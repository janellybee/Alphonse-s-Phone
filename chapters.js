/* Chapters: a 12-chapter story engine for Alfie's arcs. Story data lives in story-arcs.js.
   - Progress and choices are saved in this browser.
   - Finishing a chapter sends in-world updates to the phone (via phone-pulse.js).
   - What you've read is shared with live AI (window.StoryEngine.contextLine), so Alfie remembers it. */
(() => {
  'use strict';
  const KEY = 'alfie-chapters-v1';
  const ARCS = (window.STORY_ARCS || []).filter(Boolean);
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let state = load();
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved && typeof saved === 'object' && saved.arcs) return saved;
    } catch (_) {}
    return { arcs: {}, last: ARCS[0]?.id };
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {} };
  const progress = (arc) => (state.arcs[arc.id] ||= { done: [], flags: {}, picks: {} });
  const isDone = (arc, i) => progress(arc).done.includes(i);
  const isOpen = (arc, i) => i === 0 || isDone(arc, i - 1);
  const nextIndex = (arc) => arc.chapters.findIndex((_, i) => !isDone(arc, i));

  // Only show scenes whose conditions match the reader's choices.
  const visible = (arc, scenes = []) => scenes.filter((s) => {
    if (typeof s === 'string') return true;
    const flags = progress(arc).flags;
    if (s.if && !flags[s.if]) return false;
    if (s.unless && flags[s.unless]) return false;
    return true;
  });

  function sceneHTML(scene) {
    if (typeof scene === 'string') return `<p class="ch-narr">${esc(scene)}</p>`;
    if (scene.from) {
      const mine = /^alfie$/i.test(scene.from);
      return `<div class="ch-text ${mine ? 'mine' : ''}"><small>${esc(mine ? 'Alfie' : scene.from)}</small><span>${esc(scene.text)}</span></div>`;
    }
    return `<p class="ch-narr ch-cond">${esc(scene.text)}</p>`;
  }

  /* ---------- View ---------- */
  const view = document.createElement('section');
  view.className = 'app-view dark chapters-view';
  view.id = 'view-chapters';
  view.innerHTML = '<header class="app-header"><button class="back-btn" type="button">‹ Home</button><h2>Chapters</h2><button class="header-action ch-up" type="button" hidden>Arcs</button></header><div class="app-content ch-body" aria-live="polite"></div>';
  $('.screen')?.insertBefore(view, $('#lock-screen'));
  const body = $('.ch-body', view);
  const backBtn = $('.back-btn', view);
  const upBtn = $('.ch-up', view);
  let screenStack = 'library';

  backBtn.addEventListener('click', () => {
    if (screenStack === 'reader') return showArc(currentArc);
    if (screenStack === 'arc') return showLibrary();
    window.goHome?.();
  });
  upBtn.addEventListener('click', () => showLibrary());

  let currentArc = ARCS.find((a) => a.id === state.last) || ARCS[0];

  function setHeader(title, back, showUp) {
    $('h2', view).textContent = title;
    backBtn.textContent = back;
    upBtn.hidden = !showUp;
    body.scrollTop = 0;
  }

  function showLibrary() {
    screenStack = 'library';
    setHeader('Chapters', '‹ Home', false);
    body.innerHTML = `<div class="ch-intro"><small>ALFIE'S STORY ARCS</small><h3>Twelve chapters at a time.</h3><p>Read an arc, make the calls Alfie has to make, and watch his phone react. Everything you read here, he remembers when he texts you.</p></div>` +
      ARCS.map((arc) => {
        const p = progress(arc).done.length;
        const total = arc.chapters.length || 12;
        return `<button class="ch-arc" type="button" data-arc="${esc(arc.id)}" ${arc.comingSoon ? 'disabled' : ''} style="--a:${arc.colors?.[0] || '#2a1f5c'};--b:${arc.colors?.[1] || '#b0306a'}">
          <span class="ch-cover" aria-hidden="true">${esc(arc.cover || '✦')}</span>
          <span class="ch-arc-text"><small>ARC ${esc(arc.number)}${arc.comingSoon ? ' · COMING SOON' : ` · ${p}/${total} READ`}</small><b>${esc(arc.title)}</b><span>${esc(arc.tagline)}</span>
          ${arc.comingSoon ? '' : `<span class="ch-bar"><i style="width:${(p / total) * 100}%"></i></span>`}</span></button>`;
      }).join('');
  }

  function showArc(arc) {
    currentArc = arc;
    state.last = arc.id; save();
    screenStack = 'arc';
    setHeader(`Arc ${arc.number}`, '‹ Arcs', false);
    const next = nextIndex(arc);
    const p = progress(arc);
    body.innerHTML = `<div class="ch-arc-hero" style="--a:${arc.colors[0]};--b:${arc.colors[1]}"><span class="ch-cover big" aria-hidden="true">${esc(arc.cover)}</span><h3>${esc(arc.title)}</h3><p>${esc(arc.tagline)}</p>
      <button class="primary ch-go" type="button" data-ch="${next < 0 ? 0 : next}">${next < 0 ? 'Read again from chapter 1' : p.done.length ? `Continue · Chapter ${next + 1}` : 'Start chapter 1'}</button></div>
      <ol class="ch-list">${arc.chapters.map((c, i) => {
        const done = isDone(arc, i), open = isOpen(arc, i);
        return `<li><button type="button" class="ch-item ${done ? 'done' : open ? 'open' : 'locked'}" data-ch="${i}" ${open ? '' : 'disabled'}>
          <span class="ch-num">${done ? '✓' : open ? i + 1 : '🔒'}</span><span><b>${esc(c.title)}</b><small>${esc(open ? c.teaser : 'Finish the chapter before to unlock')}</small></span></button></li>`;
      }).join('')}</ol>
      ${p.done.length ? '<button class="ch-reset" type="button">Restart this arc</button>' : ''}`;
  }

  function showReader(arc, i) {
    const chapter = arc.chapters[i];
    if (!chapter || !isOpen(arc, i)) return;
    screenStack = 'reader';
    setHeader(`Chapter ${i + 1}`, '‹ Chapters', true);
    const p = progress(arc);
    const already = isDone(arc, i);
    body.innerHTML = `<div class="ch-reader"><small class="ch-kicker">ARC ${arc.number} · CHAPTER ${i + 1} OF ${arc.chapters.length}</small><h3>${esc(chapter.title)}</h3><div class="ch-scenes"></div><div class="ch-controls"></div></div>`;
    const scenes = $('.ch-scenes', body);
    const controls = $('.ch-controls', body);
    const queue = visible(arc, chapter.scenes);
    let step = 0;

    const scrollDown = () => { body.scrollTop = body.scrollHeight; };
    const add = (html) => { scenes.insertAdjacentHTML('beforeend', html); scenes.lastElementChild?.classList.add('ch-in'); scrollDown(); };

    // Replays show everything at once, with the choice that was made.
    if (already) {
      queue.forEach((s) => add(sceneHTML(s)));
      const pick = chapter.choice?.options?.[p.picks[i]];
      if (pick) add(`<p class="ch-choice-made">You chose: ${esc(pick.label)}</p><p class="ch-narr">${esc(pick.result)}</p>`);
      visible(arc, chapter.scenesAfterChoice).forEach((s) => add(sceneHTML(s)));
      finishControls(arc, i, false);
      return;
    }

    const advance = () => {
      if (step < queue.length) {
        add(sceneHTML(queue[step++]));
        controls.innerHTML = '<button class="ch-next" type="button">Tap to continue ›</button>';
        return;
      }
      if (chapter.choice && !resolved) {
        if (p.picks[i] == null) return showChoice();
        return resolve(p.picks[i]); // picked earlier, but left before finishing
      }
      finish();
    };
    let resolved = false;
    function resolve(k) {
      resolved = true;
      const pick = chapter.choice.options[k];
      add(`<p class="ch-choice-made">You chose: ${esc(pick.label)}</p><p class="ch-narr">${esc(pick.result)}</p>`);
      visible(arc, chapter.scenesAfterChoice).forEach((s) => queue.push(s));
      advance();
    }
    function showChoice() {
      controls.innerHTML = `<p class="ch-prompt">${esc(chapter.choice.prompt)}</p>` +
        chapter.choice.options.map((o, k) => `<button class="ch-option" type="button" data-pick="${k}">${esc(o.label)}</button>`).join('');
      scrollDown();
    }
    controls.addEventListener('click', (e) => {
      if (e.target.closest('.ch-next')) return advance();
      const opt = e.target.closest('[data-pick]');
      if (!opt) return;
      const k = Number(opt.dataset.pick);
      const pick = chapter.choice.options[k];
      // Picking one option clears the other options' flags for this chapter.
      chapter.choice.options.forEach((o) => { if (o.set) delete p.flags[o.set]; });
      if (pick.set) p.flags[pick.set] = true;
      p.picks[i] = k; save();
      resolve(k);
    });
    function finish() {
      if (!p.done.includes(i)) p.done.push(i);
      save();
      if (chapter.after?.length) window.PhonePulse?.storyPings(chapter.after);
      finishControls(arc, i, true);
    }
    advance();
  }

  function finishControls(arc, i, fresh) {
    const chapter = arc.chapters[i];
    const last = i === arc.chapters.length - 1;
    const controls = $('.ch-controls', body);
    controls.innerHTML = `${chapter.ending ? `<p class="ch-ending">${esc(chapter.ending)}</p>` : ''}
      <p class="ch-done">✦ Chapter ${i + 1} ${fresh ? 'complete' : 'read'}${fresh && chapter.after?.length ? ' · keep an eye on the phone' : ''}</p>
      ${last ? '<button class="primary ch-to-arc" type="button">Back to the arc</button>' : `<button class="primary ch-go" type="button" data-ch="${i + 1}">Chapter ${i + 2}: ${esc(arc.chapters[i + 1].title)} ›</button>`}
      <button class="ch-talk" type="button">💬 Text Alfie about it</button>`;
    body.scrollTop = body.scrollHeight;
  }

  body.addEventListener('click', (e) => {
    const arcBtn = e.target.closest('[data-arc]');
    if (arcBtn) { const arc = ARCS.find((a) => a.id === arcBtn.dataset.arc); if (arc && !arc.comingSoon) showArc(arc); return; }
    const go = e.target.closest('.ch-go, .ch-item');
    if (go) return showReader(currentArc, Number(go.dataset.ch));
    if (e.target.closest('.ch-to-arc')) return showArc(currentArc);
    if (e.target.closest('.ch-reset')) {
      if (!confirm('Restart this arc? Your choices will be cleared.')) return;
      state.arcs[currentArc.id] = { done: [], flags: {}, picks: {} }; save();
      return showArc(currentArc);
    }
    if (e.target.closest('.ch-talk')) {
      window.openApp?.('messages');
      const input = $('#message-input');
      if (input) { input.value = 'ok i need to talk about what just happened'; input.focus(); }
    }
  });

  // Each time the app opens, land on the arc you were reading.
  new MutationObserver(() => {
    if (view.classList.contains('active') && screenStack !== 'reader') {
      currentArc && progress(currentArc).done.length ? showArc(currentArc) : showLibrary();
    }
  }).observe(view, { attributes: true, attributeFilter: ['class'] });
  showLibrary();

  /* ---------- Shared story memory for live AI ---------- */
  function contextLine() {
    const started = ARCS.filter((a) => !a.comingSoon && progress(a).done.length);
    const arc = started.find((a) => a.id === state.last) || started[0];
    if (!arc) return '';
    const p = progress(arc);
    const read = [...p.done].sort((a, b) => a - b);
    const recaps = read.slice(-4).map((i) => `Ch ${i + 1}: ${arc.chapters[i].recap}`).join(' ');
    const choices = read.map((i) => arc.chapters[i].choice?.options?.[p.picks[i]]?.label).filter(Boolean).slice(-5).join('; ');
    return `Story so far (arc "${arc.title}", ${read.length} of ${arc.chapters.length} chapters lived): ${recaps}${choices ? ` Choices Alfie made: ${choices}.` : ''}`.slice(0, 700);
  }
  function current() {
    const arc = currentArc;
    if (!arc) return null;
    const read = progress(arc).done;
    if (!read.length) return null;
    const i = Math.max(...read);
    return { arc: arc.title, number: i + 1, title: arc.chapters[i].title, recap: arc.chapters[i].recap };
  }

  window.StoryEngine = { contextLine, current, arcs: ARCS };
})();
