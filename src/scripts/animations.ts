import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenis, getLenis, prefersReducedMotion } from './lenis-setup';

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   Reveals
   -------------------------------------------------------------------------- */

function revealLines(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal-lines]').forEach((group) => {
    const spans = group.querySelectorAll<HTMLElement>('[data-reveal-line] > span');
    if (!spans.length) return;

    gsap.to(spans, {
      yPercent: 0,
      duration: 1.05,
      ease: 'power4.out',
      stagger: 0.075,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });
}

function revealBlocks(): void {
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const delay = Number(el.dataset.revealDelay ?? 0);
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      delay,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/* --------------------------------------------------------------------------
   Contadores
   -------------------------------------------------------------------------- */

function counters(): void {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count ?? 0);
    const suffix = el.dataset.countSuffix ?? '';
    const state = { value: 0 };

    gsap.to(state, {
      value: target,
      duration: 1.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = Math.round(state.value).toLocaleString('pt-BR') + suffix;
      },
    });
  });
}

/* --------------------------------------------------------------------------
   Parallax
   -------------------------------------------------------------------------- */

function parallax(): void {
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const strength = Number(el.dataset.parallax || 12);
    gsap.fromTo(
      el,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    );
  });
}

/* --------------------------------------------------------------------------
   Header: fundo sólido depois da primeira dobra
   -------------------------------------------------------------------------- */

function headerState(): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!header) return;

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      header.classList.toggle('is-scrolled', self.scroll() > 80);
    },
  });
  header.classList.toggle('is-scrolled', window.scrollY > 80);
}

/* --------------------------------------------------------------------------
   Boot
   -------------------------------------------------------------------------- */

export function initAnimations(): void {
  document.documentElement.classList.add('js-ready');

  if (prefersReducedMotion()) {
    // Tudo já visível via CSS. Nenhum scroll-trigger, nenhum parallax.
    headerState();
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = Number(el.dataset.count ?? 0);
      el.textContent = target.toLocaleString('pt-BR') + (el.dataset.countSuffix ?? '');
    });
    return;
  }

  initLenis();
  const lenis = getLenis();
  lenis?.on('scroll', ScrollTrigger.update);
  ScrollTrigger.defaults({ invalidateOnRefresh: true });

  revealLines();
  revealBlocks();
  counters();
  parallax();
  headerState();

  // Fontes chegam depois do primeiro paint e mudam a altura dos títulos
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
