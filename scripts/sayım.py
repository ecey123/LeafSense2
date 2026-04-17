from pathlib import Path

DATASET_DIR = Path(r"C:\Users\eceol\Downloads\PlantVillage")
image_exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

class_counts = {}

for class_dir in DATASET_DIR.iterdir():
    if class_dir.is_dir():
        count = sum(1 for f in class_dir.rglob("*") if f.suffix.lower() in image_exts)
        class_counts[class_dir.name] = count

print("Toplam sınıf sayısı:", len(class_counts))
print("-" * 50)

for class_name, count in sorted(class_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"{class_name}: {count}")