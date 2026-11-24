import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginCitizen } from '../api/grievanceApi';

function CitizenLogin() {
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
      const res = await loginCitizen(email, password);
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('role', 'citizen');
      localStorage.setItem('email', email || 'demo.citizen@example.com');
      // user_id is the real database ID — needed as citizen_id on every
      // grievance request once DEMO_MODE is off.
      localStorage.setItem('userId', res.user_id || 'demo-citizen-id');
      navigate('/citizen-dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card citizen-auth">
      <h2>Citizen Login</h2>
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
        New here? <Link to="/citizen-signup">Create an account</Link>
      </p>
      <p className="switch-link">
        Are you an official? <Link to="/admin-login">Admin login</Link>
      </p>
      <p className="switch-link"><Link to="/">Back to home</Link></p>
    </div>
  );
}

export default CitizenLogin;
