import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('department');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <span className="brand">CivicChain {role === 'admin' && '· Admin'}</span>
      <div className="nav-right">
        {role === 'citizen' && (
          <>
            <Link to="/citizen-dashboard" className="nav-link">Dashboard</Link>
            <Link to="/file-complaint" className="nav-link">File Complaint</Link>
          </>
        )}
        <span>{email}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
