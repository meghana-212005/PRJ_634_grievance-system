// A tiny fake "database" living in localStorage, used only in DEMO_MODE.
// Lets you show a full, working app tomorrow with zero backend running.

const STORE_KEY = 'demo_grievances';

const SEED_DATA = [
  {
    id: 'GR-1001',
    title: 'Streetlight not working',
    category: 'Electricity',
    description: 'The streetlight on 4th Cross Road has been off for a week.',
    status: 'In Progress',
    citizen_id: 'demo.citizen@example.com',
  },
  {
    id: 'GR-1002',
    title: 'Garbage not collected',
    category: 'Sanitation',
    description: 'Garbage pickup has been missed for 3 days in our area.',
    status: 'Pending',
    citizen_id: 'demo.citizen@example.com',
  },
];

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : SEED_DATA;
  } catch {
    return SEED_DATA;
  }
}

function save(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function getAll() {
  return load();
}

export function getByCitizen(email) {
  return load().filter((g) => g.citizen_id === email);
}

export function getByCategory(category) {
  if (!category) return load();
  return load().filter((g) => g.category === category);
}

export function add(grievance) {
  const data = load();
  const newItem = {
    id: `GR-${1000 + data.length + Math.floor(Math.random() * 900)}`,
    status: 'Pending',
    ...grievance, // includes image (base64) when the citizen attached a photo
  };
  data.push(newItem);
  save(data);
  return newItem;
}

export function updateStatus(id, status) {
  const data = load();
  const updated = data.map((g) => (g.id === id ? { ...g, status } : g));
  save(updated);
  return updated.find((g) => g.id === id);
}

export function resetDemoData() {
  save(SEED_DATA);
}

// --- Demo user accounts (signup) ---
const USERS_KEY = 'demo_users';

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function addUser(role, userDetails) {
  const users = loadUsers();
  users.push({ role, ...userDetails, createdAt: new Date().toISOString() });
  saveUsers(users);
  return userDetails;
}
