from ai.translator import translate

def translate_text(text: str, src: str, tgt: str) -> str:
    if src == tgt:
        return text
    return translate(text, src, tgt)
