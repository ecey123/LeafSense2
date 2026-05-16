import io
from pathlib import Path

import clip
import torch
import numpy as np
import tensorflow as tf
from PIL import Image, ImageOps
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.utils import (
    preprocess_image,
    load_class_names,
    predict_with_model,
    IMG_SIZE,
)

app = FastAPI(title="LeafSense API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

CROP_MODEL_PATH = MODELS_DIR / "crop_classifier_best.keras"
CROP_CLASS_NAMES_PATH = MODELS_DIR / "crop_classifier_class_names.json"

DISEASE_MODEL_PATHS = {
    "Corn": {
        "model": MODELS_DIR / "corn_disease_best_finetune.keras",
        "classes": MODELS_DIR / "corn_disease_class_names.json",
    },
    "Tomato": {
        "model": MODELS_DIR / "tomato_disease_best_finetune.keras",
        "classes": MODELS_DIR / "tomato_disease_class_names.json",
    },
    "Pepper": {
        "model": MODELS_DIR / "pepper_disease_best.keras",
        "classes": MODELS_DIR / "pepper_disease_class_names.json",
    },
    "Potato": {
        "model": MODELS_DIR / "potato_disease_best_finetune.keras",
        "classes": MODELS_DIR / "potato_disease_class_names_finetune.json",
    },
}

crop_model = None
crop_class_names = None
disease_models = {}
disease_class_names = {}
clip_model = None
clip_preprocess = None


# =========================
# HELPERS
# =========================

def is_leaf(image_bytes: bytes, threshold: float = 0.6) -> bool:
    img = Image.open(io.BytesIO(image_bytes))
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGB")

    img_tensor = clip_preprocess(img).unsqueeze(0)
    text = clip.tokenize([
        "a photo of a plant leaf",
        "a photo of something else, not a plant"
    ])

    with torch.no_grad():
        logits, _ = clip_model(img_tensor, text)
        probs = logits.softmax(dim=-1)[0]

    return float(probs[0]) > threshold


def clean_label(label: str) -> str:
    label = label.replace("___", " ")
    label = label.replace("__", " ")
    label = label.replace("_", " ")
    label = label.replace("bell", "Bell")
    label = label.strip()

    words = label.split()
    cleaned_words = []

    for word in words:
        if word.lower() in ["tomato", "potato", "pepper", "corn"]:
            cleaned_words.append(word.capitalize())
        elif word.lower() == "healthy":
            cleaned_words.append("Healthy")
        elif word.lower() == "blight":
            cleaned_words.append("Blight")
        elif word.lower() == "leaf":
            cleaned_words.append("Leaf")
        elif word.lower() == "spot":
            cleaned_words.append("Spot")
        elif word.lower() == "mold":
            cleaned_words.append("Mold")
        elif word.lower() == "virus":
            cleaned_words.append("Virus")
        elif word.lower() == "rust":
            cleaned_words.append("Rust")
        elif word.lower() == "mite":
            cleaned_words.append("Mite")
        elif word.lower() == "mites":
            cleaned_words.append("Mites")
        elif word.lower() == "bacterial":
            cleaned_words.append("Bacterial")
        elif word.lower() == "septoria":
            cleaned_words.append("Septoria")
        elif word.lower() == "mosaic":
            cleaned_words.append("Mosaic")
        elif word.lower() == "curl":
            cleaned_words.append("Curl")
        elif word.lower() == "yellow":
            cleaned_words.append("Yellow")
        elif word.lower() == "target":
            cleaned_words.append("Target")
        elif word.lower() == "gray":
            cleaned_words.append("Gray")
        elif word.lower() == "spider":
            cleaned_words.append("Spider")
        elif word.lower() == "two":
            cleaned_words.append("Two")
        elif word.lower() == "spotted":
            cleaned_words.append("Spotted")
        elif word.lower() == "northern":
            cleaned_words.append("Northern")
        elif word.lower() == "common":
            cleaned_words.append("Common")
        elif word.lower() == "early":
            cleaned_words.append("Early")
        elif word.lower() == "late":
            cleaned_words.append("Late")
        else:
            cleaned_words.append(word)

    return " ".join(cleaned_words)


DISEASE_TIPS = {
    # Tomato
    "Tomato Yellow Leaf Curl Virus": "Control whitefly populations using insecticide and remove infected plants to prevent spreading.",
    "Tomato Septoria Leaf Spot": "Remove affected leaves promptly and avoid wetting foliage when watering.",
    "Tomato Healthy": "Your plant looks healthy! Maintain regular watering and monitor for early signs of disease.",
    "Tomato Target Spot": "Use copper-based fungicide and remove heavily infected leaves immediately.",
    "Tomato Early Blight": "Apply fungicide and ensure proper spacing between plants for better air circulation.",
    "Tomato Mosaic Virus": "Remove and destroy infected plants immediately to prevent spreading to healthy ones.",
    "Tomato Bacterial Spot": "Use copper-based sprays and avoid working with plants when they are wet.",
    "Tomato Late Blight": "Avoid overhead watering, remove infected leaves immediately and apply fungicide.",
    "Tomato Spider Mites Two Spotted Spider Mite": "Spray plants with water or use insecticidal soap to control mite populations.",
    "Tomato Leaf Mold": "Improve air circulation and reduce humidity in the growing area.",
    # Pepper
    "Pepper Bell Healthy": "Your plant looks healthy! Keep up the good care and monitor regularly.",
    "Pepper Bell Bacterial Spot": "Use copper-based fungicide and avoid overhead irrigation to reduce moisture on leaves.",
    # Corn
    "Corn Rust Leaf": "Apply fungicide at early signs of infection and consider resistant varieties next season.",
    "Corn Leaf Blight": "Remove infected leaves and apply fungicide if the infection is severe.",
    "Corn Healthy": "Your plant looks healthy! Ensure adequate fertilization and watch for early disease signs.",
    "Corn Gray Leaf Spot": "Improve air circulation, rotate crops next season and apply fungicide if needed.",
    # Potato
    "Potato Late Blight": "Apply fungicide immediately, remove and destroy infected foliage to prevent spreading.",
    "Potato Early Blight": "Ensure adequate fertilization and apply appropriate fungicide at first signs.",
    "Potato Healthy": "Your plant looks healthy! Keep soil moisture consistent and monitor regularly.",
}


def get_tip(clean_disease_label: str) -> str:
    return DISEASE_TIPS.get(
        clean_disease_label,
        "Monitor your plant closely and consult an agronomist if symptoms worsen."
    )


# =========================
# STARTUP
# =========================

@app.on_event("startup")
def load_models():
    global crop_model, crop_class_names, disease_models, disease_class_names
    global clip_model, clip_preprocess

    clip_model, clip_preprocess = clip.load("ViT-B/32")
    clip_model.eval()
    print("CLIP modeli yüklendi.")

    if not CROP_MODEL_PATH.exists():
        raise RuntimeError(f"Crop model bulunamadı: {CROP_MODEL_PATH}")
    if not CROP_CLASS_NAMES_PATH.exists():
        raise RuntimeError(f"Crop class names bulunamadı: {CROP_CLASS_NAMES_PATH}")

    crop_model = tf.keras.models.load_model(CROP_MODEL_PATH)
    crop_class_names = load_class_names(CROP_CLASS_NAMES_PATH)

    for crop_name, paths in DISEASE_MODEL_PATHS.items():
        model_path = paths["model"]
        class_path = paths["classes"]

        if not model_path.exists():
            raise RuntimeError(f"{crop_name} disease model bulunamadı: {model_path}")
        if not class_path.exists():
            raise RuntimeError(f"{crop_name} class names bulunamadı: {class_path}")

        disease_models[crop_name] = tf.keras.models.load_model(model_path)
        disease_class_names[crop_name] = load_class_names(class_path)

    print("Tüm modeller başarıyla yüklendi.")


# =========================
# ROUTES
# =========================

@app.get("/")
def root():
    return {"message": "LeafSense backend çalışıyor."}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "crop_model_loaded": crop_model is not None,
        "clip_model_loaded": clip_model is not None,
        "loaded_disease_models": list(disease_models.keys()),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="Dosya yüklenmedi.")

    try:
        file_bytes = await file.read()

        # 1) CLIP ile yaprak kontrolü
        if not is_leaf(file_bytes, threshold=0.6):
            return {
                "status": "rejected",
                "message": "Please upload a clear leaf image.",
                "result": None,
                "crop_prediction": None,
                "crop_confidence": None,
                "disease_prediction": None,
                "disease_confidence": None,
                "tip": None,
            }

        # 2) Bitki türünü tahmin et
        image_array = preprocess_image(file_bytes, target_size=IMG_SIZE)
        crop_result = predict_with_model(crop_model, crop_class_names, image_array)
        crop_label = crop_result["label"]
        crop_confidence = crop_result["confidence"]

        # 3) İlgili hastalık modelini bul
        if crop_label not in disease_models:
            raise HTTPException(
                status_code=500,
                detail=f"{crop_label} için disease modeli bulunamadı."
            )

        # 4) Hastalık tahmini yap
        disease_result = predict_with_model(
            disease_models[crop_label],
            disease_class_names[crop_label],
            image_array,
        )
        disease_label = disease_result["label"]
        disease_confidence = disease_result["confidence"]
        clean_result = clean_label(disease_label)

        return {
            "status": "success",
            "message": "Prediction completed successfully.",
            "result": clean_result,
            "crop_prediction": crop_label,
            "crop_confidence": crop_confidence,
            "disease_prediction": disease_label,
            "disease_confidence": disease_confidence,
            "tip": get_tip(clean_result),
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Tahmin sırasında hata oluştu: {str(e)}"
        )