import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { api } from '../api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    setError('');
    try {
      await api('/auth/register', { method: 'POST', body: form });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header"><h1 className="page-title">Create an account</h1></header>
      <div className="form-wrapper">
        <form className="food-form" onSubmit={handleSubmit} noValidate>
          <Alert type="error" message={error} />
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input id="name" name="name" className="form-input" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-input" value={form.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password (min 6 characters)</label>
            <input id="password" name="password" type="password" className="form-input" value={form.password} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </div>
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </div>
    </div>
  );
}
