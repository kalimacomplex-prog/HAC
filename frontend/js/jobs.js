async function runNow(processId, processName) {
  try {
    await api('POST', '/jobs', { process_id: processId, params: {} });
    toast(`Job "${processName}" disparado! Worker vai executar em breve.`, 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

function openJobModal(processId, processName) {
  document.getElementById('job-process-id').value = processId;
  document.getElementById('job-process-name').textContent = processName;
  document.getElementById('job-params').value = '{}';
  openModal('modal-job');
}

async function dispatchJob() {
  const processId = document.getElementById('job-process-id').value;
  let params = {};
  try {
    params = JSON.parse(document.getElementById('job-params').value || '{}');
  } catch { return toast('JSON de parâmetros inválido', 'error'); }
  try {
    await api('POST', '/jobs', { process_id: processId, params });
    toast('Job disparado! Worker vai executar em breve.', 'success');
    closeModal('modal-job');
  } catch(e) { toast(e.message, 'error'); }
}

async function loadJobs() {
  const tbody = document.getElementById('jobs-body');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="5"><div class="spinner"></div></td></tr>`;
  const status = document.getElementById('filter-status')?.value || '';
  const qs = status ? `?status=${status}&limit=100` : '?limit=100';
  const jobs = await api('GET', `/jobs${qs}`);
  if (!jobs) return;
  if (!jobs.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">⚙️</div><h3>Nenhum job encontrado</h3><p>Dispare um job a partir de um processo</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = jobs.map(j => `
    <tr>
      <td class="agent-name-cell">${j.process_name}</td>
      <td>${statusBadge(j.status)}</td>
      <td><code style="font-size:.75rem;color:var(--gray-600)">${JSON.stringify(j.params).slice(0,50)}${JSON.stringify(j.params).length>50?'…':''}</code></td>
      <td>${formatDate(j.created_at)}</td>
      <td class="actions-cell">
        <button class="btn btn-outline btn-sm" onclick="viewJob('${j.id}')">Ver resultado</button>
        ${j.status === 'pending' ? `<button class="btn btn-danger btn-sm" onclick="cancelJob('${j.id}')">Cancelar</button>` : ''}
      </td>
    </tr>
  `).join('');
}

async function viewJob(id) {
  const job = await api('GET', `/jobs/${id}`);
  if (!job) return;
  const body = document.getElementById('job-result-body');
  body.innerHTML = `
    <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.25rem">
      <div><span style="font-size:.75rem;color:var(--gray-400);text-transform:uppercase;font-weight:600">Processo</span><br><strong>${job.process_name}</strong></div>
      <div><span style="font-size:.75rem;color:var(--gray-400);text-transform:uppercase;font-weight:600">Status</span><br>${statusBadge(job.status)}</div>
      <div><span style="font-size:.75rem;color:var(--gray-400);text-transform:uppercase;font-weight:600">Criado</span><br><span style="font-size:.85rem">${formatDate(job.created_at)}</span></div>
      ${job.finished_at ? `<div><span style="font-size:.75rem;color:var(--gray-400);text-transform:uppercase;font-weight:600">Finalizado</span><br><span style="font-size:.85rem">${formatDate(job.finished_at)}</span></div>` : ''}
    </div>
    ${Object.keys(job.params).length ? `
      <div style="margin-bottom:1.25rem">
        <div style="font-size:.8rem;font-weight:600;color:var(--gray-600);margin-bottom:.5rem">Parâmetros</div>
        <pre style="background:var(--gray-100);border-radius:8px;padding:.75rem;font-size:.8rem;overflow-x:auto">${JSON.stringify(job.params, null, 2)}</pre>
      </div>
    ` : ''}
    ${job.output ? `
      <div style="margin-bottom:1rem">
        <div style="font-size:.8rem;font-weight:600;color:var(--gray-600);margin-bottom:.5rem">Output</div>
        <div class="output-box">${escapeHtml(job.output)}</div>
      </div>
    ` : ''}
    ${job.error ? `
      <div>
        <div style="font-size:.8rem;font-weight:600;color:#991b1b;margin-bottom:.5rem">Erro</div>
        <div class="output-box output-error">${escapeHtml(job.error)}</div>
      </div>
    ` : ''}
    ${!job.output && !job.error ? `<p style="color:var(--gray-400);font-size:.875rem;text-align:center;padding:2rem">Nenhuma saída registrada ainda.</p>` : ''}
  `;
  openModal('modal-job-result');
}

async function cancelJob(id) {
  if (!confirm('Cancelar este job?')) return;
  try {
    await api('DELETE', `/jobs/${id}`);
    toast('Job cancelado', 'success');
    loadJobs();
  } catch(e) { toast(e.message, 'error'); }
}
