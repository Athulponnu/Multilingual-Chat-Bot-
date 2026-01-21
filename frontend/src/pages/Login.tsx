import { useState } from "react";
import { register } from "../api";
import { state } from "../state";

export default function Login({ onNext }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    await register(email, password);
    state.email = email;
    state.userId = email; // temporary ID
    onNext();
  }

  return (
    <div>
      <h2>Login / Register</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={submit}>Continue</button>
    </div>
  );
}
