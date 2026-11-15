import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page">
      <div className="empty-state">
        <span className="empty-state-icon">🍽️</span>
        <h2>404 – Page not found</h2>
        <p><Link to="/">Back to the menu</Link></p>
      </div>
    </div>
  );
}
