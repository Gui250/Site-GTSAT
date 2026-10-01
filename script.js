const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Revela blocos ao entrar na tela; o fechamento abre o círculo, os números contam.
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  }
}, { threshold: 0.2 });
document.querySelectorAll('[data-reveal], .closing').forEach((el) => io.observe(el));

function countUp(el) {
  const end = +el.dataset.count;
  if (calm) return;
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.round(end * (1 - (1 - p) ** 3));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Borda do topo depois de rolar
const bar = document.querySelector('.topbar');
addEventListener('scroll', () => bar.classList.toggle('scrolled', scrollY > 8), { passive: true });

// Sem movimento: o vídeo da hero fica parado no primeiro quadro
if (calm) document.querySelector('.hero-media video').pause();

// Reserva: monta a mensagem e abre o WhatsApp
const form = document.querySelector('.quote');
form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const d = new FormData(form);
  const nome = d.get('nome').trim();
  const err = form.querySelector('.form-error');
  err.hidden = !!nome;
  if (!nome) return form.nome.focus();
  const bairro = d.get('bairro').trim();
  const msg = `Olá, sou ${nome}${bairro ? `, do bairro ${bairro}` : ''}. Quero alugar uma moto no ${d.get('plano')}.`;
  open(`https://wa.me/557141410580?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});
