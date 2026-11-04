/* Adds the newspaper as a phone app without replacing the existing page. */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.app-grid');
  const home = document.querySelector('.screen');
  if (!grid || !home || document.querySelector('[data-app="newspaper"]')) return;

  const icon = document.createElement('button');
  icon.className = 'app-icon';
  icon.dataset.app = 'newspaper';
  icon.innerHTML = '<span class="icon-tile" style="background:linear-gradient(145deg,#fff1ce,#c99b61)">📰</span>Beacon';
  grid.appendChild(icon);

  const view = document.createElement('section');
  view.className = 'app-view';
  view.id = 'view-newspaper';
  view.innerHTML = '<header class="app-header"><button class="back-btn" data-newspaper-back>‹ Home</button><h2>The Borough Beacon</h2><span></span></header><iframe title="The Borough Beacon newspaper" src="./newspaper.html" style="border:0;width:100%;flex:1;background:#f4f0e7"></iframe>';
  home.appendChild(view);

  icon.addEventListener('click', () => {
    document.querySelector('#home').style.display = 'none';
    document.querySelectorAll('.app-view').forEach((app) => app.classList.remove('active'));
    view.classList.add('active');
  });
  view.querySelector('[data-newspaper-back]').addEventListener('click', () => {
    view.classList.remove('active');
    document.querySelector('#home').style.display = 'flex';
  });
});
