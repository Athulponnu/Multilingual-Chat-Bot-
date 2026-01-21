from services.language_service import detect_language
from services.translation_service import translate_text

def handle_message(room_id: str, text: str):
    src_lang = detect_language(text)
    return {
        "room_id": room_id,
        "original": text,
        "language": src_lang
    }
