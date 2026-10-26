/* Mango Mini Golf + Minesweeper — original standalone browser games. MIT License. */
(() => {
  function init() {
    const grid = document.querySelector('.mango-game-grid');
    const player = document.getElementById('mangoPlayer');
    const frame = document.getElementById('mangoGameFrame');
    if (!grid || !player || !frame || document.getElementById('playMangoGolf')) return;
    const style = document.createElement('style');
    style.textContent = `#mangoLocalGame{background:#182c24;color:#fff;border-radius:14px;padding:18px;min-height:460px}#mangoLocalGame canvas{display:block;width:min(100%,780px);margin:auto;touch-action:none;border-radius:12px;background:#2d9150}#mangoLocalGame button{margin:4px}#mangoLocalGame .mine-grid{display:grid;gap:3px;justify-content:center;margin:16px auto}#mangoLocalGame .mine-cell{width:33px;height:33px;padding:0;border:1px solid #506568;border-radius:5px;background:#526b69;color:#fff;font-weight:bold;font-size:17px}#mangoLocalGame .mine-cell.open{background:#c6d3c5;color:#142d31}#mangoLocalGame .mine-cell.flag{background:#856735}@media(max-width:550px){#mangoLocalGame .mine-cell{width:27px;height:27px;font-size:13px}}`;
    document.head.append(style);
    const host = document.createElement('div');
    host.id = 'mangoLocalGame'; host.hidden = true;
    player.append(host);
    let cleanup = () => {};
    function show(name) {
      cleanup(); cleanup = () => {};
      frame.removeAttribute('src'); frame.hidden = true;
      const external = document.getElementById('mangoOpenGame'); if(external) external.hidden = true;
      document.getElementById('mangoGameTitle').textContent = name;
      document.getElementById('mangoGameStatus').textContent = 'Made for Mango — playable right here.';
      player.hidden = false; host.hidden = false; host.replaceChildren();
      player.scrollIntoView({behavior:'smooth',block:'start'});
    }
    function card(id,name,icon,desc,fn) {
      const article=document.createElement('article');article.className='mango-game-card';
      const art=document.createElement('div');art.className='mango-game-art';art.textContent=icon;
      const title=document.createElement('h2');title.textContent=name;
      const p=document.createElement('p');p.textContent=desc;
      const btn=document.createElement('button');btn.id=id;btn.className='primary';btn.textContent='▶ Play '+name;btn.onclick=fn;
      article.append(art,title,p,btn);grid.append(article);
    }
    function heading(text){const h=document.createElement('p');h.textContent=text;host.append(h);return h;}
    function button(text,fn){const b=document.createElement('button');b.textContent=text;b.onclick=fn;host.append(b);return b;}
    function golf() {
      show('⛳ Mango Mini Golf');
      const info=heading('Drag backward from the ball and release to shoot. Complete all 5 holes!');
      const replay=button('↻ Restart course',golf);
      const canvas=document.createElement('canvas');canvas.width=780;canvas.height=440;host.append(canvas);
      const ctx=canvas.getContext('2d');
      const levels=[
        {start:[95,210],hole:[680,210],walls:[]},
        {start:[100,350],hole:[680,90],walls:[[335,0,24,260]]},
        {start:[95,95],hole:[690,345],walls:[[230,170,410,22]]},
        {start:[85,220],hole:[695,220],walls:[[270,75,22,250],[490,150,22,250]]},
        {start:[85,340],hole:[690,85],walls:[[200,90,22,235],[380,0,22,320],[555,120,22,320]]}
      ];
      let level=0,strokes=0,total=0,ball,aim=null,done=false,raf=0,last=0;
      function reset(){const l=levels[level];ball={x:l.start[0],y:l.start[1],vx:0,vy:0};strokes=0;aim=null;done=false;info.textContent=`Hole ${level+1}/5 · Strokes: ${strokes} · Total previous strokes: ${total}. Drag backward from the ball to aim.`;}
      reset();
      function pointer(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};}
      function down(e){if(done||Math.hypot(ball.vx,ball.vy)>.2)return;const p=pointer(e);if(Math.hypot(p.x-ball.x,p.y-ball.y)<60){aim=p;canvas.setPointerCapture(e.pointerId);}}
      function move(e){if(aim)aim=pointer(e);}
      function up(e){if(!aim)return;const p=pointer(e);let dx=ball.x-p.x,dy=ball.y-p.y,m=Math.hypot(dx,dy);if(m>8){let scale=Math.min(m,150)/m*.11;ball.vx=dx*scale;ball.vy=dy*scale;strokes++;info.textContent=`Hole ${level+1}/5 · Strokes: ${strokes} · Total previous strokes: ${total}.`;}aim=null;}
      canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',()=>aim=null);
      function physics(){
        if(Math.hypot(ball.vx,ball.vy)<.08){ball.vx=ball.vy=0;return;}
        const oldX=ball.x,oldY=ball.y;ball.x+=ball.vx;ball.y+=ball.vy;ball.vx*=.986;ball.vy*=.986;
        const r=11;
        if(ball.x<30+r||ball.x>750-r){ball.x=Math.max(30+r,Math.min(750-r,ball.x));ball.vx*=-.72;}
        if(ball.y<30+r||ball.y>410-r){ball.y=Math.max(30+r,Math.min(410-r,ball.y));ball.vy*=-.72;}
        for(const [x,y,w,h] of levels[level].walls){let cx=Math.max(x,Math.min(x+w,ball.x)),cy=Math.max(y,Math.min(y+h,ball.y));if(Math.hypot(ball.x-cx,ball.y-cy)<r){const oldCx=Math.max(x,Math.min(x+w,oldX)),oldCy=Math.max(y,Math.min(y+h,oldY));const hitX=Math.abs(oldX-oldCx)>Math.abs(oldY-oldCy);if(hitX){ball.x=oldX;ball.vx*=-.7;}else{ball.y=oldY;ball.vy*=-.7;}}}
        const [hx,hy]=levels[level].hole;
        if(Math.hypot(ball.x-hx,ball.y-hy)<15&&Math.hypot(ball.vx,ball.vy)<4){done=true;total+=strokes;ball.vx=ball.vy=0; info.textContent=level===4?`🏆 Course complete! Total strokes: ${total}`:`✅ Hole ${level+1} complete in ${strokes} strokes!`;const next=button(level===4?'Play again':'Next hole →',()=>{next.remove();if(level===4){level=0;total=0;}else level++;reset();});}
      }
      function draw(){
        ctx.fillStyle='#23854b';ctx.fillRect(0,0,780,440);ctx.fillStyle='#61b762';ctx.fillRect(30,30,720,380);
        ctx.strokeStyle='#173f2e';ctx.lineWidth=13;ctx.strokeRect(30,30,720,380);
        for(const [x,y,w,h] of levels[level].walls){ctx.fillStyle='#665849';ctx.fillRect(x,y,w,h);ctx.strokeStyle='#c7ae75';ctx.lineWidth=3;ctx.strokeRect(x,y,w,h);}
        const [hx,hy]=levels[level].hole;ctx.beginPath();ctx.arc(hx,hy,15,0,Math.PI*2);ctx.fillStyle='#123b2c';ctx.fill();ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(hx,hy-55);ctx.strokeStyle='#faf8ee';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#f44336';ctx.beginPath();ctx.moveTo(hx,hy-55);ctx.lineTo(hx+26,hy-44);ctx.lineTo(hx,hy-32);ctx.fill();
        ctx.beginPath();ctx.arc(ball.x+2,ball.y+3,11,0,Math.PI*2);ctx.fillStyle='#183f30';ctx.fill();ctx.beginPath();ctx.arc(ball.x,ball.y,11,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
        if(aim){ctx.beginPath();ctx.moveTo(ball.x,ball.y);ctx.lineTo(ball.x+(ball.x-aim.x),ball.y+(ball.y-aim.y));ctx.strokeStyle='#fff99d';ctx.lineWidth=4;ctx.setLineDash([9,7]);ctx.stroke();ctx.setLineDash([]);}
      }
      function loop(t){if(t-last>15){if(!done)physics();draw();last=t;}raf=requestAnimationFrame(loop);}raf=requestAnimationFrame(loop);
      cleanup=()=>{cancelAnimationFrame(raf);};
    }
    function mines() {
      show('💣 Mango Minesweeper');
      const info=heading('Left-click to reveal. Right-click to place a flag. On touchscreens use Flag mode.');
      let mode='reveal'; const toggle=button('🚩 Flag mode: OFF',()=>{mode=mode==='reveal'?'flag':'reveal';toggle.textContent='🚩 Flag mode: '+(mode==='flag'?'ON':'OFF');});
      button('↻ New game',mines);
      const board=document.createElement('div');board.className='mine-grid';host.append(board);
      const w=9,h=9,bombs=10;board.style.gridTemplateColumns=`repeat(${w},minmax(0,33px))`;
      let cells=Array.from({length:w*h},()=>({mine:false,open:false,flag:false,count:0}));let started=false,ended=false;
      function neighbors(i){let x=i%w,y=Math.floor(i/w),out=[];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){let nx=x+dx,ny=y+dy;if((dx||dy)&&nx>=0&&nx<w&&ny>=0&&ny<h)out.push(ny*w+nx);}return out;}
      function plant(safe){let candidates=cells.map((_,i)=>i).filter(i=>i!==safe&&!neighbors(safe).includes(i));for(let k=0;k<bombs;k++){let z=Math.floor(Math.random()*candidates.length),i=candidates.splice(z,1)[0];cells[i].mine=true;}cells.forEach((c,i)=>c.count=neighbors(i).filter(n=>cells[n].mine).length);}
      function open(i){const c=cells[i];if(c.open||c.flag||ended)return;if(!started){started=true;plant(i);}c.open=true;if(c.mine){ended=true;info.textContent='💥 Mine hit! Click New game to try again.';cells.forEach(x=>{if(x.mine)x.open=true;});draw();return;}if(c.count===0)neighbors(i).forEach(j=>{if(!cells[j].open)open(j);});if(cells.filter(x=>x.open).length===w*h-bombs){ended=true;info.textContent='🏆 You cleared the minefield!';}draw();}
      function flag(i){if(ended||cells[i].open)return;cells[i].flag=!cells[i].flag;draw();}
      function draw(){const flags=cells.filter(x=>x.flag).length;if(!ended)info.textContent=`Mines: ${bombs} · Flags: ${flags} · ${mode==='flag'?'Tap a tile to flag':'Tap a tile to reveal'}`;board.replaceChildren();cells.forEach((c,i)=>{const b=document.createElement('button');b.className='mine-cell'+(c.open?' open':'')+(c.flag?' flag':'');b.setAttribute('aria-label',`Row ${Math.floor(i/w)+1}, column ${i%w+1}`);b.textContent=c.open?(c.mine?'💣':c.count||''):(c.flag?'🚩':'');if(c.open&&!c.mine&&c.count){b.style.color=['','#216bd5','#1d7b35','#da5039','#533ca4','#a83b41','#268a8e','#333','#666'][c.count];}b.onclick=()=>mode==='flag'?flag(i):open(i);b.oncontextmenu=e=>{e.preventDefault();flag(i);};board.append(b);});}
      draw();
    }
    card('playMangoGolf','Mini Golf','⛳','Five playable putting holes with walls, aiming, physics, and stroke scoring.',golf);
    card('playMangoMines','Minesweeper','💣','Classic 9×9 Minesweeper with 10 mines, flags, and safe first click.',mines);
    const close=document.getElementById('mangoCloseGame');if(close)close.addEventListener('click',()=>{cleanup();host.hidden=true;frame.hidden=false;const a=document.getElementById('mangoOpenGame');if(a)a.hidden=false;});
    new MutationObserver(()=>{if(player.hidden || document.getElementById('games')?.hidden){cleanup();host.hidden=true;frame.hidden=false;const a=document.getElementById('mangoOpenGame');if(a)a.hidden=false;}}).observe(document.getElementById('games'),{attributes:true,subtree:true,attributeFilter:['hidden']});
    const originalButtons=grid.querySelectorAll('button:not(#playMangoGolf):not(#playMangoMines), a');originalButtons.forEach(b=>b.addEventListener('click',()=>{cleanup();host.hidden=true;frame.hidden=false;const a=document.getElementById('mangoOpenGame');if(a)a.hidden=false;}));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();