import axiosInstance from './axiosInstance';
import { DEMO_MODE } from '../config';
import * as mockStore from './mockStore';
import { classifyGrievance } from './mockClassifier';

// Fake network delay so demo mode still feels like it's "loading"
const wait = (ms = 500) => new Promise((res) => setTimeout(res, ms));

export async function loginCitizen(email, password) {
  if (DEMO_MODE) {
    await wait();
    return { access_token: 'demo-citizen-token', user_id: 'demo-citizen-id' };
  }
  // Real response shape: { access_token, token_type, user_id, role }
  return axiosInstance.post('/login/citizen', { email, password });
}

export async function loginAdmin(email, password) {
  if (DEMO_MODE) {
    await wait();
    // Look up the demo department this admin signed up with, so demo mode
    // filters the same way the real backend does.
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const match = users.find((u) => u.role === 'admin' && u.email === email);
    return {
      access_token: 'demo-admin-token',
      user_id: 'demo-admin-id',
      department: match?.department || '',
    };
  }
  return axiosInstance.post('/login/admin', { email, password });
}

export async function signupCitizen({ name, email, password }) {
  if (DEMO_MODE) {
    await wait();
    return mockStore.addUser('citizen', { name, email, password });
  }
  // Confirmed real route: POST /login/register/citizen
  return axiosInstance.post('/login/register/citizen', { name, email, password });
}

export async function signupAdmin({ name, email, password, department }) {
  if (DEMO_MODE) {
    await wait();
    return mockStore.addUser('admin', { name, email, password, department });
  }
  // Confirmed real route: POST /login/register/admin
  return axiosInstance.post('/login/register/admin', { name, email, password, department });
}

export async function submitGrievance({ title, description, citizen_id, image }) {
  if (DEMO_MODE) {
    await wait();
    // Simulates the backend's NLP step: the citizen never picks a category —
    // it's inferred from what they wrote, same as the real BERT classifier will do.
    const category = classifyGrievance(title, description);
    return mockStore.add({ title, description, citizen_id, image, category });
  }
  // Backend only accepts { text, citizen_id } right now — no separate title
  // field, and no photo field yet (flag the photo gap to your teammate).
  // citizen_id MUST be the real Mongo _id from login, not an email.
  const text = `${title} - ${description}`;
  return axiosInstance.post('/submit-grievance', { text, citizen_id });
}

export async function getMyGrievances(citizenId) {
  if (DEMO_MODE) {
    await wait(300);
    return mockStore.getByCitizen(citizenId);
  }
  // Backend expects citizen_id as a query parameter, not derived from a token.
  return axiosInstance.get('/my-grievances', { params: { citizen_id: citizenId } });
}

export async function getAllGrievances(department) {
  if (DEMO_MODE) {
    await wait(300);
    return mockStore.getByCategory(department);
  }
  // No department (super-admin) -> backend returns everything.
  // With a department -> backend filters to that category only.
  return axiosInstance.get('/all-grievances', { params: department ? { department } : {} });
}

export async function updateGrievanceStatus(id, status) {
  if (DEMO_MODE) {
    await wait(300);
    return mockStore.updateStatus(id, status);
  }
  // Backend only accepts exactly: "Pending" | "In Progress" | "Resolved"
  return axiosInstance.patch(`/grievance/${id}/status`, { status });
}
