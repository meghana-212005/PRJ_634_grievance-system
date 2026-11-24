import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupAdmin } from '../api/grievanceApi';

function AdminSignup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', department: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await signupAdmin(form);
      navigate('/admin-login', { state: { signupSuccess: true } });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card admin-auth">
      <h2>Official Signup</h2>
      <p className="auth-subtext">Register as a department official to manage citizen grievances.</p>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Department</label>
        {/* Must match the backend classifier's category names exactly
            (app/services/nlp_service.py CATEGORIES) or grievances won't
            ever match this admin's filter. */}
        <select name="department" value={form.department} onChange={handleChange} required>
          <option value="" disabled>Select a department</option>
          <option value="Water Supply">Water Supply</option>
          <option value="Roads and Infrastructure">Roads and Infrastructure</option>
          <option value="Electricity">Electricity</option>
          <option value="Sanitation">Sanitation</option>
          <option value="Other">Other</option>
        </select>

        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />

        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />

        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="switch-link">
        Already registered? <Link to="/admin-login">Log in</Link>
      </p>
      <p className="switch-link"><Link to="/">Back to home</Link></p>
    </div>
  );
}

export default AdminSignup;
