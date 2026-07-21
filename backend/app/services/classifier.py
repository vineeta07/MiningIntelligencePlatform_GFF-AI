"""
Mining Intelligence Platform — AI Rock Classification Service
Loads the ResNet50 model and provides inference + Grad-CAM heatmap generation.
"""
import json
import io
import numpy as np
import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import cv2
import matplotlib
matplotlib.use('Agg')  # Non-interactive backend
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap
from typing import Optional
from app.core.config import get_settings

settings = get_settings()


class RockClassifier:
    """
    Enterprise-grade rock classification service using ResNet50.
    Supports inference, confidence scoring, and Grad-CAM explainability.
    """
    
    _instance: Optional["RockClassifier"] = None
    
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.class_names = []
        self.transform = None
        self.gradients = None
        self.activations = None
        self._loaded = False
    
    @classmethod
    def get_instance(cls) -> "RockClassifier":
        """Singleton pattern to avoid loading model multiple times."""
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance
    
    def load_model(self):
        """Load the pre-trained ResNet50 model and class names."""
        if self._loaded:
            return
        
        # Load model config
        with open(settings.MODEL_CONFIG_PATH, 'r') as f:
            config = json.load(f)
        
        # Load class names
        with open(settings.CLASS_NAMES_PATH, 'r') as f:
            self.class_names = json.load(f)
        
        num_classes = len(self.class_names)
        img_size = config.get("img_size", 224)
        normalize_mean = config.get("normalize_mean", [0.485, 0.456, 0.406])
        normalize_std = config.get("normalize_std", [0.229, 0.224, 0.225])
        
        # Build model architecture
        self.model = models.resnet50(weights=None)
        self.model.fc = torch.nn.Linear(self.model.fc.in_features, num_classes)
        
        # Load trained weights
        state_dict = torch.load(settings.MODEL_PATH, map_location=self.device, weights_only=True)
        self.model.load_state_dict(state_dict)
        self.model.to(self.device)
        self.model.eval()
        
        # Register hooks for Grad-CAM on the last conv layer (layer4)
        self.model.layer4[-1].register_forward_hook(self._forward_hook)
        self.model.layer4[-1].register_full_backward_hook(self._backward_hook)
        
        # Define preprocessing transform
        self.transform = transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=normalize_mean, std=normalize_std),
        ])
        
        self._loaded = True
        print(f"[AI Engine] Model loaded on {self.device} — {num_classes} classes")
    
    def _forward_hook(self, module, input, output):
        """Capture activations from the target layer."""
        self.activations = output.detach()
    
    def _backward_hook(self, module, grad_input, grad_output):
        """Capture gradients flowing into the target layer."""
        self.gradients = grad_output[0].detach()
    
    def classify(self, image: Image.Image) -> dict:
        """
        Classify a rock image and return predictions with confidence scores.
        
        Returns:
            dict with keys: predicted_class, confidence, all_probabilities
        """
        self.load_model()
        
        # Preprocess
        input_tensor = self.transform(image.convert("RGB")).unsqueeze(0).to(self.device)
        
        # Inference
        with torch.no_grad():
            output = self.model(input_tensor)
            probabilities = F.softmax(output, dim=1)[0]
        
        # Build results
        probs_dict = {
            self.class_names[i]: round(probabilities[i].item(), 4)
            for i in range(len(self.class_names))
        }
        
        predicted_idx = torch.argmax(probabilities).item()
        
        return {
            "predicted_class": self.class_names[predicted_idx],
            "confidence": round(probabilities[predicted_idx].item(), 4),
            "all_probabilities": probs_dict,
        }
    
    def generate_gradcam(self, image: Image.Image, target_class: Optional[str] = None) -> bytes:
        """
        Generate a Grad-CAM heatmap overlay for the given image.
        
        Args:
            image: PIL Image to analyze
            target_class: Optional class to generate CAM for (defaults to predicted class)
        
        Returns:
            PNG bytes of the Grad-CAM overlay image
        """
        self.load_model()
        
        img_rgb = image.convert("RGB")
        input_tensor = self.transform(img_rgb).unsqueeze(0).to(self.device)
        input_tensor.requires_grad_(True)
        
        # Forward pass (with gradient tracking)
        output = self.model(input_tensor)
        
        # Determine target class index
        if target_class and target_class in self.class_names:
            target_idx = self.class_names.index(target_class)
        else:
            target_idx = output.argmax(dim=1).item()
        
        # Backward pass for the target class
        self.model.zero_grad()
        target_score = output[0, target_idx]
        target_score.backward()
        
        # Compute Grad-CAM weights
        weights = self.gradients.mean(dim=[2, 3], keepdim=True)  # Global Average Pool
        cam = (weights * self.activations).sum(dim=1, keepdim=True)
        cam = F.relu(cam)  # Only positive contributions
        
        # Normalize to [0, 1]
        cam = cam.squeeze().cpu().numpy()
        cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        
        # Resize CAM to original image size
        original_np = np.array(img_rgb)
        cam_resized = cv2.resize(cam, (original_np.shape[1], original_np.shape[0]))
        
        # Create the heatmap overlay with a warm industrial colormap
        warm_colors = LinearSegmentedColormap.from_list(
            'industrial_warm',
            ['#FFF8F0', '#F4A261', '#E07A5F', '#C1121F', '#3D1C00'],
            N=256
        )
        
        fig, axes = plt.subplots(1, 3, figsize=(18, 6))
        fig.patch.set_facecolor('#FFF8F0')
        
        # Original image
        axes[0].imshow(original_np)
        axes[0].set_title('Original Image', fontsize=14, fontweight='bold', color='#3D1C00')
        axes[0].axis('off')
        
        # Grad-CAM heatmap
        axes[1].imshow(cam_resized, cmap=warm_colors, aspect='auto')
        axes[1].set_title('Grad-CAM Heatmap', fontsize=14, fontweight='bold', color='#3D1C00')
        axes[1].axis('off')
        
        # Overlay
        axes[2].imshow(original_np)
        axes[2].imshow(cam_resized, cmap=warm_colors, alpha=0.5, aspect='auto')
        axes[2].set_title('Overlay Analysis', fontsize=14, fontweight='bold', color='#3D1C00')
        axes[2].axis('off')
        
        plt.tight_layout()
        
        # Save to bytes
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=150, bbox_inches='tight', facecolor='#FFF8F0')
        plt.close(fig)
        buf.seek(0)
        
        return buf.getvalue()
    
    def get_model_info(self) -> dict:
        """Return model metadata for the documentation endpoint."""
        self.load_model()
        
        with open(settings.MODEL_CONFIG_PATH, 'r') as f:
            config = json.load(f)
        
        total_params = sum(p.numel() for p in self.model.parameters())
        trainable_params = sum(p.numel() for p in self.model.parameters() if p.requires_grad)
        
        return {
            "architecture": config.get("architecture", "ResNet50"),
            "input_size": f"{config.get('img_size', 224)}x{config.get('img_size', 224)}",
            "num_classes": len(self.class_names),
            "class_names": self.class_names,
            "test_accuracy": config.get("test_accuracy", 0.0),
            "total_parameters": total_params,
            "trainable_parameters": trainable_params,
            "device": str(self.device),
            "normalize_mean": config.get("normalize_mean"),
            "normalize_std": config.get("normalize_std"),
        }
