(() => {
  const header = document.querySelector('header');
  if (!header || document.getElementById('gamesTab')) return;
  const style = document.createElement('style');
  style.textContent = `
    #games {max-width:1200px;margin:auto;padding:28px 22px}
    #games h1 {color:#ffbe55}
    .mango-game-grid {display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px;margin:24px 0}
    .mango-game-card {padding:24px;border:1px solid #494949;border-radius:20px;background:#292929}
    .mango-game-art {height:150px;border-radius:14px;display:grid;place-items:center;font-size:72px;background:radial-gradient(circle at 35% 30%,#71368a,#171329)}
    .mango-game-art.racing {background:radial-gradient(circle at 35% 30%,#c59a3b,#342913)}
    .mango-game-card p {color:#bbb;font-size:14px;line-height:1.6}
    .mango-player-toolbar {display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
    .mango-player-toolbar h2 {margin:0 auto 0 0;font-size:20px}
    #mangoGameFrame {display:block;width:100%;height:70dvh;min-height:420px;border:1px solid #444;border-radius:14px;background:#000}
    #mangoPlayer:fullscreen {background:#111;padding:12px;display:flex;flex-direction:column}
    #mangoPlayer:fullscreen #mangoGameFrame {flex:1;min-height:0;height:auto}
    #mangoGameStatus {font-size:13px;color:#bbb;line-height:1.6}
    #games a {color:#ffbe55}
    #games .mango-game-link {display:inline-block;padding:11px 14px;border-radius:10px;background:#ffbe55;color:#171717;font-weight:650;text-decoration:none}
    .mango-game-art.polytrack {background:linear-gradient(135deg,#3970aa,#15233d)}
  `;
  document.head.append(style);
  const tab = document.createElement('button');
  tab.id = 'gamesTab';
  tab.textContent = '🎮 Games';
  tab.setAttribute('aria-pressed', 'false');
  header.insertBefore(tab, document.getElementById('suggestTab'));
  const page = document.createElement('section');
  page.id = 'games';
  page.hidden = true;
  page.innerHTML = `
    <h1>🎮 Mango Games</h1>
    <p class="muted">Choose a game. These games are best played on a computer with a keyboard and mouse.</p>
    <div class="mango-game-grid">
      <article class="mango-game-card"><div class="mango-game-art" style="background:linear-gradient(135deg,#215260,#e7ac56)" aria-hidden="true">🏝️</div><h2>Mango Circuit</h2><p>A Mango original. Race three laps through a low-poly coastal circuit with sweeping bends, hills, boost, and your own best-lap record. Keyboard and touch controls.</p><button id="playCircuit" class="primary">Play Mango Circuit</button><p class="small">Original game · Plays right here</p></article>
      <article class="mango-game-card"><div class="mango-game-art">🎯</div><h2>Void Runner</h2><p>Survive waves in a neon 3D arena. Move with WASD, aim with your mouse, and click to fire.</p><button id="playVoid" class="primary">Play Void Runner</button></article>
      <article class="mango-game-card"><div class="mango-game-art racing">🏎️</div><h2>PMNDRS Racing</h2><p>Drive a 3D car around a desert track. Use WASD or arrow keys, Shift for boost, and R to reset.</p><button id="playRacing" class="primary">Play Racing</button></article>
      <article class="mango-game-card"><div class="mango-game-art polytrack" aria-hidden="true">🏁</div><h2>PolyTrack</h2><p>Race through loops, jumps, and custom tracks in Kodub’s low-poly racing game. Opens the official game on CrazyGames in a new tab.</p><a id="playPolytrack" class="mango-game-link" href="https://www.crazygames.com/game/polytrack" target="_blank" rel="noopener noreferrer">Play PolyTrack ↗</a><p class="small">By Kodub · Official game link</p></article>
    </div>
    <div id="mangoPlayer" hidden>
      <div class="mango-player-toolbar"><h2 id="mangoGameTitle"></h2><button id="mangoFullscreen">⛶ Fullscreen</button><a id="mangoOpenGame" target="_blank" rel="noopener noreferrer">Open game separately ↗</a><button id="mangoCloseGame">Close game</button></div>
      <p id="mangoGameStatus" role="status"></p>
      <iframe id="mangoGameFrame" title="Mango game player" allow="fullscreen; autoplay; gamepad" allowfullscreen></iframe>
    </div>
    <p class="small">Mango Circuit is an original game made for Mango. Void Runner and Racing run from their creators’ websites inside Mango. PolyTrack opens its official game page in a new tab. <a href="https://github.com/mheerspink75/void-runner" target="_blank" rel="noopener noreferrer">Void Runner source / MIT license</a> · <a href="https://github.com/pmndrs/racing-game" target="_blank" rel="noopener noreferrer">Racing source / licenses</a></p>
  `;
  document.querySelector('header').after(page);
  const $ = id => document.getElementById(id);
  function closeGame() {
    $('mangoGameFrame').removeAttribute('src');
    $('mangoPlayer').hidden = true;
  }
  function openGames() {
    for (const name of ['home', 'ai', 'friends', 'school']) {
      $(name).hidden = true;
      $(name + 'Tab').setAttribute('aria-pressed', 'false');
    }
    page.hidden = false;
    tab.setAttribute('aria-pressed', 'true');
  }
  tab.addEventListener('click', openGames);
  for (const id of ['homeTab','aiTab','friendsTab','schoolTab','openAI']) {
    $(id).addEventListener('click', () => {
      page.hidden = true;
      tab.setAttribute('aria-pressed', 'false');
      closeGame();
    });
  }
  // Stop GPU rendering if the main Mango script hides Games programmatically.
  new MutationObserver(() => {if (page.hidden) closeGame()})
    .observe(page, {attributes:true,attributeFilter:['hidden']});
  function play(title,path) {
    $('mangoGameTitle').textContent = title;
    $('mangoOpenGame').href = path;
    $('mangoGameFrame').title = title;
    $('mangoPlayer').hidden = false;
    $('mangoGameStatus').textContent = 'Click inside the game to give it keyboard focus. If mouse capture or fullscreen is blocked, use Open game separately. Press Esc to release the mouse.';
    $('mangoGameFrame').src = path;
    $('mangoPlayer').scrollIntoView({behavior:'smooth',block:'start'});
  }
  $('playCircuit').onclick = () => play('Mango Circuit','./mango-circuit.html');
  $('playVoid').onclick = () => play('Void Runner','https://mheerspink75.github.io/void-runner/');
  $('playRacing').onclick = () => play('PMNDRS Racing','https://racing.pmnd.rs/');
  $('mangoCloseGame').onclick = closeGame;
  $('mangoFullscreen').onclick = async () => {
    try {
      if (!document.fullscreenElement) await $('mangoPlayer').requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      $('mangoGameStatus').textContent = 'Fullscreen is unavailable here. Use Open game separately.';
    }
  };
})();
