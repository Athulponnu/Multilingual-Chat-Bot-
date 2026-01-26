# ML Inference Layer – Real-Time Translation System

This folder documents the **machine learning inference part** of the project.

This project does NOT train models.  
It focuses on **using pretrained models safely in a real-time system**.

---

## What This ML Part Does

- Detects the language of incoming messages
- Translates messages into target languages
- Runs inference during live chat
- Keeps the system responsive and stable

---

## ML Inference Pipeline

```text
Message
 → Language Detection
 → Translation Inference
 → Post-processing
 → Output

## Model Reference

This project uses a **pretrained multilingual translation model** for inference.

Model source:
- Hugging Face: https://huggingface.co/facebook/nllb-200-distilled-600M

The model is used **as-is** for inference only.
No fine-tuning or training is performed in this project.
