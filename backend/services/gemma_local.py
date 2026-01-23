from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "models",
    "gemma-3"
)

print("🔍 Loading Gemma model from:", MODEL_PATH)

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_PATH,
    torch_dtype=torch.float16,   # 🔥 GPU optimized
    device_map="auto"            # 🔥 auto place on GPU
)

model.eval()
