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

/* ========= Հայտնվելու անիմացիա ========= */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));