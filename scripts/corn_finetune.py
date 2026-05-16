import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import tensorflow as tf
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
    precision_recall_fscore_support
)
from sklearn.utils.class_weight import compute_class_weight

# =========================
# PATHS
# =========================
BASE_DIR = Path(r"C:\Users\eceol\Downloads\split_dataset") / "corn_disease"
MODEL_DIR = Path(r"C:\Users\eceol\Desktop\leafsense 2\models")
RESULTS_DIR = Path(r"C:\Users\eceol\Desktop\leafsense 2\results") / "corn_disease_finetune"

MODEL_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

BASE_MODEL_PATH = MODEL_DIR / "corn_disease_best.keras"
FINETUNE_MODEL_PATH = MODEL_DIR / "corn_disease_best_finetune.keras"
CLASS_NAMES_PATH = MODEL_DIR / "corn_disease_class_names.json"

# =========================
# CONFIG
# =========================
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
SEED = 42

# =========================
# DATASETS
# =========================
train_dir = BASE_DIR / "train"
val_dir = BASE_DIR / "val"
test_dir = BASE_DIR / "test"

train_ds = tf.keras.utils.image_dataset_from_directory(
    train_dir,
    label_mode="categorical",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True,
    seed=SEED
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    val_dir,
    label_mode="categorical",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

test_ds = tf.keras.utils.image_dataset_from_directory(
    test_dir,
    label_mode="categorical",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

class_names = train_ds.class_names
num_classes = len(class_names)

print("\nClass names:", class_names)
print("Num classes:", num_classes)

AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)
test_ds = test_ds.prefetch(AUTOTUNE)

# =========================
# CLASS WEIGHTS
# =========================
train_labels = []
for _, labels in train_ds.unbatch():
    train_labels.append(np.argmax(labels.numpy()))

train_labels = np.array(train_labels)

class_weights_array = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(train_labels),
    y=train_labels
)
class_weights = {i: float(w) for i, w in enumerate(class_weights_array)}
print("Class weights:", class_weights)

# =========================
# MEVCUT MODELİ YÜKLE
# =========================
print(f"\nMevcut model yükleniyor: {BASE_MODEL_PATH}")
model = tf.keras.models.load_model(BASE_MODEL_PATH)
model.summary()

# =========================
# FINE-TUNING
# =========================
base_model = None
for layer in model.layers:
    if "efficientnetb0" in layer.name:
        base_model = layer
        break

print(f"Bulunan base model: {base_model.name}")

base_model.trainable = True

for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# =========================
# CALLBACKS
# =========================
callbacks = [
    tf.keras.callbacks.ModelCheckpoint(
        filepath=str(FINETUNE_MODEL_PATH),
        monitor="val_accuracy",
        save_best_only=True,
        mode="max",
        verbose=1
    ),
    tf.keras.callbacks.EarlyStopping(
        monitor="val_accuracy",
        patience=5,
        mode="max",
        restore_best_weights=True,
        verbose=1
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor="val_loss",
        factor=0.2,
        patience=3,
        min_lr=1e-7,
        verbose=1
    )
]

# =========================
# FINE-TUNE EĞİTİM
# =========================
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=20,
    callbacks=callbacks,
    class_weight=class_weights
)

# =========================
# EVALUATE
# =========================
test_loss, test_acc = model.evaluate(test_ds, verbose=1)
print(f"\nTest Loss: {test_loss:.4f}")
print(f"Test Accuracy: {test_acc:.4f}")

# =========================
# PREDICTIONS
# =========================
y_true = []
y_pred = []

for images, labels in test_ds:
    preds = model.predict(images, verbose=0)
    y_true.extend(np.argmax(labels.numpy(), axis=1))
    y_pred.extend(np.argmax(preds, axis=1))

# =========================
# CLASSIFICATION REPORT
# =========================
report_text = classification_report(
    y_true, y_pred, target_names=class_names, digits=4
)
print("\nClassification Report:")
print(report_text)

with open(RESULTS_DIR / "classification_report.txt", "w", encoding="utf-8") as f:
    f.write(report_text)

# =========================
# CONFUSION MATRIX
# =========================
cm = confusion_matrix(y_true, y_pred)

plt.figure(figsize=(10, 8))
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=class_names)
disp.plot(cmap="Blues", xticks_rotation=45)
plt.title("Corn Disease Confusion Matrix (Fine-Tuning)")
plt.tight_layout()
plt.savefig(RESULTS_DIR / "confusion_matrix.png", dpi=300, bbox_inches="tight")
plt.show()

# =========================
# PRECISION / RECALL / F1
# =========================
precision, recall, f1, _ = precision_recall_fscore_support(
    y_true, y_pred, average=None, zero_division=0
)

x = np.arange(len(class_names))
width = 0.25

plt.figure(figsize=(10, 6))
plt.bar(x - width, precision, width, label="Precision")
plt.bar(x, recall, width, label="Recall")
plt.bar(x + width, f1, width, label="F1-score")

plt.xticks(x, class_names, rotation=45, ha="right")
plt.ylim(0, 1.05)
plt.ylabel("Score")
plt.title("Corn Disease Precision / Recall / F1 (Fine-Tuning)")
plt.legend()
plt.tight_layout()
plt.savefig(RESULTS_DIR / "precision_recall_f1.png", dpi=300, bbox_inches="tight")
plt.show()

# =========================
# TRAIN HISTORY
# =========================
plt.figure(figsize=(8, 5))
plt.plot(history.history["accuracy"], label="train_accuracy")
plt.plot(history.history["val_accuracy"], label="val_accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.title("Corn Disease Fine-Tuning Accuracy")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(RESULTS_DIR / "accuracy_curve.png", dpi=300, bbox_inches="tight")
plt.show()

plt.figure(figsize=(8, 5))
plt.plot(history.history["loss"], label="train_loss")
plt.plot(history.history["val_loss"], label="val_loss")
plt.xlabel("Epoch")
plt.ylabel("Loss")
plt.title("Corn Disease Fine-Tuning Loss")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig(RESULTS_DIR / "loss_curve.png", dpi=300, bbox_inches="tight")
plt.show()

print(f"\nResults saved to: {RESULTS_DIR}")
print(f"Fine-tuned model saved to: {FINETUNE_MODEL_PATH}")
