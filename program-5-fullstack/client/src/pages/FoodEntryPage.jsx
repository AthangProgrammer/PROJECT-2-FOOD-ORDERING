import { useState } from 'react';
import { CATEGORIES } from '../components/FoodList';
import Alert from '../components/Alert';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const empty = { name: '', description: '', category: '', price: '' };

export default function FoodEntryPage() {
  const { token } = useAuth();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null); // { type, text }
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Food name must be at least 2 characters.';
    if (form.description.trim().length < 10) e.description = 'Description must be at least 10 characters.';
    if (!form.category) e.category = 'Please select a category.';
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 1 || Number(form.price) > 99999)
      e.price = 'Price must be a number between 1 and 99999.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return setFeedback({ type: 'error', text: 'Please fix the highlighted fields.' });

    setSaving(true);
    try {
      await api('/foods', {
        method: 'POST',
        token,
        body: { ...form, name: form.name.trim(), description: form.description.trim(), price: Number(form.price) },
      });
      setFeedback({ type: 'success', text: `"${form.name.trim()}" was added to the menu!` });
      setForm(empty);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Add Food Item</h1>
        <p className="page-subtitle">The item is saved in MongoDB and appears on the menu.</p>
      </header>

      <div className="form-wrapper">
        <form className="food-form" onSubmit={handleSubmit} noValidate>
          <Alert type={feedback?.type} message={feedback?.text} />

          <div className="form-group">
            <label htmlFor="name" className="form-label">Food Name <span className="required">*</span></label>
            <input id="name" name="name" className={`form-input ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={handleChange} />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description <span className="required">*</span></label>
            <textarea id="description" name="description" className={`form-input form-textarea ${errors.description ? 'input-error' : ''}`} value={form.description} onChange={handleChange} />
            {errors.description && <span className="error-msg">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">Category <span className="required">*</span></label>
            <select id="category" name="category" className={`form-input form-select ${errors.category ? 'input-error' : ''}`} value={form.category} onChange={handleChange}>
              <option value="">-- Select Category --</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <span className="error-msg">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price" className="form-label">Price (₹) <span className="required">*</span></label>
            <input id="price" name="price" type="number" min="1" className={`form-input ${errors.price ? 'input-error' : ''}`} value={form.price} onChange={handleChange} />
            {errors.price && <span className="error-msg">{errors.price}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Food Item'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
