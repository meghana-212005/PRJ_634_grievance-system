import Navbar from '../components/Navbar';
import AdminGrievanceList from '../components/AdminGrievanceList';

function AdminDashboard() {
  return (
    <div>
      <Navbar />
      <main className="container">
        <AdminGrievanceList />
      </main>
    </div>
  );
}

export default AdminDashboard;
