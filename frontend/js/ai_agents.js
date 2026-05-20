let aiAgentsList = [];

async function loadAIAgents() {
  const body = document.getElementById('ai-agents-body');
  body.innerHTML = '<tr class="loading-row"><td colspan="5"><div class="spinner"></div></td></tr>';
  try {
    aiAgentsList = await api('GET', '/ai-agents');
    if (!aiAgentsList.length) {
      body.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--gray-400);padding:2rem">Nenhum agente IA cadastrado</td></tr>';
      return;
    }
    body.innerHTML = aiAgentsList.map(a => `
      <tr>
        <td><strong>${escapeHtml(a.name)}</strong><br><span style="font-size:.78rem;color:var(--gray-500)">${escapeHtml(a.description || '')}</span></td>
        <td>${providerBadge(a.provider)}</td>
        <td><code style="font-size:.78rem;background:var(--gray-100);padding:.1rem .35rem;border-radius:4px">${escapeHtml(a.model)}</code></td>
        <td>${a.api_key_set ? '<span style="color:#16a34a;font-size:.8rem">✓ Configurada</span>' : '<span style="color:var(--red);font-size:.8rem">✕ Sem chave</span>'}</td>
        <td style="font-size:.82rem">${tokenInfo(a)}</td>
        <td>
          <div style="display:flex;gap:.3rem;flex-wrap:wrap">
            <button class="btn btn-outline btn-xs" onclick="openAIAgentTest('${a.id}')">⚡ Testar</button>
            <button class="btn btn-outline btn-xs" onclick="openAIAgentModal(aiAgentsList.find(x=>x.id==='${a.id}'))">✏</button>
            <button class="btn btn-danger btn-xs" onclick="deleteAIAgent('${a.id}','${escapeHtml(a.name)}')">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    body.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--red)">${escapeHtml(e.message)}</td></tr>`;
  }
}

function tokenInfo(a) {
  if (a.tokens_remaining !== null && a.tokens_remaining !== undefined) {
    return `<span style="color:#16a34a;font-weight:600">${a.tokens_remaining.toLocaleString('pt-BR')}</span> <span style="color:var(--gray-400)">restantes</span>`;
  }
  if (a.tokens_used_last !== null && a.tokens_used_last !== undefined) {
    return `<span style="color:var(--gray-600)">${a.tokens_used_last.toLocaleString('pt-BR')}</span> <span style="color:var(--gray-400)">usados</span>`;
  }
  return '<span style="color:var(--gray-300)">—</span>';
}

function providerBadge(provider) {
  const styles = {
    anthropic: 'background:#d9770615;color:#d97706;border:1px solid #d9770640',
    openai:    'background:#16a34a15;color:#16a34a;border:1px solid #16a34a40',
    groq:      'background:#7c3aed15;color:#7c3aed;border:1px solid #7c3aed40',
  };
  const labels = { anthropic: 'Anthropic', openai: 'OpenAI', groq: 'Groq' };
  const style = styles[provider] || 'background:var(--gray-100);color:var(--gray-600)';
  return `<span style="${style};border-radius:999px;padding:.15rem .6rem;font-size:.75rem;font-weight:600">${labels[provider] || provider}</span>`;
}

const AI_MODELS = {
  anthropic: [
    { value: 'claude-opus-4-7',          label: 'Claude Opus 4.7' },
    { value: 'claude-sonnet-4-6',         label: 'Claude Sonnet 4.6' },
    { value: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5' },
  ],
  openai: [
    { value: 'gpt-4o',        label: 'GPT-4o' },
    { value: 'gpt-4o-mini',   label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo',   label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  groq: [
    { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (recomendado)' },
    { value: 'llama-3.1-8b-instant',    label: 'Llama 3.1 8B (rápido)' },
    { value: 'gemma2-9b-it',            label: 'Gemma 2 9B' },
    { value: 'mixtral-8x7b-32768',      label: 'Mixtral 8x7B' },
  ],
};

function openAIAgentModal(agent = null) {
  document.getElementById('ai-agent-edit-id').value = agent?.id || '';
  document.getElementById('modal-ai-agent-title').textContent = agent ? 'Editar agente IA' : 'Novo agente IA';
  document.getElementById('ai-agent-name').value = agent?.name || '';
  document.getElementById('ai-agent-description').value = agent?.description || '';
  document.getElementById('ai-agent-provider').value = agent?.provider || 'anthropic';
  onAIProviderChange(agent?.model);
  document.getElementById('ai-agent-api-key').value = '';
  document.getElementById('ai-agent-api-key-hint').style.display = agent?.api_key_set ? 'block' : 'none';
  document.getElementById('ai-agent-system-prompt').value = agent?.system_prompt || '';
  document.getElementById('ai-agent-guardrail').value = agent?.guardrail_prompt || '';
  document.getElementById('ai-agent-temperature').value = agent?.temperature ?? 0.7;
  document.getElementById('ai-agent-max-tokens').value = agent?.max_tokens || 1000;
  openModal('modal-ai-agent');
}

function onAIProviderChange(selectModel = null) {
  const provider = document.getElementById('ai-agent-provider').value;
  const modelSelect = document.getElementById('ai-agent-model');
  const list = AI_MODELS[provider] || [];
  modelSelect.innerHTML = list.map(m => `<option value="${m.value}">${m.label}</option>`).join('');
  if (selectModel) modelSelect.value = selectModel;
}

async function saveAIAgent() {
  const id = document.getElementById('ai-agent-edit-id').value;
  const apiKey = document.getElementById('ai-agent-api-key').value.trim();
  const isEdit = !!document.getElementById('ai-agent-edit-id').value;
  const body = {
    name: document.getElementById('ai-agent-name').value.trim(),
    description: document.getElementById('ai-agent-description').value.trim(),
    provider: document.getElementById('ai-agent-provider').value,
    model: document.getElementById('ai-agent-model').value,
    system_prompt: document.getElementById('ai-agent-system-prompt').value.trim(),
    guardrail_prompt: document.getElementById('ai-agent-guardrail').value.trim(),
    temperature: parseFloat(document.getElementById('ai-agent-temperature').value),
    max_tokens: parseInt(document.getElementById('ai-agent-max-tokens').value),
  };
  if (apiKey) body.api_key = apiKey;
  if (!body.name) return toast('Nome obrigatório', 'error');
  if (!isEdit && !apiKey) return toast('Chave de API obrigatória', 'error');
  try {
    if (id) {
      await api('PATCH', `/ai-agents/${id}`, body);
      toast('Agente IA atualizado');
    } else {
      await api('POST', '/ai-agents', body);
      toast('Agente IA criado');
    }
    closeModal('modal-ai-agent');
    loadAIAgents();
  } catch(e) { toast(e.message, 'error'); }
}

async function deleteAIAgent(id, name) {
  showConfirm('Excluir agente IA', `Excluir o agente "${name}"?`, async () => {
    try {
      await api('DELETE', `/ai-agents/${id}`);
      toast('Agente IA excluído');
      loadAIAgents();
    } catch(e) { toast(e.message, 'error'); }
  });
}

function openAIAgentTest(id) {
  const agent = aiAgentsList.find(a => a.id === id);
  if (!agent) return;
  document.getElementById('ai-test-agent-id').value = id;
  document.getElementById('ai-test-agent-name').textContent = agent.name;
  document.getElementById('ai-test-input').value = '';
  document.getElementById('ai-test-output-wrap').style.display = 'none';
  document.getElementById('ai-test-output-text').textContent = '';
  openModal('modal-ai-test');
}

async function runAIAgentTest() {
  const id = document.getElementById('ai-test-agent-id').value;
  const input = document.getElementById('ai-test-input').value.trim();
  if (!input) return toast('Digite uma entrada', 'error');
  const btn = document.getElementById('btn-run-ai-test');
  btn.disabled = true;
  btn.textContent = 'Executando...';
  try {
    const result = await api('POST', `/ai-agents/${id}/run`, { input });
    document.getElementById('ai-test-output-text').textContent = result.output;
    document.getElementById('ai-test-output-wrap').style.display = 'block';
  } catch(e) {
    toast(e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Executar';
  }
}
