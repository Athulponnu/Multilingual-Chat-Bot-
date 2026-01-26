# Real-Time Multilingual Translation System

A production-oriented **real-time multilingual message translation system** designed for low-latency inference in chat applications.  
The system enables users to communicate across languages seamlessly using **WebSockets** and **ML-powered translation inference**.

Built with **FastAPI**, **React (Vite)**, **PostgreSQL**, and a **local LLM-based translation pipeline**.

---

## Overview

Real-time chat translation introduces unique challenges that go beyond standard web applications:

- Low-latency inference requirements
- Concurrent message handling
- Real-time message streaming
- Fault-tolerant ML inference
- Language preservation across users

This project focuses on **ML inference integration in a real-time system**, rather than only UI features.

---

## Problem Statement

In multilingual chat systems, messages must be:
- Translated instantly to avoid breaking conversation flow
- Delivered reliably to multiple users
- Preserved in their original form for auditing and reprocessing
- Processed under concurrency without blocking the system

This project addresses these challenges by combining:
- WebSocket-based real-time communication
- Database-backed message persistence
- Isolated translation inference logic
- Production-aware backend architecture

---

## System Architecture

- **Frontend**: React (Vite) — real-time UI using WebSockets  
- **Backend**: FastAPI — API, authentication, and message orchestration  
- **Database**: PostgreSQL — persistent storage for users, rooms, messages, and translations  
- **ML Inference**: Local LLM-based translation (Meta NLLB-200-600M implementation)  
- **Communication**: REST APIs + WebSockets  

---

## ML Translation Pipeline

```text
User Message
 → Language Detection
 → Text Normalization
 → Translation Model Inference
 → Post-processing
 → Store Original + Translated Text
 → Broadcast via WebSocket
