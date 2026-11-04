/* Adds the Beacon and fictional encyclopedia as apps without replacing the phone UI. */
document.addEventListener('DOMContentLoaded', () => {
  const screen = document.querySelector('.screen');
  const existingIcon = document.querySelector('[data-app="messages"]');
  const grid = document.querySelector('.app-grid') || existingIcon?.parentElement;
  if (!screen || !grid) return;

  const apps = [
    ['newspaper', '📰', 'Beacon', '#fff1ce,#c99b61', 'The Borough Beacon', './newspaper.html'],
    ['wiki', 'W', 'Wikipedia', '#eeeeee,#c9d6ff', 'Alphonse Summers · AU Wiki', './wiki.html']
  ];
  for (const [id, glyph, label, colors, title, page] of apps) {
    if (document.querySelector(`[data-app="${id}"]`)) continue;
    const icon = document.createElement('button');
    icon.className = 'app-icon'; icon.dataset.app = id;
    icon.innerHTML = `<span class="icon-tile" style="background:linear-gradient(145deg,${colors})">${glyph}</span>${label}`;
    grid.appendChild(icon);
    const view = document.createElement('section');
    view.className = 'app-view'; view.id = `view-${id}`;
    view.innerHTML = `<header class="app-header"><button class="back-btn">‹ Home</button><h2>${title}</h2><span></span></header><iframe title="${title}" src="${page}" style="border:0;width:100%;height:100%;flex:1;background:#f4f0e7"></iframe>`;
    screen.appendChild(view);
    icon.addEventListener('click', () => {
      document.querySelector('#home').style.display = 'none';
      document.querySelectorAll('.app-view').forEach((app) => app.classList.remove('active'));
      view.classList.add('active');
    });
    view.querySelector('.back-btn').addEventListener('click', () => {
      view.classList.remove('active');
      document.querySelector('#home').style.display = 'flex';
    });
  }
});
