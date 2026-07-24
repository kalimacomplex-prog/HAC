// ─── Ícones vetoriais (substituem os antigos emojis em todo o sistema) ─
const ICONS = {
  branch: '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M6 8.2V16"/><path d="M8.2 6H14a4 4 0 0 1 4 4v3.8"/>',
  repeat: '<path d="M17 2 21 6 17 10"/><path d="M3 12V10a4 4 0 0 1 4-4h14"/><path d="M7 22 3 18 7 14"/><path d="M21 12v2a4 4 0 0 1-4 4H3"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  'clock-repeat': '<path d="M12 4a8 8 0 1 1-6.9 4"/><path d="M5 4v4h4"/><path d="M12 8v5l3 2"/>',
  'shield-alert': '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V5z"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  layers: '<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
  link: '<path d="M9 15 15 9"/><path d="M11 6l1.5-1.5a4 4 0 0 1 5.7 5.7L16.5 12"/><path d="M13 18l-1.5 1.5a4 4 0 0 1-5.7-5.7L7.5 12"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
  dice: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="8.5" r="1"/><circle cx="8.5" cy="15.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/><circle cx="12" cy="12" r="1"/>',
  message: '<path d="M4 5h16v11H8l-4 4V5z"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/>',
  calculator: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="8.01" y2="11"/><line x1="12" y1="11" x2="12.01" y2="11"/><line x1="16" y1="11" x2="16.01" y2="11"/><line x1="8" y1="15" x2="8.01" y2="15"/><line x1="12" y1="15" x2="12.01" y2="15"/><line x1="16" y1="15" x2="16.01" y2="15"/><line x1="8" y1="19" x2="16" y2="19"/>',
  'book-open': '<path d="M12 5C10 3.5 6 3 3 4v14c3-1 7-.5 9 1 2-1.5 6-2 9-1V4c-3-1-7-.5-9 1z"/><line x1="12" y1="5" x2="12" y2="19"/>',
  pencil: '<path d="M4 20l1-4 11-11 3 3-11 11-4 1z"/><line x1="14" y1="6" x2="18" y2="10"/>',
  folder: '<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z"/>',
  trash: '<line x1="4" y1="7" x2="20" y2="7"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/><path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9z"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M10.5 12.5 20 3"/><path d="M17 6l2 2"/><path d="M14 9l2 2"/>',
  info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><line x1="21" y1="21" x2="15.5" y2="15.5"/>',
  font: '<path d="M6 18 10 6h1l4 12"/><line x1="7.2" y1="14" x2="13.8" y2="14"/><path d="M16 18l2.5-6h.5L21 18"/>',
  archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8"/><line x1="10" y1="12" x2="14" y2="12"/>',
  save: '<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3"/><rect x="8" y="14" width="8" height="6"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="4" x2="9" y2="20"/>',
  'file-text': '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/><line x1="9" y1="13" x2="16" y2="13"/><line x1="9" y1="17" x2="16" y2="17"/>',
  filter: '<path d="M4 4h16l-6 8v6l-4 2v-8z"/>',
  broom: '<path d="M19 4 9 14"/><path d="M9 14l-5 5 2 2 5-5"/><path d="M13 10l4-6 3 3-6 4z"/>',
  sort: '<path d="M8 3v14"/><path d="M4 13l4 4 4-4"/><path d="M16 21V7"/><path d="M20 11l-4-4-4 4"/>',
  clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><line x1="9" y1="11" x2="15" y2="11"/><line x1="9" y1="15" x2="15" y2="15"/>',
  paperclip: '<path d="M8 12V6a4 4 0 0 1 8 0v10a2.5 2.5 0 0 1-5 0V8"/>',
  scissors: '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><line x1="7.5" y1="7.5" x2="20" y2="20"/><line x1="7.5" y1="16.5" x2="20" y2="4"/>',
  printer: '<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1"/><path d="M6 17v4h12v-4"/>',
  edit: '<path d="M4 21h16"/><path d="M6 17l1-4 9-9 3 3-9 9-4 1z"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  network: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2V12"/><path d="M12 12 6.5 17"/><path d="M12 12 17.5 17"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  sparkles: '<path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
  'id-card': '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="12" r="2"/><line x1="13" y1="10" x2="18" y2="10"/><line x1="13" y1="14" x2="18" y2="14"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 6l9 7 9-7"/>',
  phone: '<path d="M6 3h4l1.5 5-2.5 1.5a12 12 0 0 0 5.5 5.5L16 12.5l5 1.5v4a2 2 0 0 1-2 2C10.5 20.5 3.5 13.5 4 5a2 2 0 0 1 2-2z"/>',
  'map-pin': '<path d="M12 22s7-7.2 7-12a7 7 0 0 0-14 0c0 4.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.4"/>',
  dollar: '<circle cx="12" cy="12" r="9"/><path d="M12 6v12"/><path d="M15.5 9c0-1.5-1.5-2.5-3.5-2.5S8.5 7.5 8.5 9s1.5 2 3.5 2.5 3.5 1 3.5 2.5-1.5 2.5-3.5 2.5-3.5-1-3.5-2.5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
  coin: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><path d="M12 8v8"/>',
  receipt: '<path d="M6 2h12v20l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5-2 1.5z"/><line x1="8.5" y1="7" x2="15.5" y2="7"/><line x1="8.5" y1="11" x2="15.5" y2="11"/>',
  hash: '<line x1="9" y1="3" x2="7" y2="21"/><line x1="17" y1="3" x2="15" y2="21"/><line x1="4" y1="9" x2="20" y2="9"/><line x1="3" y1="15" x2="19" y2="15"/>',
  check: '<path d="M4 12l6 6L20 6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  scroll: '<path d="M6 3h12v15a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"/><path d="M6 3a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/>',
  signature: '<path d="M3 17c3-1 5-4 5-7 0-2-1-3-2-3s-2 2 0 5 6 5 9 3c1.5-1 1-3 0-3s-2 1-1 3 4 3 5 1"/>',
  ruler: '<rect x="3" y="8" width="18" height="8" rx="1"/><line x1="7" y1="8" x2="7" y2="11"/><line x1="11" y1="8" x2="11" y2="11"/><line x1="15" y1="8" x2="15" y2="11"/><line x1="19" y1="8" x2="19" y2="11"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a15 15 0 0 1 0 18"/><path d="M12 3a15 15 0 0 0 0 18"/>',
  briefcase: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="3" y1="13" x2="21" y2="13"/>',
  'arrow-down': '<line x1="12" y1="4" x2="12" y2="17"/><path d="M6 12l6 6 6-6"/>',
  'arrow-up': '<line x1="12" y1="20" x2="12" y2="7"/><path d="M6 12l6-6 6 6"/>',
  'arrow-right': '<line x1="4" y1="12" x2="19" y2="12"/><path d="M13 6l6 6-6 6"/>',
  'arrow-left': '<line x1="20" y1="12" x2="5" y2="12"/><path d="M11 6l-6 6 6 6"/>',
  newspaper: '<rect x="3" y="5" width="13" height="15" rx="1"/><path d="M16 8h5v10a2 2 0 0 1-2 2H5"/><line x1="6.5" y1="9" x2="12.5" y2="9"/><line x1="6.5" y1="12" x2="12.5" y2="12"/><line x1="6.5" y1="15" x2="10" y2="15"/>',
  rss: '<circle cx="6" cy="18" r="1.6"/><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 5a15 15 0 0 1 15 15"/>',
  sun: '<circle cx="12" cy="12" r="4.5"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.5" y1="4.5" x2="6.5" y2="6.5"/><line x1="17.5" y1="17.5" x2="19.5" y2="19.5"/><line x1="4.5" y1="19.5" x2="6.5" y2="17.5"/><line x1="17.5" y1="6.5" x2="19.5" y2="4.5"/>',
  building: '<rect x="4" y="3" width="10" height="18"/><rect x="14" y="9" width="6" height="12"/><line x1="7" y1="7" x2="7" y2="7.01"/><line x1="11" y1="7" x2="11" y2="7.01"/><line x1="7" y1="11" x2="7" y2="11.01"/><line x1="11" y1="11" x2="11" y2="11.01"/><line x1="7" y1="15" x2="7" y2="15.01"/><line x1="11" y1="15" x2="11" y2="15.01"/>',
  inbox: '<path d="M3 12h5l2 3h4l2-3h5"/><path d="M5 4h14l2 8v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6z"/>',
  'paper-plane': '<path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9z"/>',
  gamepad: '<rect x="2" y="8" width="20" height="10" rx="5"/><line x1="7" y1="11" x2="7" y2="15"/><line x1="5" y1="13" x2="9" y2="13"/><circle cx="16" cy="12" r="1"/><circle cx="18.5" cy="14.5" r="1"/>',
  bell: '<path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  'alert-triangle': '<path d="M12 3 22 20H2z"/><line x1="12" y1="9" x2="12" y2="14"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'credit-card': '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/>',
  'currency-exchange': '<path d="M4 7h13"/><path d="M13 3l4 4-4 4"/><path d="M20 17H7"/><path d="M11 21l-4-4 4-4"/>',
  bitcoin: '<circle cx="12" cy="12" r="9"/><path d="M10 7v10"/><path d="M14 7v10"/><path d="M8 8h6a2.5 2.5 0 0 1 0 5H8"/><path d="M8 13h7a2.5 2.5 0 0 1 0 5H8"/>',
  qrcode: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="14" y1="14" x2="14" y2="14.01"/><line x1="18" y1="14" x2="18" y2="14.01"/><line x1="14" y1="18" x2="14" y2="18.01"/><line x1="18" y1="18" x2="21" y2="18"/><line x1="21" y1="21" x2="21" y2="21.01"/>',
  terminal: '<polyline points="4 6 10 12 4 18"/><line x1="12" y1="18" x2="20" y2="18"/>',
  code: '<polyline points="9 6 3 12 9 18"/><polyline points="15 6 21 12 15 18"/>',
  braces: '<path d="M8 3c-2 0-3 1-3 3v4c0 1-1 2-2 2 1 0 2 1 2 2v4c0 2 1 3 3 3"/><path d="M16 3c2 0 3 1 3 3v4c0 1 1 2 2 2-1 0-2 1-2 2v4c0 2-1 3-3 3"/>',
  'bar-chart': '<line x1="6" y1="20" x2="6" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="18" y1="20" x2="18" y2="15"/>',
  plug: '<path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v4a6 6 0 0 1-12 0z"/><path d="M12 18v4"/>',
  monitor: '<rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3 3-2-2z"/>',
  'heart-pulse': '<path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-1 1.8-2.6 3.5-4.5 5.2"/><polyline points="5 12 8 12 9.5 9 11.5 15 13 12 16 12"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5h1a3 3 0 0 0 2-1"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5h-1a3 3 0 0 1-2-1"/><line x1="9" y1="4" x2="9" y2="20"/><line x1="15" y1="4" x2="15" y2="20"/>',
  dna: '<path d="M6 3c0 6 12 12 12 18"/><path d="M18 3c0 6-12 12-12 18"/><line x1="7.5" y1="7" x2="16.5" y2="7"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7.5" y1="17" x2="16.5" y2="17"/>',
  shield: '<path d="M12 2 4 5v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V5z"/>',
  versus: '<path d="M4 12h6"/><path d="M8 8l-4 4 4 4"/><path d="M20 12h-6"/><path d="M16 8l4 4-4 4"/>',
  'doc-word': '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/><path d="M8 13l1.3 6L11 14l1.7 5L14 13"/>',
  'doc-slides': '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/><rect x="8.5" y="12" width="7" height="5" rx="1"/>',
  resize: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>',
  droplet: '<path d="M12 3c4 5 7 8.5 7 12a7 7 0 0 1-14 0c0-3.5 3-7 7-12z"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5.5-5.5L9 17"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13.5" r="3.2"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2a4.5 4.5 0 0 0 4.5-4.5C21 6.4 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="9.5" cy="7.5" r="1"/><circle cx="14.5" cy="7" r="1"/><circle cx="17" cy="10.5" r="1"/>',
  film: '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="8" y1="4" x2="8" y2="9"/><line x1="15" y1="4" x2="15" y2="9"/><line x1="8" y1="15" x2="8" y2="20"/><line x1="15" y1="15" x2="15" y2="20"/>',
  music: '<circle cx="6" cy="18" r="2.5"/><circle cx="17" cy="16" r="2.5"/><path d="M8.5 18V5.5L19.5 3v12.5"/>',
  speaker: '<polygon points="4 9 8 9 12 5 12 19 8 15 4 15"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M18.5 6.5a9 9 0 0 1 0 11"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/>',
  'mouse-pointer': '<path d="M4 3l7 17 2-7 7-2z"/>',
  keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6" y2="10.01"/><line x1="10" y1="10" x2="10" y2="10.01"/><line x1="14" y1="10" x2="14" y2="10.01"/><line x1="18" y1="10" x2="18" y2="10.01"/><line x1="7" y1="14" x2="17" y2="14"/>',
  stop: '<circle cx="12" cy="12" r="9"/><rect x="9" y="9" width="6" height="6"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  wallet: '<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="17" cy="14" r="1.3"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.2.6.7 1 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z"/>',
  robot: '<rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="9" cy="14" r="1.3"/><circle cx="15" cy="14" r="1.3"/><line x1="12" y1="5" x2="12" y2="9"/><circle cx="12" cy="3.3" r="1.3"/><line x1="3" y1="13" x2="5" y2="13"/><line x1="19" y1="13" x2="21" y2="13"/>',
  ban: '<circle cx="12" cy="12" r="9"/><line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/>',
  play: '<polygon points="6 3 20 12 6 21"/>',
  'play-forward': '<polygon points="4 4 14 12 4 20"/><line x1="18" y1="4" x2="18" y2="20"/>',
  paste: '<rect x="6" y="4" width="12" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 12h6"/><path d="M9 16h6"/>',
  zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  cloud: '<path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.4-2A5 5 0 0 0 6 19h11.5z"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  flask: '<path d="M9 3h6"/><path d="M10 3v6.5L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V3"/><line x1="8.5" y1="14" x2="15.5" y2="14"/>',
  mask: '<path d="M12 3c-3 0-5 2-5 5 0 2 1 3 1 5 0 3-2 4-2 4h12s-2-1-2-4c0-2 1-3 1-5 0-3-2-5-5-5z"/><circle cx="9.5" cy="9" r=".8"/><circle cx="14.5" cy="9" r=".8"/><path d="M9.5 13c1 1 4 1 5 0"/>',
  home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/>',
  shuffle: '<polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/>',
  windows: '<rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/>',
  package: '<path d="M21 8 12 3 3 8v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5"/><path d="M12 13v8"/><path d="M7 5.5 16 10.5"/>',
};

function _icon(key, size, color) {
  size = size || 16;
  const inner = ICONS[key] || ICONS.gear;
  const stroke = color || 'currentColor';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;flex-shrink:0">${inner}</svg>`;
}

// Navegadores (Chrome/Edge no Windows) não aplicam a cor do <option> selecionado
// ao campo fechado do <select> — só dentro da lista aberta. Copia manualmente.
function _syncSelectColor(selectEl) {
  const opt = selectEl.options[selectEl.selectedIndex];
  if (opt) selectEl.style.color = opt.style.color || '';
}

function showConfirm(title, message, onConfirm) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').textContent = message;
  const btn = document.getElementById('confirm-btn-ok');
  btn.onclick = () => { closeModal('modal-confirm'); onConfirm(); };
  openModal('modal-confirm');
}

function copyId(id) {
  navigator.clipboard.writeText(id).then(() => toast('ID copiado!', 'success'));
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function statusBadge(status) {
  const map = {
    pending:   ['badge-pending', `${_icon('clock', 12)} Pendente`],
    running:   ['badge-running', '<span class="dot dot-running"></span> Executando'],
    done:      ['badge-done', `${_icon('check', 12)} Concluído`],
    failed:    ['badge-failed', `${_icon('x', 12)} Falhou`],
    cancelled: ['badge-cancelled', '– Cancelado'],
  };
  const [cls, label] = map[status] || ['badge-blue', status];
  return `<span class="badge ${cls}">${label}</span>`;
}

function formatDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function toast(msg, type = '') {
  const el = document.createElement('div');
  el.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
  el.innerHTML = `<span>${type === 'success' ? _icon('check', 14) : type === 'error' ? _icon('x', 14) : _icon('info', 14)}</span> ${msg}`;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
});
