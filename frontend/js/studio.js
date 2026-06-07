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
    { type: 'browser_open',       icon: '🌐', label: 'Abrir sessão',       color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_click',      icon: '👆', label: 'Clicar',             color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_type',       icon: '⌨️', label: 'Digitar',            color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_extract',    icon: '📋', label: 'Extrair texto',      color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_wait',       icon: '⏳', label: 'Aguardar elemento',  color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_screenshot', icon: '📸', label: 'Screenshot',         color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_close',      icon: '⛔', label: 'Fechar sessão',      color: '#7c3aed', bg: '#f5f3ff' },
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
let _draggedStepId = null;
let _draggedActionType = null;

// ─── Step defaults (shared) ───────────────────────────────────────
const STEP_DEFAULTS = {
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
  browser_actions: [], browser_engine: 'playwright', browser_headless: true,
  session_name: '', target: '',
};

// ─── Container helpers ────────────────────────────────────────────
const CONTAINER_TYPES = new Set(['loop_count', 'condition']);

function _branches(step) {
  return step.type === 'condition' ? ['children_true', 'children_false'] : ['children'];
}

function _findStep(id, arr) {
  for (const s of arr) {
    if (s.id === id) return s;
    if (CONTAINER_TYPES.has(s.type))
      for (const b of _branches(s)) { const f = _findStep(id, s[b] || []); if (f) return f; }
  }
  return null;
}

function _removeStep(id, arr) {
  const i = arr.findIndex(s => s.id === id);
  if (i !== -1) return arr.splice(i, 1)[0];
  for (const s of arr)
    if (CONTAINER_TYPES.has(s.type))
      for (const b of _branches(s)) { const r = _removeStep(id, s[b] || (s[b] = [])); if (r) return r; }
  return null;
}

function _countSteps(steps) {
  let n = 0;
  for (const s of steps) {
    n++;
    if (CONTAINER_TYPES.has(s.type))
      for (const b of _branches(s)) n += _countSteps(s[b] || []);
  }
  return n;
}

function _getTargetArr(containerId, branch) {
  if (!containerId) return _buildSteps;
  const c = _findStep(containerId, _buildSteps);
  if (!c) return _buildSteps;
  if (!c[branch]) c[branch] = [];
  return c[branch];
}

function _ensureContainerArrays(steps) {
  for (const s of steps) {
    if (s.type === 'loop_count') {
      if (!s.children) s.children = [];
      _ensureContainerArrays(s.children);
    }
    if (s.type === 'condition') {
      if (!s.children_true) s.children_true = [];
      if (!s.children_false) s.children_false = [];
      _ensureContainerArrays(s.children_true);
      _ensureContainerArrays(s.children_false);
    }
  }
}

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

  try {
    [_buildPipelines, _buildAIAgents, _buildAgents] = await Promise.all([
      api('GET', '/pipelines').catch(() => []),
      api('GET', '/ai-agents').catch(() => []),
      api('GET', '/agents').catch(() => []),
    ]);
  } catch (_) {}

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
      _ensureContainerArrays(_buildSteps);
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
  _clearBuilderLog();
  _initBuilderLogResize();
}

function backToStudio() {
  const topbar = document.querySelector('.topbar');
  const sidebar = document.getElementById('sidebar');
  if (topbar) topbar.style.display = '';
  if (sidebar) sidebar.style.display = '';
  navigate('studio');
}

// ─── Log Panel ────────────────────────────────────────────────────

function _initBuilderLogResize() {
  const handle = document.getElementById('builder-log-resize');
  const panel  = document.getElementById('builder-log-panel');
  if (!handle || !panel) return;
  let startY, startH;
  handle.addEventListener('mousedown', e => {
    startY = e.clientY;
    startH = panel.offsetHeight;
    e.preventDefault();
    const onMove = mv => {
      const delta = startY - mv.clientY;
      const maxH = panel.parentElement.offsetHeight * 0.85;
      panel.style.height = Math.max(48, Math.min(startH + delta, maxH)) + 'px';
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', () => document.removeEventListener('mousemove', onMove), { once: true });
  });
}

function _clearBuilderLog() {
  const el = document.getElementById('builder-log-output');
  if (el) el.innerHTML = '<span style="color:#334155">— Log limpo —</span>';
}

function _appendBuilderLog(html) {
  const el = document.getElementById('builder-log-output');
  if (!el) return;
  if (el.innerHTML.includes('Aguardando') || el.innerHTML.includes('Log limpo')) el.innerHTML = '';
  el.innerHTML += html;
  el.scrollTop = el.scrollHeight;
}

async function _runBuilderInline() {
  const editId = document.getElementById('builder-edit-id')?.value;
  if (!editId) { showToast('Salve a automação antes de executar', 'error'); return; }
  const input = document.getElementById('builder-log-input')?.value || '';

  const panel = document.getElementById('builder-log-panel');
  if (panel && panel.offsetHeight < 120) panel.style.height = '260px';

  _appendBuilderLog(`<span style="color:#64748b">[${new Date().toLocaleTimeString()}] Iniciando execução...</span>\n`);

  try {
    const run = await api('POST', `/studio/${editId}/run`, { input });
    const sc = { success: '#22c55e', failed: '#ef4444', skipped: '#f59e0b' };
    const si = { success: '✓', failed: '✗', skipped: '⚠' };
    const meta_icon = t => (ACTION_MAP[t] || { icon: '⚙' }).icon;

    run.steps_result.forEach(s => {
      const color = sc[s.status] || '#94a3b8';
      const icon  = si[s.status] || '?';
      _appendBuilderLog(
        `<span style="color:${color}">${icon} ${meta_icon(s.step_type)} ${escapeHtml(s.step_name)}</span>` +
        `<span style="color:#475569"> (${s.duration_ms}ms)</span>\n`
      );
      if (s.output) _appendBuilderLog(
        `<span style="color:#64748b">  → ${escapeHtml(s.output.replace(/\n/g,'↵ ').substring(0, 200))}${s.output.length > 200 ? '…' : ''}</span>\n`
      );
      if (s.error)  _appendBuilderLog(
        `<span style="color:#ef4444">  ✗ ${escapeHtml(s.error.substring(0, 800))}</span>\n`
      );
    });

    const finalColor = run.status === 'success' ? '#22c55e' : '#ef4444';
    _appendBuilderLog(`\n<span style="color:${finalColor};font-weight:bold">● Finalizado: ${run.status.toUpperCase()} — ${run.duration_ms}ms</span>\n`);
    if (run.output) _appendBuilderLog(
      `<span style="color:#7dd3fc">Output final: ${escapeHtml(run.output.substring(0, 400))}${run.output.length > 400 ? '…' : ''}</span>\n`
    );
  } catch (e) {
    _appendBuilderLog(`<span style="color:#ef4444">✗ Erro: ${escapeHtml(e.message)}</span>\n`);
  }
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
          draggable="true"
          ondragstart="_onPaletteDragStart(event,'${a.type}')"
          ondragend="_onPaletteDragEnd(event)"
          style="padding:.42rem .75rem .42rem 1.1rem;font-size:.8rem;cursor:grab;display:flex;align-items:center;gap:.4rem;color:#1e293b;transition:background .1s;border-bottom:1px solid #f1f5f9"
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
  const total = _countSteps(_buildSteps);
  const count = document.getElementById('builder-step-count');
  if (count) count.textContent = `${total} ação${total !== 1 ? 'ões' : ''}`;

  let html = `<div style="display:flex;flex-direction:column;align-items:center;gap:0;width:100%;max-width:540px">`;
  html += _flowBubble('INÍCIO', '#22c55e', '#f0fdf4');
  html += _renderStepList(_buildSteps, null, 'children', 0);
  html += _flowBubble('FIM', '#64748b', '#f8fafc');
  html += `</div>`;
  canvas.innerHTML = html;
}

function _renderStepList(steps, containerId, branch, depth) {
  const cid = containerId || '';
  if (steps.length === 0) {
    return `<div
      ondragover="_onZoneDragOver(event,this)"
      ondragleave="_onZoneDragLeave(event,this)"
      ondrop="_onZoneDrop(event,0,'${cid}','${branch}',this)"
      style="width:100%;border:1.5px dashed #cbd5e1;border-radius:8px;padding:${depth===0?'1.5rem':'.6rem'};text-align:center;color:#94a3b8;font-size:.78rem;transition:background .12s,border-color .12s;box-sizing:border-box;margin:${depth===0?'0':'2px 0'}">
      ${depth===0 ? 'Arraste uma ação da paleta para começar' : 'Arraste ações aqui'}
    </div>`;
  }
  let html = _zoneArrow(0, cid, branch, depth);
  steps.forEach((step, idx) => {
    html += _renderStepHtml(step, steps, idx, containerId, branch, depth);
    html += _zoneArrow(idx + 1, cid, branch, depth);
  });
  return html;
}

function _renderStepHtml(step, arr, idx, containerId, branch, depth) {
  if (CONTAINER_TYPES.has(step.type)) return _renderContainer(step, arr, idx, containerId, branch, depth);
  return _renderLeaf(step, arr, idx, containerId, branch, depth);
}

function _renderLeaf(step, arr, idx, containerId, branch, depth) {
  const meta = ACTION_MAP[step.type] || { icon: '⚙', color: '#64748b', bg: '#f8fafc' };
  const sel = step.id === _buildSelectedId;
  const isFirst = idx === 0;
  const isLast  = idx === arr.length - 1;
  const pad = depth > 0 ? '.5rem .75rem' : '.65rem .875rem';
  return `<div onclick="selectBuilderStep('${step.id}')"
    draggable="true"
    ondragstart="_onStepDragStart(event,'${step.id}',this)"
    ondragend="_onStepDragEnd(event,this)"
    style="display:flex;align-items:center;gap:.65rem;padding:${pad};background:${sel ? meta.bg : 'white'};border:2px solid ${sel ? meta.color : '#e2e8f0'};border-radius:10px;cursor:grab;width:100%;box-sizing:border-box;transition:border-color .12s,box-shadow .12s;box-shadow:${sel ? `0 0 0 3px ${meta.color}33` : '0 1px 2px rgba(0,0,0,.05)'}">
    <div style="color:#cbd5e1;font-size:.95rem;flex-shrink:0;user-select:none;line-height:1">⠿</div>
    <div style="width:${depth>0?28:32}px;height:${depth>0?28:32}px;border-radius:8px;background:${meta.bg};border:1.5px solid ${meta.color}44;display:flex;align-items:center;justify-content:center;font-size:${depth>0?'.9rem':'1rem'};flex-shrink:0">${meta.icon}</div>
    <div style="flex:1;min-width:0">
      <div style="font-weight:700;font-size:${depth>0?'.75rem':'.8rem'};color:${meta.color};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(step.name)}</div>
      <div style="font-size:.68rem;color:#64748b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${_stepBrief(step)}</div>
    </div>
    <div style="display:flex;gap:.18rem;flex-shrink:0">
      <button onclick="event.stopPropagation();moveBuilderStep('${step.id}',-1)" ${isFirst?'disabled':''} title="Mover para cima"
        style="width:20px;height:20px;border:1px solid #e2e8f0;border-radius:4px;background:white;font-size:.65rem;display:flex;align-items:center;justify-content:center;color:#64748b;cursor:${isFirst?'default':'pointer'};opacity:${isFirst?.3:1}">↑</button>
      <button onclick="event.stopPropagation();moveBuilderStep('${step.id}',1)" ${isLast?'disabled':''} title="Mover para baixo"
        style="width:20px;height:20px;border:1px solid #e2e8f0;border-radius:4px;background:white;font-size:.65rem;display:flex;align-items:center;justify-content:center;color:#64748b;cursor:${isLast?'default':'pointer'};opacity:${isLast?.3:1}">↓</button>
      <button onclick="event.stopPropagation();removeBuilderStep('${step.id}')" title="Remover"
        style="width:20px;height:20px;border:1px solid #fca5a5;border-radius:4px;background:white;cursor:pointer;font-size:.65rem;display:flex;align-items:center;justify-content:center;color:#ef4444">✕</button>
    </div>
  </div>`;
}

function _renderContainer(step, arr, idx, containerId, branch, depth) {
  const meta = ACTION_MAP[step.type] || { icon: '⚙', color: '#64748b', bg: '#f8fafc' };
  const sel = step.id === _buildSelectedId;
  const isFirst = idx === 0;
  const isLast  = idx === arr.length - 1;

  const header = `<div
    onclick="selectBuilderStep('${step.id}')"
    draggable="true"
    ondragstart="_onStepDragStart(event,'${step.id}',this)"
    ondragend="_onStepDragEnd(event,this)"
    style="display:flex;align-items:center;gap:.65rem;padding:.6rem .875rem;cursor:grab;border-radius:10px 10px 0 0;transition:background .12s">
    <div style="color:#94a3b8;font-size:.95rem;flex-shrink:0;user-select:none;line-height:1">⠿</div>
    <div style="width:30px;height:30px;border-radius:7px;background:${meta.bg};border:1.5px solid ${meta.color};display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0">${meta.icon}</div>
    <div style="flex:1;min-width:0">
      <div style="font-weight:700;font-size:.8rem;color:${meta.color};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(step.name)}</div>
      <div style="font-size:.68rem;color:#64748b">${_stepBrief(step)}</div>
    </div>
    <div style="display:flex;gap:.18rem;flex-shrink:0">
      <button onclick="event.stopPropagation();moveBuilderStep('${step.id}',-1)" ${isFirst?'disabled':''} title="Mover para cima"
        style="width:20px;height:20px;border:1px solid #e2e8f0;border-radius:4px;background:white;font-size:.65rem;display:flex;align-items:center;justify-content:center;color:#64748b;cursor:${isFirst?'default':'pointer'};opacity:${isFirst?.3:1}">↑</button>
      <button onclick="event.stopPropagation();moveBuilderStep('${step.id}',1)" ${isLast?'disabled':''} title="Mover para baixo"
        style="width:20px;height:20px;border:1px solid #e2e8f0;border-radius:4px;background:white;font-size:.65rem;display:flex;align-items:center;justify-content:center;color:#64748b;cursor:${isLast?'default':'pointer'};opacity:${isLast?.3:1}">↓</button>
      <button onclick="event.stopPropagation();removeBuilderStep('${step.id}')" title="Remover"
        style="width:20px;height:20px;border:1px solid #fca5a5;border-radius:4px;background:white;cursor:pointer;font-size:.65rem;display:flex;align-items:center;justify-content:center;color:#ef4444">✕</button>
    </div>
  </div>`;

  let body = '';
  if (step.type === 'loop_count') {
    const children = step.children || [];
    body = `<div style="border-top:1.5px solid ${meta.color}44;padding:.5rem;background:${meta.bg}55">
      <div style="font-size:.65rem;font-weight:700;color:${meta.color};opacity:.8;margin-bottom:.25rem;letter-spacing:.03em">CORPO DO LOOP (${(step.config||{}).count||3} vezes)</div>
      ${_renderStepList(children, step.id, 'children', depth + 1)}
    </div>`;
  } else if (step.type === 'condition') {
    const ct = step.children_true || [];
    const cf = step.children_false || [];
    body = `<div style="border-top:1.5px solid ${meta.color}44;display:grid;grid-template-columns:1fr 1fr;background:${meta.bg}55">
      <div style="padding:.4rem .5rem;border-right:1px solid ${meta.color}22">
        <div style="font-size:.65rem;font-weight:700;color:#16a34a;margin-bottom:.25rem;letter-spacing:.03em">✓ VERDADEIRO</div>
        ${_renderStepList(ct, step.id, 'children_true', depth + 1)}
      </div>
      <div style="padding:.4rem .5rem">
        <div style="font-size:.65rem;font-weight:700;color:#ef4444;margin-bottom:.25rem;letter-spacing:.03em">✗ FALSO</div>
        ${_renderStepList(cf, step.id, 'children_false', depth + 1)}
      </div>
    </div>`;
  }

  return `<div style="border:2px solid ${sel ? meta.color : meta.color+'55'};border-radius:12px;background:white;width:100%;box-sizing:border-box;overflow:hidden;box-shadow:${sel?`0 0 0 3px ${meta.color}33`:'0 1px 4px rgba(0,0,0,.07)'}">
    ${header}
    ${body}
  </div>`;
}

function _zoneArrow(insertIdx, cid, branch, depth) {
  const h = depth === 0 ? '26px' : '16px';
  return `<div
    ondragover="_onZoneDragOver(event,this)"
    ondragleave="_onZoneDragLeave(event,this)"
    ondrop="_onZoneDrop(event,${insertIdx},'${cid}','${branch}',this)"
    style="display:flex;flex-direction:column;align-items:center;height:${h};flex-shrink:0;box-sizing:border-box;border-radius:6px;transition:background .1s;width:100%">
    <div style="width:2px;flex:1;background:#cbd5e1;pointer-events:none"></div>
    <div style="width:0;height:0;border-left:${depth===0?5:4}px solid transparent;border-right:${depth===0?5:4}px solid transparent;border-top:${depth===0?6:5}px solid #cbd5e1;pointer-events:none"></div>
  </div>`;
}

function _flowBubble(label, color, bg) {
  return `<div style="padding:.35rem .875rem;background:${bg};border:2px solid ${color};border-radius:20px;font-size:.72rem;font-weight:700;color:${color};display:inline-block">${label}</div>`;
}

function _stepBrief(step) {
  const c = step.config || {};
  switch (step.type) {
    case 'condition': {
      const ct = (step.children_true||[]).length, cf = (step.children_false||[]).length;
      return `${c.operator||'contains'} "${(c.condition_value||'').substring(0,15)}" — ✓${ct} ✗${cf}`;
    }
    case 'loop_count': {
      const nc = (step.children||[]).length;
      return `${c.count||3}x · ${nc} ação${nc!==1?'ões':''}`;
    }
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
    case 'browser_open':       return `Abrir "${c.session_name || '...'}" (${c.browser_engine || 'playwright'}) ${c.target ? '→ ' + c.target.substring(0, 25) : ''}`;
    case 'browser_click':      return `Clicar em "${(c.target || '...').substring(0, 30)}" — sessão "${c.session_name || '...'}"`;
    case 'browser_type':       return `Digitar "${(c.value || '...').substring(0, 20)}" em "${(c.target || '...').substring(0, 20)}" — "${c.session_name || '...'}"`;
    case 'browser_extract':    return `Extrair "${(c.target || '...').substring(0, 25)}" → ${c.variable_name || 'output'} — "${c.session_name || '...'}"`;
    case 'browser_wait':       return c.target ? `Aguardar "${c.target.substring(0, 30)}" — "${c.session_name || '...'}"` : `Aguardar ${c.value || 1}s — "${c.session_name || '...'}"`;
    case 'browser_screenshot': return `Screenshot → ${c.target || 'caminho não definido'} — "${c.session_name || '...'}"`;
    case 'browser_close':      return `Fechar sessão "${c.session_name || '...'}"`;
    default: return '';
  }
}

// ─── Gerenciamento de Steps ───────────────────────────────────────

function _makeStep(type) {
  const meta = ACTION_MAP[type] || { label: type };
  const id = 'step_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const step = { id, type, name: meta.label, config: { ...STEP_DEFAULTS, browser_actions: [], headers: {} } };
  if (type === 'loop_count') step.children = [];
  if (type === 'condition') { step.children_true = []; step.children_false = []; }
  return step;
}

function addBuilderStep(type) {
  const step = _makeStep(type);
  _buildSteps.push(step);
  _buildSelectedId = step.id;
  _renderBuilderCanvas();
  _renderPropsPanel(_findStep(step.id, _buildSteps));
}

function removeBuilderStep(id) {
  _removeStep(id, _buildSteps);
  if (_buildSelectedId === id) _buildSelectedId = null;
  _renderBuilderCanvas();
  _renderPropsPanel(_buildSelectedId ? _findStep(_buildSelectedId, _buildSteps) : null);
}

function moveBuilderStep(id, dir) {
  function tryMove(arr) {
    const idx = arr.findIndex(s => s.id === id);
    if (idx !== -1) {
      const to = idx + dir;
      if (to < 0 || to >= arr.length) return false;
      [arr[idx], arr[to]] = [arr[to], arr[idx]];
      return true;
    }
    for (const s of arr)
      if (CONTAINER_TYPES.has(s.type))
        for (const b of _branches(s)) if (tryMove(s[b] || [])) return true;
    return false;
  }
  if (tryMove(_buildSteps)) _renderBuilderCanvas();
}

function selectBuilderStep(id) {
  _buildSelectedId = id;
  _renderBuilderCanvas();
  _renderPropsPanel(_findStep(id, _buildSteps));
}

function _insertStepAt(type, insertIdx, containerId, branch) {
  const step = _makeStep(type);
  _getTargetArr(containerId, branch).splice(insertIdx, 0, step);
  _buildSelectedId = step.id;
  _renderBuilderCanvas();
  _renderPropsPanel(_findStep(step.id, _buildSteps));
}

function _moveStepTo(stepId, insertIdx, containerId, branch) {
  const targetArr = _getTargetArr(containerId, branch);
  const srcIdx = targetArr.findIndex(s => s.id === stepId);
  const step = _removeStep(stepId, _buildSteps);
  if (!step) return;
  let idx = (srcIdx !== -1 && srcIdx < insertIdx) ? insertIdx - 1 : insertIdx;
  targetArr.splice(Math.min(Math.max(0, idx), targetArr.length), 0, step);
}

// ─── Drag and Drop ────────────────────────────────────────────────

function _onStepDragStart(e, id, el) {
  _draggedStepId = id;
  _draggedActionType = null;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', id);
  requestAnimationFrame(() => { el.style.opacity = '0.35'; });
}

function _onStepDragEnd(e, el) {
  el.style.opacity = '';
  _draggedStepId = null;
}

function _onPaletteDragStart(e, type) {
  _draggedActionType = type;
  _draggedStepId = null;
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', type);
}

function _onPaletteDragEnd(e) {
  _draggedActionType = null;
}

function _onZoneDragOver(e, el) {
  if (!_draggedActionType && !_draggedStepId) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = _draggedActionType ? 'copy' : 'move';
  el.style.background = _draggedActionType ? '#dcfce7' : '#dbeafe';
  el.style.borderColor = _draggedActionType ? '#86efac' : '#93c5fd';
}

function _onZoneDragLeave(e, el) {
  el.style.background = '';
  el.style.borderColor = '';
}

function _onZoneDrop(e, insertIdx, containerId, branch, el) {
  e.preventDefault();
  el.style.background = '';
  el.style.borderColor = '';
  const cid = containerId || null;
  if (_draggedActionType) {
    _insertStepAt(_draggedActionType, insertIdx, cid, branch);
    _draggedActionType = null;
  } else if (_draggedStepId) {
    _moveStepTo(_draggedStepId, insertIdx, cid, branch);
    _draggedStepId = null;
    _renderBuilderCanvas();
  }
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

  switch (step.type) {

    case 'condition':
      html += _field('OPERADOR', `<select onchange="_upCfg('${step.id}','operator',this.value)" ${_sel()}>
        ${[['contains','contém'],['not_contains','não contém'],['equals','igual a'],['not_equals','diferente de'],
           ['starts_with','começa com'],['ends_with','termina com'],['is_empty','está vazio'],['not_empty','não está vazio'],
           ['greater_than','maior que (número)'],['less_than','menor que (número)']]
          .map(([v,l])=>`<option value="${v}" ${v===c.operator?'selected':''}>${l}</option>`).join('')}
      </select>`);
      html += _field('VALOR A COMPARAR', `<input type="text" value="${escapeHtml(c.condition_value||'')}" placeholder="texto esperado no output" onchange="_upCfg('${step.id}','condition_value',this.value)" ${_inp()} />`);
      html += `<div style="background:#fffbeb;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#92400e">✓ VERDADEIRO → ações no bloco verde. ✗ FALSO → ações no bloco vermelho. Ambos continuam para a próxima ação após o bloco.</div>`;
      break;

    case 'loop_count':
      html += _field('QUANTIDADE', `<input type="number" value="${c.count||3}" min="1" max="1000" onchange="_upCfg('${step.id}','count',+this.value)" ${_inp()} />`);
      html += _field('VARIÁVEL DE ÍNDICE', `<input type="text" value="${escapeHtml(c.index_variable||'loop_index')}" placeholder="loop_index" onchange="_upCfg('${step.id}','index_variable',this.value)" ${_inp()} />`);
      html += `<div style="background:#f0fdfa;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#0f766e">Arraste ações para dentro do bloco de repetição. A variável de índice (ex: {loop_index}) começa em 0.</div>`;
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
      const engine = c.browser_engine || 'playwright';
      const actTypes = ['open','click','type','extract','wait','screenshot','close'];
      html += _field('ENGINE DE AUTOMAÇÃO', `<select onchange="_upCfg('${step.id}','browser_engine',this.value)" ${_sel()}>
        <option value="playwright" ${engine==='playwright'?'selected':''}>🎭 Playwright</option>
        <option value="selenium"   ${engine==='selenium'  ?'selected':''}>🔬 Selenium</option>
      </select>`);
      const engineHints = {
        playwright: 'Playwright — async, moderno, suporta Chromium/Firefox/WebKit. Recomendado.',
        selenium: 'Selenium — compatível com qualquer browser via WebDriver. Requer geckodriver/chromedriver.',
      };
      html += `<p style="font-size:.7rem;color:#7c3aed;margin:-.35rem 0 .1rem;line-height:1.5">ℹ️ ${engineHints[engine]}</p>`;
      const headless = c.browser_headless !== false;
      html += _field('MODO HEADLESS', `<div style="display:flex;gap:.5rem">
        <label style="display:flex;align-items:center;gap:.35rem;padding:.38rem .75rem;border:1.5px solid ${headless?'#2563eb':'#e2e8f0'};border-radius:7px;cursor:pointer;font-size:.8rem;background:${headless?'#eff6ff':'white'};flex:1;justify-content:center" onclick="_upCfg('${step.id}','browser_headless',true)">
          <span style="font-size:.95rem">🖥️</span> <span style="color:${headless?'#2563eb':'#64748b'};font-weight:${headless?'700':'400'}">Headless (true)</span>
        </label>
        <label style="display:flex;align-items:center;gap:.35rem;padding:.38rem .75rem;border:1.5px solid ${!headless?'#2563eb':'#e2e8f0'};border-radius:7px;cursor:pointer;font-size:.8rem;background:${!headless?'#eff6ff':'white'};flex:1;justify-content:center" onclick="_upCfg('${step.id}','browser_headless',false)">
          <span style="font-size:.95rem">👁️</span> <span style="color:${!headless?'#2563eb':'#64748b'};font-weight:${!headless?'700':'400'}">Visível (false)</span>
        </label>
      </div>`);
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
      break;
    }

    case 'browser_open': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _hint('Escolha um nome único para esta sessão — use o mesmo nome nos próximos passos do navegador para reaproveitar o mesmo navegador.');
      const sessEngine = c.browser_engine || 'playwright';
      html += _field('ENGINE PARA AS AÇÕES DESTA SESSÃO', `<select onchange="_upCfg('${step.id}','browser_engine',this.value)" ${_sel()}>
        <option value="playwright" ${sessEngine==='playwright'?'selected':''}>🎭 Playwright</option>
        <option value="selenium"   ${sessEngine==='selenium'  ?'selected':''}>🔬 Selenium</option>
      </select>`);
      const sessEngineHints = {
        playwright: 'Usa o Chromium instalado pelo Playwright no agente (playwright install chromium) e reconecta via CDP em cada ação. Padrão recomendado.',
        selenium: 'Usa o Google Chrome instalado no sistema do agente e reconecta via debuggerAddress do Chrome em cada ação. Totalmente independente do Playwright — requer apenas Chrome + biblioteca selenium no agente.',
      };
      html += `<p style="font-size:.7rem;color:#7c3aed;margin:-.35rem 0 .1rem;line-height:1.5">ℹ️ ${sessEngineHints[sessEngine]}</p>`;
      html += _field('URL INICIAL (opcional)', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="https://exemplo.com" onchange="_upCfg('${step.id}','target',this.value)" ${_inp()} />`);
      const headlessOpen = c.browser_headless !== false;
      html += _field('MODO HEADLESS', `<div style="display:flex;gap:.5rem">
        <label style="display:flex;align-items:center;gap:.35rem;padding:.38rem .75rem;border:1.5px solid ${headlessOpen?'#2563eb':'#e2e8f0'};border-radius:7px;cursor:pointer;font-size:.8rem;background:${headlessOpen?'#eff6ff':'white'};flex:1;justify-content:center" onclick="_upCfg('${step.id}','browser_headless',true)">
          <span style="font-size:.95rem">🖥️</span> <span style="color:${headlessOpen?'#2563eb':'#64748b'};font-weight:${headlessOpen?'700':'400'}">Headless (true)</span>
        </label>
        <label style="display:flex;align-items:center;gap:.35rem;padding:.38rem .75rem;border:1.5px solid ${!headlessOpen?'#2563eb':'#e2e8f0'};border-radius:7px;cursor:pointer;font-size:.8rem;background:${!headlessOpen?'#eff6ff':'white'};flex:1;justify-content:center" onclick="_upCfg('${step.id}','browser_headless',false)">
          <span style="font-size:.95rem">👁️</span> <span style="color:${!headlessOpen?'#2563eb':'#64748b'};font-weight:${!headlessOpen?'700':'400'}">Visível (false)</span>
        </label>
      </div>`);
      break;
    }

    case 'browser_click': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _field('SELETOR (CSS, XPATH OU OUTRO)', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="#id, .classe, //button[text()='Entrar'] ou xpath=..." onchange="_upCfg('${step.id}','target',this.value)" ${_inp('font-family:monospace')} />`);
      html += _SELECTOR_HINT;
      break;
    }

    case 'browser_type': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _field('SELETOR (CSS, XPATH OU OUTRO)', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="#id, .classe, //input[@name='user'] ou xpath=..." onchange="_upCfg('${step.id}','target',this.value)" ${_inp('font-family:monospace')} />`);
      html += _SELECTOR_HINT;
      html += _field('TEXTO A DIGITAR', `<input type="text" value="${escapeHtml(c.value||'')}" placeholder="texto ou {variavel}" onchange="_upCfg('${step.id}','value',this.value)" ${_inp()} />`);
      break;
    }

    case 'browser_extract': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _field('SELETOR (CSS, XPATH OU OUTRO)', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="#id, .classe, //span[@class='preco'] ou xpath=..." onchange="_upCfg('${step.id}','target',this.value)" ${_inp('font-family:monospace')} />`);
      html += _SELECTOR_HINT;
      html += _field('ATRIBUTO (opcional)', `<input type="text" value="${escapeHtml(c.value||'')}" placeholder="vazio = texto do elemento" onchange="_upCfg('${step.id}','value',this.value)" ${_inp()} />`);
      html += _field('SALVAR RESPOSTA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="texto_extraido (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;
    }

    case 'browser_wait': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _field('SELETOR A AGUARDAR (opcional, CSS/XPATH/OUTRO)', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="#id, .classe, //div[@id='pronto'] ou xpath=..." onchange="_upCfg('${step.id}','target',this.value)" ${_inp('font-family:monospace')} />`);
      html += _SELECTOR_HINT;
      html += _field('SEGUNDOS (se seletor vazio)', `<input type="text" value="${escapeHtml(c.value||'')}" placeholder="ex: 2" onchange="_upCfg('${step.id}','value',this.value)" ${_inp()} />`);
      html += _hint('Se um seletor for informado, aguarda o elemento aparecer; caso contrário, aguarda o número de segundos indicado.');
      break;
    }

    case 'browser_screenshot': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _field('CAMINHO DO ARQUIVO', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="ex: screenshot.png" onchange="_upCfg('${step.id}','target',this.value)" ${_inp()} />`);
      break;
    }

    case 'browser_close': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _hint('Encerra o navegador e libera os recursos da sessão. Use ao final do fluxo ou quando não precisar mais dela.');
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
const _SELECTOR_HINT = _hint('Aceita CSS (<code>#id</code>, <code>.classe</code>), XPath (comece com <code>//</code>, <code>..</code> ou <code>(</code> — detectado automaticamente) ou prefixos explícitos como <code>xpath=</code>, <code>css=</code>, <code>id=</code>, <code>name=</code>, <code>class=</code>, <code>tag=</code>, <code>link=</code>, <code>partial_link=</code> (estes últimos válidos em sessões Selenium).');

function _headersToText(headers) {
  if (!headers || typeof headers !== 'object') return '';
  return Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join('\n');
}

function _upField(id, field, value) {
  const step = _findStep(id, _buildSteps);
  if (step) { step[field] = value; _renderBuilderCanvas(); }
}

function _upCfg(id, field, value) {
  const step = _findStep(id, _buildSteps);
  if (step) {
    step.config = step.config || {};
    step.config[field] = value;
    _renderBuilderCanvas();
    if (['operation','type'].includes(field)) _renderPropsPanel(step);
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
  const step = _findStep(stepId, _buildSteps);
  if (!step) return;
  step.config.browser_actions = step.config.browser_actions || [];
  step.config.browser_actions.push({ type: 'open', target: '', value: '', variable: '' });
  _renderPropsPanel(step); _renderBuilderCanvas();
}

function _removeBA(stepId, idx) {
  const step = _findStep(stepId, _buildSteps);
  if (!step) return;
  step.config.browser_actions.splice(idx, 1);
  _renderPropsPanel(step); _renderBuilderCanvas();
}

function _upBA(stepId, idx, field, value) {
  const step = _findStep(stepId, _buildSteps);
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
  openModal('modal-studio-run');
}

function openBuilderRun() {
  _runBuilderInline();
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
