
/* MANGO - MOTO X3M GAME COLLECTION */
/* Adds 5 games without removing existing games */

(() => {
  const games = [
    {
      name: "Moto X3M 2",
      icon: "🏍️",
      description: "More motorcycle stunts and levels!",
      url: "https://www.miniplay.com/embed/moto-x3m-2"
    },
    {
      name: "Moto X3M 3",
      icon: "🏁",
      description: "Race through challenging obstacles!",
      url: "https://www.miniplay.com/embed/moto-x3m-3"
    },
    {
      name: "Moto X3M Winter",
      icon: "❄️",
      description: "Race through snowy winter tracks!",
      url: "https://www.minijuegos.com/embed/moto-x3m-4-winter"
    },
    {
      name: "Moto X3M Pool Party",
      icon: "🌊",
      description: "Summer stunts and water obstacles!",
      url: "https://www.minijuegos.com/embed/moto-x3m-pool-party"
    },
    {
      name: "Moto X3M Spooky Land",
      icon: "🎃",
      description: "Halloween-themed racing challenges!",
      url: "https://www.minijuegos.com/embed/moto-x3m-spooky-land"
    }
  ];

  function installGames() {
    const grid = document.querySelector(".mango-game-grid");
    const player = document.getElementById("mangoPlayer");
    const frame = document.getElementById("mangoGameFrame");
    const title = document.getElementById("mangoGameTitle");
    const status = document.getElementById("mangoGameStatus");
    const openLink = document.getElementById("mangoOpenGame");

    if (!grid || !player || !frame || !title) {
      console.warn("Mango Games tab not found.");
      return;
    }

    games.forEach(game => {
      const card = document.createElement("article");
      card.className = "mango-game-card";

      const art = document.createElement("div");
      art.className = "mango-game-art racing";
      art.textContent = game.icon;

      const heading = document.createElement("h2");
      heading.textContent = game.name;

      const description = document.createElement("p");
      description.textContent = game.description;

      const button = document.createElement("button");
      button.className = "primary";
      button.textContent = "▶ Play Now";

      button.onclick = () => {
        title.textContent = game.name;
        frame.title = game.name;
        frame.src = game.url;

        if (openLink) {
          openLink.href = game.url;
        }

        if (status) {
          status.textContent =
            "Loading " + game.name +
            "... If the game is blocked, this provider may not allow embedding.";
        }

        player.hidden = false;

        player.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      };

      card.append(art, heading, description, button);
      grid.appendChild(card);
    });

    console.log("5 Moto X3M games added to Mango!");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installGames);
  } else {
    installGames();
  }
})();
