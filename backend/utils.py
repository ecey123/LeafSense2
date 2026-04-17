import io
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

register_heif_opener()

IMG_SIZE = (224, 224)


def load_class_names(json_path: Path):
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


def preprocess_image(file_bytes: bytes, target_size=(224, 224)) -> np.ndarray:
    """
    Yüklenen görseli modele uygun hale getirir.
    - iPhone orientation düzeltir
    - RGB'ye çevirir
    - resize yapar
    - EfficientNet preprocess uygular
    """
    img = Image.open(io.BytesIO(file_bytes))
    img = ImageOps.exif_transpose(img)
    img = img.convert("RGB")
    img = img.resize(target_size)

    img_array = np.array(img, dtype=np.float32)
    img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array


def predict_with_model(model, class_names, image_array):
    preds = model.predict(image_array, verbose=0)[0]
    pred_index = int(np.argmax(preds))
    pred_label = class_names[pred_index]
    confidence = float(preds[pred_index])

    return {
        "label": pred_label,
        "confidence": round(confidence, 4),
        "probabilities": [float(x) for x in preds]
    }