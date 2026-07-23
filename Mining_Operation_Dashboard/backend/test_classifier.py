import sys
import os

from PIL import Image
import torch

from app.services.classifier import RockClassifier

print("Testing classifier initialization...")
try:
    classifier = RockClassifier.get_instance()
    print("Instance fetched.")
    classifier.load_model()
    print("Model loaded.")
except Exception as e:
    print("Error:", e)
