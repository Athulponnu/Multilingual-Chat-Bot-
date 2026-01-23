from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "Qwen/Qwen2.5-0.5B-Instruct"

device = "cuda" if torch.cuda.is_available() else "cpu"

print(f"🔍 Loading {MODEL_NAME} on {device}")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME,
    trust_remote_code=True
)

model = AutoModelForCausalLM.from_pretrained(
    MODEL_NAME,
    torch_dtype=torch.float16 if device == "cuda" else torch.float32,
    device_map="auto" if device == "cuda" else None,
    trust_remote_code=True
)

if device == "cpu":
    model.to("cpu")

model.eval()


def translate(text: str, source_lang: str, target_lang: str) -> str:
    if source_lang == target_lang:
        return text

    prompt = f"""
You are a translation assistant.
Translate the following text from {source_lang} to {target_lang}.
Only output the translated text.

Text:
{text}
"""

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=128,
            do_sample=False
        )

    decoded = tokenizer.decode(output[0], skip_special_tokens=True)
    return decoded.split("Text:")[-1].strip()
