"""Unit and contract tests for FitSync OCR v4 adapter, parser, preprocessing, and Gate B intake."""
from __future__ import annotations

import hashlib
import json
import sys
import tempfile
import unittest
from pathlib import Path

OCR_DIR = Path(__file__).resolve().parents[1]
if str(OCR_DIR) not in sys.path:
    sys.path.insert(0, str(OCR_DIR))

from contract import PROFILES, SCHEMA_VERSION, build_draft_envelope, cells, evaluate_plausibility_warnings
from fixtures import render_fixture
from gate_b_intake import verify as verify_gate_b
from pipeline import (
    normalize_series_anchor,
    parse_tokens,
    preprocess_document,
    run_cascade_v4,
)


def _synthetic_tokens(profile: str, overrides: dict[str, str] | None = None, header: str | None = None):
    series, panel, *_ = PROFILES[profile]
    tokens = [(45.0, 44.0, header or f"SYNTHETIC SAMPLE | {series}"), (45.0, 120.0, panel)]
    overrides = overrides or {}
    for spec in cells(profile):
        text = overrides.get(spec.label, f"{spec.label}: 4.3 {spec.unit}")
        tokens.append((float(spec.x), float(spec.y + 13), text))
    return tokens


class ContractAndParserTests(unittest.TestCase):
    def test_valid_tokens_for_both_profiles(self):
        for profile in PROFILES:
            recognized, values, err = parse_tokens(_synthetic_tokens(profile))
            self.assertEqual(recognized, profile)
            self.assertIsNone(err)
            self.assertEqual(len(values), len(cells(profile)))

    def test_series_homoglyph_only_adjacent_to_digits(self):
        self.assertIn("270series", normalize_series_anchor("SYNTHETICSAMPLEI 27OSERIES"))
        self.assertIn("780series", normalize_series_anchor("SYNTHETICSAMPLEI78OSERIES"))
        self.assertEqual(normalize_series_anchor("UNKNOWN SERIES"), "unknownseries")
        recognized, values, err = parse_tokens(
            _synthetic_tokens("inbody_270_style", header="SYNTHETICSAMPLEI 27OSERIES")
        )
        self.assertEqual(recognized, "inbody_270_style")
        self.assertIsNone(err)
        self.assertEqual(len(values), len(cells("inbody_270_style")))

    def test_unknown_and_ambiguous_templates_rejected(self):
        rec, vals, err = parse_tokens(_synthetic_tokens("inbody_270_style", header="SYNTHETIC | 93O SERIES"))
        self.assertIsNone(rec)
        self.assertEqual(vals, {})
        self.assertEqual(err, "unsupported_template")

        # Crossed panel (InBody series with Tanita panel) must reject
        tokens = _synthetic_tokens("inbody_270_style")
        tokens[1] = (45.0, 120.0, "SEGMENTAL MUSCLE")
        rec2, vals2, err2 = parse_tokens(tokens)
        self.assertIsNone(rec2)
        self.assertEqual(vals2, {})
        self.assertEqual(err2, "unsupported_template")

    def test_swapped_side_wrong_unit_and_wrong_metric_never_emit(self):
        profile = "inbody_270_style"
        target = "L arm / Lean mass"
        for bad_text in (
            "R arm / Lean mass: 3.2 kg",
            "L arm / Lean mass: 3.2 %",
            "L arm / Muscle mass: 3.2 kg",
            "L arm / Lean mass: 3.O kg",  # Letter 'O' in numeric value must NEVER be coerced!
        ):
            rec, vals, err = parse_tokens(_synthetic_tokens(profile, overrides={target: bad_text}))
            self.assertEqual(rec, profile)
            self.assertIsNone(err)
            self.assertNotIn(target, vals, msg=f"Should reject {bad_text}")

    def test_cascade_drops_cross_engine_conflicts_and_preserves_agreement(self):
        profile = "inbody_270_style"
        first_tokens = _synthetic_tokens(profile, overrides={"Weight": "Weight: 70.0 kg", "Trunk / Lean mass": "CORRUPT"})
        second_tokens = _synthetic_tokens(profile, overrides={"Weight": "Weight: 71.0 kg", "Trunk / Lean mass": "Trunk / Lean mass: 24.5 kg"})
        img, _, _ = render_fixture(profile, 1, "flat", "valid")
        draft = run_cascade_v4(
            engine=None,
            image=img,
            tesseract_reader=lambda _: first_tokens,
            rapid_reader=lambda _e, _i: second_tokens,
        )
        self.assertEqual(draft["schema"], SCHEMA_VERSION)
        self.assertEqual(draft["status"], "draft")
        self.assertTrue(draft["requires_pt_confirmation"])
        self.assertEqual(draft["summary"]["conflict_count"], 1)
        by_label = {f["source_label"]: f for f in draft["fields"]}
        self.assertIsNone(by_label["Weight"]["value"])
        self.assertTrue(by_label["Weight"]["conflict_dropped"])
        self.assertEqual(by_label["Weight"]["state"], "needs_review")
        self.assertEqual(by_label["Trunk / Lean mass"]["value"], 24.5)
        self.assertEqual(by_label["Trunk / Lean mass"]["state"], "extracted")

    def test_cascade_fails_closed_on_profile_disagreement(self):
        t1 = _synthetic_tokens("inbody_270_style", overrides={"Weight": "BROKEN"})
        t2 = _synthetic_tokens("tanita_780_style")
        img, _, _ = render_fixture("inbody_270_style", 2, "flat", "valid")
        draft = run_cascade_v4(
            engine=None,
            image=img,
            tesseract_reader=lambda _: t1,
            rapid_reader=lambda _e, _i: t2,
        )
        self.assertEqual(draft["status"], "rejected")
        self.assertEqual(draft["failure_code"], "ambiguous_template")
        self.assertEqual(draft["fields"], [])

    def test_plausibility_warnings_flag_asymmetry_and_fat_mismatch(self):
        warnings = evaluate_plausibility_warnings(
            "inbody_270_style",
            {
                "Weight": 70.0,
                "Body fat mass": 14.0,
                "Body fat": 25.0,  # Implied 20.0% vs 25.0%
                "L arm / Lean mass": 2.4,
                "R arm / Lean mass": 3.4,  # 29% difference
            },
        )
        codes = {w["code"] for w in warnings}
        self.assertIn("fat_percentage_consistency_warning", codes)
        self.assertIn("asymmetry_review_required", codes)

    def test_preprocessing_triggers_on_shadow_and_washout(self):
        for profile in PROFILES:
            for mode in ("flat", "shadow", "washout", "jpeg"):
                img, _, _ = render_fixture(profile, 99, mode, "valid")
                processed, changed = preprocess_document(img)
                self.assertTrue(changed, f"Diagram/lighting preprocessing expected for {profile}/{mode}")
                self.assertEqual(processed.size, img.size)

    def test_draft_envelope_rejects_unexpected_keys(self):
        with self.assertRaises(ValueError):
            build_draft_envelope("inbody_270_style", {"Fabricated metric": 1.0})


class GateBIntakeTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.folder = Path(self.tmp.name).resolve()
        self.rows = []
        self.labels = {}
        for identifier, split in (("one", "development"), ("two", "holdout")):
            filename = identifier + ".png"
            content = identifier.encode()
            (self.folder / filename).write_bytes(content)
            self.rows.append(
                {
                    "capture_id": identifier,
                    "source_id": identifier,
                    "split": split,
                    "file": filename,
                    "vendor": "fictional",
                    "model": "synthetic",
                    "layout": "test",
                    "condition": "flat",
                    "sha256": hashlib.sha256(content).hexdigest(),
                }
            )
            self.labels[identifier] = {"weight": {"value": 64, "unit": "kg", "region": None}}
        self._write()

    def _write(self, reviewer_b="tester-b", labels_b=None, reference="synthetic-review"):
        docs = {
            "manifest": {"approval_ref": reference, "captures": self.rows},
            "labels-a": {"reviewer": "tester-a", "labels": self.labels},
            "labels-b": {"reviewer": reviewer_b, "labels": self.labels if labels_b is None else labels_b},
        }
        for name, doc in docs.items():
            (self.folder / f"{name}.json").write_text(json.dumps(doc))

    def test_valid_receipt(self):
        self.assertEqual(verify_gate_b(self.folder)["holdout_sources"], 1)

    def test_missing_approval(self):
        self._write(reference="")
        with self.assertRaisesRegex(ValueError, "approval"):
            verify_gate_b(self.folder)

    def test_same_reviewer(self):
        self._write(reviewer_b="tester-a")
        with self.assertRaisesRegex(ValueError, "distinct"):
            verify_gate_b(self.folder)

    def test_cross_split_source(self):
        self.rows[1]["source_id"] = "one"
        self._write()
        with self.assertRaisesRegex(ValueError, "crosses"):
            verify_gate_b(self.folder)

    def test_labels_disagree(self):
        self._write(labels_b={key: {"weight": {"value": 63, "unit": "kg"}} for key in self.labels})
        with self.assertRaisesRegex(ValueError, "disagree"):
            verify_gate_b(self.folder)

    def test_source_changed(self):
        (self.folder / "one.png").write_bytes(b"changed")
        with self.assertRaisesRegex(ValueError, "digest"):
            verify_gate_b(self.folder)


if __name__ == "__main__":
    unittest.main()
