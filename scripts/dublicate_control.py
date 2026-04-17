from pathlib import Path
import hashlib
from collections import defaultdict

DATASET_DIR = Path(r"C:\Users\eceol\Downloads\PlantVillage")
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
            hash_info[h].append((class_name, str(file_path)))
        except Exception as e:
            print(f"Hata: {file_path} -> {e}")

same_class_duplicates = {}
cross_class_duplicates = {}

for h, items in hash_info.items():
    if len(items) > 1:
        class_names = {class_name for class_name, _ in items}
        if len(class_names) == 1:
            same_class_duplicates[h] = items
        else:
            cross_class_duplicates[h] = items

print("Aynı class içi duplicate grup sayısı:", len(same_class_duplicates))
print("Classlar arası duplicate grup sayısı:", len(cross_class_duplicates))

print("\n--- Aynı class içi ilk 3 örnek ---")
for i, (h, items) in enumerate(same_class_duplicates.items()):
    if i == 3:
        break
    print(f"\nGrup {i+1}")
    for class_name, path in items:
        print(class_name, "->", path)

print("\n--- Classlar arası ilk 3 örnek ---")
for i, (h, items) in enumerate(cross_class_duplicates.items()):
    if i == 3:
        break
    print(f"\nGrup {i+1}")
    for class_name, path in items:
        print(class_name, "->", path)