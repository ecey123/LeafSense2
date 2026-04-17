
from pathlib import Path

BASE_DIR = Path(r"C:\Users\eceol\Downloads\split_dataset")
image_exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

for dataset_dir in BASE_DIR.iterdir():
    if not dataset_dir.is_dir():
        continue

    print(f"\nDATASET: {dataset_dir.name}")

    for split_dir in dataset_dir.iterdir():
        if not split_dir.is_dir():
            continue

        print(f"  {split_dir.name.upper()}")
        for class_dir in split_dir.iterdir():
            if class_dir.is_dir():
                count = sum(1 for f in class_dir.iterdir() if f.is_file() and f.suffix.lower() in image_exts)
                print(f"    {class_dir.name}: {count}")