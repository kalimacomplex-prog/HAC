let oraculoHistory = [];
let oraculoAgentsList = [];
let oraculoTyping = false;
let _oraculoAttachments = [];

async function loadOraculoAgents() {
  try {
    oraculoAgentsList = await api('GET', '/ai-agents');
  } catch(e) {
    oraculoAgentsList = [];
  }
  const select = document.getElementById('oraculo-agent-select');
  const savedId = localStorage.getItem('oraculo_agent_id');
  if (oraculoAgentsList.length) {
    select.innerHTML = oraculoAgentsList.map(a =>
      `<option value="${a.id}" ${a.id === savedId ? 'selected' : ''}>${escapeHtml(a.name)} · ${a.provider}</option>`
    ).join('');
  } else {
    select.innerHTML = '<option value="">Nenhum agente cadastrado</option>';
  }
  renderOraculoMessages();
}

function renderOraculoMessages() {
  const container = document.getElementById('oraculo-messages');
  if (!oraculoHistory.length) {
    const hasAgents = oraculoAgentsList.length > 0;
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:.875rem;color:var(--gray-400);user-select:none">
        <div style="font-size:2.75rem">🔮</div>
        <div style="font-weight:700;font-size:1.05rem;color:var(--gray-600)">Oráculo</div>
        <div style="font-size:.875rem;text-align:center;max-width:320px;line-height:1.65;color:var(--gray-400)">
          ${hasAgents
            ? 'Selecione um Agente IA no campo abaixo e faça sua pergunta.'
            : 'Cadastre um Agente IA em <strong style="color:var(--gray-600)">Agentes IA</strong> para começar a conversar.'}
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = oraculoHistory.map(msg => {
    if (msg.role === 'user') {
      const chips = (msg.attachments || []).map(a =>
        `<div style="display:inline-flex;align-items:center;gap:.25rem;background:rgba(255,255,255,.2);border-radius:5px;padding:.1rem .4rem;font-size:.7rem;margin-top:.35rem;margin-right:.25rem">
          📄 ${escapeHtml(a.name)}
        </div>`
      ).join('');
      return `
        <div style="display:flex;justify-content:flex-end;margin-bottom:.875rem">
          <div style="max-width:72%;background:var(--blue-600);color:white;border-radius:18px 18px 4px 18px;padding:.7rem 1rem;font-size:.9rem;line-height:1.65;white-space:pre-wrap;word-break:break-word;box-shadow:0 1px 4px rgba(37,99,235,.2)">
            ${escapeHtml(msg.content)}
            ${chips ? `<div style="display:flex;flex-wrap:wrap">${chips}</div>` : ''}
          </div>
        </div>
      `;
    }
    if (msg.role === 'typing') {
      return `
        <div style="display:flex;align-items:flex-end;gap:.5rem;margin-bottom:.875rem">
          <div class="oraculo-avatar">🔮</div>
          <div style="background:white;border:1px solid var(--gray-200);border-radius:18px 18px 18px 4px;padding:.75rem 1rem;box-shadow:0 1px 3px rgba(0,0,0,.06)">
            <div style="display:flex;gap:.35rem;align-items:center;height:18px">
              <div class="oraculo-dot" style="animation-delay:0s"></div>
              <div class="oraculo-dot" style="animation-delay:.18s"></div>
              <div class="oraculo-dot" style="animation-delay:.36s"></div>
            </div>
          </div>
        </div>
      `;
    }
    return `
      <div style="display:flex;align-items:flex-end;gap:.5rem;margin-bottom:.875rem">
        <div class="oraculo-avatar">🔮</div>
        <div style="max-width:72%">
          ${msg.agentName ? `<div style="font-size:.7rem;font-weight:600;color:var(--gray-400);margin-bottom:.25rem;padding-left:.2rem">${escapeHtml(msg.agentName)}</div>` : ''}
          <div style="background:white;border:1px solid var(--gray-200);border-radius:18px 18px 18px 4px;padding:.7rem 1rem;font-size:.9rem;line-height:1.65;white-space:pre-wrap;word-break:break-word;color:var(--gray-800);box-shadow:0 1px 3px rgba(0,0,0,.06)">${escapeHtml(msg.content)}</div>
        </div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

async function sendOraculoMessage() {
  if (oraculoTyping) return;
  const inputEl = document.getElementById('oraculo-input');
  const select  = document.getElementById('oraculo-agent-select');
  const text    = inputEl.value.trim();
  const agentId = select.value;

  if (!text && !_oraculoAttachments.length) return;
  if (!agentId) return showToast('Selecione um agente IA', 'error');

  const agent = oraculoAgentsList.find(a => a.id === agentId);
  localStorage.setItem('oraculo_agent_id', agentId);

  // Snapshot e limpa anexos antes de enviar
  const attachments = _oraculoAttachments.slice();
  _oraculoAttachments = [];
  _renderOraculoAttachments();

  oraculoHistory.push({ role: 'user', content: text || '(arquivo anexado)', attachments: attachments.map(a => ({ name: a.name })) });
  inputEl.value = '';
  inputEl.style.height = 'auto';

  oraculoTyping = true;
  oraculoHistory.push({ role: 'typing' });
  renderOraculoMessages();

  // Monta contexto com histórico
  const msgs = oraculoHistory.filter(m => m.role !== 'typing');
  const recent = msgs.slice(-11, -1);
  let contextInput = text || '';
  if (recent.length) {
    const hist = recent.map(m => m.role === 'user' ? `Usuário: ${m.content}` : `Assistente: ${m.content}`).join('\n\n');
    contextInput = `[Histórico da conversa]\n${hist}\n\n[Nova mensagem]\n${text || ''}`;
  }

  // Inclui conteúdo dos anexos no contexto
  if (attachments.length) {
    const fileBlock = attachments.map(a =>
      `[Arquivo: ${a.name}]\n${a.content}`
    ).join('\n\n---\n\n');
    contextInput = fileBlock + '\n\n---\n\n' + (contextInput || '(Analise o(s) arquivo(s) acima)');
  }

  try {
    const result = await api('POST', `/ai-agents/${agentId}/run`, { input: contextInput });
    oraculoHistory = oraculoHistory.filter(m => m.role !== 'typing');
    oraculoHistory.push({ role: 'assistant', content: result.output, agentName: agent?.name });
  } catch(e) {
    oraculoHistory = oraculoHistory.filter(m => m.role !== 'typing');
    oraculoHistory.push({ role: 'assistant', content: `⚠ Erro: ${e.message}`, agentName: agent?.name });
  } finally {
    oraculoTyping = false;
    renderOraculoMessages();
  }
}

function onOraculoKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendOraculoMessage();
  }
}

function oraculoAutoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

function clearOraculo() {
  oraculoHistory = [];
  _oraculoAttachments = [];
  _renderOraculoAttachments();
  renderOraculoMessages();
}

// ─── Anexos ───────────────────────────────────────────────────────

function oraculoHandleFiles(input) {
  const files = Array.from(input.files);
  input.value = '';
  if (!files.length) return;

  const MAX_SIZE = 150 * 1024; // 150 KB por arquivo
  files.forEach(file => {
    if (file.size > MAX_SIZE) {
      showToast(`"${file.name}" excede 150 KB — use arquivos menores`, 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      _oraculoAttachments.push({ name: file.name, content: e.target.result });
      _renderOraculoAttachments();
    };
    reader.onerror = () => showToast(`Erro ao ler "${file.name}"`, 'error');
    reader.readAsText(file, 'utf-8');
  });
}

function oraculoRemoveAttachment(idx) {
  _oraculoAttachments.splice(idx, 1);
  _renderOraculoAttachments();
}

function _renderOraculoAttachments() {
  const container = document.getElementById('oraculo-attachments');
  if (!container) return;
  if (!_oraculoAttachments.length) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }
  container.style.display = 'flex';
  container.innerHTML = _oraculoAttachments.map((a, i) => `
    <div style="display:inline-flex;align-items:center;gap:.3rem;background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:.2rem .5rem .2rem .45rem;font-size:.75rem;color:#1d4ed8;max-width:200px">
      <span style="flex-shrink:0">📄</span>
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1" title="${escapeHtml(a.name)}">${escapeHtml(a.name)}</span>
      <button onclick="oraculoRemoveAttachment(${i})" title="Remover" style="background:none;border:none;cursor:pointer;color:#64748b;font-size:.72rem;padding:0;line-height:1;flex-shrink:0;margin-left:.1rem">✕</button>
    </div>
  `).join('');
}
