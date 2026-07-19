const API = (localStorage.getItem('hac_api_url') || window.location.origin).replace(/\/$/, '');

let token = localStorage.getItem('hac_token');
let currentUser = null;

window.addEventListener('load', () => {
  if (token) initApp();
  else showAuth();
});

async function api(method, path, body, timeoutMs = 180000, externalSignal = null) {
  const controller = new AbortController();
  let timedOut = false;
  const tid = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', () => controller.abort());
  }
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(`${API}${path}`, opts);
    clearTimeout(tid);
    if (res.status === 401) { logout(); return null; }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Erro desconhecido' }));
      throw new Error(err.detail || 'Erro na requisição');
    }
    if (res.status === 204) return null;
    return res.json();
  } catch (e) {
    clearTimeout(tid);
    if (e.name === 'AbortError') {
      if (timedOut) throw new Error('Tempo esgotado (180s). A execução pode continuar em background.');
      const abortErr = new Error('Cancelado pelo usuário');
      abortErr.name = 'AbortError';
      throw abortErr;
    }
    throw e;
  }
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

    let savedView = localStorage.getItem('hac_current_view') || 'dashboard';
    if (!document.getElementById(`view-${savedView}`)) savedView = 'dashboard';
    if (savedView === 'studio_builder') {
      const savedAutoId = localStorage.getItem('hac_builder_auto_id');
      window._builderAutoId = savedAutoId || null;
    }
    navigate(savedView);
  } catch(e) { logout(); }
}

function navigate(view) {
  localStorage.setItem('hac_current_view', view);
  if (view === 'studio_builder') localStorage.setItem('hac_builder_auto_id', window._builderAutoId || '');
  // Restaura sidebar e topbar ao sair do builder
  if (view !== 'studio_builder') {
    document.querySelector('.topbar').style.display = '';
    document.getElementById('sidebar').style.display = '';
  }
  // Restaura padding do content ao sair do modelador
  const contentEl = document.querySelector('.content');
  if (view !== 'workflows') {
    contentEl.style.padding = '';
    contentEl.style.overflow = '';
    contentEl.style.height = '';
  }

  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`view-${view}`).classList.add('active');
  const navEl = document.getElementById(`nav-${view}`);
  if (navEl) navEl.classList.add('active');

  stopQueueAutoRefresh();

  const titles = { dashboard: 'Dashboard', queue: 'Fila de Execução', agents: 'Agentes', processes: 'Processos', cronjobs: 'Cron Jobs', instructions: 'Instruções', studio: 'HAC Studio', studio_builder: 'Builder', ai_agents: 'Agentes IA', pipelines: 'Pipelines de IA', oraculo: 'Oráculo', workflows: 'Modelador de Workflows' };
  document.getElementById('topbar-title').textContent = titles[view];

  const actions = document.getElementById('topbar-actions');
  actions.innerHTML = '';

  if (view === 'agents') {
    actions.innerHTML = `<button class="btn btn-blue" onclick="openAgentModal()">+ Novo agente</button>`;
    loadAgents();
  } else if (view === 'processes') {
    actions.innerHTML = `<button class="btn btn-blue" onclick="openProcessModal()">+ Novo processo</button>`;
    loadProcesses();
  } else if (view === 'cronjobs') {
    actions.innerHTML = `<button class="btn btn-blue" onclick="openNewCronModal()">+ Cadastrar</button>`;
    loadCronJobs();
  } else if (view === 'instructions') {
    // conteúdo estático, nada a carregar
  } else if (view === 'dashboard') {
    loadDashboard();
  } else if (view === 'ai_agents') {
    actions.innerHTML = `<button class="btn btn-blue" onclick="openAIAgentModal()">+ Novo agente IA</button>`;
    loadAIAgents();
  } else if (view === 'pipelines') {
    actions.innerHTML = `<button class="btn btn-blue" onclick="openPipelineModal()">+ Nova pipeline</button>`;
    loadPipelines();
  } else if (view === 'studio') {
    actions.innerHTML = `<button class="btn btn-blue" onclick="openBuilderPage()">+ Nova automação</button>`;
    loadStudio();
  } else if (view === 'studio_builder') {
    document.querySelector('.topbar').style.display = 'none';
    document.getElementById('sidebar').style.display = 'none';
    initBuilderPage();
  } else if (view === 'queue') {
    loadQueue();
    startQueueAutoRefresh();
  } else if (view === 'oraculo') {
    loadOraculoAgents();
  } else if (view === 'workflows') {
    const topbarH = document.querySelector('.topbar').getBoundingClientRect().height;
    contentEl.style.padding = '0';
    contentEl.style.overflow = 'hidden';
    contentEl.style.height = `calc(100vh - ${topbarH}px)`;
    actions.innerHTML = `<button class="btn btn-blue" onclick="openWorkflowEditor()">+ Novo workflow</button>`;
    loadWorkflows();
  }
}
