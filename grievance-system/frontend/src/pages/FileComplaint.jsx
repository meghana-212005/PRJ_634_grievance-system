import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GrievanceForm from '../components/GrievanceForm';

function FileComplaint() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <main className="container">
        <h2>Register a New Complaint</h2>
        <GrievanceForm onQueued={() => navigate('/citizen-dashboard')} />
      </main>
    </div>
  );
}

export default FileComplaint;
