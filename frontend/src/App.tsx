import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Chat from "./pages/Chat";
import { state } from "./state";

/* ===== Protected Route ===== */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!state.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===== ROOT REDIRECT ===== */}
        <Route
          path="/"
          element={
            state.isAuthenticated()
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* ===== PUBLIC ROUTES ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== PROTECTED ROUTES ===== */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:roomId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* ===== CATCH-ALL ===== */}
        <Route
          path="*"
          element={
            state.isAuthenticated()
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
