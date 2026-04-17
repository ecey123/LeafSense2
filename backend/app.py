from pathlib import Path

import tensorflow as tf
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
    allow_origins=["*"],   # geliştirme için açık
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

# =========================
# MODEL PATHS
# =========================
CROP_MODEL_PATH = MODELS_DIR / "crop_classifier_best.keras"
CROP_CLASS_NAMES_PATH = MODELS_DIR / "crop_classifier_class_names.json"

DISEASE_MODEL_PATHS = {
    "Corn": {
        "model": MODELS_DIR / "corn_disease_best.keras",
        "classes": MODELS_DIR / "corn_disease_class_names.json",
    },
    "Pepper": {
        "model": MODELS_DIR / "pepper_disease_best.keras",
        "classes": MODELS_DIR / "pepper_disease_class_names.json",
    },
    "Potato": {
        "model": MODELS_DIR / "potato_disease_best_finetune.keras",
        "classes": MODELS_DIR / "potato_disease_class_names_finetune.json",
    },
    "Tomato": {
        "model": MODELS_DIR / "tomato_disease_best.keras",
        "classes": MODELS_DIR / "tomato_disease_class_names.json",
    },
}

crop_model = None
crop_class_names = None
disease_models = {}
disease_class_names = {}


@app.on_event("startup")
def load_models():
    global crop_model, crop_class_names, disease_models, disease_class_names

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


@app.get("/")
def root():
    return {"message": "LeafSense backend çalışıyor."}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "crop_model_loaded": crop_model is not None,
        "loaded_disease_models": list(disease_models.keys()),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="Dosya yüklenmedi.")

    try:
        file_bytes = await file.read()
        image_array = preprocess_image(file_bytes, target_size=IMG_SIZE)

        # 1) Crop prediction
        crop_result = predict_with_model(crop_model, crop_class_names, image_array)
        crop_label = crop_result["label"]

        if crop_label not in disease_models:
            raise HTTPException(
                status_code=500,
                detail=f"{crop_label} için disease modeli bulunamadı."
            )

        # 2) Disease prediction
        disease_model = disease_models[crop_label]
        disease_classes = disease_class_names[crop_label]

        disease_result = predict_with_model(
            disease_model,
            disease_classes,
            image_array
        )

        return {
            "crop_prediction": crop_result["label"],
            "crop_confidence": crop_result["confidence"],
            "disease_prediction": disease_result["label"],
            "disease_confidence": disease_result["confidence"],
            "crop_probabilities": crop_result["probabilities"],
            "disease_probabilities": disease_result["probabilities"],
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Tahmin sırasında hata oluştu: {str(e)}"
        )