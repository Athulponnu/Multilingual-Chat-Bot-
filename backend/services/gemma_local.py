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
    torch_dtype=torch.float32,   # ✅ IMPORTANT
    device_map=None              # ✅ IMPORTANT
)

model.to("cpu")                  # ✅ FORCE CPU
model.eval()
