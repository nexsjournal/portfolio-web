(() => {
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const themeButtons = [...document.querySelectorAll('[data-theme-option]')];
  let theme = 'system';
  const swatches = [];

  function selectButton(buttons, current) {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button === current));
  }

  function applyTheme() {
    const dark = theme === 'dark' || (theme === 'system' && media.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    for (const { label, token } of swatches) label.textContent = dark && token.dark ? token.dark : token.value;
  }

  for (const button of themeButtons) button.addEventListener('click', () => {
    theme = button.dataset.themeOption;
    selectButton(themeButtons, button);
    applyTheme();
  });
  media.addEventListener('change', applyTheme);

  if (location.protocol === 'https:' || location.protocol === 'http:') {
    for (const link of document.querySelectorAll('[data-live-url]')) {
      link.href = link.dataset.liveUrl;
      link.hidden = false;
    }
  }

  const dialog = document.querySelector('#contact-dialog');
  const trigger = document.querySelector('#open-dialog');
  let backdropPress = false;
  trigger.addEventListener('click', () => dialog.showModal());
  dialog.addEventListener('pointerdown', (event) => { backdropPress = event.target === dialog; });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog && backdropPress) dialog.close();
    backdropPress = false;
  });
  dialog.addEventListener('close', () => trigger.focus());

  const filters = [...document.querySelectorAll('[data-filter]')];
  const notes = [...document.querySelectorAll('[data-note]')];
  for (const button of filters) button.addEventListener('click', () => {
    selectButton(filters, button);
    const filter = button.dataset.filter;
    for (const note of notes) note.hidden = filter !== 'all' && note.dataset.note !== filter;
    const count = notes.filter((note) => !note.hidden).length;
    document.querySelector('#empty-notes').hidden = count > 0;
    document.querySelector('#note-count').textContent = `显示 ${count} 条记录`;
  });

  const shot = document.querySelector('#active-shot');
  const shots = [...document.querySelectorAll('[data-shot]')];
  for (const button of shots) button.addEventListener('click', () => {
    selectButton(shots, button);
    shot.src = button.querySelector('img').src;
    shot.alt = `旅迹时光第 ${button.dataset.shot} 张界面截图`;
  });

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  const copyStatus = document.querySelector('#copy-status');
  let copyTimer;

  function legacyCopy(value) {
    const active = document.activeElement;
    const field = element('textarea', value, 'sr-only');
    field.readOnly = true;
    document.body.append(field);
    field.select();
    try {
      return document.execCommand('copy');
    } finally {
      field.remove();
      active?.focus({ preventScroll: true });
    }
  }

  async function copyVariable(token) {
    const value = `var(${token.css})`;
    let copied = false;
    try {
      await navigator.clipboard.writeText(value);
      copied = true;
    } catch {
      try { copied = legacyCopy(value); } catch { copied = false; }
    }
    copyStatus.textContent = copied ? `已复制 ${value}` : `复制未成功，可手动选择：${value}`;
    window.clearTimeout(copyTimer);
    if (copied) copyTimer = window.setTimeout(() => { copyStatus.textContent = ''; }, 2800);
  }

  function copyButton(text, className, token) {
    const button = element('button', text, className);
    button.type = 'button';
    button.setAttribute('aria-label', `复制 ${token.description} CSS 变量 ${token.css}`);
    button.addEventListener('click', () => { void copyVariable(token); });
    return button;
  }

  function drawSwatches(tokens, container, showValue) {
    for (const token of Object.values(tokens)) {
      const button = copyButton('', 'swatch', token);
      const chip = element('span', '', 'swatch-chip');
      chip.style.setProperty('--swatch', `var(${token.css})`);
      button.title = `${token.description} · ${token.value} · ${token.css}`;
      button.append(chip, element('span', token.description));
      if (showValue) {
        const label = element('code', token.value);
        button.append(label);
        swatches.push({ label, token });
      }
      container.append(button);
    }
  }

  const groups = globalThis.lexDesignTokens?.tokens;
  applyTheme();
  if (!groups) return;

  drawSwatches(groups.color, document.querySelector('#semantic-swatches'), true);
  drawSwatches(groups.project, document.querySelector('#project-swatches'), false);
  applyTheme();

  const groupTitle = {
    color: '语义色', aqua: 'Aqua 按钮', project: '作品色', note: '内容类型色', font: '字体栈',
    layout: '页面尺寸', space: '间距', radius: '圆角', type: '字号与行高', control: '交互控件',
    image: '图片比例', effect: '视觉效果', motion: '动效',
  };
  const container = document.querySelector('#token-groups');
  const registry = Object.entries(groups).map(([name, group]) => {
    const details = element('details', '', 'token-group');
    const summary = element('summary', groupTitle[name] || name);
    const titleCount = element('span');
    summary.append(titleCount);
    details.append(summary);
    details.open = name === 'color';
    const entries = Object.values(group).map((token) => {
      const item = element('div', '', 'token-entry');
      const label = element('div');
      label.append(element('code', token.css), element('p', token.description));
      const values = element('div', '', 'token-values');
      const location = `${token.source.file} · ${token.source.selector} · ${token.source.property}`;
      values.append(element('code', token.dark ? `浅色：${token.value}` : token.value));
      if (token.dark) values.append(element('code', `深色：${token.dark}`));
      const source = element('p', token.source.file);
      source.title = location;
      values.append(source);
      item.append(label, values, copyButton('复制', 'token-copy', token));
      details.append(item);
      return { item, text: [groupTitle[name], token.css, token.description, token.value, token.dark, location].join(' ').toLowerCase() };
    });
    container.append(details);
    return { details, entries, titleCount, restoreOpen: details.open };
  });

  const total = registry.reduce((count, group) => count + group.entries.length, 0);
  document.querySelector('#token-summary').textContent = `${total} 个 Tokens，从网站实际样式提取。点击分组查看浅深色值和源码位置。`;
  const search = document.querySelector('#token-search');
  let searching = false;

  function filterTokens() {
    const query = search.value.toLowerCase().trim();
    let found = 0;
    for (const group of registry) {
      let visible = 0;
      for (const { item, text } of group.entries) {
        item.hidden = !text.includes(query);
        if (!item.hidden) visible += 1;
      }
      group.titleCount.textContent = `${visible} 项`;
      group.details.hidden = visible === 0;
      if (query) {
        if (!searching) group.restoreOpen = group.details.open;
        group.details.open = visible > 0;
      } else if (searching) group.details.open = group.restoreOpen;
      found += visible;
    }
    searching = Boolean(query);
    document.querySelector('#empty-tokens').hidden = found > 0;
  }

  search.addEventListener('input', filterTokens);
  filterTokens();
})();
