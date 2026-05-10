function importPyFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (!file.name.endsWith('.py')) return toast('Selecione um arquivo .py', 'error');
  const reader = new FileReader();
  reader.onload = e => {
    document.getElementById('process-script').value = e.target.result;
    toast(`"${file.name}" importado com sucesso`, 'success');
  };
  reader.readAsText(file, 'utf-8');
  input.value = '';
}

function stopProcess(processId, processName) {
  showConfirm(
    'Parar processo',
    `Deseja cancelar todas as execuções pendentes e em andamento de "${processName}"?`,
    async () => {
      try {
        await api('POST', `/processes/${processId}/stop`);
        toast(`Execuções de "${processName}" canceladas.`, 'success');
      } catch(e) { toast(e.message, 'error'); }
    }
  );
}

async function loadProcesses() {
  const tbody = document.getElementById('processes-body');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="5"><div class="spinner"></div></td></tr>`;
  const [processes, agents] = await Promise.all([
    api('GET', '/processes'),
    api('GET', '/agents'),
  ]);
  if (!processes) return;
  if (!processes.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📋</div><h3>Nenhum processo ainda</h3><p>Crie seu primeiro processo Python</p></div></td></tr>`;
    return;
  }
  const agentMap = {};
  if (agents) agents.forEach(a => agentMap[a.id] = a);
  tbody.innerHTML = processes.map(p => {
    const agent = p.agent_id ? agentMap[p.agent_id] : null;
    const agentCell = agent
      ? `<span style="display:inline-flex;align-items:center;gap:.35rem;font-size:.82rem">${agent.connected ? '🟢' : '⚫'} ${agent.name}</span>`
      : `<span style="color:var(--gray-400);font-size:.82rem">Qualquer</span>`;
    return `
    <tr>
      <td class="agent-name-cell" style="cursor:pointer;text-decoration:underline;text-decoration-color:var(--blue-300)" onclick="openProcessLogs('${p.id}','${p.name.replace(/'/g,"\\'")}')">
        ${p.name}
      </td>
      <td>${p.description || '–'}</td>
      <td>${agentCell}</td>
      <td>${p.schedule ? `<span class="badge badge-blue" style="font-family:monospace;font-size:.72rem">${p.schedule}</span>` : '<span style="color:var(--gray-400);font-size:.82rem">–</span>'}</td>
      <td class="actions-cell">
        <button class="btn btn-blue btn-sm" onclick="runNow('${p.id}','${p.name.replace(/'/g,"\\'")}')">⚡ Executar</button>
        <button class="btn btn-outline btn-sm" onclick="openProcessLogs('${p.id}','${p.name.replace(/'/g,"\\'")}')">📋 Logs</button>
        <button class="btn btn-danger btn-sm" onclick="stopProcess('${p.id}','${p.name.replace(/'/g,"\\'")}')">⏹ Parar</button>
        <button class="btn btn-outline btn-sm" onclick="openJobModal('${p.id}','${p.name.replace(/'/g,"\\'")}')">▶ Com parâmetros</button>
        <button class="btn btn-outline btn-sm" onclick="editProcess('${p.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProcess('${p.id}')">Remover</button>
      </td>
    </tr>`;
  }).join('');
}

function onScheduleTypeChange() {
  const type = document.getElementById('process-schedule-type').value;
  document.getElementById('schedule-interval').style.display = type === 'interval' ? 'block' : 'none';
  document.getElementById('schedule-daily').style.display = type === 'daily' ? 'block' : 'none';
  document.getElementById('schedule-cron').style.display = type === 'cron' ? 'block' : 'none';
}

function _scheduleToFields(schedule) {
  if (!schedule) { document.getElementById('process-schedule-type').value = ''; return; }
  const intervalMatch = schedule.match(/^\*\/(\d+) \* \* \* \*$/);
  const dailyMatch = schedule.match(/^(\d+) (\d+) \* \* \*$/);
  if (intervalMatch) {
    document.getElementById('process-schedule-type').value = 'interval';
    document.getElementById('schedule-minutes').value = intervalMatch[1];
  } else if (dailyMatch) {
    document.getElementById('process-schedule-type').value = 'daily';
    const h = String(dailyMatch[2]).padStart(2,'0');
    const m = String(dailyMatch[1]).padStart(2,'0');
    document.getElementById('schedule-time').value = `${h}:${m}`;
  } else {
    document.getElementById('process-schedule-type').value = 'cron';
    document.getElementById('schedule-cron-expr').value = schedule;
  }
  onScheduleTypeChange();
}

function _fieldsToSchedule() {
  const type = document.getElementById('process-schedule-type').value;
  if (!type) return null;
  if (type === 'interval') {
    const m = parseInt(document.getElementById('schedule-minutes').value) || 60;
    return `*/${m} * * * *`;
  }
  if (type === 'daily') {
    const [h, m] = (document.getElementById('schedule-time').value || '09:00').split(':');
    return `${parseInt(m)} ${parseInt(h)} * * *`;
  }
  return document.getElementById('schedule-cron-expr').value.trim() || null;
}

async function _fillAgentDropdown(selectedId = '') {
  const sel = document.getElementById('process-agent-id');
  sel.innerHTML = '<option value="">Qualquer agente</option>';
  const agents = await api('GET', '/agents');
  if (agents) agents.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.name + (a.connected ? ' 🟢' : ' ⚫');
    opt.selected = a.id === selectedId;
    sel.appendChild(opt);
  });
}

async function openProcessModal() {
  document.getElementById('process-edit-id').value = '';
  document.getElementById('process-name').value = '';
  document.getElementById('process-description').value = '';
  document.getElementById('process-script').value = '';
  document.getElementById('process-timeout').value = '300';
  document.getElementById('process-schedule-type').value = '';
  onScheduleTypeChange();
  document.getElementById('modal-process-title').textContent = 'Novo processo';
  await _fillAgentDropdown();
  openModal('modal-process');
}

async function editProcess(id) {
  const p = await api('GET', `/processes/${id}`);
  if (!p) return;
  document.getElementById('process-edit-id').value = p.id;
  document.getElementById('process-name').value = p.name;
  document.getElementById('process-description').value = p.description || '';
  document.getElementById('process-script').value = p.script || '';
  document.getElementById('process-timeout').value = p.timeout_seconds;
  _scheduleToFields(p.schedule || '');
  document.getElementById('modal-process-title').textContent = 'Editar processo';
  await _fillAgentDropdown(p.agent_id || '');
  openModal('modal-process');
}

async function saveProcess() {
  const id = document.getElementById('process-edit-id').value;
  const body = {
    name: document.getElementById('process-name').value.trim(),
    description: document.getElementById('process-description').value.trim(),
    timeout_seconds: parseInt(document.getElementById('process-timeout').value),
    agent_id: document.getElementById('process-agent-id').value || null,
    schedule: _fieldsToSchedule(),
  };
  const script = document.getElementById('process-script').value.trim();
  if (!body.name) return toast('Informe o nome do processo', 'error');
  if (!id && !script) return toast('Informe o script do processo', 'error');
  if (script) body.script = script;
  try {
    if (id) {
      await api('PATCH', `/processes/${id}`, body);
      toast('Processo atualizado!', 'success');
    } else {
      await api('POST', '/processes', body);
      toast('Processo criado!', 'success');
    }
    closeModal('modal-process');
    loadProcesses();
  } catch(e) { toast(e.message, 'error'); }
}

async function deleteProcess(id) {
  if (!confirm('Remover este processo?')) return;
  try {
    await api('DELETE', `/processes/${id}`);
    toast('Processo removido', 'success');
    loadProcesses();
  } catch(e) { toast(e.message, 'error'); }
}

async function openProcessLogs(processId, processName) {
  document.getElementById('modal-process-logs-title').textContent = `Logs — ${processName}`;
  const body = document.getElementById('process-logs-body');
  body.innerHTML = `<div style="padding:2rem;text-align:center"><div class="spinner"></div></div>`;
  openModal('modal-process-logs');

  const jobs = await api('GET', `/jobs?process_id=${processId}&limit=50`);
  if (!jobs) return;
  if (!jobs.length) {
    body.innerHTML = `<div style="padding:3rem;text-align:center;color:var(--gray-400)">
      <div style="font-size:2rem;margin-bottom:.75rem">📭</div>
      <p>Nenhuma execução ainda</p>
    </div>`;
    return;
  }

  body.innerHTML = jobs.map(j => `
    <div style="border-bottom:1px solid var(--gray-200);padding:1rem 1.5rem">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem">
        <div style="display:flex;align-items:center;gap:.75rem">
          ${statusBadge(j.status)}
          <span style="font-size:.8rem;color:var(--gray-400)">${formatDate(j.created_at)}</span>
          ${j.finished_at ? `<span style="font-size:.8rem;color:var(--gray-400)">→ ${formatDate(j.finished_at)}</span>` : ''}
        </div>
        <button class="btn btn-outline btn-sm" onclick="viewJob('${j.id}')">Ver detalhes</button>
      </div>
      ${j.output ? `<pre style="background:var(--gray-100);border-radius:6px;padding:.6rem .75rem;font-size:.78rem;max-height:120px;overflow:auto;margin:0;white-space:pre-wrap;word-break:break-all">${escapeHtml(j.output.slice(0, 500))}${j.output.length > 500 ? '\n…' : ''}</pre>` : ''}
      ${j.error ? `
        <pre style="background:#fef2f2;border-radius:6px;padding:.6rem .75rem;font-size:.78rem;max-height:80px;overflow:auto;margin:0;color:#991b1b;white-space:pre-wrap;word-break:break-all">${escapeHtml(j.error.slice(0, 300))}${j.error.length > 300 ? '\n…' : ''}</pre>
        ${_installBtn(j.agent_id, _missingModule(j.error))}
      ` : ''}
      ${!j.output && !j.error && j.status === 'pending' ? `<span style="font-size:.8rem;color:var(--gray-400)">Aguardando worker...</span>` : ''}
      ${!j.output && !j.error && j.status === 'running' ? `<span style="font-size:.8rem;color:var(--blue-600)">Executando...</span>` : ''}
    </div>
  `).join('');
}
