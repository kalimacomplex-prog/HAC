const API = (localStorage.getItem('hac_api_url') || window.location.origin).replace(/\/$/, '');

let token = localStorage.getItem('hac_token');
let currentUser = null;

window.addEventListener('load', () => {
  if (token) initApp();
  else showAuth();
});

async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  if (res.status === 401) { logout(); return null; }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Erro desconhecido' }));
    throw new Error(err.detail || 'Erro na requisição');
  }
  if (res.status === 204) return null;
  return res.json();
}

async function initApp() {
  try {
    currentUser = await api('GET', '/auth/me');
    if (!currentUser) return;
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
    navigate('dashboard');
  } catch(e) { logout(); }
}

function navigate(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  document.getElementById(`nav-${view}`).classList.add('active');

  const titles = { dashboard: 'Dashboard', agents: 'Agentes', processes: 'Processos', jobs: 'Jobs' };
  document.getElementById('topbar-title').textContent = titles[view];

  const actions = document.getElementById('topbar-actions');
  actions.innerHTML = '';

  if (view === 'agents') {
    actions.innerHTML = `<button class="btn btn-blue" onclick="openAgentModal()">+ Novo agente</button>`;
    loadAgents();
  } else if (view === 'processes') {
    actions.innerHTML = `<button class="btn btn-blue" onclick="openProcessModal()">+ Novo processo</button>`;
    loadProcesses();
  } else if (view === 'jobs') {
    loadJobs();
  } else if (view === 'dashboard') {
    loadDashboard();
  }
}
