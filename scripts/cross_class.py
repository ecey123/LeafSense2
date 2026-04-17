from pathlib import Path
import hashlib
import shutil
from collections import defaultdict

DATASET_DIR = Path(r"C:\Users\eceol\Downloads\PlantVillage")
REVIEW_DIR = DATASET_DIR / "_cross_class_review"
image_exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

def file_hash(filepath, chunk_size=8192):
    hasher = hashlib.md5()
    with open(filepath, "rb") as f:
        while chunk := f.read(chunk_size):
            hasher.update(chunk)
    return hasher.hexdigest()

hash_info = defaultdict(list)

for file_path in DATASET_DIR.rglob("*"):
    if (
        file_path.is_file()
        and file_path.suffix.lower() in image_exts
        and "_cross_class_review" not in str(file_path)
    ):
        try:
            h = file_hash(file_path)
            class_name = file_path.parent.name
            hash_info[h].append((class_name, file_path))
        except Exception as e:
            print(f"Hata: {file_path} -> {e}")

cross_class_duplicates = {}

for h, items in hash_info.items():
    if len(items) > 1:
        class_names = {class_name for class_name, _ in items}
        if len(class_names) > 1:
            cross_class_duplicates[h] = items

print("Classlar arası duplicate grup sayısı:", len(cross_class_duplicates))

REVIEW_DIR.mkdir(exist_ok=True)

moved_count = 0

for i, (h, items) in enumerate(cross_class_duplicates.items(), 1):
    print(f"\nGrup {i}")
    for class_name, file_path in items:
        target_dir = REVIEW_DIR / class_name
        target_dir.mkdir(parents=True, exist_ok=True)

        target_path = target_dir / file_path.name

        # Aynı isim varsa ezmemesi için başına grup numarası ekleyelim
        if target_path.exists():
            target_path = target_dir / f"group{i}_{file_path.name}"

        print(f"Taşınıyor: {file_path} -> {target_path}")
        shutil.move(str(file_path), str(target_path))
        moved_count += 1

print("\nToplam taşınan dosya sayısı:", moved_count)
print("İnceleme klasörü:", REVIEW_DIR)
