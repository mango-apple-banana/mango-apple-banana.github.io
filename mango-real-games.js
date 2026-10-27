/* Mango provider-hosted game collection. Reuses existing cards. */
(() => {
  "use strict";
  const games = [
    ["Moto X3M Original","🏍️","./moto-x3m.html","playMoto"],
    ["Moto X3M 2","🏍️","https://www.minijuegos.com/embed/moto-x3m-2"],
    ["Moto X3M 3","🏁","https://www.minijuegos.com/embed/moto-x3m-3"],
    ["Moto X3M Winter","❄️","https://www.minijuegos.com/embed/moto-x3m-4-winter"],
    ["Moto X3M Pool Party","🌊","https://www.minijuegos.com/embed/moto-x3m-pool-party"],
    ["Moto X3M Spooky Land","🎃","https://www.minijuegos.com/embed/moto-x3m-spooky-land"],
    ["Ragdoll Archers","🏹","https://www.bubbleshooter.net/embed.php?id=2320","playRealArchers"],
    ["Smash Karts","🏎️","./smash-karts.html","playSmashKarts"],
    ["Basket Random","🏀","https://html5.gamemonetize.co/anaaahgt57d5t2tddrbc1m4qq97vz1jd/","playBasketRandom"],
    ["Soccer Physics","⚽","https://www.miniplay.com/embed/soccer-physics","playSoccerPhysics"]
  ];
  function install() {
    const grid = document.querySelector(".mango-game-grid");
    const player = document.getElementById("mangoPlayer");
    const frame = document.getElementById("mangoGameFrame");
    const title = document.getElementById("mangoGameTitle");
    if (!grid || !player || !frame || !title) return;
    games.forEach(([name, icon, url, existingId], i) => {
      const existing = existingId && document.getElementById(existingId);
      const sameTitle = Array.from(grid.querySelectorAll("h2"))
        .some(h => h.textContent.trim() === name);
      if (existing || sameTitle || document.getElementById("mango-real-" + i)) return;
      const card = document.createElement("article");
      card.className = "mango-game-card";
      card.id = "mango-real-" + i;
      const art = document.createElement("div");
      art.className = "mango-game-art";
      art.textContent = icon;
      const heading = document.createElement("h2");
      heading.textContent = name;
      const description = document.createElement("p");
      description.textContent = "Play " + name + " inside Mango.";
      const button = document.createElement("button");
      button.className = "primary";
      button.textContent = "▶ Play " + name;
      button.addEventListener("click", () => {
        document.getElementById("mangoCloseGame")?.click();
        title.textContent = name;
        frame.title = name;
        const link = document.getElementById("mangoOpenGame");
        if (link) { link.href = url; link.hidden = false; }
        const status = document.getElementById("mangoGameStatus");
        if (status) status.textContent = "Loading " + name + "… Availability depends on the provider and your network.";
        frame.hidden = false;
        frame.src = url;
        player.hidden = false;
        player.scrollIntoView({behavior:"smooth",block:"start"});
      });
      card.append(art, heading, description, button);
      grid.append(card);
    });
  }
  // Run after existing DOMContentLoaded add-ons so their cards are reused.
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => queueMicrotask(install), {once:true});
  else queueMicrotask(install);
})();
