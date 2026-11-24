import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginAdmin } from '../api/grievanceApi';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const justSignedUp = location.state?.signupSuccess;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginAdmin(email, password);
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('role', 'admin');
      localStorage.setItem('email', email || 'demo.admin@example.com');
      localStorage.setItem('userId', res.user_id || 'demo-admin-id');
      localStorage.setItem('department', res.department || '');
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card admin-auth">
      <h2>Admin / Official Login</h2>
      {justSignedUp && (
        <p className="success-text">Account created — please log in.</p>
      )}
      <form onSubmit={handleLogin}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p className="switch-link">
        New official? <Link to="/admin-signup">Create an account</Link>
      </p>
      <p className="switch-link">
        Not an official? <Link to="/citizen-login">Citizen login</Link>
      </p>
      <p className="switch-link"><Link to="/">Back to home</Link></p>
    </div>
  );
}

export default AdminLogin;
