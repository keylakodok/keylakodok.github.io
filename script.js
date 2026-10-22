const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Animasi angka */
function count(el) {
  const to = +el.dataset.count; let n = 0;
  const t = setInterval(() => { el.textContent = ++n; if (n >= to) clearInterval(t); }, 1200 / to);
}

/* Muncul saat di-scroll: kartu, bar skill, dan angka */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  $$('.bar', e.target).forEach(b => b.style.width = b.dataset.w + '%');
  $$('[data-count]', e.target).forEach(count);
  io.unobserve(e.target);
}), { threshold: .15 });
$$('.rv').forEach(el => io.observe(el));

/* Teks mengetik di hero */
const roles = ['Software Developer', 'UI/UX Enthusiast', 'Mobile App Builder', 'Problem Solver'];
let ri = 0, ci = 0, del = false;
(function type() {
  const w = roles[ri], el = $('#typed');
  el.textContent = w.slice(0, ci += del ? -1 : 1);
  let wait = del ? 40 : 90;
  if (!del && ci === w.length) { del = true; wait = 1400; }
  else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; wait = 350; }
  setTimeout(type, wait);
})();

/* Jejak kilau mengikuti kursor */
let lastSpark = 0;
addEventListener('pointermove', e => {
  mouseX = e.clientX;
  const now = Date.now();
  if (reduce || now - lastSpark < 70 || e.pointerType === 'touch') return;
  lastSpark = now;
  const s = document.createElement('span');
  s.className = 'spark';
  s.textContent = ['✦', '♡', '✧', '❀'][Math.random() * 4 | 0];
  s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;color:${['#ff8fb8', '#9d7fc0', '#6fb5ee', '#4cc79a'][Math.random() * 4 | 0]}`;
  document.body.append(s);
  setTimeout(() => s.remove(), 900);
});

/* Toast */
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Avatar yang berjalan ---------- */
const INK = '#2b2140';
const avatar = c => `<svg viewBox="0 0 60 98" aria-hidden="true">
 <g class="legR"><rect x="31" y="66" width="9" height="24" rx="4.5" fill="${c.skin}" stroke="${INK}" stroke-width="3"/><ellipse cx="37" cy="92" rx="8" ry="4.5" fill="${INK}"/></g>
 <g class="legL"><rect x="20" y="66" width="9" height="24" rx="4.5" fill="${c.skin}" stroke="${INK}" stroke-width="3"/><ellipse cx="24" cy="92" rx="8" ry="4.5" fill="${INK}"/></g>
 <rect class="arm" x="45" y="50" width="8" height="22" rx="4" fill="${c.skin}" stroke="${INK}" stroke-width="3"/>
 <path d="M15 52 Q30 44 45 52 L54 80 H6Z" fill="${c.dress}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
 <circle cx="9" cy="28" r="8" fill="${c.hair}" stroke="${INK}" stroke-width="3"/><circle cx="51" cy="28" r="8" fill="${c.hair}" stroke="${INK}" stroke-width="3"/>
 <circle cx="30" cy="30" r="19" fill="${c.skin}" stroke="${INK}" stroke-width="3"/>
 <path d="M11 30 Q10 6 30 7 Q50 6 49 30 Q42 17 30 19 Q18 17 11 30Z" fill="${c.hair}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
 <circle cx="23" cy="33" r="2.6" fill="${INK}"/><circle cx="37" cy="33" r="2.6" fill="${INK}"/>
 <ellipse cx="18" cy="39" rx="3.5" ry="2.2" fill="#ff8fb8" opacity=".8"/><ellipse cx="42" cy="39" rx="3.5" ry="2.2" fill="#ff8fb8" opacity=".8"/>
 <path d="M26 40 Q30 44 34 40" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
 <path d="M38 8 L50 3 L47 15Z M38 8 L28 1 L30 13Z" fill="${c.bow}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>
</svg>`;

const talk = {
  idle: ['Halo! Selamat datang 👋', 'Psst, cek proyek Keyla ya ✨', 'Keyla jago Flutter lho!', 'Ngoding itu seru 💻', 'Aku lagi jalan-jalan 🚶‍♀️', 'Jangan lupa minum air 💧', 'Mau kolaborasi? Buka bagian Kontak!', 'Bug hari ini, besok sudah jadi fitur 🐛'],
  meet: ['Eh, ketemu lagi!', 'Hai teman! 🎀', 'Sudah lihat skill Keyla?', 'Ayo jalan bareng!']
};
const pick = a => a[Math.random() * a.length | 0];

let mouseX = null, follow = false;
const pets = [
  { c: { skin: '#ffe3d2', hair: '#6b4a7a', dress: '#ff8fb8', bow: '#bde0fe' }, x: 120, dir: 1, v: 1.1 },
  { c: { skin: '#f4d0b5', hair: '#2b2140', dress: '#bde0fe', bow: '#ffc8dd' }, x: 420, dir: -1, v: .8 }
].map(p => {
  p.el = document.createElement('div');
  p.el.className = 'pet walk';
  p.el.setAttribute('role', 'button');
  p.el.setAttribute('aria-label', 'Avatar, klik untuk menyapa');
  p.el.innerHTML = `<div class="bubble"></div><div class="inner">${avatar(p.c)}</div>`;
  document.body.append(p.el);
  p.inner = $('.inner', p.el); p.bub = $('.bubble', p.el); p.pause = 0; p.hush = 0;
  p.el.addEventListener('click', () => say(p, pick(talk.idle), true));
  return p;
});

function say(p, msg, jump) {
  p.bub.textContent = msg; p.bub.classList.add('show'); p.el.classList.add('talk');
  if (jump) { p.el.classList.remove('jump'); void p.el.offsetWidth; p.el.classList.add('jump'); }
  p.pause = performance.now() + 2600;
  clearTimeout(p.tid);
  p.tid = setTimeout(() => { p.bub.classList.remove('show'); p.el.classList.remove('talk', 'jump'); }, 2600);
}

function frame(now) {
  const max = innerWidth - pets[0].el.offsetWidth;
  pets.forEach(p => {
    const paused = now < p.pause;
    let speed = p.v;
    if (!paused && follow && mouseX !== null) {
      const dx = mouseX - p.el.offsetWidth / 2 - p.x;
      if (Math.abs(dx) > 12) { p.dir = Math.sign(dx); speed = 2.6; } else speed = 0;
    } else if (!paused && Math.random() < .003) {
      Math.random() < .5 ? (p.dir *= -1) : (p.pause = now + 1200 + Math.random() * 1500);
    }
    const walking = !paused && speed > 0;
    p.el.classList.toggle('walk', walking);
    if (walking) p.x += p.dir * speed;
    if (p.x < 0) { p.x = 0; p.dir = 1; } else if (p.x > max) { p.x = max; p.dir = -1; }
    p.el.style.transform = `translateX(${p.x}px)`;
    p.inner.style.scale = p.dir > 0 ? '1' : '-1 1';
  });
  const [a, b] = pets;
  if (Math.abs(a.x - b.x) < 70 && now > a.hush) {
    a.hush = b.hush = now + 9000;
    say(a, pick(talk.meet)); setTimeout(() => say(b, pick(talk.meet)), 700);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* Tombol: avatar ikut kursor */
$('#follow').addEventListener('click', e => {
  follow = !follow;
  e.currentTarget.textContent = 'Avatar ikut kursor: ' + (follow ? 'nyala' : 'mati');
  e.currentTarget.setAttribute('aria-pressed', follow);
  toast(follow ? 'Gerakkan kursor, mereka akan mengejarnya!' : 'Avatar kembali jalan-jalan.');
});

/* Avatar menyapa saat bagian baru dibuka */
const greet = { about: 'Ini bagian tentang Keyla!', skills: 'Lihat bar skill-nya bergerak 😍', projects: 'Proyek favoritku ada di sini!', contact: 'Kirim pesan yuk 💌' };
const secIO = new IntersectionObserver(es => es.forEach(e => {
  const id = e.target.id;
  if (e.isIntersecting && greet[id]) { say(pets[Math.random() * 2 | 0], greet[id]); delete greet[id]; }
}), { threshold: .4 });
$$('section[id]').forEach(s => secIO.observe(s));

/* Formulir kontak (demo, belum terhubung ke server) */
$('#form').addEventListener('submit', e => {
  e.preventDefault(); e.target.reset();
  toast('Pesan terkirim, terima kasih! 💌');
  say(pets[0], 'Yay, pesan terkirim!', true);
});