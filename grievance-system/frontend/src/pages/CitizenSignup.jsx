import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupCitizen } from '../api/grievanceApi';

function CitizenSignup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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
      await signupCitizen(form);
      // After successful signup, send them to Login to sign in with their
      // new credentials — matches how a real government portal would work.
      navigate('/citizen-login', { state: { signupSuccess: true } });
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card citizen-auth">
      <h2>Citizen Signup</h2>
      <p className="auth-subtext">New here? Create an account to file and track grievances.</p>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

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
        Already registered? <Link to="/citizen-login">Log in</Link>
      </p>
      <p className="switch-link"><Link to="/">Back to home</Link></p>
    </div>
  );
}

export default CitizenSignup;
