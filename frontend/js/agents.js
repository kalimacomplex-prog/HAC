async function loadAgents() {
  const tbody = document.getElementById('agents-body');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="4"><div class="spinner"></div></td></tr>`;
  const agents = await api('GET', '/agents');
  if (!agents) return;
  if (!agents.length) {
    tbody.innerHTML = `<tr><td colspan="4"><div class="empty-state"><div class="empty-icon">🤖</div><h3>Nenhum agente ainda</h3><p>Cadastre o ambiente onde os processos vão executar</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = agents.map(a => `
    <tr>
      <td class="agent-name-cell">${a.name}</td>
      <td>${a.description || '–'}</td>
      <td>${a.connected
        ? `<span style="display:inline-flex;align-items:center;gap:.4rem;color:#16a34a;font-size:.82rem;font-weight:600"><span style="width:8px;height:8px;border-radius:50%;background:#16a34a;display:inline-block"></span>Conectado</span>`
        : `<span style="display:inline-flex;align-items:center;gap:.4rem;color:var(--gray-400);font-size:.82rem"><span style="width:8px;height:8px;border-radius:50%;background:var(--gray-400);display:inline-block"></span>Desconectado</span>`
      }</td>
      <td class="actions-cell">
        <button class="btn btn-outline btn-sm" onclick="copyId('${a.id}')" title="${a.id}">📋 Copiar ID</button>
        <button class="btn btn-outline btn-sm" onclick="editAgent('${a.id}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAgent('${a.id}')">Remover</button>
      </td>
    </tr>
  `).join('');
}

function openAgentModal() {
  document.getElementById('agent-edit-id').value = '';
  document.getElementById('agent-name').value = '';
  document.getElementById('agent-description').value = '';
  document.getElementById('modal-agent-title').textContent = 'Novo agente';
  openModal('modal-agent');
}

async function editAgent(id) {
  const agent = await api('GET', `/agents/${id}`);
  if (!agent) return;
  document.getElementById('agent-edit-id').value = agent.id;
  document.getElementById('agent-name').value = agent.name;
  document.getElementById('agent-description').value = agent.description || '';
  document.getElementById('modal-agent-title').textContent = 'Editar agente';
  openModal('modal-agent');
}

async function saveAgent() {
  const id = document.getElementById('agent-edit-id').value;
  const body = {
    name: document.getElementById('agent-name').value.trim(),
    description: document.getElementById('agent-description').value.trim(),
  };
  if (!body.name) return toast('Informe o nome do agente', 'error');
  try {
    if (id) {
      await api('PATCH', `/agents/${id}`, body);
      toast('Agente atualizado!', 'success');
    } else {
      await api('POST', '/agents', body);
      toast('Agente criado!', 'success');
    }
    closeModal('modal-agent');
    loadAgents();
  } catch(e) { toast(e.message, 'error'); }
}

async function deleteAgent(id) {
  if (!confirm('Remover este agente?')) return;
  try {
    await api('DELETE', `/agents/${id}`);
    toast('Agente removido', 'success');
    loadAgents();
  } catch(e) { toast(e.message, 'error'); }
}
