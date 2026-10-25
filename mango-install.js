(() => {
  if (window.__mangoInstallLoaded) return;
  window.__mangoInstallLoaded = true;
  let installEvent = null;
  let installedHere = false;
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const button = document.createElement('button');
  button.type = 'button';
  button.id = 'installMango';
  button.textContent = '⬇ Install Mango';
  button.setAttribute('aria-label', 'Install Mango');
  const help = document.createElement('dialog');
  help.setAttribute('aria-labelledby', 'mangoInstallTitle');
  const title = document.createElement('h2');
  title.id = 'mangoInstallTitle';
  title.textContent = 'Install Mango 🥭';
  const instructions = document.createElement('p');
  instructions.style.lineHeight = '1.7';
  const note = document.createElement('p');
  note.textContent = 'Sign-in and messages need internet. AI requires a compatible device. Installing may use separate browser storage, so existing local AI chats might not appear in the installed app.';
  note.style.cssText = 'font-size:13px;color:#bbb;line-height:1.6';
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = 'Got it';
  close.onclick = () => help.close();
  help.append(title, instructions, note, close);
  const refresh = () => { button.hidden = installedHere || standalone(); };
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installEvent = event;
    button.dataset.installReady = 'true';
    refresh();
  });
  window.addEventListener('appinstalled', () => {
    installedHere = true;
    installEvent = null;
    button.hidden = true;
    if (help.open) help.close();
  });
  window.matchMedia('(display-mode: standalone)').addEventListener('change', refresh);
  button.onclick = async () => {
    if (installEvent) {
      const prompt = installEvent;
      installEvent = null;
      try {
        button.disabled = true;
        await prompt.prompt();
        await prompt.userChoice;
      } catch {
        showHelp();
      } finally {
        button.disabled = false;
        refresh();
      }
    } else showHelp();
  };
  function showHelp() {
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    instructions.textContent = ios
      ? 'Open Mango in Safari. Tap Share → Add to Home Screen → Add. If shown, leave Open as Web App enabled.'
      : 'In Chrome or Edge, open the browser menu and look for Install Mango, Install page as app, or Apps → Install this site as an app. On Android, look for Install app or Add to Home screen. On a Mac using Safari, choose File → Add to Dock. If installation is not offered yet, refresh after all installation files are published.';
    help.showModal();
  }
  document.body.append(help);
  fetch(new URL('./manifest.webmanifest', location.href)).then(r => r.json()).then(manifest => {
    const icon = manifest.icons.find(icon => icon.sizes === '512x512' && icon.purpose === 'any');
    const apple = document.querySelector('link[rel="apple-touch-icon"]');
    if (icon && apple) apple.href = icon.src;
  }).catch(() => {});
  const header = document.querySelector('header') || document.querySelector('nav');
  (header || document.body).append(button);
  refresh();
  // Only the static offline notice is cached. Chats and API responses aren't cached here.
  if ('serviceWorker' in navigator) {
    const script = document.currentScript;
    const base = new URL('./', script ? script.src : location.href);
    navigator.serviceWorker.register(new URL('mango-sw.js', base), {scope:base.pathname})
      .catch(error => console.warn('Mango installation setup:', error.message));
  }
})();
