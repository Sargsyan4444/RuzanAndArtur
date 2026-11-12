/* ========= Կարգավորումներ ========= */
const EVENT = {
  date: '2026-12-17T17:30:00+04:00',   // Նշանադրության օրը և ժամը
  year: 2026, month: 11, day: 17,      // month: 0-ից սկսած (11 = Դեկտեմբեր)
  title: 'Ռուզաննա & Արթուր — Նշանադրություն',
  place: 'Նոր Սուրմալու ռեստորան',
};

const byId = id => document.getElementById(id);

/* ========= Բացման էկրան + երաժշտություն ========= */
const cover = byId('cover');
const audio = byId('bgMusic');
const musicBtn = byId('musicBtn');

byId('openBtn').addEventListener('click', () => {
  cover.classList.add('open');
  document.body.classList.remove('locked');
  musicBtn.hidden = false;
  audio.volume = 0.7;
  audio.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
});

musicBtn.addEventListener('click', () => {
  if (audio.paused) { audio.play(); musicBtn.classList.add('playing'); }
  else { audio.pause(); musicBtn.classList.remove('playing'); }
});

/* ========= Հաշվիչ ========= */
const target = new Date(EVENT.date).getTime();
const cd = { d: byId('cd-d'), h: byId('cd-h'), m: byId('cd-m'), s: byId('cd-s') };

function tick() {
  let diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff / 864e5); diff %= 864e5;
  const h = Math.floor(diff / 36e5);  diff %= 36e5;
  const m = Math.floor(diff / 6e4);   diff %= 6e4;
  const s = Math.floor(diff / 1e3);
  cd.d.textContent = d;
  cd.h.textContent = String(h).padStart(2, '0');
  cd.m.textContent = String(m).padStart(2, '0');
  cd.s.textContent = String(s).padStart(2, '0');
}
tick(); setInterval(tick, 1000);

/* ========= Օրացույց ========= */
(function buildCalendar() {
  const box = byId('calendar');
  ['Երկ', 'Երք', 'Չրք', 'Հնգ', 'Ուրբ', 'Շբթ', 'Կիր'].forEach(n => {
    box.insertAdjacentHTML('beforeend', `<div class="dow">${n}</div>`);
  });
  const first = new Date(EVENT.year, EVENT.month, 1);
  const offset = (first.getDay() + 6) % 7;                 // շաբաթը սկսվում է Երկուշաբթիից
  const total = new Date(EVENT.year, EVENT.month + 1, 0).getDate();
  for (let i = 0; i < offset; i++) box.insertAdjacentHTML('beforeend', '<div></div>');
  for (let d = 1; d <= total; d++) {
    box.insertAdjacentHTML('beforeend',
      `<div class="day${d === EVENT.day ? ' target' : ''}">${d}</div>`);
  }
})();

/* Ավելացնել օրացույցում (.ics ֆայլ) */
byId('addCal').addEventListener('click', () => {
  const start = new Date(EVENT.date);
  const end = new Date(start.getTime() + 5 * 36e5);
  const f = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
    `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
    `SUMMARY:${EVENT.title}`, `LOCATION:${EVENT.place}`,
    'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  a.download = 'nshanadrutyun.ics';
  a.click();
});

/* ========= Ծաղիկներ ========= */
const NS = 'http://www.w3.org/2000/svg';

/* Ծաղիկների պատկերները (SVG sprite) */
document.body.insertAdjacentHTML('afterbegin', `
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <!-- հինգթերթանի ծաղիկ -->
  <symbol id="f5" viewBox="0 0 100 100">
    <g fill="currentColor">
      <ellipse cx="50" cy="27" rx="13" ry="22"/>
      <ellipse cx="50" cy="27" rx="13" ry="22" transform="rotate(72 50 50)"/>
      <ellipse cx="50" cy="27" rx="13" ry="22" transform="rotate(144 50 50)"/>
      <ellipse cx="50" cy="27" rx="13" ry="22" transform="rotate(216 50 50)"/>
      <ellipse cx="50" cy="27" rx="13" ry="22" transform="rotate(288 50 50)"/>
    </g>
    <circle cx="50" cy="50" r="8" fill="#E6DAC8"/>
    <circle cx="50" cy="50" r="3" fill="#CBB9A4"/>
  </symbol>
  <!-- փոքր կլոր ծաղիկ -->
  <symbol id="f4" viewBox="0 0 100 100">
    <g fill="currentColor">
      <circle cx="50" cy="27" r="17"/><circle cx="73" cy="50" r="17"/>
      <circle cx="50" cy="73" r="17"/><circle cx="27" cy="50" r="17"/>
    </g>
    <circle cx="50" cy="50" r="9" fill="#E6DAC8"/>
  </symbol>
  <!-- ճյուղիկ մանր ծաղիկներով -->
  <symbol id="sp" viewBox="0 0 100 100">
    <g fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
      <path d="M50 98 C50 72 42 52 30 28"/>
      <path d="M49 82 C56 62 68 50 77 31"/>
      <path d="M46 64 C40 52 28 48 17 41"/>
      <path d="M50 90 C58 82 66 80 74 80"/>
    </g>
    <g fill="currentColor">
      <circle cx="30" cy="25" r="6"/><circle cx="23" cy="33" r="4"/><circle cx="37" cy="30" r="4"/>
      <circle cx="77" cy="28" r="6"/><circle cx="70" cy="36" r="4"/><circle cx="84" cy="35" r="4"/>
      <circle cx="16" cy="38" r="5"/><circle cx="11" cy="46" r="3.5"/>
      <circle cx="75" cy="79" r="4.5"/><circle cx="46" cy="14" r="4"/>
    </g>
  </symbol>
</svg>`);

/* Կայուն «պատահական» թվեր, որ ծաղիկները միշտ նույն տեղում լինեն */
function rng(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const PALETTES = {
  cool:  ['#88708E', '#A9777A', '#BAAAC8', '#CBB9A4', '#D7C5D8'],
  warm:  ['#A9777A', '#88708E', '#BAAAC8', '#D7C5D8'],
  light: ['#E6DAC8', '#D7C5D8', '#DAD4DF', '#CBB9A4', '#BAAAC8'],
};

function makeFlower(id, color, size, style) {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('viewBox', '0 0 100 100');
  s.style.width = s.style.height = size + 'px';
  s.style.color = color;
  s.style.cssText += style;
  const u = document.createElementNS(NS, 'use');
  u.setAttribute('href', '#' + id);
  s.appendChild(u);
  return s;
}

/* Ծաղկային անկյուններ բաժինների համար */
function addFlora(el, palette, seed) {
  const r = rng(seed), pal = PALETTES[palette], box = document.createElement('div');
  box.className = 'flora';
  [['left', 'top'], ['right', 'top'], ['left', 'bottom'], ['right', 'bottom']].forEach(([sx, sy]) => {
    for (let i = 0; i < 5; i++) {
      const isSprig = i === 0;
      const id = isSprig ? 'sp' : (r() > .45 ? 'f5' : 'f4');
      const size = isSprig ? 70 + r() * 30 : 20 + r() * 34;
      const x = sx === 'left' ? -2 + r() * 13 : 89 + r() * 12;
      const y = sy === 'top' ? 1 + r() * 11 : 84 + r() * 12;
      const color = pal[Math.floor(r() * pal.length)];
      const rot = Math.round(r() * 360 - 180);
      const css = `left:${x}%;top:${y}%;--r:${rot}deg;--d:${6 + r() * 6}s;--dl:${-r() * 6}s;`;
      box.appendChild(decorate(makeFlower(id, color, size, css)));
    }
  });
  el.prepend(box);
}
function decorate(svg) { svg.classList.add('fl'); return svg; }

/* Թափվող թերթիկներ (բացման էկրանում և գլխավոր նկարի վրա) */
function addPetals(el, seed, count) {
  const r = rng(seed), pal = PALETTES.light, box = document.createElement('div');
  box.className = 'petals';
  for (let i = 0; i < count; i++) {
    const p = makeFlower(r() > .5 ? 'f5' : 'f4', pal[Math.floor(r() * pal.length)], 12 + r() * 16,
      `left:${r() * 100}%;--t:${11 + r() * 9}s;--dl:${-r() * 18}s;--x:${Math.round(-40 + r() * 80)}px;`);
    p.classList.add('petal');
    box.appendChild(p);
  }
  el.appendChild(box);
}

/* Զարդարանքի ավելացում */
addFlora(document.querySelector('.story'), 'cool', 11);
document.querySelectorAll('.photo-band').forEach((el, i) => addFlora(el, 'cool', 21 + i));
addFlora(document.querySelector('.countdown-sec'), 'warm', 31);
addFlora(document.querySelector('.calendar-sec'), 'cool', 41);
addFlora(document.querySelector('.place-sec'), 'cool', 51);
addFlora(document.querySelector('footer'), 'light', 61);
addPetals(document.querySelector('.hero'), 71, 16);
addPetals(cover, 81, 18);

/* Ծաղկային գիծ վերնագրերի տակ */
document.querySelectorAll('.sec-title').forEach(t => {
  const line = document.createElement('div');
  line.className = 'flower-line';
  line.append(makeFlower('f4', '#BAAAC8', 18, ''), makeFlower('f5', '#A9777A', 26, ''), makeFlower('f4', '#BAAAC8', 18, ''));
  t.after(line);
});

/* ========= Հայտնվելու անիմացիա ========= */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));