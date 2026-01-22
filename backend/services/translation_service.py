# backend/services/translation_service.py
from sqlalchemy.orm import Session
from models.message_translation import MessageTranslation
from services.gemma_translate import translate_with_gemma   # ✅ MISSING IMPORT


def translate_text_stub(
    db: Session,
    message_id: str,
    original_text: str,
    source_lang: str,
    target_lang: str,
):
    if source_lang == target_lang:
        return original_text

    cached = (
        db.query(MessageTranslation)
        .filter(
            MessageTranslation.message_id == message_id,
            MessageTranslation.target_language == target_lang,
        )
        .first()
    )

    if cached:
        return cached.translated_text

    translated = translate_with_gemma(
        text=original_text,
        source_lang=source_lang,
        target_lang=target_lang,
    )

    db.add(
        MessageTranslation(
            message_id=message_id,
            target_language=target_lang,
            translated_text=translated,
        )
    )
    db.commit()

    return translated


# ✅ ALIAS — this fixes the ImportError without changing behavior
translate_if_needed = translate_text_stub
