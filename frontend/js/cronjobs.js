async function loadCronJobs() {
  const tbody = document.getElementById('cronjobs-body');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="4"><div class="spinner"></div></td></tr>`;
  const processes = await api('GET', '/processes');
  if (!processes) return;

  const scheduled = processes.filter(p => !!p.schedule);

  if (!scheduled.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state">
      <div class="empty-icon">⏱</div>
      <h3>Nenhum cron job cadastrado</h3>
      <p>Clique em "+ Cadastrar" para agendar um processo</p>
    </div></td></tr>`;
    return;
  }

  tbody.innerHTML = scheduled.map(p => `
    <tr>
      <td class="agent-name-cell">${p.name}</td>
      <td>
        <div style="display:flex;flex-direction:column;gap:.25rem">
          <span class="badge badge-blue" style="font-family:monospace;font-size:.72rem;width:fit-content">${p.schedule}</span>
          <span style="font-size:.75rem;color:var(--gray-600)">${_formatSchedule(p.schedule)}</span>
        </div>
      </td>
      <td style="font-size:.82rem;color:var(--gray-600)">${_cronNextRun(p.schedule)}</td>
      <td class="actions-cell">
        <button class="btn btn-danger btn-sm" onclick="removeCronSchedule('${p.id}','${p.name.replace(/'/g,"\\'")}')">Remover</button>
      </td>
    </tr>
  `).join('');
}

async function openNewCronModal() {
  const processes = await api('GET', '/processes');
  if (!processes) return;

  const available = processes.filter(p => !p.schedule);
  const sel = document.getElementById('cron-process-select');
  sel.innerHTML = '<option value="">Selecione um processo...</option>';
  available.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });

  if (!available.length) {
    return toast('Todos os processos já têm agendamento', 'error');
  }

  document.getElementById('cron-schedule-type').value = '';
  onCronTypeChange();
  openModal('modal-cron');
}

async function saveCronSchedule() {
  const processId = document.getElementById('cron-process-select').value;
  if (!processId) return toast('Selecione um processo', 'error');
  const schedule = _cronFieldsToSchedule();
  if (!schedule) return toast('Configure o agendamento', 'error');
  try {
    await api('PATCH', `/processes/${processId}`, { schedule });
    toast('Cron job cadastrado!', 'success');
    closeModal('modal-cron');
    loadCronJobs();
  } catch(e) { toast(e.message, 'error'); }
}

async function removeCronSchedule(processId, processName) {
  if (!confirm(`Remover o cron job de "${processName}"? O processo deixará de ser executado automaticamente.`)) return;
  try {
    await api('PATCH', `/processes/${processId}`, { schedule: null });
    toast('Cron job removido', 'success');
    loadCronJobs();
  } catch(e) { toast(e.message, 'error'); }
}

function onCronTypeChange() {
  const type = document.getElementById('cron-schedule-type').value;
  document.getElementById('cron-interval').style.display = type === 'interval' ? 'block' : 'none';
  document.getElementById('cron-daily').style.display    = type === 'daily'    ? 'block' : 'none';
  document.getElementById('cron-custom').style.display   = type === 'cron'     ? 'block' : 'none';
}

function _cronFieldsToSchedule() {
  const type = document.getElementById('cron-schedule-type').value;
  if (!type) return null;
  if (type === 'interval') {
    const m = parseInt(document.getElementById('cron-minutes').value) || 60;
    return `*/${m} * * * *`;
  }
  if (type === 'daily') {
    const [h, m] = (document.getElementById('cron-time').value || '09:00').split(':');
    return `${parseInt(m)} ${parseInt(h)} * * *`;
  }
  return document.getElementById('cron-expr').value.trim() || null;
}

function _formatSchedule(cron) {
  if (!cron) return '–';
  const intervalMatch = cron.match(/^\*\/(\d+) \* \* \* \*$/);
  const dailyMatch    = cron.match(/^(\d+) (\d+) \* \* \*$/);
  if (intervalMatch) return `A cada ${intervalMatch[1]} minuto${intervalMatch[1] === '1' ? '' : 's'}`;
  if (dailyMatch) {
    const h = String(dailyMatch[2]).padStart(2,'0');
    const m = String(dailyMatch[1]).padStart(2,'0');
    return `Todo dia às ${h}:${m}`;
  }
  return 'Expressão personalizada';
}

function _cronNextRun(cron) {
  if (!cron) return '–';
  try {
    const intervalMatch = cron.match(/^\*\/(\d+) \* \* \* \*$/);
    if (intervalMatch) {
      const mins = parseInt(intervalMatch[1]);
      const now = new Date();
      const nextMin = Math.ceil(now.getMinutes() / mins) * mins;
      const next = new Date(now);
      next.setMinutes(nextMin, 0, 0);
      if (next <= now) next.setMinutes(next.getMinutes() + mins);
      return `Próx: ${next.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    }
    const dailyMatch = cron.match(/^(\d+) (\d+) \* \* \*$/);
    if (dailyMatch) {
      const h = parseInt(dailyMatch[2]);
      const m = parseInt(dailyMatch[1]);
      const now = new Date();
      const next = new Date();
      next.setHours(h, m, 0, 0);
      if (next <= now) next.setDate(next.getDate() + 1);
      const diff = Math.round((next - now) / 60000);
      if (diff < 60) return `Em ${diff} min`;
      return `Em ${Math.round(diff / 60)}h`;
    }
    return 'Cron personalizado';
  } catch { return '–'; }
}
