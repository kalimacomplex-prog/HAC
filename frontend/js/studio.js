// ─── Categorias e ações (estilo Automate Fortra) ──────────────────
const ACTION_CATEGORIES = [
  { key: 'flow', label: 'Controle de Fluxo', icon: '🔄', actions: [
    { type: 'condition',  icon: '🔀', label: 'Condição (Se/Senão)', color: '#b45309', bg: '#fffbeb' },
    { type: 'loop_count', icon: '🔁', label: 'Repetir N vezes',     color: '#0f766e', bg: '#f0fdfa' },
    { type: 'wait',       icon: '⏳', label: 'Aguardar (delay)',    color: '#64748b', bg: '#f8fafc' },
    { type: 'comment',    icon: '💬', label: 'Comentário',          color: '#94a3b8', bg: '#f8fafc' },
  ]},
  { key: 'variables', label: 'Variáveis', icon: '📦', actions: [
    { type: 'set_variable', icon: '📦', label: 'Definir variável',     color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'calculate',    icon: '🧮', label: 'Calcular / Expressar', color: '#7c3aed', bg: '#f5f3ff' },
  ]},
  { key: 'files', label: 'Arquivos', icon: '📁', actions: [
    { type: 'read_file',  icon: '📖', label: 'Ler arquivo',     color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'write_file', icon: '✏️', label: 'Escrever arquivo', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'list_files', icon: '📂', label: 'Listar arquivos',  color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'delete_file',icon: '🗑️', label: 'Deletar arquivo',  color: '#ef4444', bg: '#fef2f2' },
  ]},
  { key: 'http', label: 'HTTP & Internet', icon: '🌐', actions: [
    { type: 'http_request', icon: '🌐', label: 'HTTP Request', color: '#0f766e', bg: '#f0fdfa' },
    { type: 'parse_json',   icon: '{}', label: 'Parse JSON',   color: '#0f766e', bg: '#f0fdfa' },
  ]},
  { key: 'email', label: 'Email', icon: '📧', actions: [
    { type: 'send_email', icon: '📧', label: 'Enviar Email', color: '#dc2626', bg: '#fef2f2' },
  ]},
  { key: 'system', label: 'Sistema', icon: '⚙️', actions: [
    { type: 'run_command', icon: '⌨️', label: 'Comando Shell',   color: '#374151', bg: '#f8fafc' },
    { type: 'run_python',  icon: '🐍', label: 'Script Python',  color: '#15803d', bg: '#f0fdf4' },
  ]},
  { key: 'ai', label: 'Inteligência Artificial', icon: '🤖', actions: [
    { type: 'call_ai_agent', icon: '🧠', label: 'Agente IA',   color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'call_pipeline', icon: '🔗', label: 'Pipeline IA', color: '#1d4ed8', bg: '#eff6ff' },
  ]},
  { key: 'data', label: 'Dados', icon: '📊', actions: [
    { type: 'text_transform', icon: '✂️', label: 'Transformar Texto', color: '#0891b2', bg: '#f0f9ff' },
  ]},
  { key: 'browser', label: 'Navegador Web', icon: '🌍', actions: [
    { type: 'browser', icon: '🌍', label: 'Ações de Navegador', color: '#7c3aed', bg: '#f5f3ff' },
  ]},
];

const ACTION_MAP = {};
ACTION_CATEGORIES.forEach(cat => cat.actions.forEach(a => ACTION_MAP[a.type] = { ...a, category: cat.label }));

// ─── State ────────────────────────────────────────────────────────
let _studioList = [];
let _buildSteps = [];
let _buildTrigger = { type: 'manual', schedule: '', webhook_token: '', schedule_input: '' };
let _buildEditId = null;
let _buildSelectedId = null;
let _buildPipelines = [];
let _buildAIAgents = [];
let _buildAgents = [];
let _collapsedCats = new Set();
let _studioRunAutoId = null;

// ─── Lista de Automações ──────────────────────────────────────────

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
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:2.5rem">
      Nenhuma automação criada. Clique em <strong>+ Nova automação</strong> para começar.
    </td></tr>`;
    return;
  }
  const triggerLabel = { manual: '▶ Manual', cron: '⏱ Cron', webhook: '🔗 Webhook' };
  tbody.innerHTML = _studioList.map(a => `<tr>
    <td>
      <strong style="cursor:pointer;color:var(--blue-600)" onclick="openBuilderPage('${a.id}')">${escapeHtml(a.name)}</strong>
      ${a.description ? `<br><small style="color:#94a3b8">${escapeHtml(a.description)}</small>` : ''}
    </td>
    <td>
      <span style="font-size:.8rem">${triggerLabel[a.trigger?.type] || '—'}</span>
      ${a.trigger?.type === 'cron' ? `<br><code style="font-size:.7rem;color:#64748b">${a.trigger.schedule || ''}</code>` : ''}
    </td>
    <td>${a.steps?.length || 0} ação${(a.steps?.length || 0) !== 1 ? 'ões' : ''}</td>
    <td>
      <label style="display:inline-flex;align-items:center;gap:.35rem;cursor:pointer;font-size:.8rem">
        <input type="checkbox" ${a.active ? 'checked' : ''} onchange="toggleStudioActive('${a.id}',this.checked)" style="width:14px;height:14px;cursor:pointer" />
        <span style="color:${a.active ? '#16a34a' : '#94a3b8'}">${a.active ? 'Ativa' : 'Inativa'}</span>
      </label>
    </td>
    <td style="display:flex;gap:.35rem;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="openStudioRun('${a.id}')">⚡ Executar</button>
      <button class="btn btn-outline btn-sm" onclick="openBuilderPage('${a.id}')">✏ Editar</button>
      <button class="btn btn-outline btn-sm" style="color:#ef4444;border-color:#fca5a5" onclick="deleteStudioAutomation('${a.id}','${escapeHtml(a.name)}')">🗑</button>
    </td>
  </tr>`).join('');
}

// ─── Navegação para o Builder ─────────────────────────────────────

function openBuilderPage(id = null) {
  window._builderAutoId = id || null;
  navigate('studio_builder');
}

async function initBuilderPage() {
  _buildSteps = [];
  _buildSelectedId = null;
  _buildEditId = window._builderAutoId || null;
  _buildTrigger = { type: 'manual', schedule: '', webhook_token: '', schedule_input: '' };

  // Carrega recursos em paralelo
  try {
    [_buildPipelines, _buildAIAgents, _buildAgents] = await Promise.all([
      api('GET', '/pipelines').catch(() => []),
      api('GET', '/ai-agents').catch(() => []),
      api('GET', '/agents').catch(() => []),
    ]);
  } catch (_) {}

  // Popula seletor de agente
  const agentSel = document.getElementById('builder-agent-id');
  if (agentSel) {
    agentSel.innerHTML = '<option value="">⚙ Qualquer agente</option>' +
      (_buildAgents || []).map(a => `<option value="${a.id}">${a.connected ? '🟢' : '⚫'} ${escapeHtml(a.name)}</option>`).join('');
  }

  if (_buildEditId) {
    try {
      const auto = await api('GET', `/studio/${_buildEditId}`);
      document.getElementById('builder-name').value = auto.name || '';
      document.getElementById('builder-description').value = auto.description || '';
      _buildSteps = auto.steps ? JSON.parse(JSON.stringify(auto.steps)) : [];
      _buildTrigger = auto.trigger ? { ...auto.trigger } : _buildTrigger;
      if (auto.webhook_url) document.getElementById('builder-webhook-url').textContent = auto.webhook_url;
      const agentSel = document.getElementById('builder-agent-id');
      if (agentSel && auto.agent_id) agentSel.value = auto.agent_id;
    } catch (e) {
      showToast('Erro ao carregar automação: ' + e.message, 'error');
    }
  } else {
    document.getElementById('builder-name').value = '';
    document.getElementById('builder-description').value = '';
    document.getElementById('builder-webhook-url').textContent = '—';
  }

  document.getElementById('builder-edit-id').value = _buildEditId || '';
  _syncBuilderTriggerUI();
  document.getElementById('builder-trigger-panel').style.display = 'none';
  _renderPalette();
  _renderBuilderCanvas();
  _renderPropsPanel(null);
}

function backToStudio() {
  // Restaura topbar e sidebar
  const topbar = document.querySelector('.topbar');
  const sidebar = document.getElementById('sidebar');
  if (topbar) topbar.style.display = '';
  if (sidebar) sidebar.style.display = '';
  navigate('studio');
}

// ─── Trigger ──────────────────────────────────────────────────────

function toggleBuilderTrigger() {
  const panel = document.getElementById('builder-trigger-panel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function onBuilderTriggerTypeChange() {
  const type = document.getElementById('builder-trigger-type').value;
  _buildTrigger.type = type;
  document.getElementById('builder-cron-opts').style.display  = type === 'cron'    ? 'flex'  : 'none';
  document.getElementById('builder-webhook-info').style.display = type === 'webhook' ? 'flex' : 'none';
  const lbl = { manual:'▶ Manual', cron:'⏱ Cron', webhook:'🔗 Webhook' };
  document.getElementById('btn-builder-trigger').textContent = `⚡ Trigger: ${lbl[type] || 'Manual'}`;
}

function onBuilderSchedTypeChange() {
  const v = document.getElementById('builder-sched-type').value;
  document.getElementById('builder-sched-interval').style.display = v === 'interval' ? 'flex' : 'none';
  document.getElementById('builder-sched-daily').style.display    = v === 'daily'    ? 'block' : 'none';
  document.getElementById('builder-sched-cron').style.display     = v === 'cron'     ? 'block' : 'none';
}

function _syncBuilderTriggerUI() {
  const t = _buildTrigger;
  const typeEl = document.getElementById('builder-trigger-type');
  if (typeEl) typeEl.value = t.type || 'manual';
  onBuilderTriggerTypeChange();
  if (t.type === 'cron' && t.schedule) _restoreBuilderSchedule(t.schedule);
  const si = document.getElementById('builder-sched-input');
  if (si && t.schedule_input) si.value = t.schedule_input;
}

function _restoreBuilderSchedule(schedule) {
  if (!schedule) return;
  const parts = schedule.split(' ');
  if (parts.length !== 5) return;
  const [min, hour, , , dow] = parts;
  if (min.startsWith('*/') && hour === '*') {
    document.getElementById('builder-sched-type').value = 'interval';
    document.getElementById('builder-sched-minutes').value = min.replace('*/', '');
  } else if (min !== '*' && hour !== '*' && dow === '*') {
    document.getElementById('builder-sched-type').value = 'daily';
    document.getElementById('builder-sched-time').value = `${hour.padStart(2,'0')}:${min.padStart(2,'0')}`;
  } else {
    document.getElementById('builder-sched-type').value = 'cron';
    document.getElementById('builder-sched-expr').value = schedule;
  }
  onBuilderSchedTypeChange();
}

function _buildScheduleValue() {
  const t = document.getElementById('builder-sched-type')?.value || '';
  if (t === 'interval') {
    const m = parseInt(document.getElementById('builder-sched-minutes').value) || 60;
    return `*/${m} * * * *`;
  } else if (t === 'daily') {
    const [hh, mm] = (document.getElementById('builder-sched-time').value || '09:00').split(':');
    return `${parseInt(mm)} ${parseInt(hh)} * * *`;
  } else {
    return document.getElementById('builder-sched-expr')?.value.trim() || '';
  }
}

function copyBuilderWebhook() {
  const url = document.getElementById('builder-webhook-url').textContent;
  if (url && url !== '—') navigator.clipboard.writeText(url).then(() => showToast('URL copiada!'));
}

// ─── Paleta de Ações ──────────────────────────────────────────────

function _renderPalette() {
  const palette = document.getElementById('builder-palette');
  if (!palette) return;
  palette.innerHTML = ACTION_CATEGORIES.map(cat => {
    const collapsed = _collapsedCats.has(cat.key);
    return `<div>
      <div onclick="togglePaletteCat('${cat.key}')"
        style="padding:.5rem .75rem;font-size:.7rem;font-weight:700;color:#475569;letter-spacing:.04em;cursor:pointer;display:flex;align-items:center;justify-content:space-between;user-select:none;background:${collapsed ? 'transparent' : '#e8edf2'};border-bottom:1px solid #e2e8f0">
        <span>${cat.icon} ${cat.label}</span>
        <span style="font-size:.7rem;color:#94a3b8">${collapsed ? '▶' : '▼'}</span>
      </div>
      ${collapsed ? '' : cat.actions.map(a => `
        <div onclick="addBuilderStep('${a.type}')"
          style="padding:.42rem .75rem .42rem 1.1rem;font-size:.8rem;cursor:pointer;display:flex;align-items:center;gap:.4rem;color:#1e293b;transition:background .1s;border-bottom:1px solid #f1f5f9"
          onmouseover="this.style.background='#dde3eb'" onmouseout="this.style.background='transparent'">
          <span style="font-size:.95rem">${a.icon}</span>
          <span style="line-height:1.3">${a.label}</span>
        </div>`).join('')}
    </div>`;
  }).join('');
}

function togglePaletteCat(key) {
  if (_collapsedCats.has(key)) _collapsedCats.delete(key);
  else _collapsedCats.add(key);
  _renderPalette();
}

// ─── Canvas ───────────────────────────────────────────────────────

function _renderBuilderCanvas() {
  const canvas = document.getElementById('builder-canvas');
  if (!canvas) return;
  const count = document.getElementById('builder-step-count');
  if (count) count.textContent = `${_buildSteps.length} ação${_buildSteps.length !== 1 ? 'ões' : ''}`;

  let html = `<div style="display:flex;flex-direction:column;align-items:center;gap:0;width:100%;max-width:520px">`;
  html += _flowBubble('INÍCIO', '#22c55e', '#f0fdf4');
  html += _flowArrow();

  if (_buildSteps.length === 0) {
    html += `<div style="border:2px dashed #cbd5e1;border-radius:12px;padding:1.75rem;color:#94a3b8;font-size:.85rem;text-align:center;background:white;width:100%;box-sizing:border-box">
      Selecione uma ação na paleta à esquerda para adicionar ao fluxo
    </div>`;
  } else {
    _buildSteps.forEach((step, idx) => {
      const meta = ACTION_MAP[step.type] || { icon: '⚙', color: '#64748b', bg: '#f8fafc' };
      const sel = step.id === _buildSelectedId;
      html += `<div onclick="selectBuilderStep('${step.id}')"
        style="display:flex;align-items:center;gap:.75rem;padding:.75rem 1rem;background:${sel ? meta.bg : 'white'};border:2px solid ${sel ? meta.color : '#e2e8f0'};border-radius:12px;cursor:pointer;width:100%;box-sizing:border-box;transition:all .12s;box-shadow:${sel ? `0 0 0 3px ${meta.color}33` : '0 1px 3px rgba(0,0,0,.06)'}">
        <div style="width:36px;height:36px;border-radius:9px;background:${meta.bg};border:1.5px solid ${meta.color}44;display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex-shrink:0">${meta.icon}</div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:.82rem;color:${meta.color};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(step.name)}</div>
          <div style="font-size:.72rem;color:#64748b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${_stepBrief(step)}</div>
        </div>
        <div style="display:flex;gap:.2rem;flex-shrink:0">
          <button onclick="event.stopPropagation();moveBuilderStep('${step.id}',-1)" ${idx===0?'disabled':''} title="Mover para cima"
            style="width:24px;height:24px;border:1px solid #e2e8f0;border-radius:5px;background:white;font-size:.72rem;display:flex;align-items:center;justify-content:center;color:#64748b;cursor:${idx===0?'default':'pointer'};opacity:${idx===0?.3:1}">↑</button>
          <button onclick="event.stopPropagation();moveBuilderStep('${step.id}',1)" ${idx===_buildSteps.length-1?'disabled':''} title="Mover para baixo"
            style="width:24px;height:24px;border:1px solid #e2e8f0;border-radius:5px;background:white;font-size:.72rem;display:flex;align-items:center;justify-content:center;color:#64748b;cursor:${idx===_buildSteps.length-1?'default':'pointer'};opacity:${idx===_buildSteps.length-1?.3:1}">↓</button>
          <button onclick="event.stopPropagation();removeBuilderStep('${step.id}')" title="Remover"
            style="width:24px;height:24px;border:1px solid #fca5a5;border-radius:5px;background:white;cursor:pointer;font-size:.72rem;display:flex;align-items:center;justify-content:center;color:#ef4444">✕</button>
        </div>
      </div>`;
      if (idx < _buildSteps.length - 1) html += _flowArrow();
    });
  }

  html += _flowArrow();
  html += _flowBubble('FIM', '#64748b', '#f8fafc');
  html += `</div>`;
  canvas.innerHTML = html;
}

function _flowBubble(label, color, bg) {
  return `<div style="padding:.35rem .875rem;background:${bg};border:2px solid ${color};border-radius:20px;font-size:.72rem;font-weight:700;color:${color};display:inline-block">${label}</div>`;
}

function _flowArrow() {
  return `<div style="display:flex;flex-direction:column;align-items:center;height:26px;flex-shrink:0">
    <div style="width:2px;flex:1;background:#cbd5e1"></div>
    <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #cbd5e1"></div>
  </div>`;
}

function _stepBrief(step) {
  const c = step.config || {};
  switch (step.type) {
    case 'condition':    return `Se output ${c.operator || 'contains'} "${c.condition_value || '...'}"`;
    case 'loop_count':   return `Repetir ${c.count || 3}x (idx: ${c.index_variable || 'loop_index'})`;
    case 'wait':         return `Aguardar ${c.seconds || 1}s`;
    case 'comment':      return c.text ? c.text.substring(0, 50) : '—';
    case 'set_variable': return `${c.variable_name || 'var'} = "${(c.value || '').substring(0, 30)}"`;
    case 'calculate':    return `${c.variable_name || 'resultado'} = ${(c.expression || '').substring(0, 30)}`;
    case 'read_file':    return c.file_path || 'caminho não definido';
    case 'write_file':   return c.file_path || 'caminho não definido';
    case 'list_files':   return `${c.directory || '.'} / ${c.pattern || '*'}`;
    case 'delete_file':  return c.file_path || 'caminho não definido';
    case 'http_request': return c.url ? `${c.method || 'GET'} ${c.url.substring(0, 35)}` : 'URL não definida';
    case 'parse_json':   return c.key_path ? `chave: ${c.key_path}` : 'Parse completo';
    case 'send_email':   return `Para: ${c.to || '...'} | ${(c.subject || '').substring(0, 25)}`;
    case 'run_command':  return (c.command || '').substring(0, 45) || 'comando não definido';
    case 'run_python':   return (c.code || '').split('\n')[0].substring(0, 45) || 'código não definido';
    case 'call_ai_agent':{ const a = _buildAIAgents.find(x => x.id === c.agent_id); return a ? a.name : 'Agente não selecionado'; }
    case 'call_pipeline':{ const p = _buildPipelines.find(x => x.id === c.pipeline_id); return p ? p.name : 'Pipeline não selecionada'; }
    case 'text_transform': return `${c.operation || 'upper'} em: ${(c.text_input || '{output}').substring(0, 30)}`;
    case 'browser':      return `${(c.browser_actions || []).length} ação(ões)`;
    default: return '';
  }
}

// ─── Gerenciamento de Steps ───────────────────────────────────────

function addBuilderStep(type) {
  const meta = ACTION_MAP[type] || { label: type };
  const id = 'step_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const defaults = {
    operator: 'contains', condition_value: '', else_step_id: '',
    count: 3, index_variable: 'loop_index',
    seconds: 1, text: '',
    variable_name: '', value: '', expression: '',
    file_path: '', content: '{output}', append: false, directory: '.', pattern: '*',
    method: 'GET', url: '', headers: {}, body: '',
    json_input: '{output}', key_path: '',
    to: '', subject: '', email_body: '', is_html: false,
    command: '', code: '',
    agent_id: '', input_template: '{output}',
    pipeline_id: '',
    text_input: '{output}', operation: 'upper', search: '', replace_with: '',
    browser_actions: [],
  };
  _buildSteps.push({ id, type, name: meta.label, config: { ...defaults } });
  _buildSelectedId = id;
  _renderBuilderCanvas();
  _renderPropsPanel(_buildSteps.find(s => s.id === id));
}

function removeBuilderStep(id) {
  _buildSteps = _buildSteps.filter(s => s.id !== id);
  _buildSteps.forEach(s => { if (s.config?.else_step_id === id) s.config.else_step_id = ''; });
  if (_buildSelectedId === id) _buildSelectedId = null;
  _renderBuilderCanvas();
  _renderPropsPanel(_buildSelectedId ? _buildSteps.find(s => s.id === _buildSelectedId) : null);
}

function moveBuilderStep(id, dir) {
  const idx = _buildSteps.findIndex(s => s.id === id);
  const to = idx + dir;
  if (to < 0 || to >= _buildSteps.length) return;
  [_buildSteps[idx], _buildSteps[to]] = [_buildSteps[to], _buildSteps[idx]];
  _renderBuilderCanvas();
}

function selectBuilderStep(id) {
  _buildSelectedId = id;
  _renderBuilderCanvas();
  _renderPropsPanel(_buildSteps.find(s => s.id === id));
}

// ─── Painel de Propriedades ───────────────────────────────────────

function _renderPropsPanel(step) {
  const panel = document.getElementById('builder-props');
  if (!panel) return;
  if (!step) {
    panel.innerHTML = `<div style="color:#94a3b8;font-size:.82rem;text-align:center;margin-top:4rem;line-height:1.8">
      Selecione uma ação<br>no fluxo para configurar
    </div>`;
    return;
  }
  const meta = ACTION_MAP[step.type] || { icon:'⚙', color:'#64748b', label: step.type };
  const c = step.config || {};

  let html = `<div style="display:flex;flex-direction:column;gap:.75rem">
    <div style="display:flex;align-items:center;gap:.5rem;padding-bottom:.65rem;border-bottom:1px solid #f1f5f9">
      <span style="font-size:1.1rem">${meta.icon}</span>
      <span style="font-weight:700;font-size:.85rem;color:${meta.color}">${meta.label}</span>
    </div>
    ${_field('NOME DA AÇÃO', `<input type="text" value="${escapeHtml(step.name)}" onchange="_upField('${step.id}','name',this.value)" ${_inp()} />`)}`;

  // ── Campos por tipo ─────────────────────────────────────
  switch (step.type) {

    case 'condition':
      html += _field('OPERADOR', `<select onchange="_upCfg('${step.id}','operator',this.value)" ${_sel()}>
        ${[['contains','contém'],['not_contains','não contém'],['equals','igual a'],['not_equals','diferente de'],
           ['starts_with','começa com'],['ends_with','termina com'],['is_empty','está vazio'],['not_empty','não está vazio'],
           ['greater_than','maior que (número)'],['less_than','menor que (número)']]
          .map(([v,l])=>`<option value="${v}" ${v===c.operator?'selected':''}>${l}</option>`).join('')}
      </select>`);
      html += _field('VALOR A COMPARAR', `<input type="text" value="${escapeHtml(c.condition_value||'')}" placeholder="texto esperado no output" onchange="_upCfg('${step.id}','condition_value',this.value)" ${_inp()} />`);
      html += _field('SE FALSO: IR PARA', `<select onchange="_upCfg('${step.id}','else_step_id',this.value)" ${_sel()}>
        <option value="">Terminar automação</option>
        ${_buildSteps.filter(s=>s.id!==step.id).map(s=>`<option value="${s.id}" ${s.id===c.else_step_id?'selected':''}>${escapeHtml(s.name)}</option>`).join('')}
      </select>`);
      html += `<div style="background:#fffbeb;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#92400e">Se VERDADEIRO → próxima ação. Se FALSO → pula para ação selecionada (ou termina).</div>`;
      break;

    case 'loop_count':
      html += _field('QUANTIDADE', `<input type="number" value="${c.count||3}" min="1" max="1000" onchange="_upCfg('${step.id}','count',+this.value)" ${_inp()} />`);
      html += _field('VARIÁVEL DE ÍNDICE', `<input type="text" value="${escapeHtml(c.index_variable||'loop_index')}" placeholder="loop_index" onchange="_upCfg('${step.id}','index_variable',this.value)" ${_inp()} />`);
      html += `<div style="background:#f5f3ff;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#6d28d9">⚠️ Blocos aninhados em desenvolvimento. Use Script Python para loops complexos por enquanto.</div>`;
      break;

    case 'wait':
      html += _field('SEGUNDOS', `<input type="number" value="${c.seconds||1}" min="0.1" max="60" step="0.1" onchange="_upCfg('${step.id}','seconds',+this.value)" ${_inp()} />`);
      break;

    case 'comment':
      html += _field('TEXTO DO COMENTÁRIO', `<textarea onchange="_upCfg('${step.id}','text',this.value)" rows="3" ${_ta()}>${escapeHtml(c.text||'')}</textarea>`);
      break;

    case 'set_variable':
      html += _field('NOME DA VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="minha_variavel" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _field('VALOR', `<input type="text" value="${escapeHtml(c.value||'')}" placeholder="{output} ou texto fixo" onchange="_upCfg('${step.id}','value',this.value)" ${_inp()} />`);
      html += _hint('{output} {input} {varname} são substituídos');
      break;

    case 'calculate':
      html += _field('NOME DA VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="resultado" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _field('EXPRESSÃO PYTHON', `<input type="text" value="${escapeHtml(c.expression||'')}" placeholder="len(output) * 2" onchange="_upCfg('${step.id}','expression',this.value)" ${_inp('font-family:monospace')} />`);
      html += _hint('math, abs, round, len, str, int, float, min, max disponíveis. Variáveis pelo nome.');
      break;

    case 'read_file':
      html += _field('CAMINHO DO ARQUIVO', `<input type="text" value="${escapeHtml(c.file_path||'')}" placeholder="/tmp/dados.txt" onchange="_upCfg('${step.id}','file_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="conteudo (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'write_file':
      html += _field('CAMINHO DO ARQUIVO', `<input type="text" value="${escapeHtml(c.file_path||'')}" placeholder="/tmp/resultado.txt" onchange="_upCfg('${step.id}','file_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('CONTEÚDO', `<textarea onchange="_upCfg('${step.id}','content',this.value)" rows="3" ${_ta()}>${escapeHtml(c.content||'{output}')}</textarea>`);
      html += _field('MODO', `<label style="display:flex;align-items:center;gap:.4rem;font-size:.8rem;cursor:pointer">
        <input type="checkbox" ${c.append?'checked':''} onchange="_upCfg('${step.id}','append',this.checked)" /> Adicionar ao final (append)
      </label>`);
      break;

    case 'list_files':
      html += _field('DIRETÓRIO', `<input type="text" value="${escapeHtml(c.directory||'.')}" placeholder="/tmp" onchange="_upCfg('${step.id}','directory',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('PADRÃO', `<input type="text" value="${escapeHtml(c.pattern||'*')}" placeholder="*.csv" onchange="_upCfg('${step.id}','pattern',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="lista_arquivos" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'delete_file':
      html += _field('CAMINHO DO ARQUIVO', `<input type="text" value="${escapeHtml(c.file_path||'')}" placeholder="/tmp/arquivo.txt" onchange="_upCfg('${step.id}','file_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += `<div style="background:#fef2f2;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#dc2626">⚠️ Esta ação é irreversível.</div>`;
      break;

    case 'http_request':
      html += _field('MÉTODO', `<select onchange="_upCfg('${step.id}','method',this.value)" ${_sel()}>
        ${['GET','POST','PUT','PATCH','DELETE'].map(m=>`<option ${m===(c.method||'GET')?'selected':''}>${m}</option>`).join('')}
      </select>`);
      html += _field('URL', `<input type="text" value="${escapeHtml(c.url||'')}" placeholder="https://api.exemplo.com/..." onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('HEADERS (chave: valor por linha)', `<textarea rows="3" placeholder="Content-Type: application/json" onchange="_upCfgHeaders('${step.id}',this.value)" ${_ta('font-family:monospace')}>${_headersToText(c.headers)}</textarea>`);
      html += _field('BODY', `<textarea rows="4" placeholder='{"chave": "{output}"}' onchange="_upCfg('${step.id}','body',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.body||'')}</textarea>`);
      html += _field('SALVAR RESPOSTA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="resposta (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('{output} {input} {varname} são substituídos na URL e no body');
      break;

    case 'parse_json':
      html += _field('JSON DE ENTRADA', `<input type="text" value="${escapeHtml(c.json_input||'{output}')}" placeholder="{output}" onchange="_upCfg('${step.id}','json_input',this.value)" ${_inp()} />`);
      html += _field('CAMINHO DA CHAVE', `<input type="text" value="${escapeHtml(c.key_path||'')}" placeholder='data.items.0.name (vazio = tudo)' onchange="_upCfg('${step.id}','key_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="campo (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'send_email':
      html += _field('PARA (email)', `<input type="text" value="${escapeHtml(c.to||'')}" placeholder="destino@email.com" onchange="_upCfg('${step.id}','to',this.value)" ${_inp()} />`);
      html += _field('ASSUNTO', `<input type="text" value="${escapeHtml(c.subject||'')}" placeholder="Assunto do email" onchange="_upCfg('${step.id}','subject',this.value)" ${_inp()} />`);
      html += _field('CORPO', `<textarea rows="5" placeholder="Conteúdo do email... Usa {output} {input}" onchange="_upCfg('${step.id}','email_body',this.value)" ${_ta()}>${escapeHtml(c.email_body||'')}</textarea>`);
      html += _field('FORMATO', `<label style="display:flex;align-items:center;gap:.4rem;font-size:.8rem;cursor:pointer">
        <input type="checkbox" ${c.is_html?'checked':''} onchange="_upCfg('${step.id}','is_html',this.checked)" /> Corpo em HTML
      </label>`);
      html += _hint('Usa o Brevo (API key configurada no servidor)');
      break;

    case 'run_command':
      html += _field('COMANDO SHELL', `<input type="text" value="${escapeHtml(c.command||'')}" placeholder='echo "hello" ou python script.py' onchange="_upCfg('${step.id}','command',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR SAÍDA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="stdout (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('{output} {input} são substituídos no comando. Timeout: 30s.');
      break;

    case 'run_python':
      html += _field('CÓDIGO PYTHON', `<textarea rows="8" placeholder="# {output} e {input} disponíveis\nresult = output.upper()\nprint(result)" onchange="_upCfg('${step.id}','code',this.value)" ${_ta('font-family:monospace;font-size:.78rem;line-height:1.6')}>${escapeHtml(c.code||'')}</textarea>`);
      html += _field('VARIÁVEL DE RETORNO', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="result (vazio = captura print())" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp('font-family:monospace')} />`);
      html += _hint('output e input_data disponíveis. Defina a variável de retorno e nomeie ela acima.');
      break;

    case 'call_ai_agent':
      html += _field('AGENTE IA', `<select onchange="_upCfg('${step.id}','agent_id',this.value)" ${_sel()}>
        <option value="">Selecione um agente...</option>
        ${_buildAIAgents.map(a=>`<option value="${a.id}" ${a.id===c.agent_id?'selected':''}>${escapeHtml(a.name)}</option>`).join('')}
      </select>`);
      html += _field('INPUT TEMPLATE', `<input type="text" value="${escapeHtml(c.input_template||'{output}')}" placeholder="{output}" onchange="_upCfg('${step.id}','input_template',this.value)" ${_inp()} />`);
      html += _field('SALVAR RESPOSTA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="resposta_ia (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'call_pipeline':
      html += _field('PIPELINE', `<select onchange="_upCfg('${step.id}','pipeline_id',this.value)" ${_sel()}>
        <option value="">Selecione uma pipeline...</option>
        ${_buildPipelines.map(p=>`<option value="${p.id}" ${p.id===c.pipeline_id?'selected':''}>${escapeHtml(p.name)}</option>`).join('')}
      </select>`);
      html += _field('INPUT TEMPLATE', `<input type="text" value="${escapeHtml(c.input_template||'{output}')}" placeholder="{output}" onchange="_upCfg('${step.id}','input_template',this.value)" ${_inp()} />`);
      html += _field('SALVAR SAÍDA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="saida_pipe (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'text_transform':
      html += _field('TEXTO DE ENTRADA', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('OPERAÇÃO', `<select onchange="_upCfg('${step.id}','operation',this.value)" ${_sel()}>
        ${[['upper','Maiúsculas'],['lower','Minúsculas'],['strip','Remover espaços (strip)'],
           ['replace','Substituir texto'],['count_chars','Contar caracteres'],['count_words','Contar palavras'],
           ['split','Dividir (split)'],['regex','Extrair via Regex'],
           ['base64_encode','Codificar Base64'],['base64_decode','Decodificar Base64']]
          .map(([v,l])=>`<option value="${v}" ${v===c.operation?'selected':''}>${l}</option>`).join('')}
      </select>`);
      if (['replace','split','regex'].includes(c.operation||'upper')) {
        html += _field(c.operation==='replace'?'BUSCAR':'PADRÃO / DELIMITADOR', `<input type="text" value="${escapeHtml(c.search||'')}" onchange="_upCfg('${step.id}','search',this.value)" ${_inp('font-family:monospace')} />`);
        if (c.operation === 'replace')
          html += _field('SUBSTITUIR POR', `<input type="text" value="${escapeHtml(c.replace_with||'')}" onchange="_upCfg('${step.id}','replace_with',this.value)" ${_inp()} />`);
      }
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="texto_transformado (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'browser': {
      const actions = c.browser_actions || [];
      const actTypes = ['open','click','type','extract','wait','screenshot','close'];
      html += _field('AÇÕES DO NAVEGADOR',
        `<div style="display:flex;flex-direction:column;gap:.4rem" id="ba-${step.id}">
          ${actions.map((a,i) => `
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:7px;padding:.45rem .5rem;display:flex;flex-direction:column;gap:.3rem">
              <div style="display:flex;gap:.3rem">
                <select onchange="_upBA('${step.id}',${i},'type',this.value)" ${_sel('flex:1')}>
                  ${actTypes.map(t=>`<option value="${t}" ${t===a.type?'selected':''}>${t}</option>`).join('')}
                </select>
                <button onclick="_removeBA('${step.id}',${i})" style="width:22px;height:22px;border:1px solid #fca5a5;border-radius:4px;background:white;cursor:pointer;color:#ef4444;font-size:.7rem;flex-shrink:0;display:flex;align-items:center;justify-content:center">✕</button>
              </div>
              ${a.type !== 'close' ? `<input type="text" value="${escapeHtml(a.target||'')}" placeholder="${a.type==='open'?'https://url.com':'seletor CSS ou #id'}" onchange="_upBA('${step.id}',${i},'target',this.value)" ${_inp('font-size:.75rem')} />` : ''}
              ${['type','extract','wait'].includes(a.type) ? `<input type="text" value="${escapeHtml(a.value||'')}" placeholder="${a.type==='type'?'Texto a digitar':a.type==='wait'?'Segundos':'Atributo (vazio=texto)'}" onchange="_upBA('${step.id}',${i},'value',this.value)" ${_inp('font-size:.75rem')} />` : ''}
              ${['extract'].includes(a.type) ? `<input type="text" value="${escapeHtml(a.variable||'')}" placeholder="variável para guardar" onchange="_upBA('${step.id}',${i},'variable',this.value)" ${_inp('font-size:.75rem')} />` : ''}
            </div>`).join('')}
          ${actions.length === 0 ? `<div style="font-size:.78rem;color:#94a3b8;text-align:center;padding:.5rem">Nenhuma ação. Clique em + Ação.</div>` : ''}
        </div>
        <button onclick="_addBA('${step.id}')" style="margin-top:.4rem;width:100%;padding:.35rem;border:1.5px dashed #94a3b8;border-radius:7px;background:transparent;cursor:pointer;font-size:.78rem;color:#64748b">+ Adicionar ação</button>`);
      html += `<div style="background:#f5f3ff;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#6d28d9">🌍 Requer worker com Playwright. O builder está disponível para modelar o fluxo.</div>`;
      break;
    }
  }

  html += `</div>`;
  panel.innerHTML = html;
}

// ─── Props helpers ────────────────────────────────────────────────

const _inp = (extra='') => `style="width:100%;padding:.38rem .6rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.8rem;outline:none;box-sizing:border-box;${extra}"`;
const _sel = (extra='') => `style="width:100%;padding:.38rem .6rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.8rem;background:white;box-sizing:border-box;${extra}"`;
const _ta  = (extra='') => `style="width:100%;padding:.38rem .6rem;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.8rem;resize:vertical;outline:none;box-sizing:border-box;font-family:inherit;${extra}"`;
const _field = (label, input) => `<div><label style="font-size:.68rem;font-weight:700;color:#64748b;display:block;margin-bottom:.25rem;letter-spacing:.03em">${label}</label>${input}</div>`;
const _hint  = (text) => `<p style="font-size:.7rem;color:#94a3b8;margin:-.25rem 0 0;line-height:1.5">${text}</p>`;

function _headersToText(headers) {
  if (!headers || typeof headers !== 'object') return '';
  return Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join('\n');
}

function _upField(id, field, value) {
  const step = _buildSteps.find(s => s.id === id);
  if (step) { step[field] = value; _renderBuilderCanvas(); }
}

function _upCfg(id, field, value) {
  const step = _buildSteps.find(s => s.id === id);
  if (step) {
    step.config = step.config || {};
    step.config[field] = value;
    _renderBuilderCanvas();
    // Re-render props for fields that affect other fields (operation, type)
    if (['operation','type','else_step_id'].includes(field)) _renderPropsPanel(step);
  }
}

function _upCfgHeaders(id, raw) {
  const h = {};
  raw.split('\n').forEach(line => {
    const i = line.indexOf(':');
    if (i > 0) h[line.substring(0, i).trim()] = line.substring(i + 1).trim();
  });
  _upCfg(id, 'headers', h);
}

function _addBA(stepId) {
  const step = _buildSteps.find(s => s.id === stepId);
  if (!step) return;
  step.config.browser_actions = step.config.browser_actions || [];
  step.config.browser_actions.push({ type: 'open', target: '', value: '', variable: '' });
  _renderPropsPanel(step); _renderBuilderCanvas();
}

function _removeBA(stepId, idx) {
  const step = _buildSteps.find(s => s.id === stepId);
  if (!step) return;
  step.config.browser_actions.splice(idx, 1);
  _renderPropsPanel(step); _renderBuilderCanvas();
}

function _upBA(stepId, idx, field, value) {
  const step = _buildSteps.find(s => s.id === stepId);
  if (!step) return;
  step.config.browser_actions[idx][field] = value;
  _renderBuilderCanvas();
  if (field === 'type') _renderPropsPanel(step);
}

// ─── Salvar ───────────────────────────────────────────────────────

async function saveBuilderAutomation() {
  const name = document.getElementById('builder-name')?.value.trim();
  if (!name) { showToast('Informe o nome da automação', 'error'); return; }

  const triggerType = document.getElementById('builder-trigger-type')?.value || 'manual';
  let schedule = '', schedule_input = '';
  if (triggerType === 'cron') {
    schedule = _buildScheduleValue();
    schedule_input = document.getElementById('builder-sched-input')?.value || '';
  }

  const payload = {
    name,
    description: document.getElementById('builder-description')?.value.trim() || '',
    trigger: { type: triggerType, schedule, schedule_input, webhook_token: _buildTrigger.webhook_token || '' },
    steps: _buildSteps,
    active: true,
    agent_id: document.getElementById('builder-agent-id')?.value || '',
  };

  try {
    const editId = document.getElementById('builder-edit-id')?.value || null;
    const saved = editId
      ? await api('PATCH', `/studio/${editId}`, payload)
      : await api('POST', '/studio', payload);

    if (saved.webhook_url) {
      document.getElementById('builder-webhook-url').textContent = saved.webhook_url;
      document.getElementById('builder-edit-id').value = saved.id;
      _buildEditId = saved.id;
      _buildTrigger.webhook_token = saved.trigger?.webhook_token || '';
    }
    showToast(editId ? 'Automação atualizada!' : 'Automação criada!', 'success');
    if (!saved.webhook_url || triggerType !== 'webhook') {
      backToStudio();
    }
  } catch (e) {
    showToast('Erro ao salvar: ' + e.message, 'error');
  }
}

// ─── Executar (modal) ─────────────────────────────────────────────

function openStudioRun(automationId) {
  _studioRunAutoId = automationId;
  const auto = _studioList.find(a => a.id === automationId);
  document.getElementById('studio-run-name').textContent = auto?.name || 'Automação';
  document.getElementById('studio-run-id').value = automationId;
  document.getElementById('studio-run-input').value = auto?.trigger?.schedule_input || '';
  document.getElementById('studio-run-result').style.display = 'none';
  document.getElementById('studio-run-steps').innerHTML = '';
  const ow = document.getElementById('studio-run-output-wrap');
  if (ow) ow.style.display = 'none';
  const btn = document.getElementById('btn-studio-exec');
  btn.disabled = false; btn.textContent = '⚡ Executar';
  document.getElementById('modal-studio-run').style.display = 'flex';
}

function openBuilderRun() {
  const name = document.getElementById('builder-name')?.value || 'Automação';
  const editId = document.getElementById('builder-edit-id')?.value;
  if (!editId) { showToast('Salve a automação antes de executar', 'error'); return; }
  openStudioRun(editId);
}

async function executeStudioRun() {
  const id = document.getElementById('studio-run-id').value;
  const input = document.getElementById('studio-run-input').value;
  const btn = document.getElementById('btn-studio-exec');
  btn.disabled = true; btn.textContent = '⏳ Executando...';

  const stepsDiv = document.getElementById('studio-run-steps');
  stepsDiv.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem;color:#64748b;font-size:.85rem"><div class="spinner" style="width:16px;height:16px"></div> Executando...</div>`;
  document.getElementById('studio-run-result').style.display = 'block';
  const ow = document.getElementById('studio-run-output-wrap');
  if (ow) ow.style.display = 'none';

  try {
    const run = await api('POST', `/studio/${id}/run`, { input });
    _renderStudioRunResult(run);
  } catch (e) {
    stepsDiv.innerHTML = `<div style="color:#ef4444;font-size:.85rem">❌ ${escapeHtml(e.message)}</div>`;
  } finally {
    btn.disabled = false; btn.textContent = '⚡ Executar';
  }
}

function _renderStudioRunResult(run) {
  const stepsDiv = document.getElementById('studio-run-steps');
  const sc = { success: '#16a34a', failed: '#ef4444', skipped: '#f59e0b' };
  const si = { success: '✓', failed: '✕', skipped: '⚠' };

  stepsDiv.innerHTML = run.steps_result.map(s => {
    const meta = ACTION_MAP[s.step_type] || { icon: '⚙', color: '#64748b' };
    const color = sc[s.status] || '#64748b';
    const isCondition = s.condition_result != null;
    return `<div style="background:white;border:1.5px solid ${s.status==='failed'?'#fca5a5':'#e2e8f0'};border-radius:10px;padding:.6rem .875rem;display:flex;flex-direction:column;gap:.35rem">
      <div style="display:flex;align-items:center;gap:.5rem">
        <span style="font-size:.95rem">${meta.icon}</span>
        <span style="font-weight:600;font-size:.82rem;color:#1e293b;flex:1">${escapeHtml(s.step_name)}</span>
        <span style="font-size:.72rem;font-weight:700;color:${color}">${si[s.status]||'?'} ${s.status.toUpperCase()}</span>
        <span style="font-size:.7rem;color:#94a3b8">${s.duration_ms}ms</span>
      </div>
      ${s.output ? `<pre style="font-size:.75rem;background:${isCondition?'#fffbeb':'#f8fafc'};border-radius:6px;padding:.35rem .55rem;margin:0;white-space:pre-wrap;word-break:break-word;max-height:120px;overflow-y:auto;color:${isCondition?'#92400e':'#334155'};font-family:inherit">${escapeHtml(s.output.substring(0, 600))}${s.output.length>600?'…':''}</pre>` : ''}
      ${s.error ? `<div style="font-size:.75rem;color:#ef4444;background:#fef2f2;border-radius:5px;padding:.2rem .5rem">❌ ${escapeHtml(s.error)}</div>` : ''}
    </div>`;
  }).join('') || `<div style="color:#94a3b8;font-size:.85rem;text-align:center;padding:.5rem">Nenhuma ação executada</div>`;

  const ow = document.getElementById('studio-run-output-wrap');
  if (ow && run.output) {
    ow.style.display = 'block';
    document.getElementById('studio-run-output-text').textContent = run.output;
  }
}

// ─── Delete / Toggle ──────────────────────────────────────────────

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
    const a = _studioList.find(x => x.id === id);
    if (a) a.active = active;
    _renderStudioTable();
  } catch (e) {
    showToast('Erro: ' + e.message, 'error');
    loadStudio();
  }
}
