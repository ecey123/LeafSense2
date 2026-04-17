from pathlib import Path
from PIL import Image

DATASET_DIR = Path(r"C:\Users\eceol\Downloads\PlantVillage")
image_exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

bad_files = []

for file_path in DATASET_DIR.rglob("*"):
    if file_path.is_file() and file_path.suffix.lower() in image_exts:
        try:
            with Image.open(file_path) as img:
                img.verify()
        except Exception:
            bad_files.append(str(file_path))

print("Bozuk görsel sayısı:", len(bad_files))
for f in bad_files[:20]:
    print(f)