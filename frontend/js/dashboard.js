async function loadDashboard() {
  let agentList = [], jobList = [];
  let erros = [];

  try {
    agentList = await api('GET', '/agents') || [];
  } catch(e) {
    erros.push('agentes: ' + e.message);
    console.error('[dashboard] /agents falhou:', e);
  }

  try {
    jobList = await api('GET', '/jobs?limit=200') || [];
  } catch(e) {
    erros.push('jobs: ' + e.message);
    console.error('[dashboard] /jobs falhou:', e);
  }

  if (erros.length) {
    toast('Erro ao carregar dashboard — ' + erros.join(' | '), 'error');
  }

  document.getElementById('stat-agents-on').textContent  = agentList.filter(a => a.connected).length;
  document.getElementById('stat-agents-off').textContent = agentList.length - agentList.filter(a => a.connected).length;
  document.getElementById('stat-total').textContent      = jobList.length;
  document.getElementById('stat-done').textContent       = jobList.filter(j => j.status === 'done').length;
  document.getElementById('stat-failed').textContent     = jobList.filter(j => j.status === 'failed').length;

  const tbody = document.getElementById('recent-jobs-body');

  if (!jobList.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">
      <div class="empty-icon">${_icon('inbox', 32)}</div>
      <h3>Nenhuma execução ainda</h3>
      <p>Crie um processo e dispare seu primeiro job</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = jobList.map(j => `
    <tr>
      <td class="agent-name-cell">${j.process_name}</td>
      <td>${statusBadge(j.status)}</td>
      <td>${j.started_at ? formatDate(j.started_at) : '–'}</td>
      <td>${j.finished_at ? formatDate(j.finished_at) : '–'}</td>
      <td style="font-size:.82rem;color:var(--gray-600)">${_duration(j.started_at, j.finished_at)}</td>
    </tr>
  `).join('');
}

function _duration(start, end) {
  if (!start || !end) return '–';
  const ms = new Date(end + 'Z') - new Date(start + 'Z');
  if (ms < 0) return '–';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
