import { useState } from 'react';
import Navbar from '../components/Navbar';
import GrievanceForm from '../components/GrievanceForm';
import GrievanceList from '../components/GrievanceList';
import QueueStatus from '../components/QueueStatus';

function CitizenDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <Navbar />
      <main className="container">
        <GrievanceForm onQueued={() => setRefreshKey((k) => k + 1)} />
        <QueueStatus />
        <GrievanceList refreshKey={refreshKey} />
      </main>
    </div>
  );
}

export default CitizenDashboard;
