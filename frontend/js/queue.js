let _queueRefreshTimer = null;
let _queuePriorities = {};

async function loadQueue() {
  try {
    const [pending, running] = await Promise.all([
      api('GET', '/jobs?status=pending&limit=200'),
      api('GET', '/jobs?status=running&limit=50'),
    ]);
    if (!pending || !running) return;

    document.getElementById('queue-stat-pending').textContent = pending.length;
    document.getElementById('queue-stat-running').textContent = running.length;
    document.getElementById('queue-stat-updated').textContent = new Date().toLocaleTimeString('pt-BR');

    pending.sort((a, b) => {
      const pa = a.priority || 0, pb = b.priority || 0;
      if (pb !== pa) return pb - pa;
      return new Date(a.created_at) - new Date(b.created_at);
    });

    pending.forEach(j => { _queuePriorities[j.id] = j.priority || 0; });

    const pb = document.getElementById('queue-pending-body');
    if (pending.length === 0) {
      pb.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:2rem">Fila vazia</td></tr>';
    } else {
      pb.innerHTML = pending.map(j => {
        const prio = j.priority || 0;
        const prioColor = prio >= 5 ? 'var(--red)' : prio >= 3 ? '#d97706' : prio >= 1 ? 'var(--blue-600)' : 'var(--gray-400)';
        const prioLabel = prio >= 5 ? 'Urgente' : prio >= 3 ? 'Alta' : prio >= 1 ? 'Normal' : 'Padrão';
        return `
          <tr>
            <td style="text-align:center">
              <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
                <button onclick="changePriority('${j.id}', 1)" title="Priorizar"
                  style="width:24px;height:18px;border:1px solid var(--gray-200);border-radius:4px;background:white;cursor:pointer;font-size:.65rem;color:var(--blue-600);display:flex;align-items:center;justify-content:center">▲</button>
                <span style="font-size:.8rem;font-weight:700;color:${prioColor};min-width:24px;text-align:center" title="${prioLabel}">${prio}</span>
                <button onclick="changePriority('${j.id}', -1)" title="Despriorizar"
                  style="width:24px;height:18px;border:1px solid var(--gray-200);border-radius:4px;background:white;cursor:pointer;font-size:.65rem;color:var(--gray-400);display:flex;align-items:center;justify-content:center">▼</button>
              </div>
            </td>
            <td><strong>${escapeHtml(j.process_name)}</strong></td>
            <td style="color:var(--gray-500);font-size:.82rem">${j.agent_id ? '…' + j.agent_id.slice(-6) : '—'}</td>
            <td style="color:var(--gray-500);font-size:.82rem">${formatDate(j.created_at)}</td>
            <td>
              <button onclick="cancelQueueJob('${j.id}')"
                style="padding:.25rem .6rem;font-size:.75rem;border:1px solid var(--red);border-radius:6px;background:white;color:var(--red);cursor:pointer">
                ✕ Cancelar
              </button>
            </td>
          </tr>`;
      }).join('');
    }

    const rb = document.getElementById('queue-running-body');
    if (running.length === 0) {
      rb.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--gray-400);padding:2rem">Nenhum job em execução</td></tr>';
    } else {
      rb.innerHTML = running.map(j => `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:.5rem">
              <div class="spinner" style="width:14px;height:14px;border-width:2px;flex-shrink:0"></div>
              <strong>${escapeHtml(j.process_name)}</strong>
            </div>
          </td>
          <td style="color:var(--gray-500);font-size:.82rem">${j.agent_id ? '…' + j.agent_id.slice(-6) : '—'}</td>
          <td style="color:var(--gray-500);font-size:.82rem">${j.started_at ? formatDate(j.started_at) : '—'}</td>
        </tr>`).join('');
    }
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function changePriority(jobId, delta) {
  const current = _queuePriorities[jobId] || 0;
  const next = Math.max(-100, Math.min(100, current + delta));
  try {
    await api('PATCH', `/jobs/${jobId}/priority`, { priority: next });
    _queuePriorities[jobId] = next;
    await loadQueue();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function cancelQueueJob(jobId) {
  showConfirm('Cancelar job', 'Deseja cancelar este job da fila?', async () => {
    try {
      await api('DELETE', `/jobs/${jobId}`);
      showToast('Job cancelado', 'success');
      await loadQueue();
    } catch (e) {
      showToast(e.message, 'error');
    }
  });
}

function startQueueAutoRefresh() {
  stopQueueAutoRefresh();
  _queueRefreshTimer = setInterval(loadQueue, 5000);
}

function stopQueueAutoRefresh() {
  if (_queueRefreshTimer) {
    clearInterval(_queueRefreshTimer);
    _queueRefreshTimer = null;
  }
}
