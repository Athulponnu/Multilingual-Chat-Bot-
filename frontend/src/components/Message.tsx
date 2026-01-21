export default function Message({ msg }: any) {
  return (
    <p>
      <b>{msg.from}</b>: {msg.text}
    </p>
  );
}
