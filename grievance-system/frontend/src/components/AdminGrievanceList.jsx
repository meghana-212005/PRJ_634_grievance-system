import { useEffect, useState, useCallback } from 'react';
import { getAllGrievances, updateGrievanceStatus } from '../api/grievanceApi';

// Backend only accepts exactly these three — sending anything else (like
// "Rejected") gets a 400 error, so don't add more options here without
// checking with your teammate first.
const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved'];

function AdminGrievanceList() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const department = localStorage.getItem('department') || '';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllGrievances(department);
      setGrievances(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [department]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateGrievanceStatus(id, status);
      setGrievances((prev) =>
        prev.map((g) => ((g.id || g.grievance_id || g._id) === id ? { ...g, status } : g))
      );
    } catch (err) {
      alert('Could not update status: ' + err.message);
    }
  };

  if (loading) return <p>Loading grievances...</p>;
  if (error) return <p className="error-text">Could not load grievances: {error}</p>;
  if (!grievances.length) return <p>No grievances filed yet.</p>;

  return (
    <div className="card">
      <div className="card-header-row">
        <h3>{department ? `${department} Grievances` : 'All Grievances'}</h3>
        <button className="btn-small btn-refresh" onClick={fetchData}>Refresh</button>
      </div>
      <table>
        <thead>
          <tr><th>ID</th><th>Details</th><th>Category</th><th>Citizen</th><th>Status</th></tr>
        </thead>
        <tbody>
          {grievances.map((g) => {
            const id = g.id || g.grievance_id || g._id;
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{g.title || g.text || '—'}</td>
                <td>{g.category || 'Not yet classified'}</td>
                <td>{g.citizen_id || '—'}</td>
                <td>
                  <select
                    value={g.status || 'Pending'}
                    onChange={(e) => handleStatusChange(id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AdminGrievanceList;
