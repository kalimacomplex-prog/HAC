let pipelinesList = [];
let pipelineSteps = [];
let selectedStepIndex = -1;

/* ── Lista de pipelines ─────────────────────────────────────────── */

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
        <td>
          <div style="display:flex;align-items:center;gap:.3rem">
            ${p.steps.map((_, i) => `<div title="Passo ${i+1}" style="width:22px;height:22px;background:var(--blue-600);border-radius:6px;display:flex;align-items:center;justify-content:center;color:white;font-size:.65rem;font-weight:700">${i+1}</div>`).join('<div style="width:14px;height:2px;background:#cbd5e1"></div>')}
            ${!p.steps.length ? '<span style="color:var(--gray-400);font-size:.8rem">sem passos</span>' : ''}
          </div>
        </td>
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

/* ── Canvas builder ─────────────────────────────────────────────── */

async function openPipelineModal(pipeline = null) {
  if (!aiAgentsList.length) {
    try { aiAgentsList = await api('GET', '/ai-agents'); } catch(e) {}
  }
  document.getElementById('pipeline-edit-id').value = pipeline?.id || '';
  document.getElementById('modal-pipeline-title').textContent = pipeline ? 'Editar pipeline' : 'Nova pipeline';
  document.getElementById('pipeline-name').value = pipeline?.name || '';
  document.getElementById('pipeline-description').value = pipeline?.description || '';
  pipelineSteps = pipeline ? pipeline.steps.map(s => ({ ...s })) : [];
  selectedStepIndex = -1;
  document.getElementById('pipeline-config-panel').style.display = 'none';
  document.getElementById('pipeline-schedule-panel').style.display = 'none';
  setPLScheduleFromCron(pipeline?.schedule || null);
  document.getElementById('pipeline-schedule-input').value = pipeline?.schedule_input || '';
  renderPipelineCanvas();
  openModal('modal-pipeline');
}

function togglePipelineSchedule() {
  const panel = document.getElementById('pipeline-schedule-panel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function setPLScheduleFromCron(cron) {
  document.getElementById('pipeline-schedule').value = cron || '';
  const typeEl = document.getElementById('pl-schedule-type');
  if (!cron) {
    typeEl.value = '';
  } else if (/^\*\/(\d+) \* \* \* \*$/.test(cron)) {
    typeEl.value = 'interval';
    document.getElementById('pl-sched-minutes').value = cron.match(/^\*\/(\d+)/)[1];
  } else if (/^(\d+) (\d+) \* \* \*$/.test(cron)) {
    typeEl.value = 'daily';
    const [, m, h] = cron.match(/^(\d+) (\d+)/);
    document.getElementById('pl-sched-time').value = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  } else {
    typeEl.value = 'cron';
    document.getElementById('pl-sched-expr').value = cron;
  }
  onPLScheduleTypeChange();
}

function onPLScheduleTypeChange() {
  const type = document.getElementById('pl-schedule-type').value;
  document.getElementById('pl-sched-interval').style.display = type === 'interval' ? 'flex' : 'none';
  document.getElementById('pl-sched-daily').style.display   = type === 'daily'    ? 'block' : 'none';
  document.getElementById('pl-sched-cron').style.display    = type === 'cron'     ? 'block' : 'none';
}

function buildPLCron() {
  const type = document.getElementById('pl-schedule-type').value;
  if (!type) return null;
  if (type === 'interval') {
    const m = parseInt(document.getElementById('pl-sched-minutes').value) || 60;
    return `*/${m} * * * *`;
  }
  if (type === 'daily') {
    const [h, m] = document.getElementById('pl-sched-time').value.split(':');
    return `${parseInt(m)} ${parseInt(h)} * * *`;
  }
  return document.getElementById('pl-sched-expr').value.trim() || null;
}

function renderPipelineCanvas() {
  const canvas = document.getElementById('pipeline-canvas');
  const parts = [];

  // Start node
  parts.push(`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:72px;height:72px;background:#164e63;border:2px solid #06b6d4;border-radius:50%;flex-shrink:0">
      <div style="font-size:1.1rem;color:#06b6d4">▶</div>
      <div style="font-size:.6rem;font-weight:800;color:#67e8f9;letter-spacing:.06em;margin-top:.1rem">START</div>
    </div>
  `);

  pipelineSteps.forEach((step, i) => {
    const agent = aiAgentsList.find(a => a.id === step.ai_agent_id);
    const isSelected = selectedStepIndex === i;

    // Arrow
    parts.push(arrowHtml());

    // Node
    const providerColor = { anthropic: '#d97706', openai: '#16a34a', groq: '#7c3aed' }[agent?.provider] || '#475569';
    parts.push(`
      <div onclick="selectPipelineStep(${i})" style="width:168px;background:#1e293b;border:2px solid ${isSelected ? '#3b82f6' : '#334155'};border-radius:12px;cursor:pointer;flex-shrink:0;transition:border-color .15s;box-shadow:${isSelected ? '0 0 0 3px rgba(59,130,246,.25)' : 'none'}">
        <div style="background:${isSelected ? '#1d4ed8' : '#334155'};border-radius:9px 9px 0 0;padding:.3rem .65rem;display:flex;align-items:center;justify-content:space-between">
          <span style="color:white;font-size:.68rem;font-weight:800;letter-spacing:.05em">NÓ ${i + 1}</span>
          <button onclick="event.stopPropagation();removePipelineStep(${i})" style="background:none;border:none;color:#93c5fd;cursor:pointer;font-size:.75rem;padding:0;line-height:1">✕</button>
        </div>
        <div style="padding:.55rem .65rem">
          <div style="color:white;font-size:.82rem;font-weight:600;margin-bottom:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(step.name || 'Sem nome')}</div>
          ${agent
            ? `<div style="display:flex;align-items:center;gap:.3rem;margin-bottom:.3rem">
                 <span style="background:${providerColor}20;color:${providerColor};border:1px solid ${providerColor}50;border-radius:999px;padding:.05rem .4rem;font-size:.65rem;font-weight:700">${agent.provider}</span>
               </div>
               <div style="font-size:.72rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(agent.name)}</div>`
            : `<div style="font-size:.75rem;color:#f87171;margin-bottom:.25rem">⚠ Sem agente</div>`
          }
          <div style="margin-top:.35rem;background:#0f172a;border-radius:4px;padding:.15rem .4rem;font-size:.68rem;font-family:monospace;color:#38bdf8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(step.input_template || '{output}')}</div>
        </div>
      </div>
    `);
  });

  // Arrow + add button
  parts.push(arrowHtml());
  parts.push(`
    <div onclick="addPipelineStep()" title="Adicionar nó"
      style="width:52px;height:52px;background:#1e293b;border:2px dashed #334155;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;font-size:1.5rem;flex-shrink:0;transition:all .15s"
      onmouseover="this.style.borderColor='#3b82f6';this.style.color='#3b82f6'"
      onmouseout="this.style.borderColor='#334155';this.style.color='#64748b'">+</div>
  `);

  // Arrow + End node
  parts.push(arrowHtml());
  parts.push(`
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:72px;height:72px;background:#1e293b;border:2px solid #334155;border-radius:50%;flex-shrink:0">
      <div style="font-size:.95rem;color:#475569">⬛</div>
      <div style="font-size:.6rem;font-weight:800;color:#64748b;letter-spacing:.06em;margin-top:.1rem">END</div>
    </div>
  `);

  canvas.innerHTML = parts.join('');
}

function arrowHtml() {
  return `
    <div style="display:flex;align-items:center;flex-shrink:0;padding:0 2px">
      <div style="width:36px;height:2px;background:#334155;position:relative">
        <div style="position:absolute;right:-7px;top:-5px;color:#475569;font-size:.8rem">▶</div>
      </div>
    </div>
  `;
}

function addPipelineStep() {
  pipelineSteps.push({ ai_agent_id: '', name: '', input_template: '{output}' });
  selectedStepIndex = pipelineSteps.length - 1;
  renderPipelineCanvas();
  renderConfigPanel();
}

function removePipelineStep(index) {
  pipelineSteps.splice(index, 1);
  if (selectedStepIndex >= pipelineSteps.length) {
    selectedStepIndex = pipelineSteps.length - 1;
  }
  if (selectedStepIndex < 0) {
    document.getElementById('pipeline-config-panel').style.display = 'none';
  }
  renderPipelineCanvas();
  if (selectedStepIndex >= 0) renderConfigPanel();
}

function selectPipelineStep(i) {
  selectedStepIndex = i;
  renderPipelineCanvas();
  renderConfigPanel();
}

function renderConfigPanel() {
  const panel = document.getElementById('pipeline-config-panel');
  const step = pipelineSteps[selectedStepIndex];
  if (!step) { panel.style.display = 'none'; return; }

  panel.style.display = 'block';
  panel.innerHTML = `
    <div style="font-size:.68rem;font-weight:800;color:#94a3b8;letter-spacing:.08em;margin-bottom:.875rem">NÓ ${selectedStepIndex + 1} — CONFIGURAÇÃO</div>

    <div class="form-group">
      <label style="font-size:.78rem">Nome do passo</label>
      <input type="text" id="cfg-step-name" value="${escapeHtml(step.name || '')}" placeholder="Ex: Resumir"
        style="padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;width:100%;box-sizing:border-box;color:#1e293b;outline:none" />
    </div>

    <div class="form-group">
      <label style="font-size:.78rem">Agente IA</label>
      <select id="cfg-step-agent" style="padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;width:100%;background:white;color:#1e293b;outline:none">
        <option value="">Selecione um agente...</option>
        ${aiAgentsList.map(a => `<option value="${a.id}" ${step.ai_agent_id === a.id ? 'selected' : ''}>${escapeHtml(a.name)} (${a.provider})</option>`).join('')}
      </select>
    </div>

    <div class="form-group">
      <label style="font-size:.78rem">Template de entrada</label>
      <input type="text" id="cfg-step-template" value="${escapeHtml(step.input_template || '{output}')}"
        style="padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;width:100%;font-family:monospace;box-sizing:border-box;color:#1e293b;outline:none" />
      <p class="hint" style="margin:.3rem 0 0;font-size:.72rem"><code>{output}</code> saída anterior<br><code>{input}</code> entrada original</p>
    </div>

    <button onclick="applyStepConfig()" class="btn btn-blue" style="width:100%;margin-top:.25rem">Aplicar</button>

    <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #f1f5f9">
      <button onclick="removePipelineStep(${selectedStepIndex})" class="btn btn-danger btn-sm" style="width:100%">🗑 Remover este nó</button>
    </div>
  `;
}

function applyStepConfig() {
  const step = pipelineSteps[selectedStepIndex];
  if (!step) return;
  step.name = document.getElementById('cfg-step-name').value.trim();
  step.ai_agent_id = document.getElementById('cfg-step-agent').value;
  step.input_template = document.getElementById('cfg-step-template').value.trim() || '{output}';
  renderPipelineCanvas();
  renderConfigPanel();
  toast('Nó atualizado', 'success');
}

async function savePipeline() {
  const id = document.getElementById('pipeline-edit-id').value;
  const body = {
    name: document.getElementById('pipeline-name').value.trim(),
    description: document.getElementById('pipeline-description').value.trim(),
    steps: pipelineSteps,
    schedule: buildPLCron(),
    schedule_input: document.getElementById('pipeline-schedule-input').value.trim(),
  };
  if (!body.name) return toast('Nome obrigatório', 'error');
  for (const s of body.steps) {
    if (!s.ai_agent_id) return toast('Selecione um agente IA em cada nó', 'error');
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

/* ── Execução ───────────────────────────────────────────────────── */

function openPipelineRun(id) {
  const pipeline = pipelinesList.find(p => p.id === id);
  if (!pipeline) return;
  document.getElementById('pipeline-run-id').value = id;
  document.getElementById('pipeline-run-name').textContent = pipeline.name;
  document.getElementById('pipeline-run-input').value = '';
  document.getElementById('pipeline-run-flow').style.display = 'none';
  document.getElementById('pipeline-run-output').style.display = 'none';
  renderRunNodes(pipeline.steps, []);
  openModal('modal-pipeline-run');
}

function renderRunNodes(steps, results) {
  const container = document.getElementById('pipeline-run-nodes');
  const parts = [];

  // Start
  parts.push(`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:56px;height:56px;background:#164e63;border:2px solid #06b6d4;border-radius:50%;flex-shrink:0"><div style="color:#06b6d4;font-size:.9rem">▶</div></div>`);

  steps.forEach((step, i) => {
    const res = results[i];
    const status = res?.status;
    const colors = { done: '#16a34a', failed: '#ef4444', running: '#3b82f6' };
    const icons  = { done: '✓', failed: '✕', running: '…' };
    const borderColor = status ? colors[status] : '#334155';
    const icon = status ? icons[status] : '';

    parts.push(`<div style="width:28px;height:2px;background:#334155;flex-shrink:0;position:relative"><div style="position:absolute;right:-6px;top:-4px;color:#475569;font-size:.75rem">▶</div></div>`);
    parts.push(`
      <div style="display:flex;flex-direction:column;align-items:center;gap:.3rem;flex-shrink:0">
        <div style="width:140px;background:#1e293b;border:2px solid ${borderColor};border-radius:10px;overflow:hidden">
          <div style="background:${borderColor}30;padding:.25rem .6rem;display:flex;align-items:center;justify-content:space-between">
            <span style="color:white;font-size:.65rem;font-weight:800">NÓ ${i+1}</span>
            ${icon ? `<span style="color:${borderColor};font-size:.75rem;font-weight:700">${icon}</span>` : ''}
          </div>
          <div style="padding:.4rem .6rem">
            <div style="color:white;font-size:.78rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(step.name || 'Passo ' + (i+1))}</div>
            ${res?.error ? `<div style="color:#f87171;font-size:.68rem;margin-top:.2rem">${escapeHtml(res.error)}</div>` : ''}
          </div>
        </div>
        ${res?.output ? `
          <div style="width:140px;background:#f1f5f9;border-radius:8px;padding:.35rem .5rem;font-size:.7rem;color:#475569;max-height:60px;overflow:hidden;text-overflow:ellipsis;white-space:pre-wrap;word-break:break-word;border:1px solid #e2e8f0">
            ${escapeHtml(res.output.slice(0, 120))}${res.output.length > 120 ? '…' : ''}
          </div>
        ` : ''}
      </div>
    `);
  });

  // End
  parts.push(`<div style="width:28px;height:2px;background:#334155;flex-shrink:0;position:relative"><div style="position:absolute;right:-6px;top:-4px;color:#475569;font-size:.75rem">▶</div></div>`);
  parts.push(`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;width:56px;height:56px;background:#1e293b;border:2px solid #334155;border-radius:50%;flex-shrink:0"><div style="color:#475569;font-size:.75rem">⬛</div></div>`);

  container.innerHTML = parts.join('');
}

async function executePipeline() {
  const id = document.getElementById('pipeline-run-id').value;
  const input = document.getElementById('pipeline-run-input').value.trim();
  if (!input) return toast('Digite uma entrada', 'error');

  const pipeline = pipelinesList.find(p => p.id === id);
  const btn = document.getElementById('btn-exec-pipeline');
  btn.disabled = true;
  btn.textContent = 'Executando...';

  document.getElementById('pipeline-run-flow').style.display = 'block';
  document.getElementById('pipeline-run-output').style.display = 'none';
  renderRunNodes(pipeline?.steps || [], []);

  try {
    const result = await api('POST', `/pipelines/${id}/run`, { input });
    renderRunNodes(pipeline?.steps || [], result.steps);
    document.getElementById('pipeline-run-output-text').textContent = result.final_output || '(sem saída)';
    document.getElementById('pipeline-run-output').style.display = 'block';
  } catch(e) {
    toast(e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Executar';
  }
}
