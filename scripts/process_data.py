from pathlib import Path
import shutil

SOURCE_DIR = Path(r"C:\Users\eceol\Downloads\PlantVillage")
TARGET_DIR = SOURCE_DIR.parent / "processed_dataset"

# Eski klasörleri silmek istersen manuel sil
# processed_dataset ve split_dataset klasörlerini önce kendin silmen daha güvenli

crop_dir = TARGET_DIR / "crop_classifier"
tomato_dir = TARGET_DIR / "tomato_disease"
potato_dir = TARGET_DIR / "potato_disease"
pepper_dir = TARGET_DIR / "pepper_disease"
corn_dir = TARGET_DIR / "corn_disease"

for d in [crop_dir, tomato_dir, potato_dir, pepper_dir, corn_dir]:
    d.mkdir(parents=True, exist_ok=True)

for class_path in SOURCE_DIR.iterdir():
    if not class_path.is_dir():
        continue

    class_name = class_path.name

    if "_cross_class_review" in class_name:
        continue

    class_name_lower = class_name.lower()

    if class_name_lower.startswith("tomato"):
        crop = "Tomato"
        target_disease_dir = tomato_dir / class_name

    elif class_name_lower.startswith("potato"):
        crop = "Potato"
        target_disease_dir = potato_dir / class_name

    elif class_name_lower.startswith("pepper"):
        crop = "Pepper"
        target_disease_dir = pepper_dir / class_name

    elif class_name_lower.startswith("corn"):
        crop = "Corn"
        target_disease_dir = corn_dir / class_name

    else:
        print(f"Atlandı: {class_name}")
        continue

    crop_target = crop_dir / crop

    crop_target.mkdir(exist_ok=True)
    target_disease_dir.mkdir(parents=True, exist_ok=True)

    for img in class_path.iterdir():
        if img.is_file():
            shutil.copy(img, crop_target / img.name)
            shutil.copy(img, target_disease_dir / img.name)

print("Dataset başarıyla ayrıldı.")