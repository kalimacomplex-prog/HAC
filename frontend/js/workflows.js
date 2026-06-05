// ============================================================
// Node type metadata
// ============================================================
const WF_TYPE_META = {
  // Básico
  start:       {cat:'basic',    shape:'circle',    color:'#16a34a', icon:'',    palIcon:'⬤', palLabel:'Início'},
  end:         {cat:'basic',    shape:'circle-end',color:'#dc2626', icon:'',    palIcon:'⬤', palLabel:'Fim'},
  task:        {cat:'basic',    shape:'task',      color:'#3b82f6', icon:'',    palIcon:'▭', palLabel:'Tarefa'},
  // Controle de Fluxo
  xor_gateway: {cat:'flow',     shape:'diamond',   color:'#d97706', icon:'×',   palIcon:'◆', palLabel:'Gateway XOR'},
  and_gateway: {cat:'flow',     shape:'diamond',   color:'#7c3aed', icon:'+',   palIcon:'◆', palLabel:'Gateway AND'},
  evaluation:  {cat:'flow',     shape:'diamond',   color:'#0891b2', icon:'?',   palIcon:'◆', palLabel:'Avaliação'},
  wait:        {cat:'flow',     shape:'small-rect',color:'#64748b', icon:'⏱',   palIcon:'▭', palLabel:'Aguardar'},
  result:      {cat:'flow',     shape:'small-rect',color:'#059669', icon:'↩',   palIcon:'▭', palLabel:'Resultado'},
  // Eventos
  schedule:    {cat:'event',    shape:'circle',    color:'#0d9488', icon:'CAL', palIcon:'⬤', palLabel:'Agendamento'},
  keyboard:    {cat:'event',    shape:'circle',    color:'#8b5cf6', icon:'KEY', palIcon:'⬤', palLabel:'Teclado'},
  // Condições
  window:      {cat:'condition',shape:'condition', color:'#0369a1', abbr:'WIN', palIcon:'▬', palLabel:'Janela'},
  performance: {cat:'condition',shape:'condition', color:'#c2410c', abbr:'CPU', palIcon:'▬', palLabel:'Performance'},
  idle:        {cat:'condition',shape:'condition', color:'#475569', abbr:'IDL', palIcon:'▬', palLabel:'Ociosidade'},
  event_log:   {cat:'condition',shape:'condition', color:'#92400e', abbr:'LOG', palIcon:'▬', palLabel:'Log Eventos'},
  file_system: {cat:'condition',shape:'condition', color:'#b45309', abbr:'FS',  palIcon:'▬', palLabel:'Sist. Arquivos'},
  process:     {cat:'condition',shape:'condition', color:'#0f766e', abbr:'PRC', palIcon:'▬', palLabel:'Processo'},
  logon:       {cat:'condition',shape:'condition', color:'#6d28d9', abbr:'LGN', palIcon:'▬', palLabel:'Logon'},
  service:     {cat:'condition',shape:'condition', color:'#1d4ed8', abbr:'SVC', palIcon:'▬', palLabel:'Serviço'},
  snmp_trap:   {cat:'condition',shape:'condition', color:'#be123c', abbr:'SNM', palIcon:'▬', palLabel:'SNMP Trap'},
  wmi:         {cat:'condition',shape:'condition', color:'#1e3a5f', abbr:'WMI', palIcon:'▬', palLabel:'WMI'},
};

// Port config: {input: bool, outputs: 0|1|2}
const WF_PORT = {
  start:'01', end:'10', task:'11', xor_gateway:'12', and_gateway:'12',
  evaluation:'12', wait:'11', result:'11', schedule:'01', keyboard:'01',
  window:'12', performance:'12', idle:'12', event_log:'12',
  file_system:'12', process:'12', logon:'12', service:'12',
  snmp_trap:'12', wmi:'12',
};
// helper
function _wfHasInput(type)  { return (WF_PORT[type]||'11')[0]==='1'; }
function _wfOutCount(type)  { return parseInt((WF_PORT[type]||'11')[1],10); }

// Type-specific config field specs
const WF_CONFIGS = {
  evaluation:  [
    {k:'expression', l:'Expressão', t:'textarea', ph:'{variavel} == "valor"'},
    {k:'true_label', l:'Saída verdadeiro', t:'text', ph:'Sim'},
    {k:'false_label',l:'Saída falso',      t:'text', ph:'Não'},
  ],
  wait: [
    {k:'duration', l:'Duração',  t:'number', ph:'5'},
    {k:'unit',     l:'Unidade',  t:'select', opts:['seconds:Segundos','minutes:Minutos','hours:Horas']},
  ],
  result: [
    {k:'variable', l:'Variável de captura', t:'text', ph:'resultado'},
  ],
  schedule: [
    {k:'cron',        l:'Cron expression', t:'text', ph:'0 9 * * 1-5'},
    {k:'description', l:'Descrição',       t:'text', ph:'Seg–Sex às 9h'},
  ],
  keyboard: [
    {k:'hotkey', l:'Atalho de teclado', t:'text', ph:'Ctrl+Alt+T'},
  ],
  window: [
    {k:'title', l:'Título da janela', t:'text', ph:'Notepad'},
    {k:'state', l:'Estado',           t:'select', opts:['open:Aberta','closed:Fechada','focused:Em foco']},
  ],
  performance: [
    {k:'metric',    l:'Métrica',   t:'select', opts:['cpu:CPU','memory:Memória','disk:Disco']},
    {k:'operator',  l:'Operador',  t:'select', opts:['>:maior que','<:menor que','==:igual a']},
    {k:'threshold', l:'Limite (%)',t:'number', ph:'80'},
  ],
  idle: [
    {k:'duration', l:'Tempo ocioso', t:'number', ph:'5'},
    {k:'unit',     l:'Unidade',      t:'select', opts:['minutes:Minutos','hours:Horas']},
  ],
  event_log: [
    {k:'log',      l:'Log',       t:'select', opts:['Application:Application','System:System','Security:Security']},
    {k:'source',   l:'Fonte',     t:'text', ph:'MsiInstaller'},
    {k:'event_id', l:'ID Evento', t:'text', ph:'11707'},
  ],
  file_system: [
    {k:'path',  l:'Caminho', t:'text', ph:'C:\\pasta\\arquivo.txt'},
    {k:'event', l:'Evento',  t:'select', opts:['create:Criado','modify:Modificado','delete:Excluído','exists:Existe']},
  ],
  process: [
    {k:'process_name', l:'Nome do processo', t:'text', ph:'notepad.exe'},
    {k:'state',        l:'Estado',           t:'select', opts:['running:Em execução','stopped:Parado']},
  ],
  logon: [
    {k:'username',   l:'Usuário',  t:'text', ph:'DOMAIN\\user'},
    {k:'event_type', l:'Evento',   t:'select', opts:['logon:Logon','logoff:Logoff']},
  ],
  service: [
    {k:'service_name', l:'Nome do serviço', t:'text', ph:'wuauserv'},
    {k:'state',        l:'Estado',          t:'select', opts:['running:Rodando','stopped:Parado','paused:Pausado']},
  ],
  snmp_trap: [
    {k:'community', l:'Community', t:'text', ph:'public'},
    {k:'oid',       l:'OID',       t:'text', ph:'1.3.6.1.4.1...'},
  ],
  wmi: [
    {k:'query',     l:'Query WQL', t:'textarea', ph:'SELECT * FROM Win32_Process WHERE Name="notepad.exe"'},
    {k:'namespace', l:'Namespace', t:'text',     ph:'root\\cimv2'},
  ],
};

// ============================================================
// State
// ============================================================
let _wfMode = 'list';
let _wfWorkflowsList = [];
let _wfProcesses = [];
let _wfAgents = [];
let _wfCurrent = null;
let _wfNodes = [];
let _wfEdges = [];
let _wfVariables = [];
let _wfSelected = null;
let _wfSelectedType = null;
let _wfDragNode = null;
let _wfConnecting = null;
let _wfMousePos = {x:0, y:0};
let _wfPaletteType = null;

// ============================================================
// List view
// ============================================================
async function loadWorkflows() {
  _wfMode = 'list';
  _wfRenderList();
  try {
    const [wfs, ags] = await Promise.all([api('GET', '/workflows'), api('GET', '/agents')]);
    _wfWorkflowsList = wfs || [];
    _wfAgents = ags || [];
    _wfRenderList();
  } catch (e) { showToast(e.message, 'error'); }
}

function _wfRenderList() {
  const c = document.getElementById('wf-container');
  if (!c) return;
  const rows = _wfWorkflowsList.length === 0
    ? '<tr><td colspan="4" style="text-align:center;color:var(--gray-400);padding:2rem">Nenhum workflow criado</td></tr>'
    : _wfWorkflowsList.map(w => {
        const agentName = w.agent_id ? (_wfAgents.find(a=>a.id===w.agent_id)?.name || '—') : null;
        return `<tr>
          <td>
            <strong>${escapeHtml(w.name)}</strong>
            ${agentName ? `<div style="font-size:.73rem;color:var(--gray-400);margin-top:.1rem">🤖 ${escapeHtml(agentName)}</div>` : ''}
          </td>
          <td style="color:var(--gray-500)">${w.node_count}</td>
          <td style="color:var(--gray-500);font-size:.82rem">${formatDate(w.created_at)}</td>
          <td style="display:flex;gap:.4rem">
            <button class="btn btn-outline btn-sm" onclick="_wfOpenEditor('${w.id}')">✏ Editar</button>
            <button class="btn btn-blue btn-sm" onclick="_wfRunById('${w.id}','${escapeHtml(w.name).replace(/'/g,"\\'")}')">▶ Executar</button>
            <button class="btn btn-danger btn-sm" onclick="_wfDeleteWorkflow('${w.id}')">✕</button>
          </td></tr>`;
      }).join('');
  c.innerHTML = `<div class="card">
    <div class="card-header"><h3>Meus Workflows</h3>
      <button class="btn btn-outline btn-sm" onclick="loadWorkflows()">↻ Atualizar</button></div>
    <div class="card-body">
      <table class="table">
        <thead><tr><th>Nome</th><th>Nós</th><th>Criado</th><th>Ações</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div></div>`;
}

// ============================================================
// Editor
// ============================================================
async function _wfOpenEditor(id) {
  try {
    const [procs, ags] = await Promise.all([api('GET', '/processes'), api('GET', '/agents')]);
    _wfProcesses = procs || [];
    _wfAgents = ags || [];
    if (id) {
      const wf = await api('GET', `/workflows/${id}`);
      if (!wf) return;
      _wfCurrent = {id: wf.id, name: wf.name, agent_id: wf.agent_id || ''};
      _wfNodes = wf.nodes || [];
      _wfEdges = wf.edges || [];
      _wfVariables = wf.variables || [];
    } else {
      _wfCurrent = {id:null, name:'Novo Workflow', agent_id:''};
      _wfNodes = []; _wfEdges = []; _wfVariables = [];
    }
    _wfSelected = null; _wfSelectedType = null;
    _wfDragNode = null; _wfConnecting = null;
    _wfMode = 'editor';
    _wfRenderEditor();
  } catch (e) { showToast(e.message, 'error'); }
}

function openWorkflowEditor() { _wfOpenEditor(null); }

function _wfRenderEditor() {
  const c = document.getElementById('wf-container');
  if (!c) return;
  const agentOpts = _wfAgents.map(a =>
    `<option value="${a.id}" ${a.id===(_wfCurrent.agent_id||'')?'selected':''}>${escapeHtml(a.name)}</option>`
  ).join('');
  c.innerHTML = `
    <div style="display:flex;flex-direction:column;height:100%;overflow:hidden">
      <!-- Toolbar -->
      <div style="display:flex;align-items:center;gap:.45rem;padding:.48rem .8rem;background:white;border-bottom:1px solid #e2e8f0;flex-shrink:0">
        <button class="btn btn-outline btn-sm" onclick="_wfBackToList()">← Voltar</button>
        <input id="wf-name-input" type="text" value="${escapeHtml(_wfCurrent.name)}"
          style="flex:1;font-size:.93rem;font-weight:600;border:1px solid #e2e8f0;border-radius:6px;padding:.26rem .5rem;outline:none;color:var(--gray-700)"
          oninput="_wfCurrent.name=this.value"/>
        <select id="wf-agent-select"
          style="font-size:.81rem;padding:.26rem .5rem;border:1px solid #e2e8f0;border-radius:6px;color:var(--gray-700);max-width:148px;flex-shrink:0"
          onchange="_wfCurrent.agent_id=this.value">
          <option value="">🤖 Qualquer agente</option>
          ${agentOpts}
        </select>
        <button class="btn btn-outline btn-sm" onclick="_wfOpenVarsModal()">
          📋 Variáveis <span id="wf-var-badge" style="background:#3b82f6;color:white;border-radius:10px;padding:.05rem .4rem;font-size:.68rem;margin-left:.2rem">${_wfVariables.length}</span>
        </button>
        <button class="btn btn-outline btn-sm" onclick="_wfSave()">💾 Salvar</button>
        <button class="btn btn-blue btn-sm" onclick="_wfRunCurrent()">▶ Executar</button>
        <button class="btn btn-danger btn-sm" title="Del" onclick="_wfDeleteSelected()">🗑</button>
      </div>
      <!-- Body -->
      <div style="display:flex;flex:1;min-height:0;overflow:hidden">
        <!-- Palette -->
        <div style="width:158px;background:#f8fafc;border-right:1px solid #e2e8f0;padding:.6rem .55rem;flex-shrink:0;overflow-y:auto">
          ${_wfPaletteSection('Básico', ['start','end','task'])}
          ${_wfPaletteSection('Controle de Fluxo', ['xor_gateway','and_gateway','evaluation','wait','result'])}
          ${_wfPaletteSection('Eventos', ['schedule','keyboard'])}
          ${_wfPaletteSection('Condições', ['window','performance','idle','event_log','file_system','process','logon','service','snmp_trap','wmi'])}
          <div style="font-size:.68rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;margin:.5rem 0 .1rem">Dicas</div>
          <div style="font-size:.7rem;color:var(--gray-500);line-height:1.5">
            • Arraste para canvas<br>• Selecione → porta verde → clique destino<br>• <kbd>Del</kbd> exclui • <kbd>Esc</kbd> cancela
          </div>
        </div>
        <!-- Canvas -->
        <div id="wf-canvas-wrap" style="flex:1;overflow:auto;background:#eef2f7">
          <svg id="wf-canvas" width="4000" height="3000"
            onmousedown="_wfOnMouseDown(event)" onmousemove="_wfOnMouseMove(event)"
            onmouseup="_wfOnMouseUp(event)" ondragover="_wfCanvasDragOver(event)"
            ondrop="_wfCanvasDrop(event)" style="display:block;cursor:default">
            <defs>
              <marker id="wf-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill="#94a3b8"/></marker>
              <marker id="wf-arr-sel" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill="#3b82f6"/></marker>
            </defs>
            <g id="wf-g"></g>
          </svg>
        </div>
        <!-- Props -->
        <div id="wf-props" style="width:215px;background:#f8fafc;border-left:1px solid #e2e8f0;padding:.7rem;overflow-y:auto;flex-shrink:0;font-size:.82rem">
          <p style="color:var(--gray-400);text-align:center;margin-top:2rem">Selecione um elemento</p>
        </div>
      </div>
    </div>`;
  _wfRender();
  _wfSetupKb();
  requestAnimationFrame(_wfScrollToNodes);
}

function _wfScrollToNodes() {
  const wrap = document.getElementById('wf-canvas-wrap');
  if (!wrap) return;
  if (_wfNodes.length === 0) {
    wrap.scrollLeft = 1880; wrap.scrollTop = 1420; return;
  }
  const xs = _wfNodes.map(n => n.x);
  const ys = _wfNodes.map(n => n.y);
  wrap.scrollLeft = Math.max(0, Math.min(...xs) - 120);
  wrap.scrollTop  = Math.max(0, Math.min(...ys) - 100);
}

function _wfPaletteSection(title, types) {
  return `<div style="font-size:.67rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.04em;margin:.45rem 0 .15rem">${title}</div>
    ${types.map(t => {
      const m = WF_TYPE_META[t];
      if (!m) return '';
      return `<div draggable="true" ondragstart="_wfPaletteDragStart(event,'${t}')" ondragend="_wfPaletteDragEnd()"
        style="display:flex;align-items:center;gap:.4rem;padding:.35rem .5rem;background:white;border:1px solid #e2e8f0;border-radius:5px;cursor:grab;user-select:none;transition:box-shadow .1s;margin-bottom:.28rem"
        onmouseenter="this.style.boxShadow='0 2px 6px rgba(0,0,0,.09)'" onmouseleave="this.style.boxShadow=''">
        <span style="color:${m.color};font-size:.8rem;flex-shrink:0">${m.palIcon}</span>
        <span style="font-size:.77rem;color:var(--gray-700)">${m.palLabel}</span>
      </div>`;
    }).join('')}`;
}

function _wfBackToList() {
  _wfMode = 'list'; _wfRemoveKb();
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
  if (_wfNodes.length === 0) {
    html += `<text x="2000" y="1490" text-anchor="middle" font-size="18" fill="#cbd5e1" pointer-events="none">Arraste elementos da palette para começar</text>`;
  }
  for (const e of _wfEdges) html += _wfRenderEdge(e);
  if (_wfConnecting) html += _wfRenderTempLine();
  for (const n of _wfNodes) html += _wfRenderNode(n);
  g.innerHTML = html;
}

function _wfRenderNode(node) {
  const meta = WF_TYPE_META[node.type] || {shape:'small-rect', color:'#94a3b8', icon:'?', palLabel:node.type};
  const sel  = _wfSelected===node.id && _wfSelectedType==='node';
  const showP = sel || !!_wfConnecting;
  const color = meta.color;
  const sc    = sel ? '#3b82f6' : color;
  const sw    = sel ? 3 : (node.type==='end' ? 3 : 1.5);

  const ports = _wfRenderPorts(node, showP);
  let shape = '';

  const {x, y} = node;

  switch (meta.shape) {
    case 'circle': {
      const r = 26;
      const line1 = meta.icon ? meta.icon : meta.palLabel;
      const hasIcon = meta.icon && meta.icon.length > 0;
      shape = `
        <circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="${sc}" stroke-width="${sw}" data-node-id="${node.id}" style="cursor:move"/>
        ${hasIcon
          ? `<text x="${x}" y="${y-3}" text-anchor="middle" font-size="8" fill="white" font-weight="700" pointer-events="none">${meta.icon}</text>
             <text x="${x}" y="${y+9}" text-anchor="middle" font-size="9" fill="white" pointer-events="none">${escapeHtml(node.label)}</text>`
          : `<text x="${x}" y="${y+4}" text-anchor="middle" font-size="11" fill="white" font-weight="600" pointer-events="none">${escapeHtml(node.label)}</text>`}`;
      break;
    }
    case 'circle-end': {
      shape = `
        <circle cx="${x}" cy="${y}" r="26" fill="#dc2626" stroke="${sc}" stroke-width="3" data-node-id="${node.id}" style="cursor:move"/>
        <circle cx="${x}" cy="${y}" r="19" fill="none" stroke="white" stroke-width="2" pointer-events="none"/>
        <text x="${x}" y="${y+5}" text-anchor="middle" font-size="11" fill="white" font-weight="600" pointer-events="none">Fim</text>`;
      break;
    }
    case 'task': {
      const w=144, h=60;
      const proc = _wfProcesses.find(p => p.id===node.process_id);
      const pLabel = proc ? proc.name : (node.process_id ? '...' : '— sem processo —');
      const hasCfg = node.params && Object.keys(node.params).length > 0;
      const badge = hasCfg
        ? `<circle cx="${x+w/2-8}" cy="${y-h/2+8}" r="5.5" fill="#16a34a" pointer-events="none"/>
           <text x="${x+w/2-8}" y="${y-h/2+12}" text-anchor="middle" font-size="7.5" fill="white" pointer-events="none">V</text>`
        : '';
      shape = `
        <rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="7"
          fill="white" stroke="${sc}" stroke-width="${sw}" data-node-id="${node.id}" style="cursor:move;filter:drop-shadow(0 1px 4px rgba(0,0,0,.1))"/>
        <text x="${x}" y="${y-8}" text-anchor="middle" font-size="12" fill="#1e293b" font-weight="600" pointer-events="none">${escapeHtml(node.label)}</text>
        <text x="${x}" y="${y+9}" text-anchor="middle" font-size="9.5" fill="#64748b" pointer-events="none">${escapeHtml(pLabel)}</text>
        ${badge}`;
      break;
    }
    case 'diamond': {
      const r = 30;
      const pts = `${x},${y-r} ${x+r},${y} ${x},${y+r} ${x-r},${y}`;
      shape = `
        <polygon points="${pts}" fill="white" stroke="${sc}" stroke-width="${sw}"
          data-node-id="${node.id}" style="cursor:move;filter:drop-shadow(0 1px 4px rgba(0,0,0,.1))"/>
        <text x="${x}" y="${y+8}" text-anchor="middle" font-size="20" fill="${color}" font-weight="700" pointer-events="none">${meta.icon||'?'}</text>`;
      break;
    }
    case 'small-rect': {
      const w=124, h=46;
      shape = `
        <rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="7"
          fill="white" stroke="${sc}" stroke-width="${sw}"
          data-node-id="${node.id}" style="cursor:move;filter:drop-shadow(0 1px 4px rgba(0,0,0,.1))"/>
        <text x="${x}" y="${y-5}" text-anchor="middle" font-size="14" fill="${color}" pointer-events="none">${meta.icon}</text>
        <text x="${x}" y="${y+11}" text-anchor="middle" font-size="10" fill="#1e293b" font-weight="600" pointer-events="none">${escapeHtml(node.label)}</text>`;
      break;
    }
    case 'condition': {
      const w=150, h=52;
      const abbr = meta.abbr || '?';
      shape = `
        <rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="7"
          fill="white" stroke="${sc}" stroke-width="${sw}"
          data-node-id="${node.id}" style="cursor:move;filter:drop-shadow(0 1px 4px rgba(0,0,0,.1))"/>
        <rect x="${x-w/2+1}" y="${y-h/2+1}" width="13" height="${h-2}" rx="4"
          fill="${color}" pointer-events="none"/>
        <rect x="${x-w/2+9}" y="${y-h/2+1}" width="5" height="${h-2}"
          fill="${color}" pointer-events="none"/>
        <text x="${x-w/2+7.5}" y="${y+4}" text-anchor="middle" font-size="6" fill="white"
          transform="rotate(-90,${x-w/2+7.5},${y})" pointer-events="none">${abbr}</text>
        <text x="${x-w/2+24}" y="${y-5}" font-size="11" fill="#1e293b" font-weight="600" pointer-events="none">${escapeHtml(node.label)}</text>
        <text x="${x-w/2+24}" y="${y+10}" font-size="8.5" fill="${color}" font-weight="600" pointer-events="none">${meta.palLabel}</text>`;
      break;
    }
    default:
      shape = `<rect x="${x-40}" y="${y-20}" width="80" height="40" fill="#e2e8f0" data-node-id="${node.id}" style="cursor:move"/>`;
  }

  return `<g>${shape}${ports}</g>`;
}

function _wfRenderPorts(node, show) {
  if (!show) return '';
  let html = '';
  const inp = _wfInPort(node);
  const out0 = _wfOutPort(node, 0);
  const out1 = _wfOutPort(node, 1);
  if (inp)  html += `<circle cx="${inp.x}" cy="${inp.y}" r="5.5" fill="#3b82f6" stroke="white" stroke-width="1.5" data-port-input="1" data-node-id="${node.id}" style="cursor:crosshair"/>`;
  if (out0) html += `<circle cx="${out0.x}" cy="${out0.y}" r="5.5" fill="#16a34a" stroke="white" stroke-width="1.5" data-port-output="0" data-node-id="${node.id}" style="cursor:crosshair"/>`;
  if (out1) html += `<circle cx="${out1.x}" cy="${out1.y}" r="5.5" fill="#22c55e" stroke="white" stroke-width="1.5" data-port-output="1" data-node-id="${node.id}" style="cursor:crosshair"/>`;
  return html;
}

function _wfRenderEdge(edge) {
  const src = _wfNodes.find(n=>n.id===edge.source);
  const tgt = _wfNodes.find(n=>n.id===edge.target);
  if (!src||!tgt) return '';
  const p1 = _wfOutPort(src, edge.source_port||0);
  const p2 = _wfInPort(tgt);
  if (!p1||!p2) return '';
  const sel    = _wfSelected===edge.id && _wfSelectedType==='edge';
  const stroke = sel ? '#3b82f6' : '#94a3b8';
  const marker = sel ? 'wf-arr-sel' : 'wf-arr';
  const dx = Math.max(50, Math.abs(p2.x-p1.x)*0.45);
  const d  = `M${p1.x} ${p1.y} C${p1.x+dx} ${p1.y} ${p2.x-dx} ${p2.y} ${p2.x} ${p2.y}`;
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
  const src = _wfNodes.find(n=>n.id===_wfConnecting.sourceId);
  if (!src) return '';
  const p = _wfOutPort(src, _wfConnecting.portIdx||0);
  if (!p) return '';
  return `<line x1="${p.x}" y1="${p.y}" x2="${_wfMousePos.x}" y2="${_wfMousePos.y}"
    stroke="#3b82f6" stroke-width="1.8" stroke-dasharray="6 3" pointer-events="none"/>`;
}

// ============================================================
// Port geometry
// ============================================================
function _wfInPort(node) {
  if (!_wfHasInput(node.type)) return null;
  const m = WF_TYPE_META[node.type];
  if (!m) return {x:node.x-40, y:node.y};
  switch (m.shape) {
    case 'task':       return {x:node.x-72, y:node.y};
    case 'small-rect': return {x:node.x-62, y:node.y};
    case 'condition':  return {x:node.x-75, y:node.y};
    case 'diamond':    return {x:node.x-30, y:node.y};
    case 'circle':
    case 'circle-end': return {x:node.x-26, y:node.y};
    default:           return {x:node.x-40, y:node.y};
  }
}

function _wfOutPort(node, idx) {
  const n = _wfOutCount(node.type);
  if (n===0) return null;
  if (idx>0 && n<2) return null;
  const m = WF_TYPE_META[node.type];
  if (!m) return idx===0 ? {x:node.x+40, y:node.y} : null;
  switch (m.shape) {
    case 'task':
      return idx===0 ? {x:node.x+72, y:node.y} : null;
    case 'small-rect':
      return idx===0 ? {x:node.x+62, y:node.y} : null;
    case 'condition':
      if (idx===0) return {x:node.x+75, y:node.y};
      if (idx===1) return {x:node.x,    y:node.y+26};
      return null;
    case 'diamond':
      if (idx===0) return {x:node.x+30, y:node.y};
      if (idx===1) return {x:node.x,    y:node.y+30};
      return null;
    case 'circle':
      return idx===0 ? {x:node.x+26, y:node.y} : null;
    case 'circle-end':
      return null;
    default:
      return idx===0 ? {x:node.x+40, y:node.y} : null;
  }
}

// ============================================================
// Mouse events
// ============================================================
function _wfOnMouseDown(e) {
  const t = e.target;

  if (t.dataset.portOutput!==undefined && t.dataset.nodeId) {
    e.stopPropagation();
    _wfConnecting = {sourceId:t.dataset.nodeId, portIdx:parseInt(t.dataset.portOutput)||0};
    _wfMousePos = _wfPt(e);
    _wfRender(); return;
  }
  if (t.dataset.portInput!==undefined && t.dataset.nodeId && _wfConnecting) {
    e.stopPropagation();
    if (t.dataset.nodeId !== _wfConnecting.sourceId)
      _wfCreateEdge(_wfConnecting.sourceId, _wfConnecting.portIdx, t.dataset.nodeId);
    _wfConnecting = null; _wfRender(); return;
  }
  if (_wfConnecting) { _wfConnecting = null; _wfRender(); return; }

  if (t.dataset.nodeId) {
    e.preventDefault();
    const id = t.dataset.nodeId;
    _wfSelected = id; _wfSelectedType = 'node';
    const pt = _wfPt(e);
    const node = _wfNodes.find(n=>n.id===id);
    if (node) _wfDragNode = {id, offX:pt.x-node.x, offY:pt.y-node.y};
    _wfRender(); _wfRenderProps(); return;
  }
  if (t.dataset.edgeId) {
    _wfSelected = t.dataset.edgeId; _wfSelectedType = 'edge';
    _wfDragNode = null; _wfRender(); _wfRenderProps(); return;
  }
  _wfSelected = null; _wfSelectedType = null; _wfDragNode = null;
  _wfRender(); _wfRenderProps();
}

function _wfOnMouseMove(e) {
  const pt = _wfPt(e);
  _wfMousePos = pt;
  if (_wfDragNode) {
    e.preventDefault();
    const node = _wfNodes.find(n=>n.id===_wfDragNode.id);
    if (node) { node.x=Math.round(pt.x-_wfDragNode.offX); node.y=Math.round(pt.y-_wfDragNode.offY); }
    _wfRender(); return;
  }
  if (_wfConnecting) _wfRender();
}

function _wfOnMouseUp() { _wfDragNode = null; }

function _wfPt(e) {
  const svg = document.getElementById('wf-canvas');
  if (!svg) return {x:0, y:0};
  const r = svg.getBoundingClientRect();
  return {x: e.clientX-r.left, y: e.clientY-r.top};
}

// ============================================================
// Palette drag
// ============================================================
function _wfPaletteDragStart(e, type) { _wfPaletteType=type; e.dataTransfer.effectAllowed='copy'; }
function _wfPaletteDragEnd()           { _wfPaletteType=null; }
function _wfCanvasDragOver(e)          { if (_wfPaletteType) { e.preventDefault(); e.dataTransfer.dropEffect='copy'; } }
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
  const m = WF_TYPE_META[type] || {};
  const node = {id:'n'+Date.now(), type, x, y, label:m.palLabel||type,
                process_id:null, params:{}, output_var:'', config:{}};
  _wfNodes.push(node);
  _wfSelected = node.id; _wfSelectedType = 'node';
  _wfRender(); _wfRenderProps();
}

function _wfCreateEdge(sourceId, portIdx, targetId) {
  if (_wfEdges.find(e=>e.source===sourceId&&e.target===targetId&&(e.source_port||0)===portIdx)) return;
  const edge = {id:'e'+Date.now(), source:sourceId, source_port:portIdx, target:targetId, label:''};
  _wfEdges.push(edge);
  _wfSelected = edge.id; _wfSelectedType = 'edge';
  _wfRender(); _wfRenderProps();
}

function _wfDeleteSelected() {
  if (!_wfSelected) return;
  if (_wfSelectedType==='node') {
    _wfNodes = _wfNodes.filter(n=>n.id!==_wfSelected);
    _wfEdges = _wfEdges.filter(e=>e.source!==_wfSelected&&e.target!==_wfSelected);
  } else {
    _wfEdges = _wfEdges.filter(e=>e.id!==_wfSelected);
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
    p.innerHTML='<p style="color:var(--gray-400);text-align:center;margin-top:2rem">Selecione um elemento</p>';
    return;
  }

  if (_wfSelectedType==='node') {
    const node = _wfNodes.find(n=>n.id===_wfSelected);
    if (!node) return;
    const meta = WF_TYPE_META[node.type]||{};
    const cfg  = node.config || {};
    let extra  = '';

    // Task-specific fields
    if (node.type==='task') {
      const opts = _wfProcesses.map(pr=>
        `<option value="${pr.id}" ${pr.id===node.process_id?'selected':''}>${escapeHtml(pr.name)}</option>`
      ).join('');
      const paramsJson = (node.params&&Object.keys(node.params).length) ? JSON.stringify(node.params,null,2) : '{}';
      const varHints = _wfVariables.length
        ? `<div style="margin-top:.2rem;font-size:.7rem;color:var(--gray-400)">Vars: ${_wfVariables.map(v=>`<code style="background:#f1f5f9;padding:.05rem .2rem;border-radius:3px;font-size:.67rem">{${escapeHtml(v.name)}}</code>`).join(' ')}</div>`
        : '';
      extra = `
        <div style="margin-top:.55rem">
          <label style="font-size:.74rem;font-weight:600;color:var(--gray-600)">Processo HAC</label>
          <select style="width:100%;margin-top:.18rem;padding:.3rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.78rem"
            onchange="_wfNodeProp('${node.id}','process_id',this.value)">
            <option value="">— Selecione —</option>${opts}
          </select>
        </div>
        <div style="margin-top:.5rem">
          <label style="font-size:.74rem;font-weight:600;color:var(--gray-600)">Parâmetros (JSON)</label>
          ${varHints}
          <textarea rows="4" data-params-for="${node.id}"
            style="width:100%;margin-top:.18rem;padding:.3rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.72rem;font-family:monospace;box-sizing:border-box;resize:vertical"
            onblur="_wfParamsBlur('${node.id}',this.value)">${escapeHtml(paramsJson)}</textarea>
        </div>
        <div style="margin-top:.45rem">
          <label style="font-size:.74rem;font-weight:600;color:var(--gray-600)">Variável de saída</label>
          <input type="text" value="${escapeHtml(node.output_var||'')}" placeholder="resultado_etapa1"
            style="width:100%;margin-top:.18rem;padding:.3rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.78rem;box-sizing:border-box;font-family:monospace"
            oninput="_wfNodeProp('${node.id}','output_var',this.value)"/>
        </div>`;
    }

    // Type-specific config fields from WF_CONFIGS
    const fields = WF_CONFIGS[node.type];
    if (fields) {
      extra += fields.map(f => _wfConfigFieldHtml(node.id, f, cfg[f.k]||'')).join('');
    }

    p.innerHTML = `
      <div style="font-size:.67rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.35rem">Propriedades</div>
      <div style="font-size:.74rem;color:${meta.color||'var(--gray-400)'};font-weight:600;margin-bottom:.45rem">${meta.palLabel||node.type}</div>
      <div>
        <label style="font-size:.74rem;font-weight:600;color:var(--gray-600)">Rótulo</label>
        <input type="text" value="${escapeHtml(node.label)}"
          style="width:100%;margin-top:.18rem;padding:.3rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.78rem;box-sizing:border-box"
          oninput="_wfNodeProp('${node.id}','label',this.value)"/>
      </div>
      ${extra}
      <button class="btn btn-danger btn-sm" style="width:100%;margin-top:1.1rem" onclick="_wfDeleteSelected()">🗑 Excluir</button>`;
    return;
  }

  if (_wfSelectedType==='edge') {
    const edge = _wfEdges.find(e=>e.id===_wfSelected);
    if (!edge) return;
    p.innerHTML=`
      <div style="font-size:.67rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;letter-spacing:.04em;margin-bottom:.5rem">Conexão</div>
      <div>
        <label style="font-size:.74rem;font-weight:600;color:var(--gray-600)">Condição / Rótulo</label>
        <div style="font-size:.69rem;color:var(--gray-400);margin:.1rem 0 .18rem">Ex: Sucesso, Falha, {var}=="ok"</div>
        <input type="text" value="${escapeHtml(edge.label||'')}" placeholder="Sucesso"
          style="width:100%;margin-top:.1rem;padding:.3rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.78rem;box-sizing:border-box"
          oninput="_wfEdgeProp('${edge.id}','label',this.value)"/>
      </div>
      <button class="btn btn-danger btn-sm" style="width:100%;margin-top:1.1rem" onclick="_wfDeleteSelected()">🗑 Excluir</button>`;
  }
}

function _wfConfigFieldHtml(nodeId, f, currentVal) {
  const base = `font-size:.78rem;width:100%;margin-top:.18rem;padding:.3rem;border:1px solid #e2e8f0;border-radius:6px;box-sizing:border-box`;
  let input = '';
  if (f.t==='text' || f.t==='number') {
    input = `<input type="${f.t}" value="${escapeHtml(currentVal)}" placeholder="${f.ph||''}"
      style="${base}" oninput="_wfCfgProp('${nodeId}','${f.k}',this.value)"/>`;
  } else if (f.t==='textarea') {
    input = `<textarea rows="3" placeholder="${f.ph||''}"
      style="${base};resize:vertical;font-family:monospace;font-size:.72rem"
      oninput="_wfCfgProp('${nodeId}','${f.k}',this.value)">${escapeHtml(currentVal)}</textarea>`;
  } else if (f.t==='select') {
    const opts = f.opts.map(o => {
      const [val, lbl] = o.split(':');
      return `<option value="${val}" ${val===currentVal?'selected':''}>${lbl}</option>`;
    }).join('');
    input = `<select style="${base}" onchange="_wfCfgProp('${nodeId}','${f.k}',this.value)">${opts}</select>`;
  }
  return `<div style="margin-top:.45rem">
    <label style="font-size:.74rem;font-weight:600;color:var(--gray-600)">${f.l}</label>
    ${input}
  </div>`;
}

function _wfNodeProp(id, key, val) {
  const n = _wfNodes.find(n=>n.id===id);
  if (n) { n[key]=val; _wfRender(); }
}

function _wfEdgeProp(id, key, val) {
  const e = _wfEdges.find(e=>e.id===id);
  if (e) { e[key]=val; _wfRender(); }
}

function _wfCfgProp(nodeId, key, val) {
  const n = _wfNodes.find(n=>n.id===nodeId);
  if (n) { if (!n.config) n.config={}; n.config[key]=val; }
}

function _wfParamsBlur(nodeId, text) {
  try {
    _wfNodeProp(nodeId, 'params', JSON.parse(text));
  } catch { showToast('JSON inválido nos parâmetros', 'error'); }
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
    <div style="background:white;border-radius:12px;padding:1.4rem;max-width:540px;width:92%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.65rem">
        <h3 style="margin:0;font-size:.95rem">📋 Variáveis de Fluxo</h3>
        <button onclick="_wfCloseVarsModal()" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--gray-400)">✕</button>
      </div>
      <p style="font-size:.8rem;color:var(--gray-500);margin-bottom:.9rem;line-height:1.5">
        Use <code style="background:#f1f5f9;padding:.1rem .3rem;border-radius:4px">{nome}</code> nos parâmetros das tarefas para referenciar estas variáveis.
      </p>
      <div id="wf-vars-list">${_wfRenderVarsList()}</div>
      <button class="btn btn-outline btn-sm" style="margin-top:.5rem" onclick="_wfAddVar()">+ Adicionar variável</button>
      <div style="display:flex;justify-content:flex-end;margin-top:1.1rem">
        <button class="btn btn-blue" onclick="_wfCloseVarsModal()">✓ Fechar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

function _wfCloseVarsModal() {
  document.getElementById('wf-vars-modal')?.remove();
  const b = document.getElementById('wf-var-badge');
  if (b) b.textContent = _wfVariables.length;
  _wfRenderProps();
}

function _wfRenderVarsList() {
  if (!_wfVariables.length)
    return '<p style="color:var(--gray-400);font-size:.8rem;text-align:center;padding:.5rem">Nenhuma variável definida</p>';
  return `
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:.25rem;font-size:.7rem;font-weight:700;color:var(--gray-400);margin-bottom:.25rem;padding:0 .15rem">
      <span>Nome</span><span>Valor padrão</span><span>Descrição</span><span></span>
    </div>
    ${_wfVariables.map((v,i)=>`
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:.25rem;align-items:center;margin-bottom:.25rem">
        <input type="text" value="${escapeHtml(v.name)}" placeholder="nome"
          style="padding:.25rem .4rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.78rem;font-family:monospace;width:100%;box-sizing:border-box"
          oninput="_wfVarF(${i},'name',this.value)"/>
        <input type="text" value="${escapeHtml(v.default_value)}" placeholder="padrão"
          style="padding:.25rem .4rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.78rem;width:100%;box-sizing:border-box"
          oninput="_wfVarF(${i},'default_value',this.value)"/>
        <input type="text" value="${escapeHtml(v.description)}" placeholder="descrição"
          style="padding:.25rem .4rem;border:1px solid #e2e8f0;border-radius:5px;font-size:.78rem;width:100%;box-sizing:border-box"
          oninput="_wfVarF(${i},'description',this.value)"/>
        <button onclick="_wfRemoveVar(${i})" style="background:none;border:none;cursor:pointer;color:var(--red);font-size:1rem;padding:.1rem .25rem">✕</button>
      </div>`).join('')}`;
}

function _wfAddVar() { _wfVariables.push({name:'',default_value:'',description:''}); document.getElementById('wf-vars-list').innerHTML=_wfRenderVarsList(); }
function _wfRemoveVar(i) { _wfVariables.splice(i,1); document.getElementById('wf-vars-list').innerHTML=_wfRenderVarsList(); }
function _wfVarF(i, k, v) { if (_wfVariables[i]) _wfVariables[i][k]=v; }

// ============================================================
// Save
// ============================================================
async function _wfSave() {
  const nameEl = document.getElementById('wf-name-input');
  const name = (nameEl?.value||'').trim();
  if (!name) { showToast('Informe o nome do workflow','error'); return; }
  _wfCurrent.name = name;
  document.querySelectorAll('textarea[data-params-for]').forEach(ta=>{
    const node = _wfNodes.find(n=>n.id===ta.dataset.paramsFor);
    if (node) { try { node.params=JSON.parse(ta.value); } catch {} }
  });
  const agentEl = document.getElementById('wf-agent-select');
  if (agentEl) _wfCurrent.agent_id = agentEl.value;
  const payload = {name, agent_id: _wfCurrent.agent_id || null, variables:_wfVariables, nodes:_wfNodes, edges:_wfEdges};
  try {
    let r;
    if (_wfCurrent.id) { r = await api('PUT', `/workflows/${_wfCurrent.id}`, payload); }
    else { r = await api('POST', '/workflows', payload); _wfCurrent.id = r.id; }
    showToast('Workflow salvo!','success');
  } catch(e) { showToast(e.message,'error'); }
}

// ============================================================
// Run
// ============================================================
async function _wfRunCurrent() {
  if (!_wfCurrent?.id) { showToast('Salve o workflow antes de executar','error'); return; }
  _wfShowRunDialog(_wfCurrent.id, _wfCurrent.name);
}

async function _wfRunById(id, name) { _wfShowRunDialog(id, name); }

function _wfShowRunDialog(wfId, wfName) {
  const detected = new Set();
  for (const node of _wfNodes) {
    if (node.type==='task' && node.params) {
      for (const m of JSON.stringify(node.params).matchAll(/\{(\w+)\}/g)) detected.add(m[1]);
    }
  }
  const allVars = [..._wfVariables];
  for (const n of detected) {
    if (!allVars.find(v=>v.name===n)) allVars.push({name:n, default_value:'', description:'auto-detectada'});
  }
  if (!allVars.length) {
    showConfirm(`Executar "${wfName}"`, 'Criar jobs para todas as tarefas?', ()=>_wfDoRun(wfId,{}));
    return;
  }
  document.getElementById('wf-run-modal')?.remove();
  const modal = document.createElement('div');
  modal.id='wf-run-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:1000;display:flex;align-items:center;justify-content:center';
  const vNames = allVars.map(v=>v.name);
  modal.innerHTML=`
    <div style="background:white;border-radius:12px;padding:1.4rem;max-width:460px;width:92%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.25)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.65rem">
        <h3 style="margin:0;font-size:.95rem">▶ Executar: ${escapeHtml(wfName)}</h3>
        <button onclick="document.getElementById('wf-run-modal').remove()" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--gray-400)">✕</button>
      </div>
      <p style="font-size:.8rem;color:var(--gray-500);margin-bottom:.85rem">Preencha as variáveis de fluxo:</p>
      ${allVars.map(v=>`
        <div style="margin-bottom:.6rem">
          <label style="font-size:.78rem;font-weight:600;color:var(--gray-700);display:block;margin-bottom:.2rem">
            <code style="background:#f1f5f9;padding:.1rem .3rem;border-radius:4px;font-size:.75rem">{${escapeHtml(v.name)}}</code>
            ${v.description?`<span style="font-weight:400;color:var(--gray-400);font-size:.73rem"> — ${escapeHtml(v.description)}</span>`:''}
          </label>
          <input type="text" id="wf-rv-${escapeHtml(v.name)}" value="${escapeHtml(v.default_value)}"
            style="width:100%;padding:.35rem .55rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.82rem;box-sizing:border-box"/>
        </div>`).join('')}
      <div style="display:flex;justify-content:flex-end;gap:.5rem;margin-top:1.1rem">
        <button class="btn btn-outline" onclick="document.getElementById('wf-run-modal').remove()">Cancelar</button>
        <button class="btn btn-blue" onclick="_wfConfirmRun('${wfId}',${JSON.stringify(vNames)})">▶ Executar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function _wfConfirmRun(wfId, varNames) {
  const variables={};
  for (const n of varNames) { const el=document.getElementById(`wf-rv-${n}`); if(el) variables[n]=el.value; }
  document.getElementById('wf-run-modal')?.remove();
  await _wfDoRun(wfId, variables);
}

async function _wfDoRun(wfId, variables) {
  try {
    const r = await api('POST', `/workflows/${wfId}/run`, {variables});
    showToast(`Workflow iniciado! ${r.jobs_created} job(s) criados na fila.`, 'success');
  } catch(e) { showToast(e.message,'error'); }
}

// ============================================================
// Delete workflow
// ============================================================
async function _wfDeleteWorkflow(id) {
  showConfirm('Excluir Workflow', 'Excluir permanentemente?', async () => {
    try { await api('DELETE',`/workflows/${id}`); showToast('Excluído','success'); await loadWorkflows(); }
    catch(e) { showToast(e.message,'error'); }
  });
}

// ============================================================
// Keyboard
// ============================================================
function _wfKbHandler(e) {
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  if (e.key==='Delete'||e.key==='Backspace') _wfDeleteSelected();
  if (e.key==='Escape') { _wfConnecting=null; _wfRender(); }
}
function _wfSetupKb() {
  document.removeEventListener('keydown',_wfKbHandler);
  document.addEventListener('keydown',_wfKbHandler);
  window.removeEventListener('mouseup',_wfOnMouseUp);
  window.addEventListener('mouseup',_wfOnMouseUp);
}
function _wfRemoveKb() {
  document.removeEventListener('keydown',_wfKbHandler);
  window.removeEventListener('mouseup',_wfOnMouseUp);
}
