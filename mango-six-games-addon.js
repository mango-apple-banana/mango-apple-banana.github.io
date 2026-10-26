/* Mango arcade expansion - loads six original games into the existing Games tab.
   Keep mango-six-games.html in the same GitHub repository folder. */
(() => {
  const collection = [
    ['hill', '🚙', 'Hill Climb-style Racing', 'Drive over hills and collect coins.'],
    ['basket', '🏀', 'Basketball Random-style', 'Two-player bouncing basketball.'],
    ['rope', '🪢', 'Rope Swing', 'Grapple, swing, and fly to the finish.'],
    ['archery', '🏹', 'Ragdoll Archery', 'Aim arrows at moving targets.'],
    ['soccer', '⚽', 'Soccer Physics-style', 'Two-player soccer with jumping.'],
    ['road', '🐸', 'Road Hopper', 'Cross busy lanes without hitting cars.']
  ];
  function addGames() {
    const grid = document.querySelector('#games .mango-game-grid');
    if (!grid) return;
    collection.forEach(([id, icon, title, description]) => {
      if (document.getElementById('mango-six-' + id)) return;
      const card = document.createElement('article');
      card.id = 'mango-six-' + id;
      card.className = 'mango-game-card';
      const art = document.createElement('div'); art.className = 'mango-game-art'; art.textContent = icon;
      const h = document.createElement('h2'); h.textContent = title;
      const p = document.createElement('p'); p.textContent = description;
      const button = document.createElement('button'); button.className = 'primary'; button.textContent = '▶ Play';
      button.addEventListener('click', () => {
        const player = document.getElementById('mangoPlayer');
        const frame = document.getElementById('mangoGameFrame');
        if (!player || !frame) return;
        document.getElementById('mangoCloseGame')?.click();
        frame.hidden = false;
        document.getElementById('mangoOpenGame').hidden = false;
        const path = './mango-six-games.html?game=' + id;
        document.getElementById('mangoGameTitle').textContent = title;
        document.getElementById('mangoGameStatus').textContent = 'Original Mango game. Use the instructions displayed under the game.';
        document.getElementById('mangoOpenGame').href = path;
        frame.title = title;
        frame.src = path;
        player.hidden = false;
        player.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      card.append(art, h, p, button);
      grid.append(card);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addGames);
  else addGames();
})();