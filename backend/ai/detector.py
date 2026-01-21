from langdetect import detect

def detect_lang(text: str) -> str:
    return detect(text)
