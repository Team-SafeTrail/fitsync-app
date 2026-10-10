from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

import easyocr


def token_from_result(result: tuple[list[list[float]], str, float]) -> dict[str, Any]:
    box, text, confidence = result
    xs = [point[0] for point in box]
    ys = [point[1] for point in box]
    return {
        "text": text,
        "confidence": float(confidence),
        "x": float(min(xs)),
        "y": float(min(ys)),
        "width": float(max(xs) - min(xs)),
        "height": float(max(ys) - min(ys)),
    }


def main() -> None:
    model_directory = Path(os.environ["FITSYNC_EASYOCR_MODEL_DIR"])
    model_directory.mkdir(parents=True, exist_ok=True)
    reader = easyocr.Reader(
        ["en"],
        gpu=False,
        model_storage_directory=str(model_directory),
        recog_network="english_g2",
        verbose=False,
    )
    print(json.dumps({"ready": True}), flush=True)
    for line in sys.stdin:
        request = json.loads(line)
        try:
            results = reader.readtext(request["path"], detail=1, paragraph=False)
            tokens = [token_from_result(result) for result in results]
            print(json.dumps({"id": request["id"], "tokens": tokens}), flush=True)
        except Exception:
            print(json.dumps({"id": request["id"], "error": "bounded_worker_failure"}), flush=True)


if __name__ == "__main__":
    main()
