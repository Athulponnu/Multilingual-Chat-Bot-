import Login from "./pages/Login";
import Rooms from "./pages/Rooms";
import Chat from "./pages/Chat";
import { state } from "./state";

export default function App() {
  // 1️⃣ Not logged in
  if (!state.token) {
    return <Login />;
  }

  // 2️⃣ Logged in but no room
  if (!state.roomId) {
    return <Rooms />;
  }

  // 3️⃣ Logged in + in room
  return <Chat />;
}
