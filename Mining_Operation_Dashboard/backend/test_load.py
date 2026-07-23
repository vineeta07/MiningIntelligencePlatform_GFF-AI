import sys
print("starting")
from app.services.classifier import RockClassifier
c = RockClassifier()
print("instantiated")

print("reading config...")
import json
from app.core.config import get_settings
settings = get_settings()

with open(settings.MODEL_CONFIG_PATH, 'r') as f:
    config = json.load(f)
print("config read")

print("creating model...")
import torch
from torchvision import models
arch = config.get("architecture", "ResNet50")
num_classes = 7

if "EfficientNet" in arch:
    model = models.efficientnet_v2_s(weights=None)
    model.classifier[1] = torch.nn.Linear(model.classifier[1].in_features, num_classes)
print("model created")

print("loading weights...")
state_dict = torch.load(settings.MODEL_PATH, map_location=torch.device('cpu'), weights_only=True)
model.load_state_dict(state_dict)
print("weights loaded")
