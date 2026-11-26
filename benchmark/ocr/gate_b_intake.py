"""Validate a private Gate B manifest and two independently submitted label files.

Verifies manifest integrity, recorded usage approval reference, disjoint development/holdout
splits per source document, two distinct reviewer IDs, and exact label reconciliation.
Does not establish legal consent or prove submissions were blind; those require human sign-off.
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def _read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_bytes())


def _require(condition: Any, message: str) -> None:
    if not condition:
        raise ValueError(message)


def verify(folder: Path) -> dict[str, Any]:
    folder = folder.resolve()
    manifest = _read_json(folder / "manifest.json")
    review_a = _read_json(folder / "labels-a.json")
    review_b = _read_json(folder / "labels-b.json")

    _require(manifest.get("approval_ref"), "Manifest needs a recorded usage approval reference.")
    _require(
        review_a.get("reviewer")
        and review_b.get("reviewer")
        and review_a["reviewer"] != review_b["reviewer"],
        "Two distinct reviewers are required.",
    )

    captures: set[str] = set()
    sources: dict[str, str] = {}
    hashes: set[str] = set()
    for record in manifest.get("captures", []):
        capture, source, split = (record[name] for name in ("capture_id", "source_id", "split"))
        _require(capture not in captures and split in {"development", "holdout"}, "Duplicate ID or invalid split.")
        _require(sources.setdefault(source, split) == split, "One source crosses dataset splits.")
        _require(
            all(record.get(name) for name in ("vendor", "model", "layout", "condition")),
            "Missing capture metadata.",
        )
        image = (folder / record["file"]).resolve()
        _require(image.is_relative_to(folder), "Capture must be stored in the dataset folder.")
        with image.open("rb") as handle:
            image_hash = hashlib.file_digest(handle, "sha256").hexdigest()
        _require(image_hash == record["sha256"] and image_hash not in hashes, "Capture digest mismatch or duplicate.")
        captures.add(capture)
        hashes.add(image_hash)

    holdout_sources = sum(split == "holdout" for split in sources.values())
    _require(holdout_sources > 0, "No holdout sources recorded.")
    _require(set(review_a["labels"]) == captures == set(review_b["labels"]), "A review is missing captures.")
    _require(review_a["labels"] == review_b["labels"], "Labels disagree and need reconciliation.")

    return {
        "captures": len(captures),
        "sources": len(sources),
        "holdout_sources": holdout_sources,
        "manifest_sha256": hashlib.sha256((folder / "manifest.json").read_bytes()).hexdigest(),
    }


if __name__ == "__main__":
    print(json.dumps(verify(Path(sys.argv[1]).resolve()), indent=2))
