import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Available food categories
const CATEGORIES = ['Pizza', 'Burgers', 'Starters', 'Drinks', 'Desserts', 'Pasta', 'Sushi', 'Other'];

// Initial blank form state – defined outside the component so it can be reused on reset
const EMPTY_FORM = {
  name: '',
  description: '',
  category: '',
  price: '',
};

/**
 * FoodEntryForm – controlled form for adding a new food item.
 *
 * Props:
 *   onAddFoodItem(newItem) – callback to lift the new item up to App state
 *
 * Demonstrates:
 *   - useState for form inputs
 *   - Controlled inputs (value + onChange)
 *   - Form validation with error messages
 *   - Conditional rendering of success feedback
 *   - Event handling (onChange, onSubmit)
 */
function FoodEntryForm({ onAddFoodItem }) {
  // ----- state -----
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [errors, setErrors]           = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const navigate = useNavigate();

  // ---- helpers ----

  /** Update a single field in formData and clear its error */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    setErrors((prev) => ({ ...prev, [name]: '' }));
    // Hide success banner when user starts editing again
    setSubmitSuccess(false);
  }

  /** Validate all fields; returns an errors object (empty = valid) */
  function validate() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Food name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Food name must be at least 2 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category.';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number.';
    } else if (Number(formData.price) > 99999) {
      newErrors.price = 'Price must be less than ₹99,999.';
    }

    return newErrors;
  }

  /** Handle form submission */
  function handleSubmit(e) {
    e.preventDefault(); // prevent page reload

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      // Show errors and stop
      setErrors(validationErrors);
      return;
    }

    // All valid – call the parent callback
    onAddFoodItem({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: parseFloat(formData.price).toFixed(0),
    });

    // Show success feedback
    setSubmitSuccess(true);

    // Reset form
    setFormData(EMPTY_FORM);
    setErrors({});

    // Redirect to listing page after a short delay so the user sees the banner
    setTimeout(() => {
      navigate('/');
    }, 1500);
  }

  // ---- render ----
  return (
    <form className="food-form" onSubmit={handleSubmit} noValidate>

      {/* ---- Success banner (conditional rendering) ---- */}
      {submitSuccess && (
        <div className="form-success" role="alert">
          ✅ Food item added successfully! Redirecting…
        </div>
      )}

      {/* ---- Food Name ---- */}
      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Food Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Margherita Pizza"
          className={`form-input ${errors.name ? 'input-error' : ''}`}
          maxLength={80}
        />
        {/* Inline error – conditional rendering */}
        {errors.name && <span className="error-msg">{errors.name}</span>}
      </div>

      {/* ---- Description ---- */}
      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description <span className="required">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the dish in a few words…"
          className={`form-input form-textarea ${errors.description ? 'input-error' : ''}`}
          rows={3}
          maxLength={300}
        />
        {errors.description && <span className="error-msg">{errors.description}</span>}
      </div>

      {/* ---- Category ---- */}
      <div className="form-group">
        <label htmlFor="category" className="form-label">
          Category <span className="required">*</span>
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={`form-input form-select ${errors.category ? 'input-error' : ''}`}
        >
          <option value="">-- Select a category --</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <span className="error-msg">{errors.category}</span>}
      </div>

      {/* ---- Price ---- */}
      <div className="form-group">
        <label htmlFor="price" className="form-label">
          Price (₹) <span className="required">*</span>
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="e.g. 299"
          className={`form-input ${errors.price ? 'input-error' : ''}`}
          min="1"
          step="1"
          max="99999"
        />
        {errors.price && <span className="error-msg">{errors.price}</span>}
      </div>

      {/* ---- Buttons ---- */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          ➕ Add Food Item
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => { setFormData(EMPTY_FORM); setErrors({}); setSubmitSuccess(false); }}
        >
          🔄 Reset
        </button>
      </div>
    </form>
  );
}

export default FoodEntryForm;
