from services.gemma_local import tokenizer, model
import torch


def translate_with_gemma(
    text: str,
    source_lang: str,
    target_lang: str,
) -> str:
    if source_lang == target_lang:
        return text

    prompt = (
        f"Translate the following text from {source_lang} to {target_lang}.\n\n"
        f"Text:\n{text}\n\n"
        f"Translation:"
    )

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    output = model.generate(
        **inputs,
        max_new_tokens=256,
        do_sample=False,
    )

    decoded = tokenizer.decode(output[0], skip_special_tokens=True)

    # Extract only translated text (after "Translation:")
    if "Translation:" in decoded:
        return decoded.split("Translation:", 1)[1].strip()

    return decoded.strip()

