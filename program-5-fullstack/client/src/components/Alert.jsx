// Success / error message box. Renders nothing when there is no message.
export default function Alert({ type, message }) {
  if (!message) return null;
  return <div className={`alert alert-${type}`}>{message}</div>;
}
