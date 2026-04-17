from pathlib import Path
import hashlib
from collections import defaultdict

DATASET_DIR = Path(r"C:\Users\eceol\Downloads\PlantVillage")
image_exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

DRY_RUN = False  # önce True bakmak istersen, sonra False yap
SHOW_LIMIT = 20  # ekranda en fazla kaç örnek gösterilsin

def file_hash(filepath, chunk_size=8192):
    hasher = hashlib.md5()
    with open(filepath, "rb") as f:
        while chunk := f.read(chunk_size):
            hasher.update(chunk)
    return hasher.hexdigest()

hash_info = defaultdict(list)

for file_path in DATASET_DIR.rglob("*"):
    if file_path.is_file() and file_path.suffix.lower() in image_exts:
        try:
            h = file_hash(file_path)
            class_name = file_path.parent.name
            hash_info[(class_name, h)].append(file_path)
        except Exception as e:
            print(f"Hata: {file_path} -> {e}")

to_delete = []
duplicate_group_count = 0
shown = 0

for (class_name, h), files in hash_info.items():
    if len(files) > 1:
        duplicate_group_count += 1
        files = sorted(files)
        keep_file = files[0]
        delete_files = files[1:]
        to_delete.extend(delete_files)

        if shown < SHOW_LIMIT:
            print(f"\n[SINIF] {class_name}")
            print(f" Tutulacak: {keep_file}")
            for f in delete_files:
                print(f" Silinecek: {f}")
            shown += 1

print("\n" + "=" * 50)
print("Duplicate grup sayısı:", duplicate_group_count)
print("Silinecek toplam dosya sayısı:", len(to_delete))

if not DRY_RUN:
    deleted_count = 0
    for f in to_delete:
        try:
            f.unlink()
            deleted_count += 1
        except Exception as e:
            print(f"Silme hatası: {f} -> {e}")
    print("Gerçekten silinen dosya sayısı:", deleted_count)
else:
    print("DRY RUN modunda çalıştı, dosya silinmedi.")