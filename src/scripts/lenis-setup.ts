import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

/**
 * Smooth scroll global. Devolve a instância (ou null quando o usuário
 * pediu movimento reduzido — aí o scroll nativo assume).
 */
export function initLenis(): Lenis | null {
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  const raf = (time: number) => {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Âncoras do header/menu passam pelo Lenis
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      lenis?.scrollTo(target as HTMLElement, { offset: -80 });
    });
  });

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function stopScroll(): void {
  lenis?.stop();
  document.body.classList.add('is-locked');
}

export function startScroll(): void {
  lenis?.start();
  document.body.classList.remove('is-locked');
}
