import random
import requests
from pathlib import Path

# =========================
# CONFIG
# =========================
API_URL = "http://127.0.0.1:8000/predict"

DATASET_BASE = Path(r"C:\Users\eceol\Downloads\split_dataset")

SAMPLES_PER_CLASS = 50

# =========================
# HELPER
# =========================
def send_image(image_path):
    with open(image_path, "rb") as f:
        files = {"file": f}
        response = requests.post(API_URL, files=files)

    if response.status_code != 200:
        print("Hata:", response.text)
        return None

    return response.json()


# =========================
# TEST FUNCTION
# =========================
def test_dataset(dataset_name):
    print(f"\n========== {dataset_name.upper()} ==========")

    dataset_path = DATASET_BASE / dataset_name / "test"

    total_correct = 0
    total_samples = 0

    for class_dir in dataset_path.iterdir():
        if not class_dir.is_dir():
            continue

        images = list(class_dir.glob("*"))
        if len(images) == 0:
            continue

        selected = random.sample(images, min(SAMPLES_PER_CLASS, len(images)))

        correct = 0

        for img_path in selected:
            result = send_image(img_path)

            if result is None:
                continue

            predicted = result["disease_prediction"]

            # class adı içinde geçiyor mu diye bakıyoruz
            if class_dir.name in predicted:
                correct += 1

        acc = correct / len(selected)
        print(f"{class_dir.name} → {correct}/{len(selected)} = {acc:.2f}")

        total_correct += correct
        total_samples += len(selected)

    overall_acc = total_correct / total_samples
    print(f"\n>>> OVERALL ACCURACY: {overall_acc:.4f}")


# =========================
# RUN ALL
# =========================
if __name__ == "__main__":
    test_dataset("corn_disease")
    test_dataset("potato_disease")
    test_dataset("pepper_disease")
    test_dataset("tomato_disease")