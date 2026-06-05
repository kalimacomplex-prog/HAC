// ============================================================
// Workflow Modeler – state
// ============================================================
let _wfMode = 'list';
let _wfWorkflowsList = [];
let _wfProcesses = [];
let _wfCurrent = null;         // {id?, name}
let _wfNodes = [];
let _wfEdges = [];
let _wfVariables = [];         // [{name, default_value, description}]
let _wfSelected = null;
let _wfSelectedType = null;    // 'node' | 'edge'
let _wfDragNode = null;        // {id, offX, offY}
let _wfConnecting = null;      // {sourceId, portIdx}
let _wfMousePos = {x: 0, y: 0};
let _wfPaletteType = null;

// ============================================================
// List view
// ============================================================
async function loadWorkflows() {
  _wfMode = 'list';
  _wfRenderList();
  try {
    _wfWorkflowsList = await api('GET', '/workflows') || [];
    _wfRenderList();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

function _wfRenderList() {
  const c = document.getElementById('wf-container');
  if (!c) return;

  const rows = _wfWorkflowsList.length === 0
    ? '<tr><td colspan="4" style="text-align:center;color:var(--gray-400);padding:2rem">Nenhum workflow criado</td></tr>'
    : _wfWorkflowsList.map(w => `
        <tr>
          <td><strong>${escapeHtml(w.name)}</strong></td>
          <td style="color:var(--gray-500)">${w.node_count}</td>
          <td style="color:var(--gray-500);font-size:.82rem">${formatDate(w.created_at)}</td>
          <td style="display:flex;gap:.4rem">
            <button class="btn btn-outline btn-sm" onclick="_wfOpenEditor('${w.id}')">✏ Editar</button>
            <button class="btn btn-blue btn-sm" onclick="_wfRunById('${w.id}','${escapeHtml(w.name).replace(/'/g,"\\'")}')">▶ Executar</button>
            <button class="btn btn-danger btn-sm" onclick="_wfDeleteWorkflow('${w.id}')">✕</button>
          </td>
        </tr>`).join('');

  c.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h3>Meus Workflows</h3>
        <button class="btn btn-outline btn-sm" onclick="loadWorkflows()">↻ Atualizar</button>
      </div>
      <div class="card-body">
        <table class="table">
          <thead><tr><th>Nome</th><th>Nós</th><th>Criado</th><th>Ações</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

// ============================================================
// Editor
// ============================================================
async function _wfOpenEditor(id) {
  try {
    _wfProcesses = await api('GET', '/processes') || [];
    if (id) {
      const wf = await api('GET', `/workflows/${id}`);
      if (!wf) return;
      _wfCurrent = {id: wf.id, name: wf.name};
      _wfNodes = wf.nodes || [];
      _wfEdges = wf.edges || [];
      _wfVariables = wf.variables || [];
    } else {
      _wfCurrent = {id: null, name: 'Novo Workflow'};
      _wfNodes = [];
      _wfEdges = [];
      _wfVariables = [];
    }
    _wfSelected = null;
    _wfSelectedType = null;
    _wfDragNode = null;
    _wfConnecting = null;
    _wfMode = 'editor';
    _wfRenderEditor();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

function openWorkflowEditor() {
  _wfOpenEditor(null);
}

function _wfRenderEditor() {
  const c = document.getElementById('wf-container');
  if (!c) return;

  c.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;gap:0;overflow:hidden">

      <!-- Toolbar -->
      <div style="display:flex;align-items:center;gap:.5rem;padding:.5rem .85rem;background:white;border-bottom:1px solid #e2e8f0;flex-shrink:0">
        <button class="btn btn-outline btn-sm" onclick="_wfBackToList()">← Voltar</button>
        <input id="wf-name-input" type="text" value="${escapeHtml(_wfCurrent.name)}"
          style="flex:1;font-size:.95rem;font-weight:600;border:1px solid #e2e8f0;border-radius:6px;padding:.28rem .55rem;outline:none;color:var(--gray-700)"
          oninput="_wfCurrent.name=this.value"/>
        <button class="btn btn-outline btn-sm" onclick="_wfOpenVarsModal()" title="Variáveis de fluxo">
          📋 Variáveis <span id="wf-var-badge" style="background:#3b82f6;color:white;border-radius:10px;padding:.05rem .4rem;font-size:.7rem;margin-left:.25rem">${_wfVariables.length}</span>
        </button>
        <button class="btn btn-outline btn-sm" onclick="_wfSave()">💾 Salvar</button>
        <button class="btn btn-blue btn-sm" onclick="_wfRunCurrent()">▶ Executar</button>
        <button class="btn btn-danger btn-sm" title="Excluir selecionado (Del)" onclick="_wfDeleteSelected()">🗑</button>
      </div>

      <!-- Main area -->
      <div style="display:flex;flex:1;min-height:0;overflow:hidden">

        <!-- Palette -->
        <div style="width:165px;background:#f8fafc;border-right:1px solid #e2e8f0;padding:.7rem .6rem;display:flex;flex-direction:column;gap:.35rem;flex-shrink:0;overflow-y:auto">
          <div style="font-size:.68rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.1rem">Elementos</div>
          ${_wfPaletteItem('start',       '⬤', 'Início',        '#16a34a')}
          ${_wfPaletteItem('end',         '⬤', 'Fim',           '#dc2626')}
          ${_wfPaletteItem('task',        '▭', 'Tarefa',        '#3b82f6')}
          ${_wfPaletteItem('xor_gateway', '◆', 'Gateway XOR',  '#d97706')}
          ${_wfPaletteItem('and_gateway', '◆', 'Gateway AND',  '#7c3aed')}
          <div style="font-size:.68rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.04em;margin:.6rem 0 .1rem">Como usar</div>
          <div style="font-size:.71rem;color:var(--gray-500);line-height:1.55">
            • Arraste para o canvas<br>
            • Clique para selecionar<br>
            • Porta verde → clique destino para conectar<br>
            • <kbd>Del</kbd> exclui<br>
            • <kbd>Esc</kbd> cancela conexão<br>
            • Use <code style="font-size:.68rem">{var}</code> nos parâmetros
          </div>
        </div>

        <!-- Canvas -->
        <div style="flex:1;position:relative;overflow:hidden;background:#eef2f7" id="wf-canvas-wrap">
          <svg id="wf-canvas" width="100%" height="100%"
            onmousedown="_wfOnMouseDown(event)"
            onmousemove="_wfOnMouseMove(event)"
            onmouseup="_wfOnMouseUp(event)"
            ondragover="_wfCanvasDragOver(event)"
            ondrop="_wfCanvasDrop(event)"
            style="display:block">
            <defs>
              <marker id="wf-arr" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill="#94a3b8"/>
              </marker>
              <marker id="wf-arr-sel" viewBox="0 0 10 10" refX="9" refY="5"
                markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill="#3b82f6"/>
              </marker>
            </defs>
            <g id="wf-g"></g>
          </svg>
          <div id="wf-canvas-hint" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;text-align:center;color:#94a3b8;font-size:.85rem;line-height:1.7">
            ${_wfNodes.length === 0 ? 'Arraste elementos da palette para começar' : ''}
          </div>
        </div>

        <!-- Properties panel -->
        <div id="wf-props" style="width:220px;background:#f8fafc;border-left:1px solid #e2e8f0;padding:.75rem;overflow-y:auto;flex-shrink:0;font-size:.82rem">
          <p style="color:var(--gray-400);text-align:center;margin-top:2rem">Selecione um elemento</p>
        </div>

      </div>
    </div>`;

  _wfRender();
  _wfSetupKb();
}

function _wfPaletteItem(type, icon, label, color) {
  return `<div draggable="true"
    ondragstart="_wfPaletteDragStart(event,'${type}')"
    ondragend="_wfPaletteDragEnd(event)"
    style="display:flex;align-items:center;gap:.45rem;padding:.42rem .55rem;background:white;border:1px solid #e2e8f0;border-radius:6px;cursor:grab;color:var(--gray-700);user-select:none;transition:box-shadow .1s"
    onmouseenter="this.style.boxShadow='0 2px 8px rgba(0,0,0,.09)'"
    onmouseleave="this.style.boxShadow=''">
    <span style="color:${color};font-size:.85rem;flex-shrink:0">${icon}</span>
    <span style="font-size:.8rem">${label}</span>
  </div>`;
}

function _wfBackToList() {
  _wfMode = 'list';
  _wfRemoveKb();
  document.getElementById('wf-vars-modal')?.remove();
  document.getElementById('wf-run-modal')?.remove();
  loadWorkflows();
}

// ============================================================
// SVG render
// ============================================================
function _wfRender() {
  const g = document.getElementById('wf-g');
  if (!g) return;

  let html = '';
  for (const e of _wfEdges) html += _wfRenderEdge(e);
  if (_wfConnecting) html += _wfRenderTempLine();
  for (const n of _wfNodes) html += _wfRenderNode(n);
  g.innerHTML = html;

  const hint = document.getElementById('wf-canvas-hint');
  if (hint) hint.textContent = _wfNodes.length === 0 ? 'Arraste elementos da palette para começar' : '';
}

function _wfRenderNode(node) {
  const sel = _wfSelected === node.id && _wfSelectedType === 'node';
  const showPorts = sel || !!_wfConnecting;
  let shape = '', ports = '';

  const inp = _wfInputPortPos(node);
  const out0 = _wfOutputPortPos(node, 0);
  const out1 = _wfHasSecondOutput(node) ? _wfOutputPortPos(node, 1) : null;

  if (showPorts && inp) {
    ports += `<circle cx="${inp.x}" cy="${inp.y}" r="5.5" fill="#3b82f6" stroke="white" stroke-width="1.5"
      data-port-input="1" data-node-id="${node.id}" style="cursor:crosshair"/>`;
  }
  if (showPorts && out0) {
    ports += `<circle cx="${out0.x}" cy="${out0.y}" r="5.5" fill="#16a34a" stroke="white" stroke-width="1.5"
      data-port-output="0" data-node-id="${node.id}" style="cursor:crosshair"/>`;
  }
  if (showPorts && out1) {
    ports += `<circle cx="${out1.x}" cy="${out1.y}" r="5.5" fill="#16a34a" stroke="white" stroke-width="1.5"
      data-port-output="1" data-node-id="${node.id}" style="cursor:crosshair"/>`;
  }

  switch (node.type) {
    case 'start': {
      const sc = sel ? '#3b82f6' : '#15803d';
      shape = `
        <circle cx="${node.x}" cy="${node.y}" r="26" fill="#16a34a" stroke="${sc}" stroke-width="${sel?3:2}" data-node-id="${node.id}" style="cursor:move"/>
        <text x="${node.x}" y="${node.y+5}" text-anchor="middle" font-size="11" fill="white" font-weight="600" pointer-events="none">Início</text>`;
      break;
    }
    case 'end': {
      const sc = sel ? '#3b82f6' : '#b91c1c';
      shape = `
        <circle cx="${node.x}" cy="${node.y}" r="26" fill="#dc2626" stroke="${sc}" stroke-width="3" data-node-id="${node.id}" style="cursor:move"/>
        <circle cx="${node.x}" cy="${node.y}" r="19" fill="none" stroke="white" stroke-width="2" pointer-events="none"/>
        <text x="${node.x}" y="${node.y+5}" text-anchor="middle" font-size="11" fill="white" font-weight="600" pointer-events="none">Fim</text>`;
      break;
    }
    case 'task': {
      const w = 144, h = 60;
      const sc = sel ? '#3b82f6' : '#3b82f6';
      const sw = sel ? 3 : 1.5;
      const proc = _wfProcesses.find(p => p.id === node.process_id);
      const procLabel = proc ? proc.name : (node.process_id ? '...' : '— sem processo —');
      const hasParams = node.params && Object.keys(node.params).length > 0;
      const hasOutVar = !!node.output_var;
      const badge = (hasParams || hasOutVar)
        ? `<circle cx="${node.x+w/2-8}" cy="${node.y-h/2+8}" r="6" fill="#16a34a" pointer-events="none"/>
           <text x="${node.x+w/2-8}" y="${node.y-h/2+12}" text-anchor="middle" font-size="8" fill="white" pointer-events="none">V</text>`
        : '';
      shape = `
        <rect x="${node.x-w/2}" y="${node.y-h/2}" width="${w}" height="${h}" rx="7"
          fill="white" stroke="${sc}" stroke-width="${sw}" data-node-id="${node.id}" style="cursor:move;filter:drop-shadow(0 1px 4px rgba(0,0,0,.1))"/>
        <text x="${node.x}" y="${node.y-8}" text-anchor="middle" font-size="12" fill="#1e293b" font-weight="600" pointer-events="none">${escapeHtml(node.label)}</text>
        <text x="${node.x}" y="${node.y+9}" text-anchor="middle" font-size="9.5" fill="#64748b" pointer-events="none">${escapeHtml(procLabel)}</text>
        ${badge}`;
      break;
    }
    case 'xor_gateway':
    case 'and_gateway': {
      const r = 30;
      const pts = `${node.x},${node.y-r} ${node.x+r},${node.y} ${node.x},${node.y+r} ${node.x-r},${node.y}`;
      const gColor = node.type === 'xor_gateway' ? '#d97706' : '#7c3aed';
      const sc = sel ? '#3b82f6' : gColor;
      const sym = node.type === 'xor_gateway' ? '×' : '+';
      shape = `
        <polygon points="${pts}" fill="white" stroke="${sc}" stroke-width="${sel?3:2}"
          data-node-id="${node.id}" style="cursor:move;filter:drop-shadow(0 1px 4px rgba(0,0,0,.1))"/>
        <text x="${node.x}" y="${node.y+8}" text-anchor="middle" font-size="22" fill="${gColor}" font-weight="700" pointer-events="none">${sym}</text>`;
      break;
    }
    default:
      shape = `<rect x="${node.x-40}" y="${node.y-20}" width="80" height="40" fill="#e2e8f0" data-node-id="${node.id}" style="cursor:move"/>`;
  }

  return `<g>${shape}${ports}</g>`;
}

function _wfRenderEdge(edge) {
  const src = _wfNodes.find(n => n.id === edge.source);
  const tgt = _wfNodes.find(n => n.id === edge.target);
  if (!src || !tgt) return '';

  const p1 = _wfOutputPortPos(src, edge.source_port || 0);
  const p2 = _wfInputPortPos(tgt);
  if (!p1 || !p2) return '';

  const sel = _wfSelected === edge.id && _wfSelectedType === 'edge';
  const stroke = sel ? '#3b82f6' : '#94a3b8';
  const marker = sel ? 'wf-arr-sel' : 'wf-arr';
  const dx = Math.max(50, Math.abs(p2.x - p1.x) * 0.45);
  const d = `M${p1.x} ${p1.y} C${p1.x+dx} ${p1.y} ${p2.x-dx} ${p2.y} ${p2.x} ${p2.y}`;
  const mx = (p1.x+p2.x)/2, my = (p1.y+p2.y)/2 - 8;
  const lbl = edge.label
    ? `<text x="${mx}" y="${my}" text-anchor="middle" font-size="10" fill="${stroke}" pointer-events="none"
        style="paint-order:stroke" stroke="white" stroke-width="3">${escapeHtml(edge.label)}</text>`
    : '';

  return `
    <path d="${d}" stroke="transparent" stroke-width="14" fill="none" data-edge-id="${edge.id}" style="cursor:pointer"/>
    <path d="${d}" stroke="${stroke}" stroke-width="${sel?2.5:1.8}" fill="none" marker-end="url(#${marker})" pointer-events="none"/>
    ${lbl}`;
}

function _wfRenderTempLine() {
  if (!_wfConnecting) return '';
  const src = _wfNodes.find(n => n.id === _wfConnecting.sourceId);
  if (!src) return '';
  const p1 = _wfOutputPortPos(src, _wfConnecting.portIdx || 0);
  if (!p1) return '';
  return `<line x1="${p1.x}" y1="${p1.y}" x2="${_wfMousePos.x}" y2="${_wfMousePos.y}"
    stroke="#3b82f6" stroke-width="1.8" stroke-dasharray="6 3" pointer-events="none"/>`;
}

// ============================================================
// Port geometry
// ============================================================
function _wfInputPortPos(node) {
  if (node.type === 'start') return null;
  if (node.type === 'task') return {x: node.x - 72, y: node.y};
  return {x: node.x - 30, y: node.y};
}

function _wfOutputPortPos(node, portIdx) {
  if (node.type === 'end') return null;
  if (node.type === 'task') return portIdx === 0 ? {x: node.x + 72, y: node.y} : null;
  if (node.type === 'start') return {x: node.x + 26, y: node.y};
  if (portIdx === 0) return {x: node.x + 30, y: node.y};
  if (portIdx === 1) return {x: node.x, y: node.y + 30};
  return null;
}

function _wfHasSecondOutput(node) {
  return node.type === 'xor_gateway' || node.type === 'and_gateway';
}

// ============================================================
// Mouse events
// ============================================================
function _wfOnMouseDown(e) {
  const t = e.target;

  if (t.dataset.portOutput !== undefined && t.dataset.nodeId) {
    e.stopPropagation();
    _wfConnecting = {sourceId: t.dataset.nodeId, portIdx: parseInt(t.dataset.portOutput) || 0};
    _wfMousePos = _wfPt(e);
    _wfRender();
    return;
  }

  if (t.dataset.portInput !== undefined && t.dataset.nodeId && _wfConnecting) {
    e.stopPropagation();
    if (t.dataset.nodeId !== _wfConnecting.sourceId) {
      _wfCreateEdge(_wfConnecting.sourceId, _wfConnecting.portIdx, t.dataset.nodeId);
    }
    _wfConnecting = null;
    _wfRender();
    return;
  }

  if (_wfConnecting) {
    _wfConnecting = null;
    _wfRender();
    return;
  }

  if (t.dataset.nodeId) {
    e.preventDefault();
    const id = t.dataset.nodeId;
    _wfSelected = id;
    _wfSelectedType = 'node';
    const pt = _wfPt(e);
    const node = _wfNodes.find(n => n.id === id);
    if (node) _wfDragNode = {id, offX: pt.x - node.x, offY: pt.y - node.y};
    _wfRender();
    _wfRenderProps();
    return;
  }

  if (t.dataset.edgeId) {
    _wfSelected = t.dataset.edgeId;
    _wfSelectedType = 'edge';
    _wfDragNode = null;
    _wfRender();
    _wfRenderProps();
    return;
  }

  _wfSelected = null;
  _wfSelectedType = null;
  _wfDragNode = null;
  _wfRender();
  _wfRenderProps();
}

function _wfOnMouseMove(e) {
  const pt = _wfPt(e);
  _wfMousePos = pt;
  if (_wfDragNode) {
    e.preventDefault();
    const node = _wfNodes.find(n => n.id === _wfDragNode.id);
    if (node) { node.x = Math.round(pt.x - _wfDragNode.offX); node.y = Math.round(pt.y - _wfDragNode.offY); }
    _wfRender();
    return;
  }
  if (_wfConnecting) _wfRender();
}

function _wfOnMouseUp() { _wfDragNode = null; }

function _wfPt(e) {
  const svg = document.getElementById('wf-canvas');
  if (!svg) return {x: 0, y: 0};
  const r = svg.getBoundingClientRect();
  return {x: e.clientX - r.left, y: e.clientY - r.top};
}

// ============================================================
// Palette drag → canvas drop
// ============================================================
function _wfPaletteDragStart(e, type) { _wfPaletteType = type; e.dataTransfer.effectAllowed = 'copy'; }
function _wfPaletteDragEnd()          { _wfPaletteType = null; }
function _wfCanvasDragOver(e)         { if (_wfPaletteType) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } }
function _wfCanvasDrop(e) {
  if (!_wfPaletteType) return;
  e.preventDefault();
  _wfAddNode(_wfPaletteType, _wfPt(e).x, _wfPt(e).y);
  _wfPaletteType = null;
}

// ============================================================
// Node / edge operations
// ============================================================
function _wfAddNode(type, x, y) {
  const labels = {start:'Início', end:'Fim', task:'Tarefa', xor_gateway:'Gateway XOR', and_gateway:'Gateway AND'};
  const node = {id:'n'+Date.now(), type, x, y, label:labels[type]||type, process_id:null, params:{}, output_var:''};
  _wfNodes.push(node);
  _wfSelected = node.id;
  _wfSelectedType = 'node';
  _wfRender();
  _wfRenderProps();
}

function _wfCreateEdge(sourceId, portIdx, targetId) {
  if (_wfEdges.find(e => e.source===sourceId && e.target===targetId && (e.source_port||0)===portIdx)) return;
  const edge = {id:'e'+Date.now(), source:sourceId, source_port:portIdx, target:targetId, label:''};
  _wfEdges.push(edge);
  _wfSelected = edge.id;
  _wfSelectedType = 'edge';
  _wfRender();
  _wfRenderProps();
}

function _wfDeleteSelected() {
  if (!_wfSelected) return;
  if (_wfSelectedType === 'node') {
    _wfNodes = _wfNodes.filter(n => n.id !== _wfSelected);
    _wfEdges = _wfEdges.filter(e => e.source !== _wfSelected && e.target !== _wfSelected);
  } else {
    _wfEdges = _wfEdges.filter(e => e.id !== _wfSelected);
  }
  _wfSelected = null; _wfSelectedType = null;
  _wfRender(); _wfRenderProps();
}

// ============================================================
// Properties panel
// ============================================================
function _wfRenderProps() {
  const p = document.getElementById('wf-props');
  if (!p) return;

  if (!_wfSelected) {
    p.innerHTML = '<p style="color:var(--gray-400);text-align:center;margin-top:2rem">Selecione um elemento</p>';
    return;
  }

  if (_wfSelectedType === 'node') {
    const node = _wfNodes.find(n => n.id === _wfSelected);
    if (!node) return;

    const typeLabels = {start:'Evento de Início', end:'Evento de Fim', task:'Tarefa', xor_gateway:'Gateway XOR', and_gateway:'Gateway AND'};
    let extra = '';

    if (node.type === 'task') {
      const opts = _wfProcesses.map(pr =>
        `<option value="${pr.id}" ${pr.id === node.process_id ? 'selected' : ''}>${escapeHtml(pr.name)}</option>`
      ).join('');

      const paramsJson = (node.params && Object.keys(node.params).length)
        ? JSON.stringify(node.params, null, 2)
        : '{}';

      const varHints = _wfVariables.length
        ? `<div style="margin-top:.25rem;font-size:.7rem;color:var(--gray-400)">Vars: ${_wfVariables.map(v=>`<code style="background:#f1f5f9;padding:.05rem .25rem;border-radius:3px">{${escapeHtml(v.name)}}</code>`).join(' ')}</div>`
        : '<div style="margin-top:.25rem;font-size:.7rem;color:var(--gray-400)">Crie variáveis em 📋 Variáveis</div>';

      extra = `
        <div style="margin-top:.6rem">
          <label style="font-size:.75rem;font-weight:600;color:var(--gray-600)">Processo HAC</label>
          <select style="width:100%;margin-top:.2rem;padding:.32rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.8rem"
            onchange="_wfNodeProp('${node.id}','process_id',this.value)">
            <option value="">— Selecione —</option>
            ${opts}
          </select>
        </div>
        <div style="margin-top:.6rem">
          <label style="font-size:.75rem;font-weight:600;color:var(--gray-600)">Parâmetros (JSON)</label>
          ${varHints}
          <textarea rows="5" data-params-for="${node.id}"
            style="width:100%;margin-top:.2rem;padding:.32rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.74rem;font-family:monospace;box-sizing:border-box;resize:vertical"
            onblur="_wfParamsBlur('${node.id}',this.value)">${escapeHtml(paramsJson)}</textarea>
        </div>
        <div style="margin-top:.5rem">
          <label style="font-size:.75rem;font-weight:600;color:var(--gray-600)">Variável de saída</label>
          <div style="font-size:.7rem;color:var(--gray-400);margin:.1rem 0 .2rem">O output do processo é armazenado aqui</div>
          <input type="text" value="${escapeHtml(node.output_var||'')}" placeholder="ex: resultado_etapa1"
            style="width:100%;padding:.32rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.8rem;box-sizing:border-box;font-family:monospace"
            oninput="_wfNodeProp('${node.id}','output_var',this.value)"/>
        </div>`;
    }

    p.innerHTML = `
      <div style="font-size:.68rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.4rem">Propriedades</div>
      <div style="font-size:.75rem;color:var(--gray-400);margin-bottom:.5rem">${typeLabels[node.type]||node.type}</div>
      <div>
        <label style="font-size:.75rem;font-weight:600;color:var(--gray-600)">Rótulo</label>
        <input type="text" value="${escapeHtml(node.label)}"
          style="width:100%;margin-top:.2rem;padding:.32rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.8rem;box-sizing:border-box"
          oninput="_wfNodeProp('${node.id}','label',this.value)"/>
      </div>
      ${extra}
      <button class="btn btn-danger btn-sm" style="width:100%;margin-top:1.2rem" onclick="_wfDeleteSelected()">🗑 Excluir</button>`;
    return;
  }

  if (_wfSelectedType === 'edge') {
    const edge = _wfEdges.find(e => e.id === _wfSelected);
    if (!edge) return;
    p.innerHTML = `
      <div style="font-size:.68rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.5rem">Conexão</div>
      <div>
        <label style="font-size:.75rem;font-weight:600;color:var(--gray-600)">Condição / Rótulo</label>
        <div style="font-size:.7rem;color:var(--gray-400);margin:.1rem 0 .2rem">Exibido sobre a seta. Ex: Sucesso, {resultado}=="ok"</div>
        <input type="text" value="${escapeHtml(edge.label||'')}" placeholder="ex: Sucesso, Falha..."
          style="width:100%;margin-top:.2rem;padding:.32rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.8rem;box-sizing:border-box"
          oninput="_wfEdgeProp('${edge.id}','label',this.value)"/>
      </div>
      <button class="btn btn-danger btn-sm" style="width:100%;margin-top:1.2rem" onclick="_wfDeleteSelected()">🗑 Excluir conexão</button>`;
  }
}

function _wfNodeProp(id, key, val) {
  const node = _wfNodes.find(n => n.id === id);
  if (node) { node[key] = val; _wfRender(); }
}

function _wfEdgeProp(id, key, val) {
  const edge = _wfEdges.find(e => e.id === id);
  if (edge) { edge[key] = val; _wfRender(); }
}

function _wfParamsBlur(nodeId, text) {
  try {
    const params = JSON.parse(text);
    _wfNodeProp(nodeId, 'params', params);
  } catch {
    showToast('JSON inválido nos parâmetros — verifique a sintaxe', 'error');
  }
}

// ============================================================
// Variables modal
// ============================================================
function _wfOpenVarsModal() {
  document.getElementById('wf-vars-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'wf-vars-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:flex;align-items:center;justify-content:center';
  modal.innerHTML = `
    <div style="background:white;border-radius:12px;padding:1.5rem;max-width:540px;width:92%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
        <h3 style="margin:0;font-size:1rem">📋 Variáveis de Fluxo</h3>
        <button onclick="document.getElementById('wf-vars-modal').remove()" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--gray-400)">✕</button>
      </div>
      <p style="font-size:.82rem;color:var(--gray-500);margin-bottom:1rem;line-height:1.5">
        Defina variáveis reutilizáveis. Referencie-as nos <strong>Parâmetros</strong> de tarefas com a sintaxe <code style="background:#f1f5f9;padding:.1rem .3rem;border-radius:4px">{nome}</code>.
        O valor de saída de cada tarefa pode ser capturado em <strong>Variável de saída</strong>.
      </p>
      <div id="wf-vars-list">${_wfRenderVarsList()}</div>
      <button class="btn btn-outline btn-sm" style="margin-top:.6rem" onclick="_wfAddVar()">+ Adicionar variável</button>
      <div style="display:flex;justify-content:flex-end;margin-top:1.25rem">
        <button class="btn btn-blue" onclick="_wfCloseVarsModal()">✓ Fechar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function _wfCloseVarsModal() {
  document.getElementById('wf-vars-modal')?.remove();
  // Refresh badge count
  const badge = document.getElementById('wf-var-badge');
  if (badge) badge.textContent = _wfVariables.length;
  // Refresh props panel (var hints may have changed)
  _wfRenderProps();
}

function _wfRenderVarsList() {
  if (_wfVariables.length === 0) {
    return '<p style="color:var(--gray-400);font-size:.82rem;text-align:center;padding:.75rem">Nenhuma variável definida ainda</p>';
  }
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:.3rem;font-size:.72rem;font-weight:700;color:var(--gray-400);margin-bottom:.3rem;padding:0 .2rem">
      <span>Nome</span><span>Valor padrão</span><span>Descrição</span><span></span>
    </div>
    ${_wfVariables.map((v, i) => `
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:.3rem;align-items:center;margin-bottom:.3rem">
        <input type="text" value="${escapeHtml(v.name)}" placeholder="nome_var"
          style="padding:.28rem .45rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.8rem;font-family:monospace;width:100%;box-sizing:border-box"
          oninput="_wfVarField(${i},'name',this.value)"/>
        <input type="text" value="${escapeHtml(v.default_value)}" placeholder="padrão"
          style="padding:.28rem .45rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.8rem;width:100%;box-sizing:border-box"
          oninput="_wfVarField(${i},'default_value',this.value)"/>
        <input type="text" value="${escapeHtml(v.description)}" placeholder="descrição"
          style="padding:.28rem .45rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.8rem;width:100%;box-sizing:border-box"
          oninput="_wfVarField(${i},'description',this.value)"/>
        <button onclick="_wfRemoveVar(${i})" style="background:none;border:none;cursor:pointer;color:var(--red);font-size:1rem;padding:.1rem .3rem">✕</button>
      </div>`).join('')}`;
}

function _wfAddVar() {
  _wfVariables.push({name: '', default_value: '', description: ''});
  document.getElementById('wf-vars-list').innerHTML = _wfRenderVarsList();
}

function _wfRemoveVar(i) {
  _wfVariables.splice(i, 1);
  document.getElementById('wf-vars-list').innerHTML = _wfRenderVarsList();
}

function _wfVarField(i, key, val) {
  if (_wfVariables[i]) _wfVariables[i][key] = val;
}

// ============================================================
// Save
// ============================================================
async function _wfSave() {
  const nameEl = document.getElementById('wf-name-input');
  const name = (nameEl?.value || '').trim();
  if (!name) { showToast('Informe o nome do workflow', 'error'); return; }
  _wfCurrent.name = name;

  // Sync any open params textarea before saving
  document.querySelectorAll('textarea[data-params-for]').forEach(ta => {
    const nodeId = ta.dataset.paramsFor;
    const node = _wfNodes.find(n => n.id === nodeId);
    if (node) {
      try { node.params = JSON.parse(ta.value); } catch {}
    }
  });

  const payload = {name, variables: _wfVariables, nodes: _wfNodes, edges: _wfEdges};
  try {
    let result;
    if (_wfCurrent.id) {
      result = await api('PUT', `/workflows/${_wfCurrent.id}`, payload);
    } else {
      result = await api('POST', '/workflows', payload);
      _wfCurrent.id = result.id;
    }
    showToast('Workflow salvo!', 'success');
  } catch (e) {
    showToast(e.message, 'error');
  }
}

// ============================================================
// Run – variable dialog
// ============================================================
async function _wfRunCurrent() {
  if (!_wfCurrent?.id) { showToast('Salve o workflow antes de executar', 'error'); return; }
  _wfShowRunDialog(_wfCurrent.id, _wfCurrent.name);
}

async function _wfRunById(id, name) {
  _wfShowRunDialog(id, name);
}

function _wfShowRunDialog(wfId, wfName) {
  // Collect all {var} references used in task params
  const detected = new Set();
  for (const node of _wfNodes) {
    if (node.type === 'task' && node.params) {
      const s = JSON.stringify(node.params);
      for (const m of s.matchAll(/\{(\w+)\}/g)) detected.add(m[1]);
    }
  }

  // Merge with explicitly defined variables (defined ones take priority)
  const allVars = [..._wfVariables];
  for (const name of detected) {
    if (!allVars.find(v => v.name === name)) {
      allVars.push({name, default_value: '', description: 'detectada automaticamente'});
    }
  }

  if (allVars.length === 0) {
    showConfirm(`Executar "${wfName}"`, 'Criar jobs para todas as tarefas do workflow?', () => _wfDoRun(wfId, {}));
    return;
  }

  document.getElementById('wf-run-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'wf-run-modal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:flex;align-items:center;justify-content:center';

  const varNames = allVars.map(v => v.name);
  modal.innerHTML = `
    <div style="background:white;border-radius:12px;padding:1.5rem;max-width:480px;width:92%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
        <h3 style="margin:0;font-size:1rem">▶ Executar: ${escapeHtml(wfName)}</h3>
        <button onclick="document.getElementById('wf-run-modal').remove()" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--gray-400)">✕</button>
      </div>
      <p style="font-size:.82rem;color:var(--gray-500);margin-bottom:1rem;line-height:1.5">
        Preencha os valores das variáveis de fluxo. Eles serão substituídos nos parâmetros de cada tarefa.
      </p>
      ${allVars.map(v => `
        <div style="margin-bottom:.7rem">
          <label style="font-size:.8rem;font-weight:600;color:var(--gray-700);display:block;margin-bottom:.25rem">
            <code style="background:#f1f5f9;padding:.1rem .35rem;border-radius:4px;font-size:.78rem">{${escapeHtml(v.name)}}</code>
            ${v.description ? `<span style="font-weight:400;color:var(--gray-400);font-size:.75rem"> — ${escapeHtml(v.description)}</span>` : ''}
          </label>
          <input type="text" id="wf-rv-${escapeHtml(v.name)}" value="${escapeHtml(v.default_value)}"
            style="width:100%;padding:.38rem .6rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.85rem;box-sizing:border-box"/>
        </div>`).join('')}
      <div style="display:flex;justify-content:flex-end;gap:.5rem;margin-top:1.25rem">
        <button class="btn btn-outline" onclick="document.getElementById('wf-run-modal').remove()">Cancelar</button>
        <button class="btn btn-blue" onclick="_wfConfirmRun('${wfId}',${JSON.stringify(varNames)})">▶ Executar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function _wfConfirmRun(wfId, varNames) {
  const variables = {};
  for (const name of varNames) {
    const el = document.getElementById(`wf-rv-${name}`);
    if (el) variables[name] = el.value;
  }
  document.getElementById('wf-run-modal')?.remove();
  await _wfDoRun(wfId, variables);
}

async function _wfDoRun(wfId, variables) {
  try {
    const run = await api('POST', `/workflows/${wfId}/run`, {variables});
    showToast(`Workflow iniciado! ${run.jobs_created} job(s) criados na fila.`, 'success');
  } catch (e) {
    showToast(e.message, 'error');
  }
}

// ============================================================
// Delete workflow (from list)
// ============================================================
async function _wfDeleteWorkflow(id) {
  showConfirm('Excluir Workflow', 'Deseja excluir este workflow permanentemente?', async () => {
    try {
      await api('DELETE', `/workflows/${id}`);
      showToast('Workflow excluído', 'success');
      await loadWorkflows();
    } catch (e) {
      showToast(e.message, 'error');
    }
  });
}

// ============================================================
// Keyboard shortcuts
// ============================================================
function _wfKbHandler(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (e.key === 'Delete' || e.key === 'Backspace') _wfDeleteSelected();
  if (e.key === 'Escape') { _wfConnecting = null; _wfRender(); }
}

function _wfSetupKb() {
  document.removeEventListener('keydown', _wfKbHandler);
  document.addEventListener('keydown', _wfKbHandler);
  window.removeEventListener('mouseup', _wfOnMouseUp);
  window.addEventListener('mouseup', _wfOnMouseUp);
}

function _wfRemoveKb() {
  document.removeEventListener('keydown', _wfKbHandler);
  window.removeEventListener('mouseup', _wfOnMouseUp);
}
