async function loadDashboard() {
  let processes = [], jobs = [];
  try {
    [processes, jobs] = await Promise.all([
      api('GET', '/processes'),
      api('GET', '/jobs?limit=100'),
    ]);
    processes = processes || [];
    jobs = jobs || [];
  } catch(e) {}

  const today = new Date().toDateString();
  const jobsToday = jobs.filter(j => new Date(j.created_at + 'Z').toDateString() === today);

  document.getElementById('stat-agents').textContent = processes.length;
  document.getElementById('stat-jobs-today').textContent = jobsToday.length;
  document.getElementById('stat-done').textContent = jobs.filter(j => j.status === 'done').length;
  document.getElementById('stat-failed').textContent = jobs.filter(j => j.status === 'failed').length;

  const tbody = document.getElementById('recent-jobs-body');
  const recent = jobs.slice(0, 10);
  if (!recent.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">📭</div><h3>Nenhum job ainda</h3><p>Crie um processo e dispare seu primeiro job</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = recent.map(j => `
    <tr>
      <td class="agent-name-cell">${j.process_name}</td>
      <td>${statusBadge(j.status)}</td>
      <td>${formatDate(j.created_at)}</td>
      <td>${j.finished_at ? formatDate(j.finished_at) : '–'}</td>
    </tr>
  `).join('');
}
