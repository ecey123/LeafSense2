from pathlib import Path
import shutil
import random

random.seed(42)

BASE_DIR = Path(r"C:\Users\eceol\Downloads\processed_dataset")
OUTPUT_DIR = BASE_DIR.parent / "split_dataset"

DATASETS = [
    "crop_classifier",
    "tomato_disease",
    "potato_disease",
    "pepper_disease",
    "corn_disease"
]

TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

image_exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

def split_files(files, train_ratio=0.70, val_ratio=0.15, test_ratio=0.15):
    random.shuffle(files)
    total = len(files)

    train_end = int(total * train_ratio)
    val_end = train_end + int(total * val_ratio)

    train_files = files[:train_end]
    val_files = files[train_end:val_end]
    test_files = files[val_end:]

    return train_files, val_files, test_files

for dataset_name in DATASETS:
    dataset_path = BASE_DIR / dataset_name

    if not dataset_path.exists():
        print(f"Atlandı, bulunamadı: {dataset_path}")
        continue

    print(f"\nİşleniyor: {dataset_name}")

    for class_dir in dataset_path.iterdir():
        if not class_dir.is_dir():
            continue

        class_name = class_dir.name
        files = [f for f in class_dir.iterdir() if f.is_file() and f.suffix.lower() in image_exts]

        if len(files) == 0:
            print(f"Boş sınıf atlandı: {class_name}")
            continue

        train_files, val_files, test_files = split_files(files, TRAIN_RATIO, VAL_RATIO, TEST_RATIO)

        for split_name, split_files_list in {
            "train": train_files,
            "val": val_files,
            "test": test_files
        }.items():
            target_class_dir = OUTPUT_DIR / dataset_name / split_name / class_name
            target_class_dir.mkdir(parents=True, exist_ok=True)

            for file_path in split_files_list:
                shutil.copy(file_path, target_class_dir / file_path.name)

        print(
            f"{class_name}: "
            f"train={len(train_files)}, "
            f"val={len(val_files)}, "
            f"test={len(test_files)}"
        )

print("\nTüm datasetler başarıyla split edildi.")
print("Çıktı klasörü:", OUTPUT_DIR)