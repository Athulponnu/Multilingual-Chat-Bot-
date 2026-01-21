import { state } from "../state";

export default function LanguageSelector() {
  return (
    <div>
      <label>Send:</label>
      <select onChange={e => state.sendLanguage = e.target.value}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="fr">French</option>
      </select>

      <label>Receive:</label>
      <select onChange={e => state.receiveLanguage = e.target.value}>
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}
