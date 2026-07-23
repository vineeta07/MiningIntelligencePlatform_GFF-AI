import sys
import json
import torch
from torchvision import models
from app.core.config import get_settings

def log(msg):
    with open("debug.log", "a") as f:
        f.write(msg + "\n")

log("starting")
settings = get_settings()

log("reading config")
with open(settings.MODEL_CONFIG_PATH, 'r') as f:
    config = json.load(f)
log("config read")

arch = config.get("architecture", "ResNet50")
num_classes = 7

log(f"creating model {arch}")
if "EfficientNet" in arch:
    model = models.efficientnet_v2_s(weights=None)
    model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, num_classes)
log("model created")

log("loading weights")
state_dict = torch.load(settings.MODEL_PATH, map_location=torch.device('cpu'), weights_only=True)
log("weights loaded from disk")
model.load_state_dict(state_dict)
log("weights applied to model")
