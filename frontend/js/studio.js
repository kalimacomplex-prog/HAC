// ─── State ───────────────────────────────────────────────
let _studioList = [];
let _buildSteps = [];
let _buildTrigger = { type: 'manual', schedule: '', webhook_token: '', schedule_input: '' };
let _buildEditId = null;
let _buildSelectedId = null;
let _buildPipelines = [];
let _studioRunAutoId = null;

const STEP_META = {
  pipeline:     { icon: '🔗', label: 'Pipeline IA',    color: '#1d4ed8', bg: '#eff6ff' },
  http_request: { icon: '🌐', label: 'HTTP Request',   color: '#0f766e', bg: '#f0fdfa' },
  condition:    { icon: '🔀', label: 'Condição',        color: '#b45309', bg: '#fffbeb' },
  browser:      { icon: '🌍', label: 'Navegador Web',  color: '#7c3aed', bg: '#f5f3ff' },
};

// ─── List View ───────────────────────────────────────────

async function loadStudio() {
  try {
    _studioList = await api('GET', '/studio');
    _renderStudioTable();
  } catch (e) {
    showToast('Erro ao carregar automações: ' + e.message, 'error');
  }
}

function _renderStudioTable() {
  const tbody = document.getElementById('studio-automations-body');
  if (!_studioList.length) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:2rem">Nenhuma automação criada ainda. Clique em <strong>+ Nova automação</strong> para começar.</td></tr>`;
    return;
  }
  const triggerLabel = { manual: '▶ Manual', cron: '⏱ Cron', webhook: '🔗 Webhook' };
  tbody.innerHTML = _studioList.map(a => {
    const tl = triggerLabel[a.trigger?.type] || '—';
    const active = a.active;
    return `<tr>
      <td><strong>${escapeHtml(a.name)}</strong>${a.description ? `<br><small style="color:#94a3b8">${escapeHtml(a.description)}</small>` : ''}</td>
      <td><span style="font-size:.8rem">${tl}</span>${a.trigger?.type === 'cron' ? `<br><code style="font-size:.72rem;color:#64748b">${a.trigger.schedule || ''}</code>` : ''}</td>
      <td><span style="font-size:.875rem">${a.steps?.length || 0} bloco${(a.steps?.length || 0) !== 1 ? 's' : ''}</span></td>
      <td>
        <label style="display:inline-flex;align-items:center;gap:.35rem;cursor:pointer;font-size:.8rem">
          <input type="checkbox" ${active ? 'checked' : ''} onchange="toggleStudioActive('${a.id}', this.checked)" style="width:15px;height:15px;cursor:pointer" />
          <span style="color:${active ? '#16a34a' : '#94a3b8'}">${active ? 'Ativa' : 'Inativa'}</span>
        </label>
      </td>
      <td style="display:flex;gap:.4rem;flex-wrap:wrap;align-items:center">
        <button class="btn btn-outline btn-sm" onclick="openStudioRun('${a.id}')">⚡ Executar</button>
        <button class="btn btn-outline btn-sm" onclick="openStudioBuilder('${a.id}')">✏ Editar</button>
        <button class="btn btn-outline btn-sm" style="color:#ef4444;border-color:#fca5a5" onclick="deleteStudioAutomation('${a.id}','${escapeHtml(a.name)}')">🗑</button>
      </td>
    </tr>`;
  }).join('');
}

// ─── Builder ─────────────────────────────────────────────

async function openStudioBuilder(automationId = null) {
  _buildEditId = automationId || null;
  _buildSteps = [];
  _buildSelectedId = null;
  _buildTrigger = { type: 'manual', schedule: '', webhook_token: '', schedule_input: '' };

  try {
    _buildPipelines = await api('GET', '/pipelines');
  } catch (_) { _buildPipelines = []; }

  if (automationId) {
    try {
      const auto = await api('GET', `/studio/${automationId}`);
      document.getElementById('studio-name').value = auto.name;
      document.getElementById('studio-description').value = auto.description || '';
      _buildSteps = auto.steps ? JSON.parse(JSON.stringify(auto.steps)) : [];
      _buildTrigger = auto.trigger ? { ...auto.trigger } : _buildTrigger;
      if (auto.webhook_url) {
        document.getElementById('studio-webhook-url').textContent = auto.webhook_url;
      }
    } catch (e) {
      showToast('Erro ao carregar automação: ' + e.message, 'error');
      return;
    }
  } else {
    document.getElementById('studio-name').value = '';
    document.getElementById('studio-description').value = '';
    document.getElementById('studio-webhook-url').textContent = '—';
  }

  document.getElementById('studio-edit-id').value = _buildEditId || '';
  document.getElementById('studio-trigger-panel').style.display = 'none';
  _syncTriggerUI();
  _renderStudioCanvas();
  _renderConfigPanel(null);
  document.getElementById('modal-studio-builder').style.display = 'flex';
}

function _syncTriggerUI() {
  const t = _buildTrigger;
  const typeEl = document.getElementById('studio-trigger-type');
  if (typeEl) typeEl.value = t.type || 'manual';

  const btnLabel = { manual: '▶ Manual', cron: '⏱ Cron', webhook: '🔗 Webhook' };
  const btn = document.getElementById('btn-studio-trigger');
  if (btn) btn.textContent = `⚡ Trigger: ${btnLabel[t.type] || 'Manual'}`;

  const cronOpts = document.getElementById('studio-cron-opts');
  const webhookInfo = document.getElementById('studio-webhook-info');
  if (cronOpts) cronOpts.style.display = t.type === 'cron' ? 'flex' : 'none';
  if (webhookInfo) webhookInfo.style.display = t.type === 'webhook' ? 'flex' : 'none';

  if (t.type === 'cron' && t.schedule) {
    _restoreScheduleUI(t.schedule);
  }
  if (t.schedule_input) {
    const si = document.getElementById('studio-sched-input');
    if (si) si.value = t.schedule_input;
  }
}

function toggleStudioTriggerPanel() {
  const panel = document.getElementById('studio-trigger-panel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function onStudioTriggerTypeChange() {
  const type = document.getElementById('studio-trigger-type').value;
  _buildTrigger.type = type;
  const cronOpts = document.getElementById('studio-cron-opts');
  const webhookInfo = document.getElementById('studio-webhook-info');
  cronOpts.style.display = type === 'cron' ? 'flex' : 'none';
  webhookInfo.style.display = type === 'webhook' ? 'flex' : 'none';
  const btnLabel = { manual: '▶ Manual', cron: '⏱ Cron', webhook: '🔗 Webhook' };
  document.getElementById('btn-studio-trigger').textContent = `⚡ Trigger: ${btnLabel[type] || 'Manual'}`;
}

function onStudioSchedTypeChange() {
  const v = document.getElementById('studio-sched-type').value;
  document.getElementById('studio-sched-interval').style.display = v === 'interval' ? 'flex' : 'none';
  document.getElementById('studio-sched-daily').style.display = v === 'daily' ? 'block' : 'none';
  document.getElementById('studio-sched-cron').style.display = v === 'cron' ? 'block' : 'none';
}

function _restoreScheduleUI(schedule) {
  if (!schedule) return;
  const parts = schedule.split(' ');
  if (parts.length === 5) {
    const [min, hour, , , dow] = parts;
    if (min.startsWith('*/') && hour === '*') {
      document.getElementById('studio-sched-type').value = 'interval';
      document.getElementById('studio-sched-minutes').value = min.replace('*/', '');
    } else if (min !== '*' && hour !== '*' && dow === '*') {
      document.getElementById('studio-sched-type').value = 'daily';
      document.getElementById('studio-sched-time').value = `${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;
    } else {
      document.getElementById('studio-sched-type').value = 'cron';
      document.getElementById('studio-sched-expr').value = schedule;
    }
    onStudioSchedTypeChange();
  }
}

function _buildScheduleValue() {
  const schedType = document.getElementById('studio-sched-type').value;
  if (!schedType) return '';
  if (schedType === 'interval') {
    const m = parseInt(document.getElementById('studio-sched-minutes').value) || 60;
    return `*/${m} * * * *`;
  } else if (schedType === 'daily') {
    const [hh, mm] = (document.getElementById('studio-sched-time').value || '09:00').split(':');
    return `${parseInt(mm)} ${parseInt(hh)} * * *`;
  } else {
    return document.getElementById('studio-sched-expr').value.trim();
  }
}

function copyStudioWebhook() {
  const url = document.getElementById('studio-webhook-url').textContent;
  if (url && url !== '—') {
    navigator.clipboard.writeText(url).then(() => showToast('URL copiada!'));
  }
}

// ─── Canvas ──────────────────────────────────────────────

function _renderStudioCanvas() {
  const canvas = document.getElementById('studio-canvas');
  const countEl = document.getElementById('studio-steps-count');
  if (countEl) countEl.textContent = `${_buildSteps.length} bloco${_buildSteps.length !== 1 ? 's' : ''}`;

  let html = `<div style="display:flex;flex-direction:column;align-items:center;gap:0;width:100%;max-width:560px">`;

  // START node
  html += _flowNode('START', '', '#22c55e', '#f0fdf4');
  html += _flowArrow();

  if (_buildSteps.length === 0) {
    html += `<div style="border:2px dashed #e2e8f0;border-radius:12px;padding:1.5rem 2rem;color:#94a3b8;font-size:.85rem;text-align:center;background:white;width:100%;box-sizing:border-box">
      Clique em um tipo de bloco na paleta à esquerda para adicionar
    </div>`;
  } else {
    _buildSteps.forEach((step, idx) => {
      const meta = STEP_META[step.type] || STEP_META.pipeline;
      const isSelected = step.id === _buildSelectedId;
      const brief = _stepBrief(step);
      html += `<div onclick="selectStudioStep('${step.id}')"
        style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:${isSelected ? meta.bg : 'white'};border:2px solid ${isSelected ? meta.color : '#e2e8f0'};border-radius:12px;cursor:pointer;width:100%;box-sizing:border-box;transition:all .15s;box-shadow:${isSelected ? `0 0 0 3px ${meta.color}22` : '0 1px 3px rgba(0,0,0,.06)'}">
        <div style="width:36px;height:36px;border-radius:9px;background:${meta.bg};display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">${meta.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:.85rem;color:${meta.color}">${escapeHtml(step.name)}</div>
          <div style="font-size:.75rem;color:#64748b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${brief}</div>
        </div>
        <div style="display:flex;gap:.2rem;flex-shrink:0">
          <button onclick="event.stopPropagation();moveStudioStep('${step.id}',-1)" title="Mover para cima" ${idx === 0 ? 'disabled' : ''}
            style="width:26px;height:26px;border:1px solid #e2e8f0;border-radius:6px;background:white;font-size:.75rem;display:flex;align-items:center;justify-content:center;color:#64748b;cursor:${idx === 0 ? 'default' : 'pointer'};opacity:${idx === 0 ? '.3' : '1'}">↑</button>
          <button onclick="event.stopPropagation();moveStudioStep('${step.id}',1)" title="Mover para baixo" ${idx === _buildSteps.length - 1 ? 'disabled' : ''}
            style="width:26px;height:26px;border:1px solid #e2e8f0;border-radius:6px;background:white;font-size:.75rem;display:flex;align-items:center;justify-content:center;color:#64748b;cursor:${idx === _buildSteps.length - 1 ? 'default' : 'pointer'};opacity:${idx === _buildSteps.length - 1 ? '.3' : '1'}">↓</button>
          <button onclick="event.stopPropagation();removeStudioStep('${step.id}')" title="Remover"
            style="width:26px;height:26px;border:1px solid #fca5a5;border-radius:6px;background:white;cursor:pointer;font-size:.75rem;display:flex;align-items:center;justify-content:center;color:#ef4444">✕</button>
        </div>
      </div>`;
      if (idx < _buildSteps.length - 1) html += _flowArrow();
    });
  }

  html += _flowArrow();
  html += _flowNode('FIM', '', '#64748b', '#f8fafc');
  html += `</div>`;
  canvas.innerHTML = html;
}

function _flowNode(label, sub, color, bg) {
  return `<div style="display:inline-flex;flex-direction:column;align-items:center;padding:.4rem .875rem;background:${bg};border:2px solid ${color};border-radius:20px;font-size:.75rem;font-weight:700;color:${color}">
    ${label}${sub ? `<span style="font-weight:400;color:#94a3b8;font-size:.7rem">${sub}</span>` : ''}
  </div>`;
}

function _flowArrow() {
  return `<div style="display:flex;flex-direction:column;align-items:center;height:28px;flex-shrink:0">
    <div style="width:2px;flex:1;background:#e2e8f0"></div>
    <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #e2e8f0;margin-top:-1px"></div>
  </div>`;
}

function _stepBrief(step) {
  const cfg = step.config || {};
  if (step.type === 'pipeline') {
    const pipe = _buildPipelines.find(p => p.id === cfg.pipeline_id);
    return pipe ? `Pipeline: ${pipe.name}` : 'Pipeline não selecionada';
  }
  if (step.type === 'http_request') {
    return cfg.url ? `${cfg.method || 'GET'} ${cfg.url.substring(0, 40)}` : 'URL não definida';
  }
  if (step.type === 'condition') {
    return cfg.condition_value ? `Se output ${cfg.operator} "${cfg.condition_value}"` : 'Condição não configurada';
  }
  if (step.type === 'browser') {
    const count = (cfg.browser_actions || []).length;
    return `${count} ação${count !== 1 ? 'ões' : ''} definida${count !== 1 ? 's' : ''}`;
  }
  return '';
}

// ─── Step management ─────────────────────────────────────

function addStudioStep(type) {
  const meta = STEP_META[type];
  const id = 'step_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const defaultConfig = {
    pipeline_id: '', input_template: '{output}',
    method: 'GET', url: '', headers: {}, body: '',
    operator: 'contains', condition_value: '', else_step_id: '',
    browser_actions: [],
  };
  _buildSteps.push({ id, type, name: meta.label, config: { ...defaultConfig } });
  _buildSelectedId = id;
  _renderStudioCanvas();
  _renderConfigPanel(_buildSteps.find(s => s.id === id));
}

function removeStudioStep(id) {
  _buildSteps = _buildSteps.filter(s => s.id !== id);
  if (_buildSelectedId === id) _buildSelectedId = null;
  // clear else_step_id references
  _buildSteps.forEach(s => {
    if (s.config?.else_step_id === id) s.config.else_step_id = '';
  });
  _renderStudioCanvas();
  if (!_buildSelectedId) _renderConfigPanel(null);
}

function moveStudioStep(id, dir) {
  const idx = _buildSteps.findIndex(s => s.id === id);
  if (idx < 0) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= _buildSteps.length) return;
  [_buildSteps[idx], _buildSteps[newIdx]] = [_buildSteps[newIdx], _buildSteps[idx]];
  _renderStudioCanvas();
}

function selectStudioStep(id) {
  _buildSelectedId = id;
  _renderStudioCanvas();
  _renderConfigPanel(_buildSteps.find(s => s.id === id));
}

// ─── Config Panel ─────────────────────────────────────────

function _renderConfigPanel(step) {
  const panel = document.getElementById('studio-config-panel');
  if (!step) {
    panel.innerHTML = `<div style="color:#94a3b8;font-size:.82rem;text-align:center;margin-top:3rem">Clique em um bloco para configurar</div>`;
    return;
  }
  const meta = STEP_META[step.type];
  const cfg = step.config || {};

  let html = `<div style="display:flex;flex-direction:column;gap:.875rem">
    <div style="display:flex;align-items:center;gap:.5rem;padding-bottom:.75rem;border-bottom:1px solid #f1f5f9">
      <span style="font-size:1.1rem">${meta.icon}</span>
      <span style="font-weight:700;font-size:.875rem;color:${meta.color}">${meta.label}</span>
    </div>
    <div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">NOME DO BLOCO</label>
      <input type="text" value="${escapeHtml(step.name)}" onchange="_updateStepField('${step.id}','name',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;outline:none;box-sizing:border-box" />
    </div>`;

  if (step.type === 'pipeline') {
    const pipeOptions = _buildPipelines.map(p =>
      `<option value="${p.id}" ${p.id === cfg.pipeline_id ? 'selected' : ''}>${escapeHtml(p.name)}</option>`
    ).join('');
    html += `<div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">PIPELINE</label>
      <select onchange="_updateStepConfig('${step.id}','pipeline_id',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;background:white;box-sizing:border-box">
        <option value="">Selecione uma pipeline...</option>${pipeOptions}
      </select>
    </div>
    <div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">TEMPLATE DE ENTRADA</label>
      <input type="text" value="${escapeHtml(cfg.input_template || '{output}')}" onchange="_updateStepConfig('${step.id}','input_template',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;font-family:monospace;outline:none;box-sizing:border-box" />
      <p style="font-size:.7rem;color:#94a3b8;margin:.3rem 0 0">{output} = saída anterior · {input} = entrada inicial</p>
    </div>`;
  }

  if (step.type === 'http_request') {
    const headersJson = Object.entries(cfg.headers || {}).map(([k, v]) => `${k}: ${v}`).join('\n');
    html += `<div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">MÉTODO</label>
      <select onchange="_updateStepConfig('${step.id}','method',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;background:white;box-sizing:border-box">
        ${['GET','POST','PUT','DELETE','PATCH'].map(m => `<option ${m === (cfg.method || 'GET') ? 'selected' : ''}>${m}</option>`).join('')}
      </select>
    </div>
    <div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">URL</label>
      <input type="text" value="${escapeHtml(cfg.url || '')}" placeholder="https://..." onchange="_updateStepConfig('${step.id}','url',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;outline:none;box-sizing:border-box" />
      <p style="font-size:.7rem;color:#94a3b8;margin:.3rem 0 0">{output} e {input} são substituídos</p>
    </div>
    <div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">HEADERS (chave: valor, uma por linha)</label>
      <textarea rows="3" placeholder="Content-Type: application/json" onchange="_updateStepConfigHeaders('${step.id}',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.75rem;font-family:monospace;resize:vertical;outline:none;box-sizing:border-box">${escapeHtml(headersJson)}</textarea>
    </div>
    <div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">BODY</label>
      <textarea rows="4" placeholder='{"key": "{output}"}' onchange="_updateStepConfig('${step.id}','body',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.75rem;font-family:monospace;resize:vertical;outline:none;box-sizing:border-box">${escapeHtml(cfg.body || '')}</textarea>
    </div>`;
  }

  if (step.type === 'condition') {
    const operators = [
      ['contains','contém'],['not_contains','não contém'],['equals','igual a'],
      ['not_equals','diferente de'],['starts_with','começa com'],['ends_with','termina com'],
      ['is_empty','está vazio'],['not_empty','não está vazio'],
    ];
    const elseOptions = _buildSteps
      .filter(s => s.id !== step.id)
      .map(s => `<option value="${s.id}" ${s.id === cfg.else_step_id ? 'selected' : ''}>${escapeHtml(s.name)}</option>`)
      .join('');
    html += `<div style="background:#fffbeb;border-radius:8px;padding:.65rem;font-size:.75rem;color:#92400e;line-height:1.5">
      <strong>Lógica:</strong> se a condição for VERDADEIRA, continua para o próximo bloco. Se FALSA, pula para o bloco selecionado (ou termina).
    </div>
    <div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">OPERADOR</label>
      <select onchange="_updateStepConfig('${step.id}','operator',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;background:white;box-sizing:border-box">
        ${operators.map(([val, lbl]) => `<option value="${val}" ${val === cfg.operator ? 'selected' : ''}>${lbl}</option>`).join('')}
      </select>
    </div>
    <div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">VALOR A COMPARAR</label>
      <input type="text" value="${escapeHtml(cfg.condition_value || '')}" placeholder="texto esperado no output" onchange="_updateStepConfig('${step.id}','condition_value',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;outline:none;box-sizing:border-box" />
    </div>
    <div>
      <label style="font-size:.72rem;font-weight:600;color:#64748b;display:block;margin-bottom:.3rem">SE FALSO: IR PARA</label>
      <select onchange="_updateStepConfig('${step.id}','else_step_id',this.value)"
        style="width:100%;padding:.4rem .65rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.82rem;background:white;box-sizing:border-box">
        <option value="">Terminar automação</option>${elseOptions}
      </select>
    </div>`;
  }

  if (step.type === 'browser') {
    const actions = cfg.browser_actions || [];
    const actionTypes = ['open','click','type','extract','wait','close'];
    const actionsHtml = actions.map((a, i) => `
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:.5rem;display:flex;flex-direction:column;gap:.35rem;position:relative">
        <div style="display:flex;gap:.35rem;align-items:center">
          <select onchange="_updateBrowserAction('${step.id}',${i},'type',this.value)"
            style="flex:1;padding:.3rem .4rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.75rem;background:white">
            ${actionTypes.map(t => `<option value="${t}" ${t === a.type ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
          <button onclick="_removeBrowserAction('${step.id}',${i})" style="width:22px;height:22px;border:1px solid #fca5a5;border-radius:5px;background:white;cursor:pointer;color:#ef4444;font-size:.7rem;flex-shrink:0;display:flex;align-items:center;justify-content:center">✕</button>
        </div>
        <input type="text" value="${escapeHtml(a.target || '')}" placeholder="URL ou seletor CSS" onchange="_updateBrowserAction('${step.id}',${i},'target',this.value)"
          style="width:100%;padding:.3rem .4rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.75rem;outline:none;box-sizing:border-box" />
        ${a.type === 'type' || a.type === 'extract' ? `
        <input type="text" value="${escapeHtml(a.value || '')}" placeholder="${a.type === 'type' ? 'Texto a digitar' : 'Atributo (ou vazio p/ texto)'}" onchange="_updateBrowserAction('${step.id}',${i},'value',this.value)"
          style="width:100%;padding:.3rem .4rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.75rem;outline:none;box-sizing:border-box" />
        <input type="text" value="${escapeHtml(a.variable || '')}" placeholder="Variável para guardar resultado" onchange="_updateBrowserAction('${step.id}',${i},'variable',this.value)"
          style="width:100%;padding:.3rem .4rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.75rem;outline:none;box-sizing:border-box" />` : ''}
        ${a.type === 'wait' ? `
        <input type="text" value="${escapeHtml(a.value || '')}" placeholder="Segundos a aguardar" onchange="_updateBrowserAction('${step.id}',${i},'value',this.value)"
          style="width:100%;padding:.3rem .4rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.75rem;outline:none;box-sizing:border-box" />` : ''}
      </div>`).join('');

    html += `<div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.4rem">
        <label style="font-size:.72rem;font-weight:600;color:#64748b">AÇÕES DO NAVEGADOR</label>
        <button onclick="_addBrowserAction('${step.id}')" style="padding:.2rem .5rem;border:1px solid #3b82f6;border-radius:5px;font-size:.72rem;color:#3b82f6;background:#eff6ff;cursor:pointer">+ Ação</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:.4rem" id="browser-actions-${step.id}">
        ${actionsHtml || `<div style="font-size:.78rem;color:#94a3b8;text-align:center;padding:.5rem">Nenhuma ação. Clique em + Ação.</div>`}
      </div>
      <div style="margin-top:.5rem;padding:.5rem;background:#f5f3ff;border-radius:7px;font-size:.72rem;color:#6d28d9;line-height:1.5">
        🌍 Execução requer worker com Playwright instalado. O builder está disponível para modelar o fluxo.
      </div>
    </div>`;
  }

  html += `</div>`;
  panel.innerHTML = html;
}

// ─── Config helpers ───────────────────────────────────────

function _updateStepField(id, field, value) {
  const step = _buildSteps.find(s => s.id === id);
  if (step) {
    step[field] = value;
    _renderStudioCanvas();
  }
}

function _updateStepConfig(id, field, value) {
  const step = _buildSteps.find(s => s.id === id);
  if (step) {
    step.config = step.config || {};
    step.config[field] = value;
    _renderStudioCanvas();
  }
}

function _updateStepConfigHeaders(id, rawText) {
  const headers = {};
  rawText.split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon > 0) {
      const k = line.substring(0, colon).trim();
      const v = line.substring(colon + 1).trim();
      if (k) headers[k] = v;
    }
  });
  _updateStepConfig(id, 'headers', headers);
}

function _addBrowserAction(stepId) {
  const step = _buildSteps.find(s => s.id === stepId);
  if (!step) return;
  step.config = step.config || {};
  step.config.browser_actions = step.config.browser_actions || [];
  step.config.browser_actions.push({ type: 'open', target: '', value: '', variable: '' });
  _renderConfigPanel(step);
  _renderStudioCanvas();
}

function _removeBrowserAction(stepId, idx) {
  const step = _buildSteps.find(s => s.id === stepId);
  if (!step) return;
  step.config.browser_actions.splice(idx, 1);
  _renderConfigPanel(step);
  _renderStudioCanvas();
}

function _updateBrowserAction(stepId, idx, field, value) {
  const step = _buildSteps.find(s => s.id === stepId);
  if (!step) return;
  step.config.browser_actions[idx][field] = value;
  _renderStudioCanvas();
}

// ─── Save ─────────────────────────────────────────────────

async function saveStudioAutomation() {
  const name = document.getElementById('studio-name').value.trim();
  if (!name) { showToast('Informe o nome da automação', 'error'); return; }

  const triggerType = document.getElementById('studio-trigger-type')?.value || 'manual';
  let schedule = '';
  let schedule_input = '';
  if (triggerType === 'cron') {
    schedule = _buildScheduleValue();
    schedule_input = document.getElementById('studio-sched-input')?.value || '';
  }

  const trigger = {
    type: triggerType,
    schedule,
    schedule_input,
    webhook_token: _buildTrigger.webhook_token || '',
  };

  const payload = {
    name,
    description: document.getElementById('studio-description').value.trim(),
    trigger,
    steps: _buildSteps,
    active: true,
  };

  try {
    let saved;
    if (_buildEditId) {
      saved = await api('PATCH', `/studio/${_buildEditId}`, payload);
    } else {
      saved = await api('POST', '/studio', payload);
    }

    if (saved.webhook_url) {
      document.getElementById('studio-webhook-url').textContent = saved.webhook_url;
      _buildEditId = saved.id;
      document.getElementById('studio-edit-id').value = saved.id;
      if (triggerType === 'webhook') {
        showToast('Automação salva! URL do webhook gerada acima.', 'success');
        return;
      }
    }

    showToast(_buildEditId && _buildEditId !== saved.id ? 'Automação atualizada!' : 'Automação criada!', 'success');
    closeModal('modal-studio-builder');
    loadStudio();
  } catch (e) {
    showToast('Erro ao salvar: ' + e.message, 'error');
  }
}

// ─── Run ──────────────────────────────────────────────────

function openStudioRun(automationId) {
  _studioRunAutoId = automationId;
  const auto = _studioList.find(a => a.id === automationId);
  document.getElementById('studio-run-name').textContent = auto ? auto.name : 'Automação';
  document.getElementById('studio-run-id').value = automationId;
  document.getElementById('studio-run-input').value = auto?.trigger?.schedule_input || '';
  document.getElementById('studio-run-result').style.display = 'none';
  document.getElementById('studio-run-steps').innerHTML = '';
  const outWrap = document.getElementById('studio-run-output-wrap');
  if (outWrap) outWrap.style.display = 'none';
  const execBtn = document.getElementById('btn-studio-exec');
  execBtn.disabled = false;
  execBtn.textContent = '⚡ Executar';
  document.getElementById('modal-studio-run').style.display = 'flex';
}

async function executeStudioRun() {
  const id = document.getElementById('studio-run-id').value;
  const input = document.getElementById('studio-run-input').value;
  const btn = document.getElementById('btn-studio-exec');
  btn.disabled = true;
  btn.textContent = '⏳ Executando...';

  const stepsDiv = document.getElementById('studio-run-steps');
  stepsDiv.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem;color:#64748b;font-size:.85rem"><div class="spinner" style="width:16px;height:16px"></div> Executando automação...</div>`;
  document.getElementById('studio-run-result').style.display = 'block';
  const outWrap = document.getElementById('studio-run-output-wrap');
  if (outWrap) outWrap.style.display = 'none';

  try {
    const run = await api('POST', `/studio/${id}/run`, { input });
    _renderStudioRunResult(run);
  } catch (e) {
    stepsDiv.innerHTML = `<div style="color:#ef4444;font-size:.85rem">❌ Erro: ${escapeHtml(e.message)}</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = '⚡ Executar';
  }
}

function _renderStudioRunResult(run) {
  const stepsDiv = document.getElementById('studio-run-steps');
  const statusColor = { success: '#16a34a', failed: '#ef4444', skipped: '#f59e0b' };
  const statusIcon = { success: '✓', failed: '✕', skipped: '⚠' };
  const meta = STEP_META;

  stepsDiv.innerHTML = run.steps_result.map(s => {
    const m = meta[s.step_type] || meta.pipeline;
    const sc = statusColor[s.status] || '#64748b';
    const si = statusIcon[s.status] || '?';
    return `<div style="background:white;border:1.5px solid ${s.status === 'failed' ? '#fca5a5' : '#e2e8f0'};border-radius:10px;padding:.65rem .875rem;display:flex;flex-direction:column;gap:.4rem">
      <div style="display:flex;align-items:center;gap:.5rem">
        <span style="font-size:1rem">${m.icon}</span>
        <span style="font-weight:600;font-size:.82rem;color:#1e293b;flex:1">${escapeHtml(s.step_name)}</span>
        <span style="font-size:.75rem;font-weight:700;color:${sc}">${si} ${s.status.toUpperCase()}</span>
        <span style="font-size:.7rem;color:#94a3b8">${s.duration_ms}ms</span>
      </div>
      ${s.condition_result != null ? `<div style="font-size:.78rem;color:#b45309;background:#fffbeb;border-radius:5px;padding:.2rem .5rem">${escapeHtml(s.output)}</div>` : ''}
      ${s.output && s.condition_result == null ? `<pre style="font-size:.75rem;background:#f8fafc;border-radius:6px;padding:.4rem .6rem;margin:0;white-space:pre-wrap;word-break:break-word;max-height:100px;overflow-y:auto;color:#334155;font-family:inherit">${escapeHtml(s.output.substring(0, 500))}${s.output.length > 500 ? '…' : ''}</pre>` : ''}
      ${s.error ? `<div style="font-size:.78rem;color:#ef4444;background:#fef2f2;border-radius:5px;padding:.2rem .5rem">❌ ${escapeHtml(s.error)}</div>` : ''}
    </div>`;
  }).join('') || `<div style="color:#94a3b8;font-size:.85rem;text-align:center;padding:.5rem">Nenhum bloco executado</div>`;

  const outWrap = document.getElementById('studio-run-output-wrap');
  if (outWrap && run.output) {
    outWrap.style.display = 'block';
    document.getElementById('studio-run-output-text').textContent = run.output;
  }
}

// ─── Delete / Toggle ──────────────────────────────────────

async function deleteStudioAutomation(id, name) {
  showConfirm(`Excluir automação "${name}"?`, async () => {
    try {
      await api('DELETE', `/studio/${id}`);
      showToast('Automação excluída', 'success');
      loadStudio();
    } catch (e) {
      showToast('Erro ao excluir: ' + e.message, 'error');
    }
  });
}

async function toggleStudioActive(id, active) {
  try {
    await api('PATCH', `/studio/${id}`, { active });
    const auto = _studioList.find(a => a.id === id);
    if (auto) auto.active = active;
    _renderStudioTable();
  } catch (e) {
    showToast('Erro ao atualizar: ' + e.message, 'error');
    loadStudio();
  }
}
