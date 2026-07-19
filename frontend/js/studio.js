// ─── Ícones vetoriais (substituem os antigos emojis, mesma ideia) ─
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
};

function _icon(key, size, color) {
  size = size || 16;
  const inner = ICONS[key] || ICONS.gear;
  const stroke = color || 'currentColor';
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;flex-shrink:0">${inner}</svg>`;
}

// ─── Categorias e ações (estilo Automate Fortra) ──────────────────
const ACTION_CATEGORIES = [
  { key: 'flow', label: 'Controle de Fluxo', icon: 'repeat', actions: [
    { type: 'condition',  icon: 'branch', label: 'Condição (Se/Senão)', color: '#b45309', bg: '#fffbeb' },
    { type: 'loop_count', icon: 'repeat', label: 'Repetir N vezes',     color: '#0f766e', bg: '#f0fdfa' },
    { type: 'foreach',    icon: 'list', label: 'Para cada item (foreach)', color: '#0f766e', bg: '#f0fdfa' },
    { type: 'while_condition', icon: 'clock-repeat', label: 'Repetir até condição (while)', color: '#0f766e', bg: '#f0fdfa' },
    { type: 'try_catch',  icon: 'shield-alert', label: 'Tentar / Capturar erro', color: '#b45309', bg: '#fffbeb' },
    { type: 'parallel',   icon: 'layers', label: 'Executar em paralelo', color: '#0f766e', bg: '#f0fdfa' },
    { type: 'call_automation', icon: 'link', label: 'Chamar outra automação', color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'wait',       icon: 'clock', label: 'Aguardar (delay)',    color: '#64748b', bg: '#f8fafc' },
    { type: 'random_wait',icon: 'dice', label: 'Aguardar (aleatório)', color: '#64748b', bg: '#f8fafc' },
    { type: 'comment',    icon: 'message', label: 'Comentário',          color: '#94a3b8', bg: '#f8fafc' },
  ]},
  { key: 'variables', label: 'Variáveis', icon: 'box', actions: [
    { type: 'set_variable', icon: 'box', label: 'Definir variável',     color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'calculate',    icon: 'calculator', label: 'Calcular / Expressar', color: '#7c3aed', bg: '#f5f3ff' },
  ]},
  { key: 'files', label: 'Arquivos', icon: 'folder', actions: [
    { type: 'read_file',  icon: 'book-open', label: 'Ler arquivo',     color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'write_file', icon: 'pencil', label: 'Escrever arquivo', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'list_files', icon: 'folder', label: 'Listar arquivos',  color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'delete_file',icon: 'trash', label: 'Deletar arquivo',  color: '#ef4444', bg: '#fef2f2' },
    { type: 'copy_file',  icon: 'copy', label: 'Copiar arquivo',   color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'move_file',  icon: 'send', label: 'Mover/Renomear arquivo', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'file_hash',  icon: 'key', label: 'Hash de arquivo',  color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'file_info',  icon: 'info', label: 'Metadados do arquivo', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'search_in_files', icon: 'search', label: 'Buscar texto em arquivos', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'convert_encoding', icon: 'font', label: 'Converter encoding', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'ensure_dir', icon: 'folder', label: 'Criar pasta (se não existir)', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'delete_folder', icon: 'trash', label: 'Deletar pasta', color: '#ef4444', bg: '#fef2f2' },
    { type: 'zip_files',  icon: 'archive', label: 'Compactar (.zip)', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'unzip_file', icon: 'archive', label: 'Descompactar (.zip)', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'backup_folder', icon: 'save', label: 'Backup de pasta', color: '#1d4ed8', bg: '#eff6ff' },
  ]},
  { key: 'sheets', label: 'Planilhas & Excel', icon: 'table', actions: [
    { type: 'read_excel',  icon: 'table', label: 'Ler Excel',    color: '#15803d', bg: '#f0fdf4' },
    { type: 'write_excel', icon: 'table', label: 'Gerar Excel',  color: '#15803d', bg: '#f0fdf4' },
    { type: 'read_csv',    icon: 'file-text', label: 'Ler CSV',      color: '#15803d', bg: '#f0fdf4' },
    { type: 'write_csv',   icon: 'file-text', label: 'Gerar CSV',    color: '#15803d', bg: '#f0fdf4' },
    { type: 'filter_data', icon: 'filter', label: 'Filtrar dados',  color: '#15803d', bg: '#f0fdf4' },
    { type: 'merge_data',  icon: 'link', label: 'Mesclar dados (join)', color: '#15803d', bg: '#f0fdf4' },
    { type: 'dedupe_data', icon: 'broom', label: 'Remover duplicados', color: '#15803d', bg: '#f0fdf4' },
    { type: 'sort_group_data', icon: 'sort', label: 'Ordenar dados', color: '#15803d', bg: '#f0fdf4' },
  ]},
  { key: 'pdf', label: 'PDF', icon: 'file-text', actions: [
    { type: 'pdf_extract_text',   icon: 'book-open', label: 'Extrair texto de PDF', color: '#b91c1c', bg: '#fef2f2' },
    { type: 'pdf_extract_tables', icon: 'clipboard', label: 'Extrair tabelas de PDF', color: '#b91c1c', bg: '#fef2f2' },
    { type: 'pdf_merge',  icon: 'paperclip', label: 'Mesclar PDFs',   color: '#b91c1c', bg: '#fef2f2' },
    { type: 'pdf_split',  icon: 'scissors', label: 'Dividir PDF',    color: '#b91c1c', bg: '#fef2f2' },
    { type: 'pdf_generate', icon: 'printer', label: 'Gerar PDF',    color: '#b91c1c', bg: '#fef2f2' },
    { type: 'pdf_fill_form', icon: 'edit', label: 'Preencher formulário PDF', color: '#b91c1c', bg: '#fef2f2' },
  ]},
  { key: 'etl', label: 'Dados & ETL', icon: 'calculator', actions: [
    { type: 'validate_json_schema', icon: 'check-circle', label: 'Validar schema JSON', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'convert_data_format',  icon: 'repeat', label: 'Converter formato de dados', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'html_extract', icon: 'network', label: 'Extrair de HTML (CSS selector)', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'sql_on_data',  icon: 'database', label: 'SQL sobre dados', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'generate_fake_data', icon: 'sparkles', label: 'Gerar dados de teste', color: '#0891b2', bg: '#f0f9ff' },
  ]},
  { key: 'validation', label: 'Validação BR', icon: 'check-circle', actions: [
    { type: 'validate_cpf_cnpj', icon: 'id-card', label: 'Validar CPF/CNPJ', color: '#b45309', bg: '#fffbeb' },
    { type: 'validate_email',    icon: 'mail', label: 'Validar Email', color: '#b45309', bg: '#fffbeb' },
    { type: 'validate_phone',    icon: 'phone', label: 'Validar Telefone', color: '#b45309', bg: '#fffbeb' },
    { type: 'lookup_cep',        icon: 'map-pin', label: 'Consultar CEP', color: '#b45309', bg: '#fffbeb' },
    { type: 'format_currency',   icon: 'dollar', label: 'Formatar Moeda (BRL)', color: '#b45309', bg: '#fffbeb' },
  ]},
  { key: 'security', label: 'Segurança & Criptografia', icon: 'lock', actions: [
    { type: 'encrypt_text',   icon: 'lock', label: 'Criptografar texto', color: '#374151', bg: '#f8fafc' },
    { type: 'decrypt_text',   icon: 'unlock', label: 'Descriptografar texto', color: '#374151', bg: '#f8fafc' },
    { type: 'generate_jwt',   icon: 'coin', label: 'Gerar JWT', color: '#374151', bg: '#f8fafc' },
    { type: 'verify_jwt',     icon: 'receipt', label: 'Verificar JWT', color: '#374151', bg: '#f8fafc' },
    { type: 'hash_password',  icon: 'hash', label: 'Hash de senha', color: '#374151', bg: '#f8fafc' },
    { type: 'verify_password',icon: 'check', label: 'Verificar senha', color: '#374151', bg: '#f8fafc' },
    { type: 'generate_otp',   icon: 'grid', label: 'Gerar código OTP', color: '#374151', bg: '#f8fafc' },
    { type: 'verify_otp',     icon: 'key', label: 'Verificar código OTP', color: '#374151', bg: '#f8fafc' },
    { type: 'generate_secure_password', icon: 'dice', label: 'Gerar senha segura', color: '#374151', bg: '#f8fafc' },
    { type: 'check_ssl_cert', icon: 'scroll', label: 'Verificar certificado SSL', color: '#374151', bg: '#f8fafc' },
    { type: 'hmac_sign',      icon: 'signature', label: 'Assinar (HMAC)', color: '#374151', bg: '#f8fafc' },
  ]},
  { key: 'datetime', label: 'Data & Hora', icon: 'calendar', actions: [
    { type: 'date_diff',   icon: 'ruler', label: 'Diferença entre datas', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'date_add',    icon: 'plus', label: 'Somar/Subtrair de uma data', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'format_date', icon: 'calendar', label: 'Formatar data', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'timezone_convert', icon: 'globe', label: 'Converter fuso horário', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'is_business_day', icon: 'briefcase', label: 'É dia útil?', color: '#0891b2', bg: '#f0f9ff' },
  ]},
  { key: 'http', label: 'HTTP & Internet', icon: 'globe', actions: [
    { type: 'http_request', icon: 'globe', label: 'HTTP Request', color: '#0f766e', bg: '#f0fdfa' },
    { type: 'http_request_retry', icon: 'repeat', label: 'HTTP Request (com retry)', color: '#0f766e', bg: '#f0fdfa' },
    { type: 'parse_json',   icon: 'braces', label: 'Parse JSON',   color: '#0f766e', bg: '#f0fdfa' },
    { type: 'download_file', icon: 'arrow-down', label: 'Baixar arquivo (URL)', color: '#0f766e', bg: '#f0fdfa' },
    { type: 'upload_file',   icon: 'arrow-up', label: 'Enviar arquivo (upload)', color: '#0f766e', bg: '#f0fdfa' },
    { type: 'scrape_html_table', icon: 'newspaper', label: 'Raspar tabela HTML', color: '#0f766e', bg: '#f0fdfa' },
    { type: 'read_rss_feed', icon: 'rss', label: 'Ler feed RSS', color: '#0f766e', bg: '#f0fdfa' },
  ]},
  { key: 'external_apis', label: 'APIs Externas', icon: 'globe', actions: [
    { type: 'get_weather',     icon: 'sun', label: 'Previsão do tempo', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'geocode_address', icon: 'map-pin', label: 'Geocodificar endereço', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'calculate_distance', icon: 'ruler', label: 'Distância entre coordenadas', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'shorten_url',     icon: 'link', label: 'Encurtar URL', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'lookup_cnpj',     icon: 'building', label: 'Consultar CNPJ', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'translate_text',  icon: 'globe', label: 'Traduzir texto', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'get_holidays',    icon: 'calendar', label: 'Feriados nacionais', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'detect_language', icon: 'font', label: 'Detectar idioma', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'count_tokens',    icon: 'calculator', label: 'Contar tokens (LLM)', color: '#0891b2', bg: '#f0f9ff' },
  ]},
  { key: 'email', label: 'Email', icon: 'mail', actions: [
    { type: 'send_email', icon: 'mail', label: 'Enviar Email', color: '#dc2626', bg: '#fef2f2' },
    { type: 'read_email_imap', icon: 'inbox', label: 'Ler caixa de entrada (IMAP)', color: '#dc2626', bg: '#fef2f2' },
  ]},
  { key: 'messaging', label: 'Comunicação', icon: 'message', actions: [
    { type: 'send_telegram', icon: 'paper-plane', label: 'Enviar Telegram', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'send_slack',    icon: 'message', label: 'Enviar Slack', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'send_discord',  icon: 'gamepad', label: 'Enviar Discord', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'send_whatsapp', icon: 'phone', label: 'Enviar WhatsApp', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'send_sms',      icon: 'mail', label: 'Enviar SMS', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'send_push_notification', icon: 'bell', label: 'Push Notification', color: '#0891b2', bg: '#f0f9ff' },
    { type: 'create_incident', icon: 'alert-triangle', label: 'Criar incidente (PagerDuty)', color: '#dc2626', bg: '#fef2f2' },
  ]},
  { key: 'payments', label: 'Pagamentos & Financeiro', icon: 'wallet', actions: [
    { type: 'asaas_create_charge', icon: 'credit-card', label: 'Criar cobrança (Asaas)', color: '#15803d', bg: '#f0fdf4' },
    { type: 'asaas_check_payment', icon: 'search', label: 'Consultar pagamento (Asaas)', color: '#15803d', bg: '#f0fdf4' },
    { type: 'generate_pix_qr', icon: 'qrcode', label: 'Gerar código Pix', color: '#15803d', bg: '#f0fdf4' },
    { type: 'get_currency_rate', icon: 'currency-exchange', label: 'Cotação de moeda', color: '#15803d', bg: '#f0fdf4' },
    { type: 'get_crypto_price', icon: 'bitcoin', label: 'Cotação de criptomoeda', color: '#15803d', bg: '#f0fdf4' },
  ]},
  { key: 'system', label: 'Sistema', icon: 'gear', actions: [
    { type: 'run_command', icon: 'terminal', label: 'Comando Shell',   color: '#374151', bg: '#f8fafc' },
    { type: 'run_python',  icon: 'code', label: 'Script Python',  color: '#15803d', bg: '#f0fdf4' },
    { type: 'system_stats',    icon: 'bar-chart', label: 'Uso de CPU/memória/disco', color: '#374151', bg: '#f8fafc' },
    { type: 'list_processes',  icon: 'clipboard', label: 'Listar processos', color: '#374151', bg: '#f8fafc' },
    { type: 'check_port_open', icon: 'plug', label: 'Verificar porta', color: '#374151', bg: '#f8fafc' },
    { type: 'dns_lookup',      icon: 'globe', label: 'Consultar DNS', color: '#374151', bg: '#f8fafc' },
    { type: 'whois_lookup',    icon: 'search', label: 'WHOIS de domínio', color: '#374151', bg: '#f8fafc' },
    { type: 'ssh_execute',     icon: 'monitor', label: 'Executar via SSH', color: '#374151', bg: '#f8fafc' },
    { type: 'read_env_var',    icon: 'wrench', label: 'Ler variável de ambiente', color: '#374151', bg: '#f8fafc' },
    { type: 'check_url_uptime',icon: 'heart-pulse', label: 'Verificar uptime (URL)', color: '#374151', bg: '#f8fafc' },
  ]},
  { key: 'database', label: 'Banco de Dados & Fila', icon: 'database', actions: [
    { type: 'redis_get',  icon: 'arrow-up', label: 'Redis: Ler', color: '#b91c1c', bg: '#fef2f2' },
    { type: 'redis_set',  icon: 'arrow-down', label: 'Redis: Escrever', color: '#b91c1c', bg: '#fef2f2' },
    { type: 'queue_push', icon: 'arrow-right', label: 'Enfileirar (Redis)', color: '#b91c1c', bg: '#fef2f2' },
    { type: 'queue_pop',  icon: 'arrow-left', label: 'Desenfileirar (Redis)', color: '#b91c1c', bg: '#fef2f2' },
    { type: 'sql_query_external', icon: 'database', label: 'SQL externo (Postgres)', color: '#b91c1c', bg: '#fef2f2' },
  ]},
  { key: 'ai', label: 'Inteligência Artificial', icon: 'robot', actions: [
    { type: 'call_ai_agent', icon: 'brain', label: 'Agente IA',   color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'call_pipeline', icon: 'link', label: 'Pipeline IA', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'generate_embedding', icon: 'dna', label: 'Gerar embedding', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'semantic_search',    icon: 'search', label: 'Busca semântica', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'moderate_content',   icon: 'shield', label: 'Moderar conteúdo', color: '#1d4ed8', bg: '#eff6ff' },
    { type: 'compare_texts',      icon: 'versus', label: 'Comparar textos', color: '#1d4ed8', bg: '#eff6ff' },
  ]},
  { key: 'documents', label: 'Templates & Documentos', icon: 'file-text', actions: [
    { type: 'render_template',  icon: 'file-text', label: 'Renderizar template (Jinja2)', color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'generate_word_doc',icon: 'doc-word', label: 'Gerar documento Word', color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'generate_pptx',    icon: 'doc-slides', label: 'Gerar apresentação (PPTX)', color: '#7c3aed', bg: '#f5f3ff' },
  ]},
  { key: 'data', label: 'Dados', icon: 'bar-chart', actions: [
    { type: 'text_transform', icon: 'scissors', label: 'Transformar Texto', color: '#0891b2', bg: '#f0f9ff' },
  ]},
  { key: 'images', label: 'Imagens', icon: 'image', actions: [
    { type: 'resize_image',    icon: 'resize', label: 'Redimensionar imagem', color: '#ea580c', bg: '#fff7ed' },
    { type: 'convert_image_format', icon: 'repeat', label: 'Converter formato de imagem', color: '#ea580c', bg: '#fff7ed' },
    { type: 'add_watermark',   icon: 'droplet', label: 'Aplicar marca d\'água', color: '#ea580c', bg: '#fff7ed' },
    { type: 'generate_thumbnail', icon: 'image', label: 'Gerar thumbnail', color: '#ea580c', bg: '#fff7ed' },
    { type: 'generate_qrcode', icon: 'qrcode', label: 'Gerar QR Code', color: '#ea580c', bg: '#fff7ed' },
    { type: 'read_qrcode',     icon: 'camera', label: 'Ler QR Code', color: '#ea580c', bg: '#fff7ed' },
    { type: 'compare_images',  icon: 'versus', label: 'Comparar imagens', color: '#ea580c', bg: '#fff7ed' },
    { type: 'generate_ai_image', icon: 'palette', label: 'Gerar imagem via IA', color: '#ea580c', bg: '#fff7ed' },
  ]},
  { key: 'media', label: 'Áudio & Vídeo ⚠️ requer ffmpeg', icon: 'film', actions: [
    { type: 'transcode_media', icon: 'repeat', label: 'Converter áudio/vídeo', color: '#9333ea', bg: '#faf5ff' },
    { type: 'extract_audio',   icon: 'music', label: 'Extrair áudio de vídeo', color: '#9333ea', bg: '#faf5ff' },
    { type: 'trim_media',      icon: 'scissors', label: 'Cortar trecho de mídia', color: '#9333ea', bg: '#faf5ff' },
    { type: 'extract_video_frame', icon: 'image', label: 'Extrair frame de vídeo', color: '#9333ea', bg: '#faf5ff' },
    { type: 'transcribe_audio',icon: 'edit', label: 'Transcrever áudio (Whisper)', color: '#9333ea', bg: '#faf5ff' },
    { type: 'text_to_speech',  icon: 'speaker', label: 'Texto para voz (TTS)', color: '#9333ea', bg: '#faf5ff' },
  ]},
  { key: 'ocr', label: 'OCR & Visão ⚠️ requer tesseract', icon: 'eye', actions: [
    { type: 'ocr_image',       icon: 'font', label: 'OCR de imagem', color: '#9333ea', bg: '#faf5ff' },
    { type: 'ocr_pdf_scanned', icon: 'file-text', label: 'OCR de PDF escaneado', color: '#9333ea', bg: '#faf5ff' },
    { type: 'detect_face_object', icon: 'user', label: 'Detectar rosto', color: '#ea580c', bg: '#fff7ed' },
  ]},
  { key: 'browser', label: 'Navegador Web', icon: 'globe', actions: [
    { type: 'browser_open',       icon: 'globe', label: 'Abrir sessão',       color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_click',      icon: 'mouse-pointer', label: 'Clicar',             color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_type',       icon: 'keyboard', label: 'Digitar',            color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_extract',    icon: 'clipboard', label: 'Extrair texto',      color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_wait',       icon: 'clock', label: 'Aguardar elemento',  color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_screenshot', icon: 'camera', label: 'Screenshot',         color: '#7c3aed', bg: '#f5f3ff' },
    { type: 'browser_close',      icon: 'stop', label: 'Fechar sessão',      color: '#7c3aed', bg: '#f5f3ff' },
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
let _stepClipboard = null;

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
  source_path: '', dest_path: '', hash_algo: 'sha256', encoding_from: 'utf-8', encoding_to: 'utf-8',
  date_value: '', date_value2: '', date_unit: 'days', date_amount: 0,
  date_format_in: '%Y-%m-%d', date_format_out: '%d/%m/%Y',
  timezone_from: 'UTC', timezone_to: 'America/Sao_Paulo',
  list_source: '{output}', item_variable: 'item', max_iterations: 100,
  automation_id: '', seconds_max: 3,
  sheet_name: 'Sheet1', delimiter: ',', data_input: '{output}', data_input2: '', merge_key: '',
  sort_key: '', sort_desc: false, schema_input: '', format_from: 'json', format_to: 'csv',
  css_selector: '', sql_query: 'SELECT * FROM data', fake_type: 'name', fake_count: 5,
  secret_key: '', password_length: 16, region: 'BR',
  api_key: '', api_secret: '', from_number: '', pix_key: '', pix_merchant_name: '', pix_merchant_city: '',
  coord_from: '', coord_to: '',
  width: 0, height: 0,
  run_on: 'server',
};

// ─── Container helpers ────────────────────────────────────────────
const CONTAINER_TYPES = new Set(['loop_count', 'condition', 'foreach', 'while_condition', 'try_catch', 'parallel']);
const DOUBLE_BRANCH_TYPES = new Set(['condition', 'try_catch']);

// Tipos que nunca podem rodar num agente: dependem do Mongo direto (IA/pipeline/
// sub-fluxo) ou já têm seu próprio mecanismo de despacho pro agente (navegador).
const AGENT_EXCLUDED_TYPES = new Set([
  'call_ai_agent', 'call_pipeline', 'call_automation',
  'browser', 'browser_open', 'browser_click', 'browser_type',
  'browser_extract', 'browser_wait', 'browser_screenshot', 'browser_close',
]);

function _branches(step) {
  return DOUBLE_BRANCH_TYPES.has(step.type) ? ['children_true', 'children_false'] : ['children'];
}

function _findStep(id, arr) {
  for (const s of arr) {
    if (s.id === id) return s;
    if (CONTAINER_TYPES.has(s.type))
      for (const b of _branches(s)) { const f = _findStep(id, s[b] || []); if (f) return f; }
  }
  return null;
}

// Procura, em todo o fluxo, um passo "Abrir sessão" com o session_name informado
// e retorna a engine configurada nele — assim os passos de ação (Clicar, Digitar
// etc.) podem mostrar/seguir automaticamente a mesma biblioteca da sessão.
function _findSessionEngine(name, arr) {
  if (!name) return null;
  for (const s of arr) {
    const cfg = s.config || {};
    if (s.type === 'browser_open' && (cfg.session_name || '').trim() === name) {
      return cfg.browser_engine || 'playwright';
    }
    if (CONTAINER_TYPES.has(s.type))
      for (const b of _branches(s)) {
        const found = _findSessionEngine(name, s[b] || []);
        if (found) return found;
      }
  }
  return null;
}

// Aviso exibido nos passos de ação de sessão (Clicar, Digitar, Extrair, Aguardar,
// Screenshot, Fechar): identifica — pelo nome — o passo "Abrir sessão" correspondente
// no fluxo e deixa claro que esta ação herda automaticamente a MESMA biblioteca
// (Playwright ou Selenium) escolhida ali, sem precisar (nem permitir) escolher de novo.
function _sessionEngineNotice(sessionName) {
  const name = (sessionName || '').trim();
  const eng = _findSessionEngine(name, _buildSteps);
  if (!eng) {
    return _hint(`⚠ Nenhum passo "Abrir sessão" chamado "${escapeHtml(name || '...')}" foi encontrado neste fluxo ainda. Assim que você adicionar um (antes deste passo), esta ação passará a usar automaticamente a mesma engine escolhida nele.`);
  }
  const label = eng === 'selenium' ? '🔬 Selenium' : '🎭 Playwright';
  return _hint(`Esta ação roda na sessão "<strong>${escapeHtml(name)}</strong>" e usa automaticamente a mesma biblioteca configurada no passo "Abrir sessão": <strong>${label}</strong>.`);
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
  _studioSetupKb();
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

let _builderRunId = null;
let _builderRunAutoId = null;
let _builderPollTimer = null;
let _builderRenderedStepCount = 0;

function _setBuilderRunningUI(running) {
  const pairs = [['builder-run-btn-top', 'builder-stop-btn-top'], ['builder-run-btn-bottom', 'builder-stop-btn-bottom']];
  pairs.forEach(([runId, stopId]) => {
    const runBtn = document.getElementById(runId);
    const stopBtn = document.getElementById(stopId);
    if (runBtn) runBtn.style.display = running ? 'none' : '';
    if (stopBtn) stopBtn.style.display = running ? '' : 'none';
  });
}

function stopBuilderRun() {
  if (!_builderRunId || !_builderRunAutoId) return;
  api('POST', `/studio/${_builderRunAutoId}/runs/${_builderRunId}/cancel`).catch(() => {});
  _appendBuilderLog(`<span style="color:#f59e0b">⏹ Parando execução...</span>\n`);
}

function _appendNewRunSteps(run) {
  const sc = { success: '#22c55e', failed: '#ef4444', skipped: '#f59e0b', cancelled: '#f59e0b' };
  const si = { success: '✓', failed: '✗', skipped: '⚠', cancelled: '⏹' };
  const meta_icon = t => { const m = ACTION_MAP[t] || { icon: 'gear', color: '#64748b' }; return _icon(m.icon, 13, m.color); };
  const steps = run.steps_result || [];

  for (let idx = _builderRenderedStepCount; idx < steps.length; idx++) {
    const s = steps[idx];
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
  }
  _builderRenderedStepCount = steps.length;
}

async function _runBuilderInline(extra) {
  const editId = document.getElementById('builder-edit-id')?.value;
  if (!editId) { showToast('Salve a automação antes de executar', 'error'); return; }
  const input = document.getElementById('builder-log-input')?.value || '';

  const panel = document.getElementById('builder-log-panel');
  if (panel && panel.offsetHeight < 120) panel.style.height = '260px';

  _appendBuilderLog(`<span style="color:#64748b">[${new Date().toLocaleTimeString()}] Iniciando execução...</span>\n`);

  _setBuilderRunningUI(true);
  _builderRenderedStepCount = 0;

  try {
    const initial = await api('POST', `/studio/${editId}/run`, { input, ...(extra || {}) });
    _builderRunId = initial.id;
    _builderRunAutoId = editId;

    let run = initial;
    while (run.status === 'running') {
      await new Promise(r => setTimeout(r, 1000));
      run = await api('GET', `/studio/${editId}/runs/${_builderRunId}`);
      _appendNewRunSteps(run);
    }

    const finalColor = run.status === 'success' ? '#22c55e' : (run.status === 'cancelled' ? '#f59e0b' : '#ef4444');
    _appendBuilderLog(`\n<span style="color:${finalColor};font-weight:bold">● Finalizado: ${run.status.toUpperCase()} — ${run.duration_ms}ms</span>\n`);
    if (run.output) _appendBuilderLog(
      `<span style="color:#7dd3fc">Output final: ${escapeHtml(run.output.substring(0, 400))}${run.output.length > 400 ? '…' : ''}</span>\n`
    );
  } catch (e) {
    _appendBuilderLog(`<span style="color:#ef4444">✗ Erro: ${escapeHtml(e.message)}</span>\n`);
  } finally {
    _builderRunId = null;
    _builderRunAutoId = null;
    _setBuilderRunningUI(false);
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
        <span style="display:inline-flex;align-items:center;gap:.4rem">${_icon(cat.icon, 14, '#475569')}${cat.label}</span>
        <span style="font-size:.7rem;color:#94a3b8">${collapsed ? '▶' : '▼'}</span>
      </div>
      ${collapsed ? '' : cat.actions.map(a => `
        <div onclick="addBuilderStep('${a.type}')"
          draggable="true"
          ondragstart="_onPaletteDragStart(event,'${a.type}')"
          ondragend="_onPaletteDragEnd(event)"
          style="padding:.42rem .75rem .42rem 1.1rem;font-size:.8rem;cursor:grab;display:flex;align-items:center;gap:.4rem;color:#1e293b;transition:background .1s;border-bottom:1px solid #f1f5f9"
          onmouseover="this.style.background='#dde3eb'" onmouseout="this.style.background='transparent'">
          <span style="display:inline-flex">${_icon(a.icon, 16, a.color)}</span>
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
  const disabled = step.enabled === false;
  const pad = depth > 0 ? '.5rem .75rem' : '.65rem .875rem';
  return `<div onclick="selectBuilderStep('${step.id}')"
    oncontextmenu="showStepContextMenu(event,'${step.id}')"
    draggable="true"
    ondragstart="_onStepDragStart(event,'${step.id}',this)"
    ondragend="_onStepDragEnd(event,this)"
    style="display:flex;align-items:center;gap:.65rem;padding:${pad};background:${sel ? meta.bg : 'white'};border:2px solid ${sel ? meta.color : '#e2e8f0'};border-radius:10px;cursor:grab;width:100%;box-sizing:border-box;transition:border-color .12s,box-shadow .12s;box-shadow:${sel ? `0 0 0 3px ${meta.color}33` : '0 1px 2px rgba(0,0,0,.05)'};opacity:${disabled?.5:1};filter:${disabled?'grayscale(60%)':'none'}">
    <div style="color:#cbd5e1;font-size:.95rem;flex-shrink:0;user-select:none;line-height:1">⠿</div>
    <div style="width:${depth>0?28:32}px;height:${depth>0?28:32}px;border-radius:8px;background:${meta.bg};border:1.5px solid ${meta.color}44;display:flex;align-items:center;justify-content:center;flex-shrink:0">${_icon(meta.icon, depth>0?16:18, meta.color)}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:.3rem;font-weight:700;font-size:${depth>0?'.75rem':'.8rem'};color:${meta.color};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${disabled?_icon('ban',12,'#ef4444'):''}${escapeHtml(step.name)}</div>
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
  const disabled = step.enabled === false;

  const header = `<div
    onclick="selectBuilderStep('${step.id}')"
    oncontextmenu="showStepContextMenu(event,'${step.id}')"
    draggable="true"
    ondragstart="_onStepDragStart(event,'${step.id}',this)"
    ondragend="_onStepDragEnd(event,this)"
    style="display:flex;align-items:center;gap:.65rem;padding:.6rem .875rem;cursor:grab;border-radius:10px 10px 0 0;transition:background .12s">
    <div style="color:#94a3b8;font-size:.95rem;flex-shrink:0;user-select:none;line-height:1">⠿</div>
    <div style="width:30px;height:30px;border-radius:7px;background:${meta.bg};border:1.5px solid ${meta.color};display:flex;align-items:center;justify-content:center;flex-shrink:0">${_icon(meta.icon, 17, meta.color)}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:.3rem;font-weight:700;font-size:.8rem;color:${meta.color};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${disabled?_icon('ban',12,'#ef4444'):''}${escapeHtml(step.name)}</div>
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
  const singleBranchLabels = {
    loop_count: `CORPO DO LOOP (${(step.config||{}).count||3} vezes)`,
    foreach: `PARA CADA ITEM (variável {${(step.config||{}).item_variable||'item'}})`,
    while_condition: 'CORPO DO WHILE',
    parallel: 'AÇÕES EXECUTADAS EM PARALELO',
  };
  if (singleBranchLabels[step.type]) {
    const children = step.children || [];
    body = `<div style="border-top:1.5px solid ${meta.color}44;padding:.5rem;background:${meta.bg}55">
      <div style="font-size:.65rem;font-weight:700;color:${meta.color};opacity:.8;margin-bottom:.25rem;letter-spacing:.03em">${singleBranchLabels[step.type]}</div>
      ${_renderStepList(children, step.id, 'children', depth + 1)}
    </div>`;
  } else if (step.type === 'condition' || step.type === 'try_catch') {
    const isTry = step.type === 'try_catch';
    const ct = step.children_true || [];
    const cf = step.children_false || [];
    body = `<div style="border-top:1.5px solid ${meta.color}44;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);background:${meta.bg}55">
      <div style="padding:.4rem .5rem;border-right:1px solid ${meta.color}22;min-width:0">
        <div style="font-size:.65rem;font-weight:700;color:#16a34a;margin-bottom:.25rem;letter-spacing:.03em">${isTry ? '▶ TENTAR' : '✓ VERDADEIRO'}</div>
        ${_renderStepList(ct, step.id, 'children_true', depth + 1)}
      </div>
      <div style="padding:.4rem .5rem;min-width:0">
        <div style="font-size:.65rem;font-weight:700;color:#ef4444;margin-bottom:.25rem;letter-spacing:.03em">${isTry ? '⚠ SE FALHAR (catch)' : '✗ FALSO'}</div>
        ${_renderStepList(cf, step.id, 'children_false', depth + 1)}
      </div>
    </div>`;
  }

  return `<div style="border:2px solid ${sel ? meta.color : meta.color+'55'};border-radius:12px;background:white;width:100%;box-sizing:border-box;overflow:hidden;box-shadow:${sel?`0 0 0 3px ${meta.color}33`:'0 1px 4px rgba(0,0,0,.07)'};opacity:${disabled?.5:1};filter:${disabled?'grayscale(60%)':'none'}">
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
  const text = _stepBriefText(step);
  const runsOnAgent = !AGENT_EXCLUDED_TYPES.has(step.type) && (step.config || {}).run_on === 'agent';
  return runsOnAgent ? `💻 ${text}` : text;
}

function _stepBriefText(step) {
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
    case 'copy_file':    return `${c.source_path || '...'} → ${c.dest_path || '...'}`;
    case 'move_file':    return `${c.source_path || '...'} → ${c.dest_path || '...'}`;
    case 'file_hash':    return `${c.hash_algo || 'sha256'}: ${c.file_path || 'caminho não definido'}`;
    case 'file_info':    return c.file_path || 'caminho não definido';
    case 'search_in_files': return `"${(c.search||'').substring(0,20)}" em ${c.directory || '.'}/${c.pattern || '*'}`;
    case 'convert_encoding': return `${c.encoding_from||'utf-8'} → ${c.encoding_to||'utf-8'}: ${c.source_path || c.file_path || '...'}`;
    case 'ensure_dir':   return c.directory || c.file_path || 'caminho não definido';
    case 'delete_folder':return c.directory || c.file_path || 'caminho não definido';
    case 'zip_files':    return `${c.source_path || '...'} → ${c.dest_path || '...'}.zip`;
    case 'unzip_file':   return `${c.source_path || '...'} → ${c.dest_path || '.'}`;
    case 'backup_folder':return `${c.source_path || '...'} → ${c.dest_path || '...'}_<timestamp>`;
    case 'date_diff':    return `${c.date_value||'?'} → ${c.date_value2||'?'} (${c.date_unit||'days'})`;
    case 'date_add':     return `${c.date_value||'?'} ${c.date_amount>=0?'+':''}${c.date_amount||0} ${c.date_unit||'days'}`;
    case 'format_date':  return `${c.date_value||'?'} (${c.date_format_in||'%Y-%m-%d'} → ${c.date_format_out||'%d/%m/%Y'})`;
    case 'timezone_convert': return `${c.timezone_from||'UTC'} → ${c.timezone_to||'America/Sao_Paulo'}`;
    case 'is_business_day':  return c.date_value || 'data não definida';
    case 'foreach':       return `{${c.item_variable||'item'}} em ${(c.list_source||'{output}').substring(0,25)}`;
    case 'while_condition':return `enquanto ${c.operator||'not_empty'} "${(c.condition_value||'').substring(0,15)}" (máx ${c.max_iterations||100})`;
    case 'try_catch':     return 'tentar / capturar erro';
    case 'parallel':      return `${(step.children||[]).length} ação(ões) em paralelo`;
    case 'call_automation':{ const a = _studioList.find(x => x.id === c.automation_id); return a ? `Chamar: ${a.name}` : 'Automação não selecionada'; }
    case 'random_wait':   return `${c.seconds||1}s a ${c.seconds_max||3}s`;
    case 'read_excel':    return `${c.file_path||'...'} (aba: ${c.sheet_name||'auto'})`;
    case 'write_excel':   return `${c.dest_path||'...'} (aba: ${c.sheet_name||'Sheet1'})`;
    case 'read_csv':      return `${c.file_path||'...'} (delim: "${c.delimiter||','}")`;
    case 'write_csv':     return `${c.dest_path||'...'} (delim: "${c.delimiter||','}")`;
    case 'filter_data':   return `${c.sort_key||c.merge_key||'coluna'} ${c.operator||'contains'} "${(c.condition_value||'').substring(0,15)}"`;
    case 'merge_data':    return `join por "${c.merge_key||'...'}"`;
    case 'dedupe_data':   return c.merge_key ? `por chave "${c.merge_key}"` : 'linha inteira';
    case 'sort_group_data': return `por "${c.sort_key||'...'}" ${c.sort_desc?'desc':'asc'}`;
    case 'pdf_extract_text':   return c.source_path || c.file_path || 'arquivo não definido';
    case 'pdf_extract_tables': return c.source_path || c.file_path || 'arquivo não definido';
    case 'pdf_merge':     return `${(c.list_source||'[]').substring(0,30)} → ${c.dest_path||'...'}`;
    case 'pdf_split':     return `${c.source_path||c.file_path||'...'} → ${c.dest_path||'.'}`;
    case 'pdf_generate':  return c.dest_path || 'caminho não definido';
    case 'pdf_fill_form': return `${c.source_path||c.file_path||'...'} → ${c.dest_path||'...'}`;
    case 'validate_json_schema': return 'valida {output} contra schema';
    case 'convert_data_format':  return `${c.format_from||'json'} → ${c.format_to||'csv'}`;
    case 'html_extract':  return `seletor: ${c.css_selector || '...'}`;
    case 'sql_on_data':   return (c.sql_query||'SELECT * FROM data').substring(0,40);
    case 'generate_fake_data': return `${c.fake_count||5}x ${c.fake_type||'name'}`;
    case 'validate_cpf_cnpj': return (c.text_input||'{output}').substring(0,30);
    case 'validate_email':    return (c.text_input||'{output}').substring(0,30);
    case 'validate_phone':    return `${(c.text_input||'{output}').substring(0,20)} (${c.region||'BR'})`;
    case 'lookup_cep':        return (c.text_input||'{output}').substring(0,20);
    case 'format_currency':   return (c.text_input||'{output}').substring(0,20);
    case 'encrypt_text':      return 'criptografar com secret_key';
    case 'decrypt_text':      return 'descriptografar com secret_key';
    case 'generate_jwt':      return (c.json_input||'{}').substring(0,30);
    case 'verify_jwt':        return (c.text_input||'{output}').substring(0,25);
    case 'hash_password':     return 'bcrypt hash';
    case 'verify_password':   return 'compara senha com hash em secret_key';
    case 'generate_otp':      return c.secret_key ? 'código para secret existente' : 'gera novo secret + código';
    case 'verify_otp':        return `código: ${(c.text_input||'{output}').substring(0,10)}`;
    case 'generate_secure_password': return `${c.password_length||16} caracteres`;
    case 'check_ssl_cert':    return (c.text_input||'{output}').substring(0,30);
    case 'hmac_sign':         return `HMAC-SHA256 de ${(c.text_input||'{output}').substring(0,20)}`;
    case 'send_telegram': return `chat ${c.to||'...'}: ${(c.content||'{output}').substring(0,25)}`;
    case 'send_slack':    return (c.content||'{output}').substring(0,35);
    case 'send_discord':  return (c.content||'{output}').substring(0,35);
    case 'send_whatsapp': return `${c.from_number||'...'} → ${c.to||'...'}`;
    case 'send_sms':      return `${c.from_number||'...'} → ${c.to||'...'}`;
    case 'read_email_imap': return `${c.to||'...'} @ ${c.url||'imap.gmail.com'}`;
    case 'send_push_notification': return (c.content||'{output}').substring(0,35);
    case 'create_incident': return (c.content||'{output}').substring(0,40);
    case 'asaas_create_charge': return `cliente ${c.to||'...'}: R$ ${c.text_input||'0'}`;
    case 'asaas_check_payment': return `pagamento ${(c.text_input||'{output}').substring(0,25)}`;
    case 'generate_pix_qr': return `${c.pix_key||'chave não definida'} — ${c.pix_merchant_name||'...'}`;
    case 'get_currency_rate': return c.text_input || 'USD-BRL';
    case 'get_crypto_price':  return c.text_input || 'bitcoin';
    case 'get_weather':     return c.text_input || 'cidade não definida';
    case 'geocode_address': return (c.text_input||'{output}').substring(0,35);
    case 'calculate_distance': return `${c.coord_from||'?'} → ${c.coord_to||'?'}`;
    case 'shorten_url':     return (c.text_input||'{output}').substring(0,35);
    case 'lookup_cnpj':     return c.text_input || 'CNPJ não definido';
    case 'translate_text':  return `→ ${c.region||'EN'}: ${(c.text_input||'{output}').substring(0,25)}`;
    case 'get_holidays':    return c.text_input || String(new Date().getFullYear());
    case 'download_file':   return `${c.url||'...'} → ${c.dest_path||'...'}`;
    case 'upload_file':     return `${c.source_path||'...'} → ${c.url||'...'}`;
    case 'scrape_html_table': return (c.text_input||'{output}').substring(0,35);
    case 'read_rss_feed':   return c.url || 'URL não definida';
    case 'http_request_retry': return c.url ? `${c.method||'GET'} ${c.url.substring(0,25)} (até ${c.max_iterations||3}x)` : 'URL não definida';
    case 'detect_language': return (c.text_input||'{output}').substring(0,30);
    case 'count_tokens':    return (c.text_input||'{output}').substring(0,30);
    case 'generate_embedding': return (c.text_input||'{output}').substring(0,35);
    case 'semantic_search':    return `query: ${(c.text_input||'{output}').substring(0,25)}`;
    case 'moderate_content':   return (c.text_input||'{output}').substring(0,35);
    case 'compare_texts':      return `${(c.text_input||'{output}').substring(0,15)} vs ${(c.data_input2||'').substring(0,15)}`;
    case 'system_stats':    return 'CPU / memória / disco';
    case 'list_processes':  return `top ${c.fake_count||20} por memória`;
    case 'check_port_open': return c.text_input || 'host:porta não definido';
    case 'dns_lookup':      return `${c.text_input||'{output}'} (${c.operation||'A'})`;
    case 'whois_lookup':    return c.text_input || 'domínio não definido';
    case 'ssh_execute':     return `${c.to||'user'}@${c.url||'host'}: ${(c.command||'').substring(0,25)}`;
    case 'read_env_var':    return c.text_input || 'variável não definida';
    case 'check_url_uptime':return c.url || 'URL não definida';
    case 'redis_get':       return `GET ${c.text_input||'chave'}`;
    case 'redis_set':       return `SET ${c.text_input||'chave'} = ${(c.content||'{output}').substring(0,20)}`;
    case 'queue_push':      return `RPUSH ${c.text_input||'fila'} ← ${(c.content||'{output}').substring(0,20)}`;
    case 'queue_pop':       return `LPOP ${c.text_input||'fila'}`;
    case 'sql_query_external': return (c.sql_query||'SELECT 1').substring(0,40);
    case 'render_template': return (c.content||'').substring(0,35) || 'template vazio';
    case 'generate_word_doc': return c.dest_path || 'caminho não definido';
    case 'generate_pptx':     return c.dest_path || 'caminho não definido';
    case 'resize_image':   return `${c.width||'auto'}x${c.height||'auto'}: ${c.source_path||'...'}`;
    case 'convert_image_format': return `${c.source_path||'...'} → ${c.dest_path||'...'}`;
    case 'add_watermark':  return `"${(c.text||'').substring(0,20)}" em ${c.source_path||'...'}`;
    case 'generate_thumbnail': return `${c.width||200}px: ${c.source_path||'...'}`;
    case 'generate_qrcode':return (c.text_input||'{output}').substring(0,30);
    case 'read_qrcode':    return c.source_path || 'imagem não definida';
    case 'compare_images': return `${c.source_path||'...'} vs ${c.dest_path||'...'}`;
    case 'generate_ai_image': return (c.text_input||'{output}').substring(0,35);
    case 'transcode_media':return `${c.source_path||'...'} → ${c.dest_path||'...'}`;
    case 'extract_audio':  return `${c.source_path||'...'} → ${c.dest_path||'...'}`;
    case 'trim_media':     return `${c.source_path||'...'} [${c.seconds||0}s–${c.seconds_max||'fim'}]`;
    case 'extract_video_frame': return `${c.source_path||'...'} @ ${c.seconds||0}s`;
    case 'transcribe_audio': return c.source_path || 'áudio não definido';
    case 'text_to_speech':   return (c.text_input||'{output}').substring(0,30);
    case 'ocr_image':      return c.source_path || 'imagem não definida';
    case 'ocr_pdf_scanned':return c.source_path || 'PDF não definido';
    case 'detect_face_object': return c.source_path || 'imagem não definida';
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
  if (['loop_count', 'foreach', 'while_condition', 'parallel'].includes(type)) step.children = [];
  if (DOUBLE_BRANCH_TYPES.has(type)) { step.children_true = []; step.children_false = []; }
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

function closeBuilderProps() {
  _buildSelectedId = null;
  _renderBuilderCanvas();
  _renderPropsPanel(null);
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

// ─── Copiar / Recortar / Colar (Ctrl+C / Ctrl+X / Ctrl+V) ─────────

function _findStepLocation(id, arr) {
  const idx = arr.findIndex(s => s.id === id);
  if (idx !== -1) return { arr, idx };
  for (const s of arr) {
    if (CONTAINER_TYPES.has(s.type))
      for (const b of _branches(s)) {
        const found = _findStepLocation(id, s[b] || []);
        if (found) return found;
      }
  }
  return null;
}

function _cloneStepWithNewIds(step) {
  const clone = JSON.parse(JSON.stringify(step));
  const assignIds = s => {
    s.id = 'step_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    if (CONTAINER_TYPES.has(s.type))
      for (const b of _branches(s)) (s[b] || []).forEach(assignIds);
  };
  assignIds(clone);
  return clone;
}

function copyBuilderStep(id) {
  id = id || _buildSelectedId;
  const step = id && _findStep(id, _buildSteps);
  if (!step) { showToast('Selecione uma ação para copiar', 'error'); return; }
  _stepClipboard = JSON.parse(JSON.stringify(step));
  showToast('Ação copiada');
}

function cutBuilderStep(id) {
  id = id || _buildSelectedId;
  const step = id && _findStep(id, _buildSteps);
  if (!step) { showToast('Selecione uma ação para recortar', 'error'); return; }
  _stepClipboard = JSON.parse(JSON.stringify(step));
  removeBuilderStep(id);
  showToast('Ação recortada');
}

function pasteBuilderStep() {
  if (!_stepClipboard) { showToast('Nada para colar', 'error'); return; }
  const clone = _cloneStepWithNewIds(_stepClipboard);
  const loc = _buildSelectedId ? _findStepLocation(_buildSelectedId, _buildSteps) : null;
  if (loc) loc.arr.splice(loc.idx + 1, 0, clone);
  else _buildSteps.push(clone);
  _buildSelectedId = clone.id;
  _renderBuilderCanvas();
  _renderPropsPanel(_findStep(clone.id, _buildSteps));
  showToast('Ação colada');
}

function _studioKbHandler(e) {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;
  if (!document.getElementById('view-studio_builder')?.classList.contains('active')) return;
  if (!(e.ctrlKey || e.metaKey)) return;
  const k = e.key.toLowerCase();
  if (k === 'c') { e.preventDefault(); copyBuilderStep(); }
  else if (k === 'x') { e.preventDefault(); cutBuilderStep(); }
  else if (k === 'v') { e.preventDefault(); pasteBuilderStep(); }
}
function _studioSetupKb() {
  document.removeEventListener('keydown', _studioKbHandler);
  document.addEventListener('keydown', _studioKbHandler);
}

// ─── Menu de contexto (clique com o botão direito) ────────────────

function toggleBuilderStepEnabled(id) {
  const step = _findStep(id, _buildSteps);
  if (!step) return;
  step.enabled = step.enabled === false ? true : false;
  _renderBuilderCanvas();
  if (_buildSelectedId === id) _renderPropsPanel(step);
}

function runBuilderStepOnly(id) { _runBuilderInline({ only_step_id: id }); }
function runBuilderFromStep(id) { _runBuilderInline({ from_step_id: id }); }

function _closeStepContextMenu() {
  const el = document.getElementById('step-ctx-menu');
  if (el) el.remove();
  document.removeEventListener('click', _closeStepContextMenu);
  document.removeEventListener('keydown', _stepCtxMenuEscHandler);
}

function _stepCtxMenuEscHandler(e) {
  if (e.key === 'Escape') _closeStepContextMenu();
}

function _ctxMenuItem(icon, label, onclick, opts) {
  opts = opts || {};
  const color = opts.disabled ? '#cbd5e1' : (opts.danger ? '#ef4444' : '#1e293b');
  const iconColor = opts.disabled ? '#cbd5e1' : (opts.danger ? '#ef4444' : '#64748b');
  return `<div ${opts.disabled ? '' : `onclick="${onclick}"`}
    style="display:flex;align-items:center;gap:.55rem;padding:.5rem .75rem;font-size:.8rem;cursor:${opts.disabled ? 'default' : 'pointer'};color:${color};white-space:nowrap;border-radius:6px"
    ${opts.disabled ? '' : `onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'"`}>
    <span style="display:inline-flex;flex-shrink:0">${_icon(icon, 15, iconColor)}</span>
    <span>${label}</span>
  </div>`;
}

function showStepContextMenu(evt, id) {
  evt.preventDefault();
  evt.stopPropagation();
  _closeStepContextMenu();
  selectBuilderStep(id);

  const step = _findStep(id, _buildSteps);
  if (!step) return;
  const loc = _findStepLocation(id, _buildSteps);
  const isTopLevel = !!loc && loc.arr === _buildSteps;
  const isFirst = !loc || loc.idx === 0;
  const isLast  = !loc || loc.idx === loc.arr.length - 1;
  const disabled = step.enabled === false;

  const sep = '<div style="height:1px;background:#f1f5f9;margin:.3rem 0"></div>';
  const menu = document.createElement('div');
  menu.id = 'step-ctx-menu';
  menu.style.cssText = `position:fixed;left:${evt.clientX}px;top:${evt.clientY}px;background:white;border:1px solid #e2e8f0;border-radius:9px;box-shadow:0 10px 28px rgba(15,23,42,.18);z-index:9999;min-width:220px;padding:.3rem;box-sizing:border-box`;
  menu.innerHTML = [
    _ctxMenuItem('copy', 'Copiar', `copyBuilderStep('${id}');_closeStepContextMenu()`),
    _ctxMenuItem('scissors', 'Recortar', `cutBuilderStep('${id}');_closeStepContextMenu()`),
    _ctxMenuItem('paste', 'Colar', `pasteBuilderStep();_closeStepContextMenu()`, { disabled: !_stepClipboard }),
    sep,
    _ctxMenuItem('arrow-up', 'Mover para cima', `moveBuilderStep('${id}',-1);_closeStepContextMenu()`, { disabled: isFirst }),
    _ctxMenuItem('arrow-down', 'Mover para baixo', `moveBuilderStep('${id}',1);_closeStepContextMenu()`, { disabled: isLast }),
    sep,
    _ctxMenuItem(disabled ? 'eye' : 'ban', disabled ? 'Habilitar' : 'Desabilitar', `toggleBuilderStepEnabled('${id}');_closeStepContextMenu()`, { danger: !disabled }),
    sep,
    _ctxMenuItem('play', 'Executar este passo', `runBuilderStepOnly('${id}');_closeStepContextMenu()`, { disabled: !isTopLevel }),
    _ctxMenuItem('play-forward', 'Executar a partir deste passo', `runBuilderFromStep('${id}');_closeStepContextMenu()`, { disabled: !isTopLevel }),
    !isTopLevel ? `<div style="padding:.3rem .75rem .15rem;font-size:.65rem;color:#94a3b8;line-height:1.4">Executar só funciona com passos no nível principal do fluxo</div>` : '',
  ].join('');
  document.body.appendChild(menu);

  requestAnimationFrame(() => {
    const r = menu.getBoundingClientRect();
    if (r.right > window.innerWidth) menu.style.left = Math.max(4, window.innerWidth - r.width - 8) + 'px';
    if (r.bottom > window.innerHeight) menu.style.top = Math.max(4, window.innerHeight - r.height - 8) + 'px';
  });

  setTimeout(() => {
    document.addEventListener('click', _closeStepContextMenu, { once: true });
    document.addEventListener('keydown', _stepCtxMenuEscHandler);
  }, 0);
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
      <span style="display:inline-flex">${_icon(meta.icon, 20, meta.color)}</span>
      <span style="font-weight:700;font-size:.85rem;color:${meta.color};flex:1">${meta.label}</span>
      <button onclick="closeBuilderProps()" title="Fechar propriedades" style="width:24px;height:24px;border:1px solid #e2e8f0;border-radius:6px;background:white;cursor:pointer;color:#64748b;font-size:.8rem;display:flex;align-items:center;justify-content:center;flex-shrink:0">✕</button>
    </div>
    ${_field('NOME DA AÇÃO', `<input type="text" value="${escapeHtml(step.name)}" onchange="_upField('${step.id}','name',this.value)" ${_inp()} />`)}`;

  if (!AGENT_EXCLUDED_TYPES.has(step.type)) {
    const runOn = c.run_on === 'agent' ? 'agent' : 'server';
    html += _field('ONDE EXECUTAR', `<div style="display:flex;gap:.5rem">
      <label style="display:flex;align-items:center;gap:.35rem;padding:.38rem .75rem;border:1.5px solid ${runOn==='server'?'#2563eb':'#e2e8f0'};border-radius:7px;cursor:pointer;font-size:.8rem;background:${runOn==='server'?'#eff6ff':'white'};flex:1;justify-content:center" onclick="_upCfg('${step.id}','run_on','server')">
        <span style="font-size:.95rem">☁️</span> <span style="color:${runOn==='server'?'#2563eb':'#64748b'};font-weight:${runOn==='server'?'700':'400'}">Servidor</span>
      </label>
      <label style="display:flex;align-items:center;gap:.35rem;padding:.38rem .75rem;border:1.5px solid ${runOn==='agent'?'#2563eb':'#e2e8f0'};border-radius:7px;cursor:pointer;font-size:.8rem;background:${runOn==='agent'?'#eff6ff':'white'};flex:1;justify-content:center" onclick="_upCfg('${step.id}','run_on','agent')">
        <span style="font-size:.95rem">💻</span> <span style="color:${runOn==='agent'?'#2563eb':'#64748b'};font-weight:${runOn==='agent'?'700':'400'}">Agente</span>
      </label>
    </div>`);
    if (runOn === 'agent') {
      html += _hint('Roda na máquina do agente selecionado no topo da tela (não no servidor da HAC). Caminhos de arquivo/pasta são resolvidos no computador do agente.');
    }
  }

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

    case 'copy_file':
    case 'move_file':
      html += _field('ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/tmp/origem.txt" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('DESTINO', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/destino.txt" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      if (step.type === 'move_file') html += `<div style="background:#fef2f2;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#dc2626">⚠️ O arquivo de origem deixa de existir.</div>`;
      break;

    case 'file_hash':
      html += _field('CAMINHO DO ARQUIVO', `<input type="text" value="${escapeHtml(c.file_path||'')}" placeholder="/tmp/arquivo.bin" onchange="_upCfg('${step.id}','file_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('ALGORITMO', `<select onchange="_upCfg('${step.id}','hash_algo',this.value)" ${_sel()}>
        ${['sha256','sha1','md5','sha512'].map(a=>`<option value="${a}" ${a===(c.hash_algo||'sha256')?'selected':''}>${a}</option>`).join('')}
      </select>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="hash (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'file_info':
      html += _field('CAMINHO DO ARQUIVO', `<input type="text" value="${escapeHtml(c.file_path||'')}" placeholder="/tmp/arquivo.txt" onchange="_upCfg('${step.id}','file_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="info_json (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Retorna JSON com size_bytes, modified, created, is_dir');
      break;

    case 'search_in_files':
      html += _field('DIRETÓRIO', `<input type="text" value="${escapeHtml(c.directory||'.')}" placeholder="/tmp" onchange="_upCfg('${step.id}','directory',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('PADRÃO DE ARQUIVO', `<input type="text" value="${escapeHtml(c.pattern||'*')}" placeholder="*.txt" onchange="_upCfg('${step.id}','pattern',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('TEXTO A BUSCAR', `<input type="text" value="${escapeHtml(c.search||'')}" placeholder="palavra ou trecho" onchange="_upCfg('${step.id}','search',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="ocorrencias (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Busca recursiva (pastas dentro de pastas). Retorna arquivo:linha: trecho, um por linha.');
      break;

    case 'convert_encoding':
      html += _field('ARQUIVO DE ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/tmp/latin1.txt" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('ARQUIVO DE DESTINO', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="vazio = sobrescreve a origem" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('ENCODING DE ORIGEM', `<input type="text" value="${escapeHtml(c.encoding_from||'utf-8')}" onchange="_upCfg('${step.id}','encoding_from',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('ENCODING DE DESTINO', `<input type="text" value="${escapeHtml(c.encoding_to||'utf-8')}" onchange="_upCfg('${step.id}','encoding_to',this.value)" ${_inp('font-family:monospace')} />`);
      break;

    case 'ensure_dir':
      html += _field('DIRETÓRIO', `<input type="text" value="${escapeHtml(c.directory||'')}" placeholder="/tmp/nova_pasta" onchange="_upCfg('${step.id}','directory',this.value)" ${_inp('font-family:monospace')} />`);
      html += _hint('Cria a pasta (e pastas pai) se ainda não existir. Não dá erro se já existir.');
      break;

    case 'delete_folder':
      html += _field('DIRETÓRIO', `<input type="text" value="${escapeHtml(c.directory||'')}" placeholder="/tmp/pasta_antiga" onchange="_upCfg('${step.id}','directory',this.value)" ${_inp('font-family:monospace')} />`);
      html += `<div style="background:#fef2f2;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#dc2626">⚠️ Remove a pasta e TODO o conteúdo dela. Irreversível.</div>`;
      break;

    case 'zip_files':
      html += _field('ORIGEM (arquivo ou pasta)', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/tmp/pasta" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('ARQUIVO .ZIP DE SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/saida" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _hint('.zip é adicionado automaticamente se não informado');
      break;

    case 'unzip_file':
      html += _field('ARQUIVO .ZIP', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/tmp/arquivo.zip" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('PASTA DE DESTINO', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/extraido (vazio = .)" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      break;

    case 'backup_folder':
      html += _field('PASTA DE ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/dados/producao" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('PREFIXO DE DESTINO', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/backups/producao" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _hint('O nome final leva um timestamp: prefixo_AAAAMMDD_HHMMSS');
      break;

    case 'date_diff':
      html += _field('DATA A', `<input type="text" value="${escapeHtml(c.date_value||'')}" placeholder="{output} ou 2026-01-01" onchange="_upCfg('${step.id}','date_value',this.value)" ${_inp()} />`);
      html += _field('DATA B', `<input type="text" value="${escapeHtml(c.date_value2||'')}" placeholder="2026-01-31" onchange="_upCfg('${step.id}','date_value2',this.value)" ${_inp()} />`);
      html += _field('FORMATO DE ENTRADA', `<input type="text" value="${escapeHtml(c.date_format_in||'%Y-%m-%d')}" onchange="_upCfg('${step.id}','date_format_in',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('UNIDADE DO RESULTADO', `<select onchange="_upCfg('${step.id}','date_unit',this.value)" ${_sel()}>
        ${[['days','dias'],['hours','horas'],['minutes','minutos'],['seconds','segundos'],['weeks','semanas']].map(([v,l])=>`<option value="${v}" ${v===(c.date_unit||'days')?'selected':''}>${l}</option>`).join('')}
      </select>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'date_add':
      html += _field('DATA BASE', `<input type="text" value="${escapeHtml(c.date_value||'')}" placeholder="{output} ou 2026-01-01" onchange="_upCfg('${step.id}','date_value',this.value)" ${_inp()} />`);
      html += _field('FORMATO DE ENTRADA', `<input type="text" value="${escapeHtml(c.date_format_in||'%Y-%m-%d')}" onchange="_upCfg('${step.id}','date_format_in',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('QUANTIDADE (negativo = subtrai)', `<input type="number" value="${c.date_amount||0}" onchange="_upCfg('${step.id}','date_amount',+this.value)" ${_inp()} />`);
      html += _field('UNIDADE', `<select onchange="_upCfg('${step.id}','date_unit',this.value)" ${_sel()}>
        ${[['days','dias'],['hours','horas'],['minutes','minutos'],['seconds','segundos'],['weeks','semanas']].map(([v,l])=>`<option value="${v}" ${v===(c.date_unit||'days')?'selected':''}>${l}</option>`).join('')}
      </select>`);
      html += _field('FORMATO DE SAÍDA', `<input type="text" value="${escapeHtml(c.date_format_out||'%Y-%m-%d')}" onchange="_upCfg('${step.id}','date_format_out',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'format_date':
      html += _field('DATA', `<input type="text" value="${escapeHtml(c.date_value||'')}" placeholder="{output} ou 2026-01-01" onchange="_upCfg('${step.id}','date_value',this.value)" ${_inp()} />`);
      html += _field('FORMATO DE ENTRADA', `<input type="text" value="${escapeHtml(c.date_format_in||'%Y-%m-%d')}" onchange="_upCfg('${step.id}','date_format_in',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('FORMATO DE SAÍDA', `<input type="text" value="${escapeHtml(c.date_format_out||'%d/%m/%Y')}" onchange="_upCfg('${step.id}','date_format_out',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Códigos: %Y ano, %m mês, %d dia, %H hora, %M min, %S seg');
      break;

    case 'timezone_convert':
      html += _field('DATA/HORA', `<input type="text" value="${escapeHtml(c.date_value||'')}" placeholder="{output} ou 2026-01-01 12:00:00" onchange="_upCfg('${step.id}','date_value',this.value)" ${_inp()} />`);
      html += _field('FORMATO DE ENTRADA', `<input type="text" value="${escapeHtml(c.date_format_in||'%Y-%m-%d %H:%M:%S')}" onchange="_upCfg('${step.id}','date_format_in',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('FUSO DE ORIGEM', `<input type="text" value="${escapeHtml(c.timezone_from||'UTC')}" placeholder="UTC" onchange="_upCfg('${step.id}','timezone_from',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('FUSO DE DESTINO', `<input type="text" value="${escapeHtml(c.timezone_to||'America/Sao_Paulo')}" placeholder="America/Sao_Paulo" onchange="_upCfg('${step.id}','timezone_to',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('FORMATO DE SAÍDA', `<input type="text" value="${escapeHtml(c.date_format_out||'%Y-%m-%d %H:%M:%S')}" onchange="_upCfg('${step.id}','date_format_out',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Nomes de fuso no padrão IANA, ex: America/Sao_Paulo, Europe/Lisbon, UTC');
      break;

    case 'is_business_day':
      html += _field('DATA', `<input type="text" value="${escapeHtml(c.date_value||'')}" placeholder="{output} ou 2026-01-01" onchange="_upCfg('${step.id}','date_value',this.value)" ${_inp()} />`);
      html += _field('FORMATO DE ENTRADA', `<input type="text" value="${escapeHtml(c.date_format_in||'%Y-%m-%d')}" onchange="_upCfg('${step.id}','date_format_in',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="eh_util (true/false)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Considera apenas segunda a sexta — feriados não são levados em conta.');
      break;

    case 'foreach':
      html += _field('LISTA (JSON array ou uma linha por item)', `<textarea rows="3" placeholder='{output} ou ["a","b","c"]' onchange="_upCfg('${step.id}','list_source',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.list_source||'{output}')}</textarea>`);
      html += _field('VARIÁVEL DO ITEM', `<input type="text" value="${escapeHtml(c.item_variable||'item')}" placeholder="item" onchange="_upCfg('${step.id}','item_variable',this.value)" ${_inp()} />`);
      html += _hint('Dentro do bloco, use {nome_var} para o item atual e {nome_var_index} para o índice (0, 1, 2...).');
      break;

    case 'while_condition':
      html += _field('OPERADOR (avaliado sobre {output})', `<select onchange="_upCfg('${step.id}','operator',this.value)" ${_sel()}>
        ${[['contains','contém'],['not_contains','não contém'],['equals','igual a'],['not_equals','diferente de'],
           ['starts_with','começa com'],['ends_with','termina com'],['is_empty','está vazio'],['not_empty','não está vazio'],
           ['greater_than','maior que (número)'],['less_than','menor que (número)']]
          .map(([v,l])=>`<option value="${v}" ${v===c.operator?'selected':''}>${l}</option>`).join('')}
      </select>`);
      html += _field('VALOR A COMPARAR', `<input type="text" value="${escapeHtml(c.condition_value||'')}" onchange="_upCfg('${step.id}','condition_value',this.value)" ${_inp()} />`);
      html += _field('MÁXIMO DE ITERAÇÕES (segurança)', `<input type="number" value="${c.max_iterations||100}" min="1" max="10000" onchange="_upCfg('${step.id}','max_iterations',+this.value)" ${_inp()} />`);
      html += _hint('Repete o bloco enquanto a condição for verdadeira sobre o {output} atual, até o limite de iterações.');
      break;

    case 'try_catch':
      html += `<div style="background:#fffbeb;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#92400e">Executa o bloco TENTAR. Se qualquer ação dele falhar, executa o bloco SE FALHAR (catch) em vez de interromper a automação. A variável {error} fica disponível no bloco catch com a mensagem do erro.</div>`;
      break;

    case 'parallel':
      html += `<div style="background:#f0fdfa;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#0f766e">Cada ação dentro do bloco roda concorrentemente, isolada das outras (não enxergam variáveis umas das outras enquanto rodam). Ao final, o {output} vira a junção dos resultados (uma linha por ação) e as variáveis definidas por cada uma são mescladas de volta.</div>`;
      break;

    case 'call_automation':
      html += _field('AUTOMAÇÃO', `<select onchange="_upCfg('${step.id}','automation_id',this.value)" ${_sel()}>
        <option value="">Selecione uma automação...</option>
        ${_studioList.filter(a=>a.id !== _buildEditId).map(a=>`<option value="${a.id}" ${a.id===c.automation_id?'selected':''}>${escapeHtml(a.name)}</option>`).join('')}
      </select>`);
      html += _field('INPUT TEMPLATE', `<input type="text" value="${escapeHtml(c.input_template||'{output}')}" placeholder="{output}" onchange="_upCfg('${step.id}','input_template',this.value)" ${_inp()} />`);
      html += _field('SALVAR SAÍDA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="resultado_sub (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Limite de 5 níveis de profundidade entre automações, para evitar recursão infinita.');
      break;

    case 'random_wait':
      html += _field('MÍNIMO (segundos)', `<input type="number" value="${c.seconds||1}" min="0" max="60" step="0.1" onchange="_upCfg('${step.id}','seconds',+this.value)" ${_inp()} />`);
      html += _field('MÁXIMO (segundos)', `<input type="number" value="${c.seconds_max||3}" min="0" max="60" step="0.1" onchange="_upCfg('${step.id}','seconds_max',+this.value)" ${_inp()} />`);
      html += _hint('Útil para espaçar requisições/ações de forma menos previsível.');
      break;

    case 'read_excel':
      html += _field('CAMINHO DO ARQUIVO', `<input type="text" value="${escapeHtml(c.file_path||'')}" placeholder="/tmp/planilha.xlsx" onchange="_upCfg('${step.id}','file_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('ABA (vazio = primeira)', `<input type="text" value="${escapeHtml(c.sheet_name||'')}" placeholder="Sheet1" onchange="_upCfg('${step.id}','sheet_name',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="linhas (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Retorna JSON: lista de objetos, um por linha, usando a primeira linha como cabeçalho.');
      break;

    case 'write_excel':
      html += _field('DADOS (JSON: lista de objetos)', `<textarea rows="4" placeholder='{output} ou [{"nome":"A","valor":1}]' onchange="_upCfg('${step.id}','data_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.data_input||'{output}')}</textarea>`);
      html += _field('ARQUIVO DE SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/planilha.xlsx" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('NOME DA ABA', `<input type="text" value="${escapeHtml(c.sheet_name||'Sheet1')}" onchange="_upCfg('${step.id}','sheet_name',this.value)" ${_inp()} />`);
      break;

    case 'read_csv':
      html += _field('CAMINHO DO ARQUIVO', `<input type="text" value="${escapeHtml(c.file_path||'')}" placeholder="/tmp/dados.csv" onchange="_upCfg('${step.id}','file_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('DELIMITADOR', `<input type="text" value="${escapeHtml(c.delimiter||',')}" maxlength="1" onchange="_upCfg('${step.id}','delimiter',this.value)" ${_inp('font-family:monospace;max-width:60px')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="linhas (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'write_csv':
      html += _field('DADOS (JSON: lista de objetos)', `<textarea rows="4" placeholder='{output} ou [{"nome":"A","valor":1}]' onchange="_upCfg('${step.id}','data_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.data_input||'{output}')}</textarea>`);
      html += _field('ARQUIVO DE SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/dados.csv" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('DELIMITADOR', `<input type="text" value="${escapeHtml(c.delimiter||',')}" maxlength="1" onchange="_upCfg('${step.id}','delimiter',this.value)" ${_inp('font-family:monospace;max-width:60px')} />`);
      break;

    case 'filter_data':
      html += _field('DADOS DE ENTRADA (JSON)', `<input type="text" value="${escapeHtml(c.data_input||'{output}')}" onchange="_upCfg('${step.id}','data_input',this.value)" ${_inp()} />`);
      html += _field('COLUNA', `<input type="text" value="${escapeHtml(c.sort_key||'')}" placeholder="nome_da_coluna" onchange="_upCfg('${step.id}','sort_key',this.value)" ${_inp()} />`);
      html += _field('OPERADOR', `<select onchange="_upCfg('${step.id}','operator',this.value)" ${_sel()}>
        ${[['contains','contém'],['not_contains','não contém'],['equals','igual a'],['not_equals','diferente de'],
           ['starts_with','começa com'],['ends_with','termina com'],['is_empty','está vazio'],['not_empty','não está vazio'],
           ['greater_than','maior que (número)'],['less_than','menor que (número)']]
          .map(([v,l])=>`<option value="${v}" ${v===c.operator?'selected':''}>${l}</option>`).join('')}
      </select>`);
      html += _field('VALOR A COMPARAR', `<input type="text" value="${escapeHtml(c.condition_value||'')}" onchange="_upCfg('${step.id}','condition_value',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'merge_data':
      html += _field('DADOS À ESQUERDA (JSON)', `<input type="text" value="${escapeHtml(c.data_input||'{output}')}" onchange="_upCfg('${step.id}','data_input',this.value)" ${_inp()} />`);
      html += _field('DADOS À DIREITA (JSON)', `<input type="text" value="${escapeHtml(c.data_input2||'')}" placeholder='[{"id":1,"nome":"A"}]' onchange="_upCfg('${step.id}','data_input2',this.value)" ${_inp()} />`);
      html += _field('CHAVE DE JUNÇÃO', `<input type="text" value="${escapeHtml(c.merge_key||'')}" placeholder="id" onchange="_upCfg('${step.id}','merge_key',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'dedupe_data':
      html += _field('DADOS DE ENTRADA (JSON)', `<input type="text" value="${escapeHtml(c.data_input||'{output}')}" onchange="_upCfg('${step.id}','data_input',this.value)" ${_inp()} />`);
      html += _field('CHAVE (vazio = linha inteira)', `<input type="text" value="${escapeHtml(c.merge_key||'')}" placeholder="email" onchange="_upCfg('${step.id}','merge_key',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'sort_group_data':
      html += _field('DADOS DE ENTRADA (JSON)', `<input type="text" value="${escapeHtml(c.data_input||'{output}')}" onchange="_upCfg('${step.id}','data_input',this.value)" ${_inp()} />`);
      html += _field('ORDENAR POR (coluna)', `<input type="text" value="${escapeHtml(c.sort_key||'')}" onchange="_upCfg('${step.id}','sort_key',this.value)" ${_inp()} />`);
      html += _field('ORDEM', `<label style="display:flex;align-items:center;gap:.4rem;font-size:.8rem;cursor:pointer">
        <input type="checkbox" ${c.sort_desc?'checked':''} onchange="_upCfg('${step.id}','sort_desc',this.checked)" /> Decrescente
      </label>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'pdf_extract_text':
    case 'pdf_extract_tables':
      html += _field('ARQUIVO PDF', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/tmp/documento.pdf" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'pdf_merge':
      html += _field('LISTA DE ARQUIVOS (JSON array de caminhos)', `<textarea rows="3" placeholder='["/tmp/a.pdf","/tmp/b.pdf"]' onchange="_upCfg('${step.id}','list_source',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.list_source||'[]')}</textarea>`);
      html += _field('ARQUIVO DE SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/mesclado.pdf" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      break;

    case 'pdf_split':
      html += _field('ARQUIVO PDF', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/tmp/documento.pdf" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('PASTA DE DESTINO', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/paginas" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR LISTA DE ARQUIVOS EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Uma página por arquivo PDF: pagina_1.pdf, pagina_2.pdf...');
      break;

    case 'pdf_generate':
      html += _field('CONTEÚDO (texto simples)', `<textarea rows="5" placeholder="{output} ou texto fixo" onchange="_upCfg('${step.id}','content',this.value)" ${_ta()}>${escapeHtml(c.content||'{output}')}</textarea>`);
      html += _field('ARQUIVO DE SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/relatorio.pdf" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _hint('Gera um PDF simples em texto corrido (A4, quebra de página automática).');
      break;

    case 'pdf_fill_form':
      html += _field('ARQUIVO PDF (com campos de formulário)', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/tmp/formulario.pdf" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('CAMPOS (JSON: nome do campo → valor)', `<textarea rows="3" placeholder='{"nome":"João","cpf":"000.000.000-00"}' onchange="_upCfg('${step.id}','data_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.data_input||'{}')}</textarea>`);
      html += _field('ARQUIVO DE SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/preenchido.pdf" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      break;

    case 'validate_json_schema':
      html += _field('JSON DE ENTRADA', `<input type="text" value="${escapeHtml(c.json_input||'{output}')}" onchange="_upCfg('${step.id}','json_input',this.value)" ${_inp()} />`);
      html += _field('SCHEMA (JSON Schema)', `<textarea rows="4" placeholder='{"type":"object","required":["nome"]}' onchange="_upCfg('${step.id}','schema_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.schema_input||'')}</textarea>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="validacao ('válido' ou 'inválido: ...')" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'convert_data_format':
      html += _field('DADOS DE ENTRADA', `<textarea rows="4" placeholder="{output}" onchange="_upCfg('${step.id}','data_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.data_input||'{output}')}</textarea>`);
      html += _field('FORMATO DE ORIGEM', `<select onchange="_upCfg('${step.id}','format_from',this.value)" ${_sel()}>
        ${['json','yaml','csv','xml'].map(f=>`<option value="${f}" ${f===(c.format_from||'json')?'selected':''}>${f.toUpperCase()}</option>`).join('')}
      </select>`);
      html += _field('FORMATO DE DESTINO', `<select onchange="_upCfg('${step.id}','format_to',this.value)" ${_sel()}>
        ${['json','yaml','csv','xml'].map(f=>`<option value="${f}" ${f===(c.format_to||'csv')?'selected':''}>${f.toUpperCase()}</option>`).join('')}
      </select>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'html_extract':
      html += _field('HTML DE ENTRADA', `<textarea rows="4" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('SELETOR CSS', `<input type="text" value="${escapeHtml(c.css_selector||'')}" placeholder=".preco, #titulo, table tr" onchange="_upCfg('${step.id}','css_selector',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="textos_encontrados" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Retorna o texto de cada elemento encontrado, como lista JSON.');
      break;

    case 'sql_on_data':
      html += _field('DADOS DE ENTRADA (JSON: lista de objetos)', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','data_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.data_input||'{output}')}</textarea>`);
      html += _field('QUERY SQL (tabela = "data")', `<textarea rows="4" placeholder="SELECT * FROM data WHERE valor > 100" onchange="_upCfg('${step.id}','sql_query',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.sql_query||'SELECT * FROM data')}</textarea>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Motor DuckDB — SQL padrão sobre os dados de entrada, sem precisar de banco externo.');
      break;

    case 'generate_fake_data':
      html += _field('TIPO', `<select onchange="_upCfg('${step.id}','fake_type',this.value)" ${_sel()}>
        ${[['name','Nome'],['email','Email'],['cpf','CPF'],['cnpj','CNPJ'],['phone','Telefone'],
           ['address','Endereço'],['company','Empresa'],['date','Data'],['text','Texto']]
          .map(([v,l])=>`<option value="${v}" ${v===(c.fake_type||'name')?'selected':''}>${l}</option>`).join('')}
      </select>`);
      html += _field('QUANTIDADE', `<input type="number" value="${c.fake_count||5}" min="1" max="1000" onchange="_upCfg('${step.id}','fake_count',+this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Dados fictícios em pt-BR, formato JSON (lista). Uso: testes, popular ambientes de homologação.');
      break;

    case 'validate_cpf_cnpj':
      html += _field('CPF OU CNPJ', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="{output} ou 000.000.000-00" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="validacao ('válido'/'inválido')" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Detecta automaticamente CPF (11 dígitos) ou CNPJ (14 dígitos) pelo tamanho.');
      break;

    case 'validate_email':
      html += _field('EMAIL', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Verifica sintaxe e se o domínio tem registro MX (deliverability).');
      break;

    case 'validate_phone':
      html += _field('TELEFONE', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="(11) 91234-5678" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('PAÍS (código ISO)', `<input type="text" value="${escapeHtml(c.region||'BR')}" placeholder="BR" onchange="_upCfg('${step.id}','region',this.value)" ${_inp('max-width:80px')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'lookup_cep':
      html += _field('CEP', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="01310-100" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="endereco (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Consulta a API pública ViaCEP. Retorna JSON com logradouro, bairro, cidade, UF.');
      break;

    case 'format_currency':
      html += _field('VALOR NUMÉRICO', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="1234.56" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Formata em Real (R$ 1.234,56), padrão pt_BR.');
      break;

    case 'encrypt_text':
    case 'decrypt_text':
      html += _field('TEXTO', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('CHAVE SECRETA', `<input type="text" value="${escapeHtml(c.secret_key||'')}" placeholder="senha ou chave" onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('AES simétrico (Fernet) — use a mesma chave secreta para criptografar e descriptografar.');
      break;

    case 'generate_jwt':
      html += _field('PAYLOAD (JSON)', `<textarea rows="3" placeholder='{"user_id":"123"}' onchange="_upCfg('${step.id}','json_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.json_input||'{}')}</textarea>`);
      html += _field('CHAVE SECRETA', `<input type="text" value="${escapeHtml(c.secret_key||'')}" onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'verify_jwt':
      html += _field('TOKEN JWT', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('CHAVE SECRETA', `<input type="text" value="${escapeHtml(c.secret_key||'')}" onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="payload (JSON) ou 'inválido: ...'" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'hash_password':
      html += _field('SENHA', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Usa bcrypt (mesmo algoritmo do login da plataforma).');
      break;

    case 'verify_password':
      html += _field('SENHA EM TEXTO PLANO', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('HASH BCRYPT PARA COMPARAR', `<input type="text" value="${escapeHtml(c.secret_key||'')}" placeholder="$2b$12$..." onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="senha_ok (true/false)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'generate_otp':
      html += _field('SECRET (vazio = gera um novo)', `<input type="text" value="${escapeHtml(c.secret_key||'')}" placeholder="base32, ex: JBSWY3DPEHPK3PXP" onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="otp_json ({secret, code})" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Compatível com Google Authenticator. Código válido por 30s.');
      break;

    case 'verify_otp':
      html += _field('SECRET', `<input type="text" value="${escapeHtml(c.secret_key||'')}" onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('CÓDIGO DIGITADO', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="123456" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="otp_ok (true/false)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'generate_secure_password':
      html += _field('TAMANHO', `<input type="number" value="${c.password_length||16}" min="4" max="128" onchange="_upCfg('${step.id}','password_length',+this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'check_ssl_cert':
      html += _field('DOMÍNIO', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="exemplo.com (sem https://)" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Retorna JSON com emissor, validade e dias restantes até expirar.');
      break;

    case 'hmac_sign':
      html += _field('MENSAGEM', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('CHAVE SECRETA', `<input type="text" value="${escapeHtml(c.secret_key||'')}" onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Útil para validar assinatura de webhooks recebidos (HMAC-SHA256).');
      break;

    case 'send_telegram':
      html += _field('BOT TOKEN', `<input type="text" value="${escapeHtml(c.secret_key||'')}" placeholder="123456:ABC-DEF..." onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('CHAT ID', `<input type="text" value="${escapeHtml(c.to||'')}" placeholder="-1001234567890" onchange="_upCfg('${step.id}','to',this.value)" ${_inp()} />`);
      html += _field('MENSAGEM', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','content',this.value)" ${_ta()}>${escapeHtml(c.content||'{output}')}</textarea>`);
      break;

    case 'send_slack':
    case 'send_discord':
      html += _field('WEBHOOK URL', `<input type="text" value="${escapeHtml(c.url||'')}" placeholder="https://hooks.slack.com/... ou discord.com/api/webhooks/..." onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('MENSAGEM', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','content',this.value)" ${_ta()}>${escapeHtml(c.content||'{output}')}</textarea>`);
      break;

    case 'send_whatsapp':
    case 'send_sms':
      html += _field('TWILIO ACCOUNT SID', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('TWILIO AUTH TOKEN', `<input type="text" value="${escapeHtml(c.api_secret||'')}" onchange="_upCfg('${step.id}','api_secret',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('NÚMERO DE ORIGEM (Twilio)', `<input type="text" value="${escapeHtml(c.from_number||'')}" placeholder="+14155238886" onchange="_upCfg('${step.id}','from_number',this.value)" ${_inp()} />`);
      html += _field('NÚMERO DE DESTINO', `<input type="text" value="${escapeHtml(c.to||'')}" placeholder="+5511999999999" onchange="_upCfg('${step.id}','to',this.value)" ${_inp()} />`);
      html += _field('MENSAGEM', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','content',this.value)" ${_ta()}>${escapeHtml(c.content||'{output}')}</textarea>`);
      break;

    case 'send_push_notification':
      html += _field('ONESIGNAL API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('ONESIGNAL APP ID', `<input type="text" value="${escapeHtml(c.secret_key||'')}" onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('PLAYER ID (vazio = todos)', `<input type="text" value="${escapeHtml(c.to||'')}" onchange="_upCfg('${step.id}','to',this.value)" ${_inp()} />`);
      html += _field('MENSAGEM', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','content',this.value)" ${_ta()}>${escapeHtml(c.content||'{output}')}</textarea>`);
      break;

    case 'create_incident':
      html += _field('PAGERDUTY ROUTING KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('RESUMO DO INCIDENTE', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','content',this.value)" ${_ta()}>${escapeHtml(c.content||'{output}')}</textarea>`);
      html += _hint('Severidade fixa em "critical". Cria um evento de trigger na Events API v2.');
      break;

    case 'asaas_create_charge':
      html += _field('ASAAS API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('ID DO CLIENTE (Asaas)', `<input type="text" value="${escapeHtml(c.to||'')}" placeholder="cus_000000000000" onchange="_upCfg('${step.id}','to',this.value)" ${_inp()} />`);
      html += _field('VALOR (R$)', `<input type="text" value="${escapeHtml(c.text_input||'')}" placeholder="99.90" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('DESCRIÇÃO', `<input type="text" value="${escapeHtml(c.content||'')}" onchange="_upCfg('${step.id}','content',this.value)" ${_inp()} />`);
      html += _field('SALVAR RESPOSTA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Cria cobrança via Pix. O cliente precisa já existir no Asaas.');
      break;

    case 'asaas_check_payment':
      html += _field('ASAAS API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('ID DO PAGAMENTO', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="pay_000000000000" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR RESPOSTA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'generate_pix_qr':
      html += _field('CHAVE PIX', `<input type="text" value="${escapeHtml(c.pix_key||'')}" placeholder="email, celular, CPF/CNPJ ou chave aleatória" onchange="_upCfg('${step.id}','pix_key',this.value)" ${_inp()} />`);
      html += _field('NOME DO RECEBEDOR', `<input type="text" value="${escapeHtml(c.pix_merchant_name||'')}" maxlength="25" onchange="_upCfg('${step.id}','pix_merchant_name',this.value)" ${_inp()} />`);
      html += _field('CIDADE', `<input type="text" value="${escapeHtml(c.pix_merchant_city||'')}" maxlength="15" onchange="_upCfg('${step.id}','pix_merchant_city',this.value)" ${_inp()} />`);
      html += _field('VALOR (opcional)', `<input type="text" value="${escapeHtml(c.text_input||'')}" placeholder="vazio = Pix sem valor fixo" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="pix_copia_cola" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Gera o código "Pix copia e cola" (BR Code / EMV) — não gera a imagem do QR.');
      break;

    case 'get_currency_rate':
      html += _field('PAR DE MOEDAS', `<input type="text" value="${escapeHtml(c.text_input||'USD-BRL')}" placeholder="USD-BRL" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'get_crypto_price':
      html += _field('MOEDA (id CoinGecko)', `<input type="text" value="${escapeHtml(c.text_input||'bitcoin')}" placeholder="bitcoin, ethereum..." onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Retorna preço em USD e BRL.');
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

    case 'http_request_retry':
      html += _field('MÉTODO', `<select onchange="_upCfg('${step.id}','method',this.value)" ${_sel()}>
        ${['GET','POST','PUT','PATCH','DELETE'].map(m=>`<option ${m===(c.method||'GET')?'selected':''}>${m}</option>`).join('')}
      </select>`);
      html += _field('URL', `<input type="text" value="${escapeHtml(c.url||'')}" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('HEADERS (chave: valor por linha)', `<textarea rows="3" onchange="_upCfgHeaders('${step.id}',this.value)" ${_ta('font-family:monospace')}>${_headersToText(c.headers)}</textarea>`);
      html += _field('BODY', `<textarea rows="3" onchange="_upCfg('${step.id}','body',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.body||'')}</textarea>`);
      html += _field('MÁXIMO DE TENTATIVAS', `<input type="number" value="${c.max_iterations||3}" min="1" max="10" onchange="_upCfg('${step.id}','max_iterations',+this.value)" ${_inp()} />`);
      html += _field('SALVAR RESPOSTA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Repete com espera exponencial (1s, 2s, 4s...) em erro de rede ou HTTP 5xx. Erros 4xx não são repetidos.');
      break;

    case 'download_file':
      html += _field('URL', `<input type="text" value="${escapeHtml(c.url||'')}" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/arquivo.pdf" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      break;

    case 'upload_file':
      html += _field('ARQUIVO LOCAL', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/tmp/arquivo.pdf" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('URL DE DESTINO', `<input type="text" value="${escapeHtml(c.url||'')}" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('HEADERS (chave: valor por linha)', `<textarea rows="3" onchange="_upCfgHeaders('${step.id}',this.value)" ${_ta('font-family:monospace')}>${_headersToText(c.headers)}</textarea>`);
      html += _hint('Envia como multipart/form-data, campo "file".');
      break;

    case 'scrape_html_table':
      html += _field('URL OU HTML', `<textarea rows="3" placeholder="{output} ou https://site.com/pagina" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="tabelas (lista de tabelas encontradas)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Extrai todas as tabelas <table> da página. Retorna uma lista de tabelas (cada uma como lista de objetos).');
      break;

    case 'read_rss_feed':
      html += _field('URL DO FEED', `<input type="text" value="${escapeHtml(c.url||'')}" placeholder="https://site.com/feed.xml" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'get_weather':
      html += _field('CIDADE', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="São Paulo,BR" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('OPENWEATHERMAP API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'geocode_address':
      html += _field('ENDEREÇO', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="Av. Paulista, 1000, São Paulo" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="coords (lat, lon, display_name)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Via OpenStreetMap Nominatim (gratuito, sem API key).');
      break;

    case 'calculate_distance':
      html += _field('COORDENADA DE ORIGEM (lat,lon)', `<input type="text" value="${escapeHtml(c.coord_from||'')}" placeholder="-23.5505,-46.6333" onchange="_upCfg('${step.id}','coord_from',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('COORDENADA DE DESTINO (lat,lon)', `<input type="text" value="${escapeHtml(c.coord_to||'')}" placeholder="-22.9068,-43.1729" onchange="_upCfg('${step.id}','coord_to',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="distancia_km" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Distância em linha reta (fórmula de Haversine), em km.');
      break;

    case 'shorten_url':
      html += _field('URL LONGA', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'lookup_cnpj':
      html += _field('CNPJ', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="00.000.000/0001-00" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Via BrasilAPI (dados da Receita Federal, gratuito).');
      break;

    case 'translate_text':
      html += _field('TEXTO', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('IDIOMA DE DESTINO', `<input type="text" value="${escapeHtml(c.region||'EN')}" placeholder="EN, PT-BR, ES..." onchange="_upCfg('${step.id}','region',this.value)" ${_inp('max-width:120px')} />`);
      html += _field('DEEPL API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'get_holidays':
      html += _field('ANO', `<input type="text" value="${escapeHtml(c.text_input||'')}" placeholder="2026 (vazio = ano atual)" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp('max-width:120px')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Feriados nacionais do Brasil, via BrasilAPI.');
      break;

    case 'detect_language':
      html += _field('TEXTO', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="idioma (ex: pt, en, es)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'count_tokens':
      html += _field('TEXTO', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="qtd_tokens" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Estimativa via encoding cl100k_base (compatível com GPT-4/Claude aproximadamente). Útil antes de chamar um Agente IA para estimar custo.');
      break;

    case 'generate_embedding':
      html += _field('TEXTO', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('OPENAI API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Modelo text-embedding-3-small. Retorna o vetor como JSON.');
      break;

    case 'semantic_search':
      html += _field('QUERY (texto a buscar)', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('CANDIDATOS (JSON)', `<textarea rows="4" placeholder='[{"text":"...","embedding":[...]}]' onchange="_upCfg('${step.id}','json_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.json_input||'[]')}</textarea>`);
      html += _field('OPENAI API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Compara a query com cada candidato (embedding já calculado) por similaridade de cosseno e retorna o melhor.');
      break;

    case 'moderate_content':
      html += _field('TEXTO', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('OPENAI API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="moderacao ({flagged, categories})" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'compare_texts':
      html += _field('TEXTO A', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('TEXTO B', `<textarea rows="3" onchange="_upCfg('${step.id}','data_input2',this.value)" ${_ta()}>${escapeHtml(c.data_input2||'')}</textarea>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="similaridade (0 a 1)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Similaridade textual determinística (difflib), não semântica. Para similaridade de sentido, use embeddings.');
      break;

    case 'system_stats':
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Mede o uso no agente/servidor onde a automação está rodando.');
      break;

    case 'list_processes':
      html += _field('LIMITE (top N por memória)', `<input type="number" value="${c.fake_count||20}" min="1" max="200" onchange="_upCfg('${step.id}','fake_count',+this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'check_port_open':
      html += _field('HOST:PORTA', `<input type="text" value="${escapeHtml(c.text_input||'')}" placeholder="exemplo.com:443" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="porta_status ('aberta'/'fechada')" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'dns_lookup':
      html += _field('DOMÍNIO', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="exemplo.com" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('TIPO DE REGISTRO', `<select onchange="_upCfg('${step.id}','operation',this.value)" ${_sel()}>
        ${['A','AAAA','MX','TXT','NS','CNAME'].map(t=>`<option value="${t}" ${t===(c.operation||'A')?'selected':''}>${t}</option>`).join('')}
      </select>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'whois_lookup':
      html += _field('DOMÍNIO', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" placeholder="exemplo.com" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'ssh_execute':
      html += _field('HOST (porta opcional)', `<input type="text" value="${escapeHtml(c.url||'')}" placeholder="servidor.exemplo.com ou servidor.com:2222" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('USUÁRIO', `<input type="text" value="${escapeHtml(c.to||'')}" onchange="_upCfg('${step.id}','to',this.value)" ${_inp()} />`);
      html += _field('SENHA', `<input type="text" value="${escapeHtml(c.secret_key||'')}" onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('COMANDO', `<input type="text" value="${escapeHtml(c.command||'')}" placeholder="ls -la /var/www" onchange="_upCfg('${step.id}','command',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR SAÍDA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Autenticação por senha. Timeout de 30s no comando.');
      break;

    case 'read_env_var':
      html += _field('NOME DA VARIÁVEL', `<input type="text" value="${escapeHtml(c.text_input||'')}" placeholder="PATH" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Lê do ambiente do processo da API/worker — não confundir com variáveis do fluxo.');
      break;

    case 'check_url_uptime':
      html += _field('URL', `<input type="text" value="${escapeHtml(c.url||'')}" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="uptime_info ({up, status_code, latency_ms})" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'redis_get':
    case 'queue_pop':
      html += _field('URL DE CONEXÃO REDIS', `<input type="text" value="${escapeHtml(c.url||'')}" placeholder="redis://user:senha@host:6379/0" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field(step.type==='queue_pop' ? 'NOME DA FILA' : 'CHAVE', `<input type="text" value="${escapeHtml(c.text_input||'')}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'redis_set':
    case 'queue_push':
      html += _field('URL DE CONEXÃO REDIS', `<input type="text" value="${escapeHtml(c.url||'')}" placeholder="redis://user:senha@host:6379/0" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field(step.type==='queue_push' ? 'NOME DA FILA' : 'CHAVE', `<input type="text" value="${escapeHtml(c.text_input||'')}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('VALOR', `<input type="text" value="${escapeHtml(c.content||'{output}')}" onchange="_upCfg('${step.id}','content',this.value)" ${_inp()} />`);
      break;

    case 'sql_query_external':
      html += _field('DSN DE CONEXÃO (Postgres)', `<input type="text" value="${escapeHtml(c.url||'')}" placeholder="postgresql://user:senha@host:5432/banco" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('QUERY SQL', `<textarea rows="4" placeholder="SELECT * FROM clientes LIMIT 10" onchange="_upCfg('${step.id}','sql_query',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.sql_query||'SELECT 1')}</textarea>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'render_template':
      html += _field('TEMPLATE (Jinja2)', `<textarea rows="5" placeholder="Olá {{ nome }}, seu pedido {{ pedido_id }} foi confirmado." onchange="_upCfg('${step.id}','content',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.content||'')}</textarea>`);
      html += _field('VARIÁVEIS (JSON)', `<textarea rows="3" placeholder='{"nome":"Ana","pedido_id":123}' onchange="_upCfg('${step.id}','json_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.json_input||'{}')}</textarea>`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Sintaxe Jinja2: {{ variavel }}, {% if %}, {% for %}. {{ output }} e {{ input }} também disponíveis.');
      break;

    case 'generate_word_doc':
      html += _field('CONTEÚDO', `<textarea rows="5" placeholder="{output}" onchange="_upCfg('${step.id}','content',this.value)" ${_ta()}>${escapeHtml(c.content||'{output}')}</textarea>`);
      html += _field('ARQUIVO DE SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/documento.docx" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _hint('Um parágrafo por linha do conteúdo.');
      break;

    case 'generate_pptx':
      html += _field('SLIDES (JSON: lista de {title, content})', `<textarea rows="4" placeholder='[{"title":"Intro","content":"Bem-vindo"},{"title":"Dados","content":"..."}]' onchange="_upCfg('${step.id}','data_input',this.value)" ${_ta('font-family:monospace')}>${escapeHtml(c.data_input||'[]')}</textarea>`);
      html += _field('ARQUIVO DE SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/apresentacao.pptx" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      break;

    case 'resize_image':
      html += _field('IMAGEM DE ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('LARGURA (0 = auto)', `<input type="number" value="${c.width||0}" min="0" onchange="_upCfg('${step.id}','width',+this.value)" ${_inp()} />`);
      html += _field('ALTURA (0 = auto)', `<input type="number" value="${c.height||0}" min="0" onchange="_upCfg('${step.id}','height',+this.value)" ${_inp()} />`);
      html += _hint('Informe só largura OU altura para manter a proporção.');
      break;

    case 'convert_image_format':
      html += _field('IMAGEM DE ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SAÍDA (extensão define o formato)', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/imagem.webp" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      break;

    case 'add_watermark':
      html += _field('IMAGEM DE ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('TEXTO DA MARCA D\'ÁGUA', `<input type="text" value="${escapeHtml(c.text||'')}" onchange="_upCfg('${step.id}','text',this.value)" ${_inp()} />`);
      break;

    case 'generate_thumbnail':
      html += _field('IMAGEM DE ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('TAMANHO MÁXIMO (px)', `<input type="number" value="${c.width||200}" min="16" onchange="_upCfg('${step.id}','width',+this.value)" ${_inp()} />`);
      break;

    case 'generate_qrcode':
      html += _field('CONTEÚDO', `<input type="text" value="${escapeHtml(c.text_input||'{output}')}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_inp()} />`);
      html += _field('SAÍDA (imagem)', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/qrcode.png" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      break;

    case 'read_qrcode':
      html += _field('IMAGEM COM QR CODE', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'compare_images':
      html += _field('IMAGEM A', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('IMAGEM B', `<input type="text" value="${escapeHtml(c.dest_path||'')}" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="diff ({diff_bits, similarity})" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;

    case 'generate_ai_image':
      html += _field('PROMPT', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('OPENAI API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/gerada.png" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _hint('DALL-E 3, 1024x1024.');
      break;

    case 'transcode_media':
    case 'extract_audio':
      html += _field('ARQUIVO DE ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SAÍDA (extensão define o formato)', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="${step.type==='extract_audio'?'/tmp/audio.mp3':'/tmp/saida.mp4'}" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += `<div style="background:#faf5ff;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#7e22ce">⚠️ Requer <code>ffmpeg</code> instalado no agente que executar este passo.</div>`;
      break;

    case 'trim_media':
      html += _field('ARQUIVO DE ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('INÍCIO (segundos)', `<input type="number" value="${c.seconds||0}" min="0" step="0.1" onchange="_upCfg('${step.id}','seconds',+this.value)" ${_inp()} />`);
      html += _field('DURAÇÃO (segundos, 0 = até o fim)', `<input type="number" value="${c.seconds_max||0}" min="0" step="0.1" onchange="_upCfg('${step.id}','seconds_max',+this.value)" ${_inp()} />`);
      html += `<div style="background:#faf5ff;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#7e22ce">⚠️ Requer <code>ffmpeg</code> instalado no agente que executar este passo.</div>`;
      break;

    case 'extract_video_frame':
      html += _field('VÍDEO DE ORIGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SAÍDA (imagem)', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/frame.png" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('TIMESTAMP (segundos)', `<input type="number" value="${c.seconds||0}" min="0" step="0.1" onchange="_upCfg('${step.id}','seconds',+this.value)" ${_inp()} />`);
      html += `<div style="background:#faf5ff;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#7e22ce">⚠️ Requer <code>ffmpeg</code> instalado no agente que executar este passo.</div>`;
      break;

    case 'transcribe_audio':
      html += _field('ARQUIVO DE ÁUDIO', `<input type="text" value="${escapeHtml(c.source_path||'')}" placeholder="/tmp/audio.mp3" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('OPENAI API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Usa a API Whisper da OpenAI (nuvem) — não precisa de ffmpeg nem de modelo local.');
      break;

    case 'text_to_speech':
      html += _field('TEXTO', `<textarea rows="3" placeholder="{output}" onchange="_upCfg('${step.id}','text_input',this.value)" ${_ta()}>${escapeHtml(c.text_input||'{output}')}</textarea>`);
      html += _field('OPENAI API KEY', `<input type="text" value="${escapeHtml(c.api_key||'')}" onchange="_upCfg('${step.id}','api_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SAÍDA', `<input type="text" value="${escapeHtml(c.dest_path||'')}" placeholder="/tmp/fala.mp3" onchange="_upCfg('${step.id}','dest_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _hint('Usa a API TTS da OpenAI (nuvem), voz "alloy".');
      break;

    case 'ocr_image':
      html += _field('IMAGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += `<div style="background:#faf5ff;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#7e22ce">⚠️ Requer <code>tesseract-ocr</code> instalado no agente (idiomas português + inglês).</div>`;
      break;

    case 'ocr_pdf_scanned':
      html += _field('ARQUIVO PDF (escaneado)', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += `<div style="background:#faf5ff;border-radius:7px;padding:.5rem .65rem;font-size:.72rem;color:#7e22ce">⚠️ Requer <code>tesseract-ocr</code> E <code>poppler</code> instalados no agente.</div>`;
      break;

    case 'detect_face_object':
      html += _field('IMAGEM', `<input type="text" value="${escapeHtml(c.source_path||'')}" onchange="_upCfg('${step.id}','source_path',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="rostos ({count, boxes})" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Detecção de rosto frontal via OpenCV (Haar cascade, incluso na biblioteca — não precisa de binário externo).');
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

    case 'read_email_imap':
      html += _field('SERVIDOR IMAP', `<input type="text" value="${escapeHtml(c.url||'')}" placeholder="imap.gmail.com" onchange="_upCfg('${step.id}','url',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('EMAIL', `<input type="text" value="${escapeHtml(c.to||'')}" placeholder="voce@gmail.com" onchange="_upCfg('${step.id}','to',this.value)" ${_inp()} />`);
      html += _field('SENHA (de app, recomendado)', `<input type="text" value="${escapeHtml(c.secret_key||'')}" onchange="_upCfg('${step.id}','secret_key',this.value)" ${_inp('font-family:monospace')} />`);
      html += _field('QUANTIDADE (mais recentes)', `<input type="number" value="${c.fake_count||5}" min="1" max="50" onchange="_upCfg('${step.id}','fake_count',+this.value)" ${_inp()} />`);
      html += _field('SALVAR EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      html += _hint('Gmail exige senha de app (não a senha normal da conta), com IMAP habilitado.');
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
           ['base64_encode','Codificar Base64'],['base64_decode','Decodificar Base64'],
           ['remove_accents','Remover acentos'],['slugify','Slugify (url-amigável)']]
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
      html += _sessionEngineNotice(c.session_name);
      html += _field('SELETOR (CSS, XPATH OU OUTRO)', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="#id, .classe, //button[text()='Entrar'] ou xpath=..." onchange="_upCfg('${step.id}','target',this.value)" ${_inp('font-family:monospace')} />`);
      html += _SELECTOR_HINT;
      break;
    }

    case 'browser_type': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _sessionEngineNotice(c.session_name);
      html += _field('SELETOR (CSS, XPATH OU OUTRO)', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="#id, .classe, //input[@name='user'] ou xpath=..." onchange="_upCfg('${step.id}','target',this.value)" ${_inp('font-family:monospace')} />`);
      html += _SELECTOR_HINT;
      html += _field('TEXTO A DIGITAR', `<input type="text" value="${escapeHtml(c.value||'')}" placeholder="texto ou {variavel}" onchange="_upCfg('${step.id}','value',this.value)" ${_inp()} />`);
      break;
    }

    case 'browser_extract': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _sessionEngineNotice(c.session_name);
      html += _field('SELETOR (CSS, XPATH OU OUTRO)', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="#id, .classe, //span[@class='preco'] ou xpath=..." onchange="_upCfg('${step.id}','target',this.value)" ${_inp('font-family:monospace')} />`);
      html += _SELECTOR_HINT;
      html += _field('ATRIBUTO (opcional)', `<input type="text" value="${escapeHtml(c.value||'')}" placeholder="vazio = texto do elemento" onchange="_upCfg('${step.id}','value',this.value)" ${_inp()} />`);
      html += _field('SALVAR RESPOSTA EM VARIÁVEL', `<input type="text" value="${escapeHtml(c.variable_name||'')}" placeholder="texto_extraido (vazio = output)" onchange="_upCfg('${step.id}','variable_name',this.value)" ${_inp()} />`);
      break;
    }

    case 'browser_wait': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _sessionEngineNotice(c.session_name);
      html += _field('SELETOR A AGUARDAR (opcional, CSS/XPATH/OUTRO)', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="#id, .classe, //div[@id='pronto'] ou xpath=..." onchange="_upCfg('${step.id}','target',this.value)" ${_inp('font-family:monospace')} />`);
      html += _SELECTOR_HINT;
      html += _field('SEGUNDOS (se seletor vazio)', `<input type="text" value="${escapeHtml(c.value||'')}" placeholder="ex: 2" onchange="_upCfg('${step.id}','value',this.value)" ${_inp()} />`);
      html += _hint('Se um seletor for informado, aguarda o elemento aparecer; caso contrário, aguarda o número de segundos indicado.');
      break;
    }

    case 'browser_screenshot': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _sessionEngineNotice(c.session_name);
      html += _field('CAMINHO DO ARQUIVO', `<input type="text" value="${escapeHtml(c.target||'')}" placeholder="ex: screenshot.png" onchange="_upCfg('${step.id}','target',this.value)" ${_inp()} />`);
      break;
    }

    case 'browser_close': {
      html += _field('NOME DA SESSÃO', `<input type="text" value="${escapeHtml(c.session_name||'')}" placeholder="ex: login" onchange="_upCfg('${step.id}','session_name',this.value)" ${_inp()} />`);
      html += _sessionEngineNotice(c.session_name);
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
const _SELECTOR_HINT = _hint('Aceita CSS (<code>#id</code>, <code>.classe</code>), XPath — detectado automaticamente quando começa com <code>/</code> (inclusive o caminho absoluto do "Copiar XPath" do navegador, ex: <code>/html/body/div[2]/...</code>), <code>//</code>, <code>..</code> ou <code>(</code> — ou prefixos explícitos como <code>xpath=</code>, <code>css=</code>, <code>id=</code>, <code>name=</code>, <code>class=</code>, <code>tag=</code>, <code>link=</code>, <code>partial_link=</code> (estes últimos válidos em sessões Selenium).');

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
    // Campos controlados por botão/toggle (não por <input>/<textarea> com onchange)
    // precisam redesenhar o painel na hora, senão o botão destacado fica mostrando
    // a opção antiga até o usuário sair e voltar — o dado já mudou, só a tela não.
    if (['operation','type','run_on','browser_headless'].includes(field)) _renderPropsPanel(step);
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

  const editId = document.getElementById('builder-edit-id')?.value || null;

  // Já existe OUTRA automação (id diferente desta) com o mesmo nome? Confirma antes de prosseguir.
  const dup = (_studioList || []).find(a => a.id !== editId && (a.name || '').trim().toLowerCase() === name.toLowerCase());
  if (dup) {
    showConfirm(
      'Já existe uma automação com esse nome',
      `Já existe uma automação chamada "${name}". Deseja mesmo continuar e salvar assim mesmo?`,
      () => _doSaveBuilderAutomation(name, editId),
    );
    return;
  }
  await _doSaveBuilderAutomation(name, editId);
}

async function _doSaveBuilderAutomation(name, editId) {
  const btn = document.getElementById('builder-save-btn');
  if (btn.disabled) return; // trava contra duplo-clique disparando dois saves em paralelo
  btn.disabled = true;
  btn.style.opacity = '0.6';
  btn.style.cursor = 'default';

  try {
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

    const saved = editId
      ? await api('PATCH', `/studio/${editId}`, payload)
      : await api('POST', '/studio', payload);

    // Sempre grava o id retornado — independente do tipo de trigger — pra que um
    // próximo clique em Salvar (ou um duplo-clique) atualize em vez de criar de novo.
    document.getElementById('builder-edit-id').value = saved.id;
    _buildEditId = saved.id;
    if (saved.webhook_url) {
      document.getElementById('builder-webhook-url').textContent = saved.webhook_url;
      _buildTrigger.webhook_token = saved.trigger?.webhook_token || '';
    }
    showToast(editId ? 'Automação atualizada!' : 'Automação criada!', 'success');
    if (!saved.webhook_url || triggerType !== 'webhook') {
      backToStudio();
      return;
    }
  } catch (e) {
    showToast('Erro ao salvar: ' + e.message, 'error');
  } finally {
    btn.disabled = false;
    btn.style.opacity = '';
    btn.style.cursor = '';
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
    const initial = await api('POST', `/studio/${id}/run`, { input });
    let run = initial;
    while (run.status === 'running') {
      _renderStudioRunResult(run);
      await new Promise(r => setTimeout(r, 1000));
      run = await api('GET', `/studio/${id}/runs/${initial.id}`);
    }
    _renderStudioRunResult(run);
  } catch (e) {
    stepsDiv.innerHTML = `<div style="color:#ef4444;font-size:.85rem">❌ ${escapeHtml(e.message)}</div>`;
  } finally {
    btn.disabled = false; btn.textContent = '⚡ Executar';
  }
}

function _renderStudioRunResult(run) {
  const stepsDiv = document.getElementById('studio-run-steps');
  const sc = { success: '#16a34a', failed: '#ef4444', skipped: '#f59e0b', cancelled: '#f59e0b' };
  const si = { success: '✓', failed: '✕', skipped: '⚠', cancelled: '⏹' };

  stepsDiv.innerHTML = run.steps_result.map(s => {
    const meta = ACTION_MAP[s.step_type] || { icon: '⚙', color: '#64748b' };
    const color = sc[s.status] || '#64748b';
    const isCondition = s.condition_result != null;
    return `<div style="background:white;border:1.5px solid ${s.status==='failed'?'#fca5a5':'#e2e8f0'};border-radius:10px;padding:.6rem .875rem;display:flex;flex-direction:column;gap:.35rem">
      <div style="display:flex;align-items:center;gap:.5rem">
        <span style="display:inline-flex">${_icon(meta.icon, 16, meta.color)}</span>
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
