async function loadDashboard() {
  let agents = [], jobs = [];
  try {
    [agents, jobs] = await Promise.all([
      api('GET', '/agents'),
      api('GET', '/jobs?limit=200'),
    ]);
    agents = agents || [];
    jobs   = jobs   || [];
  } catch(e) {}

  const ativos     = agents.filter(a => a.connected).length;
  const inativos   = agents.length - ativos;
  const total      = jobs.length;
  const sucesso    = jobs.filter(j => j.status === 'done').length;
  const falha      = jobs.filter(j => j.status === 'failed').length;

  document.getElementById('stat-agents-on').textContent  = ativos;
  document.getElementById('stat-agents-off').textContent = inativos;
  document.getElementById('stat-total').textContent      = total;
  document.getElementById('stat-done').textContent       = sucesso;
  document.getElementById('stat-failed').textContent     = falha;

  const tbody = document.getElementById('recent-jobs-body');
  const recent = jobs.slice(0, 50);

  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">
      <div class="empty-icon">📭</div>
      <h3>Nenhuma execução ainda</h3>
      <p>Crie um processo e dispare seu primeiro job</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = recent.map(j => `
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
  const rs = s % 60;
  if (m < 60) return `${m}m ${rs}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}
