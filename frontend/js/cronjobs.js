async function loadCronJobs() {
  const tbody = document.getElementById('cronjobs-body');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="4"><div class="spinner"></div></td></tr>`;
  const processes = await api('GET', '/processes');
  if (!processes) return;
  if (!processes.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">⏱</div><h3>Nenhum processo ainda</h3><p>Crie um processo primeiro para configurar agendamentos</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = processes.map(p => {
    const hasSchedule = !!p.schedule;
    const scheduleLabel = hasSchedule ? _formatSchedule(p.schedule) : '–';
    const nextRun = hasSchedule ? _cronNextRun(p.schedule) : '–';
    return `
    <tr>
      <td class="agent-name-cell">${p.name}</td>
      <td>${p.description || '–'}</td>
      <td>
        ${hasSchedule
          ? `<div style="display:flex;flex-direction:column;gap:.25rem">
               <span class="badge badge-blue" style="font-family:monospace;font-size:.72rem;width:fit-content">${p.schedule}</span>
               <span style="font-size:.75rem;color:var(--gray-600)">${scheduleLabel}</span>
             </div>`
          : `<span style="color:var(--gray-400);font-size:.82rem">Sem agendamento</span>`
        }
      </td>
      <td style="font-size:.82rem;color:var(--gray-600)">${nextRun}</td>
      <td class="actions-cell">
        <button class="btn btn-blue btn-sm" onclick="openCronModal('${p.id}','${p.name.replace(/'/g,"\\'")}','${p.schedule || ''}')">
          ${hasSchedule ? '✏ Editar' : '+ Configurar'}
        </button>
        ${hasSchedule ? `<button class="btn btn-danger btn-sm" onclick="removeCronSchedule('${p.id}','${p.name.replace(/'/g,"\\'")}')">Remover</button>` : ''}
      </td>
    </tr>`;
  }).join('');
}

function openCronModal(processId, processName, currentSchedule) {
  document.getElementById('cron-process-id').value = processId;
  document.getElementById('cron-process-name').textContent = processName;
  _cronScheduleToFields(currentSchedule || '');
  openModal('modal-cron');
}

async function saveCronSchedule() {
  const id = document.getElementById('cron-process-id').value;
  const schedule = _cronFieldsToSchedule();
  if (!schedule) return toast('Selecione um tipo de agendamento', 'error');
  try {
    await api('PATCH', `/processes/${id}`, { schedule });
    toast('Agendamento salvo!', 'success');
    closeModal('modal-cron');
    loadCronJobs();
  } catch(e) { toast(e.message, 'error'); }
}

async function removeCronSchedule(processId, processName) {
  if (!confirm(`Remover agendamento de "${processName}"?`)) return;
  try {
    await api('PATCH', `/processes/${processId}`, { schedule: null });
    toast('Agendamento removido', 'success');
    loadCronJobs();
  } catch(e) { toast(e.message, 'error'); }
}

function onCronTypeChange() {
  const type = document.getElementById('cron-schedule-type').value;
  document.getElementById('cron-interval').style.display  = type === 'interval' ? 'block' : 'none';
  document.getElementById('cron-daily').style.display     = type === 'daily'    ? 'block' : 'none';
  document.getElementById('cron-custom').style.display    = type === 'cron'     ? 'block' : 'none';
}

function _cronScheduleToFields(schedule) {
  if (!schedule) { document.getElementById('cron-schedule-type').value = ''; onCronTypeChange(); return; }
  const intervalMatch = schedule.match(/^\*\/(\d+) \* \* \* \*$/);
  const dailyMatch    = schedule.match(/^(\d+) (\d+) \* \* \*$/);
  if (intervalMatch) {
    document.getElementById('cron-schedule-type').value = 'interval';
    document.getElementById('cron-minutes').value = intervalMatch[1];
  } else if (dailyMatch) {
    document.getElementById('cron-schedule-type').value = 'daily';
    const h = String(dailyMatch[2]).padStart(2,'0');
    const m = String(dailyMatch[1]).padStart(2,'0');
    document.getElementById('cron-time').value = `${h}:${m}`;
  } else {
    document.getElementById('cron-schedule-type').value = 'cron';
    document.getElementById('cron-expr').value = schedule;
  }
  onCronTypeChange();
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
