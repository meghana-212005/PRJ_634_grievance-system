import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const goTo = (destinationIfLoggedIn) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role === 'citizen') {
      navigate(destinationIfLoggedIn);
    } else {
      navigate('/citizen-login');
    }
  };

  return (
    <div className="home-page">
      <div className="top-strip">Government of India · Digital Governance Initiative</div>

      <nav className="navbar">
        <span className="brand">🏛️ CivicChain</span>
        <div className="nav-right">
          <Link to="/citizen-login" className="nav-link-light">Citizen Login</Link>
          <Link to="/admin-login" className="nav-link-light">Official Login</Link>
        </div>
      </nav>

      <main>
        <section className="hero">
          <span className="eyebrow">Ministry of Public Services &amp; Grievance Redressal</span>

          <div className="hero-actions">
            <Link to="/citizen-signup" className="btn-primary">Citizen Signup (New User)</Link>
            <Link to="/admin-signup" className="btn-secondary">Official Signup (New User)</Link>
          </div>
        </section>

        <section className="stats-strip">
          <div className="stat">
            <strong>12,540+</strong>
            <span>Grievances Resolved</span>
          </div>
          <div className="stat">
            <strong>98%</strong>
            <span>Records Verifiable On-Chain</span>
          </div>
          <div className="stat">
            <strong>24/7</strong>
            <span>Portal Availability</span>
          </div>
          <div className="stat">
            <strong>6</strong>
            <span>Departments Connected</span>
          </div>
        </section>

        <section className="section section-mint">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card step-blue">
              <div className="step-number">1</div>
              <h3>Register &amp; Log In</h3>
              <p>Citizens and officials each get a secure, role-based login to access the portal.</p>
            </div>
            <div className="step-card step-peach">
              <div className="step-number">2</div>
              <h3>Submit a Grievance</h3>
              <p>Describe the issue, select a department category, and attach photo evidence if needed.</p>
            </div>
            <div className="step-card step-mint">
              <div className="step-number">3</div>
              <h3>Recorded On-Chain</h3>
              <p>The submission is hashed and written to a blockchain ledger — permanent and tamper-proof.</p>
            </div>
            <div className="step-card step-lavender">
              <div className="step-number">4</div>
              <h3>Track Resolution</h3>
              <p>Officials update the status; citizens track progress in real time from their dashboard.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>What You Can Do Here</h2>
          <div className="feature-grid">
            <button className="feature-card feature-blue" onClick={() => goTo('/file-complaint')}>
              <h3>📋 File a Grievance</h3>
              <p>Submit issues like water, roads, electricity or sanitation in minutes.</p>
            </button>
            <button className="feature-card feature-peach" onClick={() => goTo('/citizen-dashboard')}>
              <h3>🔍 Track Status</h3>
              <p>See whether your complaint is submitted, in progress, or resolved.</p>
            </button>
            <button className="feature-card feature-mint" onClick={() => goTo('/citizen-dashboard')}>
              <h3>🔒 Tamper-Proof Records</h3>
              <p>Every submission is written to the blockchain so records can't be altered.</p>
            </button>
          </div>
        </section>

        <section className="section section-lavender">
          <h2>Departments &amp; Categories We Cover</h2>
          <div className="chip-row">
            <span className="chip">💧 Water Supply</span>
            <span className="chip">🛣️ Roads &amp; Infrastructure</span>
            <span className="chip">💡 Electricity</span>
            <span className="chip">🧹 Sanitation</span>
            <span className="chip">🏥 Public Health</span>
            <span className="chip">📄 Other Civic Services</span>
          </div>
        </section>

      </main>

      <footer className="site-footer">
        <div className="footer-col">
          <strong>CivicChain</strong>
          <p>A digital initiative for transparent public service delivery.</p>
        </div>
        <div className="footer-col">
          <strong>Quick Links</strong>
          <Link to="/citizen-login">Citizen Login</Link>
          <Link to="/admin-login">Official Login</Link>
        </div>
        <div className="footer-col">
          <strong>Contact</strong>
          <p>helpdesk@civicchain.gov.in</p>
          <p>Toll-Free: 1800-XXX-XXXX</p>
        </div>
      </footer>
      <div className="footer-bottom">© 2026 CivicChain · A Government Digital Services Project</div>
    </div>
  );
}

export default Home;
