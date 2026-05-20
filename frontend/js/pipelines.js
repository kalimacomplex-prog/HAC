let pipelinesList = [];
let pipelineSteps = [];

async function loadPipelines() {
  const body = document.getElementById('pipelines-body');
  body.innerHTML = '<tr class="loading-row"><td colspan="4"><div class="spinner"></div></td></tr>';
  try {
    pipelinesList = await api('GET', '/pipelines');
    if (!pipelinesList.length) {
      body.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--gray-400);padding:2rem">Nenhuma pipeline cadastrada</td></tr>';
      return;
    }
    body.innerHTML = pipelinesList.map(p => `
      <tr>
        <td><strong>${escapeHtml(p.name)}</strong></td>
        <td style="color:var(--gray-600);font-size:.85rem">${escapeHtml(p.description || '—')}</td>
        <td style="color:var(--gray-600);font-size:.85rem">${p.steps.length} ${p.steps.length === 1 ? 'passo' : 'passos'}</td>
        <td>
          <div style="display:flex;gap:.3rem;flex-wrap:wrap">
            <button class="btn btn-outline btn-xs" onclick="openPipelineRun('${p.id}')">⚡ Executar</button>
            <button class="btn btn-outline btn-xs" onclick="openPipelineModal(pipelinesList.find(x=>x.id==='${p.id}'))">✏ Editar</button>
            <button class="btn btn-danger btn-xs" onclick="deletePipeline('${p.id}','${escapeHtml(p.name)}')">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    body.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--red)">${escapeHtml(e.message)}</td></tr>`;
  }
}

async function openPipelineModal(pipeline = null) {
  if (!aiAgentsList.length) {
    try { aiAgentsList = await api('GET', '/ai-agents'); } catch(e) {}
  }
  document.getElementById('pipeline-edit-id').value = pipeline?.id || '';
  document.getElementById('modal-pipeline-title').textContent = pipeline ? 'Editar pipeline' : 'Nova pipeline';
  document.getElementById('pipeline-name').value = pipeline?.name || '';
  document.getElementById('pipeline-description').value = pipeline?.description || '';
  pipelineSteps = pipeline ? pipeline.steps.map(s => ({ ...s })) : [];
  renderPipelineSteps();
  openModal('modal-pipeline');
}

function renderPipelineSteps() {
  const container = document.getElementById('pipeline-steps-container');
  if (!pipelineSteps.length) {
    container.innerHTML = '<div style="text-align:center;color:var(--gray-400);padding:1.25rem;border:2px dashed var(--gray-200);border-radius:8px;font-size:.85rem">Nenhum passo. Clique em "+ Adicionar passo".</div>';
    return;
  }
  container.innerHTML = pipelineSteps.map((step, i) => `
    <div style="border:1.5px solid var(--gray-200);border-radius:8px;padding:.75rem;display:flex;flex-direction:column;gap:.5rem;background:var(--gray-50)">
      <div style="display:flex;align-items:center;justify-content:space-between">
        <span style="font-weight:700;font-size:.82rem;color:var(--blue-600)">Passo ${i + 1}</span>
        <button class="btn btn-danger btn-xs" onclick="removePipelineStep(${i})">✕ Remover</button>
      </div>
      <div class="form-group" style="margin:0">
        <label style="font-size:.78rem;margin-bottom:.2rem">Nome do passo</label>
        <input type="text" value="${escapeHtml(step.name || '')}" placeholder="Ex: Resumir"
          onchange="pipelineSteps[${i}].name = this.value"
          style="padding:.4rem .6rem;border:1.5px solid var(--gray-200);border-radius:6px;font-size:.82rem;width:100%;box-sizing:border-box" />
      </div>
      <div class="form-group" style="margin:0">
        <label style="font-size:.78rem;margin-bottom:.2rem">Agente IA</label>
        <select onchange="pipelineSteps[${i}].ai_agent_id = this.value"
          style="padding:.4rem .6rem;border:1.5px solid var(--gray-200);border-radius:6px;font-size:.82rem;width:100%;background:white;box-sizing:border-box">
          <option value="">Selecione...</option>
          ${aiAgentsList.map(a => `<option value="${a.id}" ${step.ai_agent_id === a.id ? 'selected' : ''}>${escapeHtml(a.name)} (${a.provider})</option>`).join('')}
        </select>
      </div>
      <div class="form-group" style="margin:0">
        <label style="font-size:.78rem;margin-bottom:.2rem">Template de entrada</label>
        <input type="text" value="${escapeHtml(step.input_template || '{output}')}"
          onchange="pipelineSteps[${i}].input_template = this.value"
          style="padding:.4rem .6rem;border:1.5px solid var(--gray-200);border-radius:6px;font-size:.82rem;width:100%;font-family:monospace;box-sizing:border-box" />
        <p class="hint" style="margin:.2rem 0 0"><code>{output}</code> = saída anterior &nbsp;|&nbsp; <code>{input}</code> = entrada original</p>
      </div>
    </div>
  `).join('');
}

function addPipelineStep() {
  pipelineSteps.push({ ai_agent_id: '', name: '', input_template: '{output}' });
  renderPipelineSteps();
}

function removePipelineStep(index) {
  pipelineSteps.splice(index, 1);
  renderPipelineSteps();
}

async function savePipeline() {
  const id = document.getElementById('pipeline-edit-id').value;
  const body = {
    name: document.getElementById('pipeline-name').value.trim(),
    description: document.getElementById('pipeline-description').value.trim(),
    steps: pipelineSteps,
  };
  if (!body.name) return toast('Nome obrigatório', 'error');
  for (const s of body.steps) {
    if (!s.ai_agent_id) return toast('Selecione um agente IA em cada passo', 'error');
  }
  try {
    if (id) {
      await api('PATCH', `/pipelines/${id}`, body);
      toast('Pipeline atualizada');
    } else {
      await api('POST', '/pipelines', body);
      toast('Pipeline criada');
    }
    closeModal('modal-pipeline');
    loadPipelines();
  } catch(e) { toast(e.message, 'error'); }
}

async function deletePipeline(id, name) {
  showConfirm('Excluir pipeline', `Excluir a pipeline "${name}"?`, async () => {
    try {
      await api('DELETE', `/pipelines/${id}`);
      toast('Pipeline excluída');
      loadPipelines();
    } catch(e) { toast(e.message, 'error'); }
  });
}

function openPipelineRun(id) {
  const pipeline = pipelinesList.find(p => p.id === id);
  if (!pipeline) return;
  document.getElementById('pipeline-run-id').value = id;
  document.getElementById('pipeline-run-name').textContent = pipeline.name;
  document.getElementById('pipeline-run-input').value = '';
  const resultDiv = document.getElementById('pipeline-run-result');
  resultDiv.style.display = 'none';
  resultDiv.innerHTML = '';
  openModal('modal-pipeline-run');
}

async function executePipeline() {
  const id = document.getElementById('pipeline-run-id').value;
  const input = document.getElementById('pipeline-run-input').value.trim();
  if (!input) return toast('Digite uma entrada', 'error');
  const btn = document.getElementById('btn-exec-pipeline');
  btn.disabled = true;
  btn.textContent = 'Executando...';
  const resultDiv = document.getElementById('pipeline-run-result');
  resultDiv.style.display = 'none';
  try {
    const result = await api('POST', `/pipelines/${id}/run`, { input });
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
      <div style="margin-bottom:.75rem;font-weight:600;font-size:.85rem">Passos executados:</div>
      ${result.steps.map((s, i) => `
        <div style="margin-bottom:.6rem;border:1.5px solid ${s.status === 'done' ? '#16a34a' : 'var(--red)'}40;border-radius:8px;overflow:hidden">
          <div style="background:${s.status === 'done' ? '#16a34a' : 'var(--red)'}15;padding:.35rem .75rem;display:flex;align-items:center;gap:.5rem">
            <span style="font-weight:600;font-size:.82rem">${escapeHtml(s.name || 'Passo ' + (i+1))}</span>
            <span style="font-size:.75rem;color:${s.status === 'done' ? '#16a34a' : 'var(--red)'}">${s.status === 'done' ? '✓ OK' : '✗ Erro'}</span>
          </div>
          <div style="padding:.5rem .75rem">
            ${s.error ? `<div style="color:var(--red);font-size:.8rem;margin-bottom:.3rem">Erro: ${escapeHtml(s.error)}</div>` : ''}
            <div style="font-size:.75rem;color:var(--gray-500);margin-bottom:.2rem">Saída:</div>
            <pre style="font-size:.8rem;white-space:pre-wrap;word-break:break-word;margin:0;color:var(--gray-800)">${escapeHtml(s.output || '—')}</pre>
          </div>
        </div>
      `).join('')}
      <div style="border-top:1.5px solid var(--gray-200);padding-top:.75rem;margin-top:.5rem">
        <div style="font-weight:600;font-size:.85rem;margin-bottom:.4rem">Saída final:</div>
        <pre style="background:var(--gray-100);border-radius:8px;padding:.75rem;font-size:.85rem;white-space:pre-wrap;word-break:break-word;margin:0">${escapeHtml(result.final_output || '(sem saída)')}</pre>
      </div>
    `;
  } catch(e) {
    toast(e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Executar';
  }
}
