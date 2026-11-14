import { Link } from 'react-router-dom';

/**
 * NotFoundPage – shown for any unmatched URL.
 *
 * Demonstrates conditional rendering at the router level.
 */
function NotFoundPage() {
  return (
    <div className="page not-found-page">
      <span className="not-found-icon">🍕</span>
      <h1>404 – Page Not Found</h1>
      <p>Looks like this page went missing (maybe someone ate it).</p>
      <Link to="/" className="btn btn-primary">
        🏠 Back to Menu
      </Link>
    </div>
  );
}

export default NotFoundPage;
