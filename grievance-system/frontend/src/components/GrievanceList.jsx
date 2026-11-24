import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMyGrievances } from '../api/grievanceApi';

const STATUS_COLORS = {
  pending: '#c9962b',
  'in progress': '#2b6fc9',
  resolved: '#2b9c4a',
};

function GrievanceList({ refreshKey }) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const citizenId = localStorage.getItem('userId') || localStorage.getItem('email');
      const res = await getMyGrievances(citizenId);
      setGrievances(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData, refreshKey]);


  useEffect(() => {
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) return <p>Loading your grievances...</p>;
  if (error) return <p className="error-text">Could not load grievances: {error}</p>;

  return (
    <div className="card">
      <div className="card-header-row">
        <h3>My Grievances</h3>
        <div className="header-actions">
          <button className="btn-small btn-refresh" onClick={fetchData}>Refresh</button>
          <Link to="/file-complaint" className="btn-small">+ New Complaint</Link>
        </div>
      </div>
      {!grievances.length ? (
        <p>You haven't filed any grievances yet.</p>
      ) : (
        <table>
          <thead>
            <tr><th>ID</th><th>Photo</th><th>Details</th><th>Category</th><th>Status</th></tr>
          </thead>
          <tbody>
            {grievances.map((g) => {
              const id = g.id || g.grievance_id || g._id;
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>
                    {g.image ? (
                      <img src={g.image} alt="evidence" className="thumb" />
                    ) : (
                      '—'
                    )}
                  </td>
                  {}
                  <td>{g.title || g.text || '—'}</td>
                  <td>{g.category || 'Not yet classified'}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: STATUS_COLORS[(g.status || '').toLowerCase()] || '#888' }}
                    >
                      {g.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default GrievanceList;
