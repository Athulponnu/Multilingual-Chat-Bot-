# 🌐 Multilingual Chat Bot

A real-time multilingual chat application that allows users to create and join chat rooms, exchange messages instantly using WebSockets, and automatically translate messages across different languages.

Built with **FastAPI**, **WebSockets**, **React (Vite)**, and **PostgreSQL**.

---

## 🚀 Features

- 🔐 User authentication (Login / Register)
- 🏠 Home page with room actions
- ➕ Create chat rooms
- ➡️ Join existing rooms
- 💬 Real-time messaging via WebSockets
- 🌍 Automatic language translation
- 🔄 JWT-based authentication
- 🧭 Protected routes
- ⚡ FastAPI backend
- 🎨 React + Vite frontend

---

## 🏗️ Tech Stack

### Backend
- FastAPI
- WebSockets
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Uvicorn

### Frontend
- React
- TypeScript
- Vite
- React Router

---

## 📂 Project Structure

```text
multilingual_chat/
│
├── backend/
│   ├── api/
│   │   ├── auth.py
│   │   ├── rooms.py
│   │   ├── messages.py
│   │   └── users.py
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── security.py
│   │   └── websocket.py
│   ├── models/
│   ├── schemas/
│   ├── services/
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Rooms.tsx
│   │   │   └── Chat.tsx
│   │   ├── components/
│   │   ├── state.ts
│   │   ├── ws.ts
│   │   └── App.tsx
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Setup Instructions
1️⃣ Clone the Repository

```
git clone https://github.com/Athulponnu/Multilingual-Chat-Bot-.git
cd Multilingual-Chat-Bot-
```

## 2️⃣ Backend Setup
```
cd backend
python -m venv vnv
source vnv/bin/activate    # Windows: vnv\Scripts\activate
pip install -r requirements.txt
```

##Create a .env file:

DATABASE_URL=postgresql://user:password@localhost:5432/chatdb
SECRET_KEY=your_secret_key
ALGORITHM=HS256


Run backend server:

uvicorn main:app --reload


Backend URL:

http://127.0.0.1:8000

## 3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend URL:

http://localhost:5173

## 🔐 Authentication Flow
```
User registers or logs in

Backend issues a JWT token

Token is stored in localStorage

Protected routes are unlocked

User is redirected to Home

🏠 Application Flow
Login / Register
      ↓
     Home
  ↙        ↘
Create     Join
 Room      Room
      ↓
     Chat
```
## 🔌 WebSocket Communication

WebSocket is used for real-time messaging

Authenticated using JWT token

Messages are broadcast to all users in a room

Translation service processes outgoing messages

## 🛡️ Security

JWT-based authentication

Password hashing

Protected API endpoints

WebSocket authentication

## 🧪 Future Enhancements

🔔 Typing indicators

🟢 Online user presence

📎 File sharing

🔄 Token refresh

🌐 More language support

👨‍💻 Author

Athul KK
GitHub: https://github.com/Athulponnu
