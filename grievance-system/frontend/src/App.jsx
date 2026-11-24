import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CitizenLogin from './pages/CitizenLogin';
import AdminLogin from './pages/AdminLogin';
import CitizenSignup from './pages/CitizenSignup';
import AdminSignup from './pages/AdminSignup';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FileComplaint from './pages/FileComplaint';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/citizen-login" element={<CitizenLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/citizen-signup" element={<CitizenSignup />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route
          path="/citizen-dashboard"
          element={
            <ProtectedRoute role="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/file-complaint"
          element={
            <ProtectedRoute role="citizen">
              <FileComplaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
