import torch
print("Checking CUDA...")
cuda_avail = torch.cuda.is_available()
print("CUDA:", cuda_avail)
