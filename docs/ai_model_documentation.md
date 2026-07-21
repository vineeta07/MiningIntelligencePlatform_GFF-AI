# AI Model Documentation
## Mining Intelligence Platform — Rock Classification Model

### 1. Model Overview

| Property | Value |
|----------|-------|
| Architecture | ResNet50 (Residual Network, 50 layers) |
| Framework | PyTorch |
| Input Size | 224 × 224 × 3 (RGB) |
| Number of Classes | 7 |
| Total Parameters | ~25.6 million |
| Test Accuracy | **71.84%** |
| Explainability | Grad-CAM (Gradient-weighted Class Activation Mapping) |

### 2. Supported Rock Classes

| Class | Category | Description |
|-------|----------|-------------|
| Basalt | Igneous | Dark, fine-grained volcanic rock |
| Coal | Sedimentary | Combustible sedimentary rock |
| Granite | Igneous | Coarse-grained intrusive rock |
| Limestone | Sedimentary | Calcium carbonate rock |
| Marble | Metamorphic | Recrystallized limestone |
| Quartzite | Metamorphic | Hard metamorphic rock from sandstone |
| Sandstone | Sedimentary | Clastic sedimentary rock |

### 3. Architecture Details

```
Input Image (224 × 224 × 3)
    │
    ▼
┌──────────────────────┐
│   Conv1 (7×7, 64)    │ ← Stride 2
│   BatchNorm + ReLU   │
│   MaxPool (3×3)      │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│   Layer 1 (×3)       │ ← 64 → 256 channels
│   Bottleneck Blocks  │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│   Layer 2 (×4)       │ ← 128 → 512 channels
│   Bottleneck Blocks  │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│   Layer 3 (×6)       │ ← 256 → 1024 channels
│   Bottleneck Blocks  │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│   Layer 4 (×3)       │ ← 512 → 2048 channels
│   Bottleneck Blocks  │ ◄── Grad-CAM hooks here
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│   AdaptiveAvgPool    │ ← Global average pooling
│   FC (2048 → 7)      │ ← Final classification
│   Softmax            │
└──────────────────────┘
```

### 4. Training Hyperparameters

| Parameter | Value |
|-----------|-------|
| Optimizer | Adam |
| Learning Rate | 0.001 (with scheduling) |
| Batch Size | 32 |
| Epochs | Trained to convergence |
| Loss Function | CrossEntropyLoss |
| Data Augmentation | Random Flip, Rotation, Color Jitter |

### 5. Preprocessing Pipeline

```python
transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],  # ImageNet statistics
        std=[0.229, 0.224, 0.225]
    ),
])
```

### 6. Grad-CAM Explainability

Grad-CAM generates visual explanations by:
1. **Forward pass** through the model to get predictions
2. **Backward pass** computing gradients of the target class w.r.t. feature maps at Layer 4
3. **Global Average Pooling** of gradients to get importance weights
4. **Weighted combination** of feature maps (ReLU applied for positive-only contributions)
5. **Upsampling** the activation map to original image size
6. **Overlay** with warm industrial colormap (#FFF8F0 → #F4A261 → #E07A5F → #C1121F → #3D1C00)

### 7. Performance Metrics

| Metric | Value |
|--------|-------|
| Test Accuracy | 71.84% |
| Model Size | ~90 MB (.pth file) |
| Inference Time (CPU) | ~2-4 seconds |
| Inference Time (GPU) | ~0.1-0.3 seconds |
