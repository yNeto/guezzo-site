import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenis, getLenis, prefersReducedMotion } from './lenis-setup';

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   Reveals
   -------------------------------------------------------------------------- */

function revealLines(): void {
  const criar = () => {
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
  };

  // As fontes usam font-display:swap e chegam depois do bundle. Se a tween
  // começar antes, o glifo troca de forma no meio do translateY — a fonte
  // fallback anima, o Anton estoura por cima no meio do movimento. Espera as
  // fontes (com teto de 400ms) antes de criar o ScrollTrigger; o título
  // continua mascarado até lá, então não perde nada visível.
  const prontas = document.fonts?.ready ?? Promise.resolve();
  const teto = new Promise<void>((resolve) => setTimeout(resolve, 400));
  Promise.race([prontas, teto]).then(criar);
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

/**
 * Rede de segurança contra rAF congelado (aba aberta em segundo plano): o
 * ScrollTrigger dispara, a tween começa e para no meio, deixando o texto preso
 * fora da máscara. Só mexe no que já deveria estar visível pela posição atual
 * de scroll — nunca em algo abaixo da dobra que o usuário ainda não alcançou,
 * senão a reserva mata a tween real e o elemento "pula" pronto quando o
 * ScrollTrigger dele finalmente dispara, sem transição nenhuma.
 */
function failsafeReveal(): void {
  const jaDeveriaEstarVisivel = (el: HTMLElement): boolean => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  const cravar = () => {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      if (!jaDeveriaEstarVisivel(el)) return;
      if (Number(getComputedStyle(el).opacity) < 0.99) {
        gsap.killTweensOf(el);
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.willChange = 'auto';
      }
    });

    document
      .querySelectorAll<HTMLElement>('[data-reveal-line] > span')
      .forEach((span) => {
        const linha = span.parentElement;
        if (!linha || !jaDeveriaEstarVisivel(linha)) return;
        // Lê o transform pintado: o yPercent que o GSAP reporta pode já ser 0
        // enquanto a matriz congelada ainda mantém a linha fora da máscara.
        const t = getComputedStyle(span).transform;
        const deslocamento = t === 'none' ? 0 : new DOMMatrixReadOnly(t).m42;
        if (Math.abs(deslocamento) > 1) {
          gsap.killTweensOf(span);
          span.style.transform = 'none';
          span.style.willChange = 'auto';
        }
      });

    // Um contador parado em "0+ seguidores" é pior que não animar nunca
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      if (!jaDeveriaEstarVisivel(el)) return;
      const alvo = Number(el.dataset.count ?? 0);
      const sufixo = el.dataset.countSuffix ?? '';
      const final = alvo.toLocaleString('pt-BR') + sufixo;
      // A tween anima um objeto intermediário, não o elemento: escrever o texto
      // basta. Se o rAF voltar, ela retoma e termina no mesmo valor.
      if (el.textContent !== final) el.textContent = final;
    });
  };

  // setInterval roda por fora do rAF: mesmo com a aba em segundo plano (rAF
  // pausado), continua verificando o que já deveria estar visível conforme o
  // usuário rola. Para sozinho depois de um tempo para não ficar de vigia pra
  // sempre.
  let voltas = 0;
  const intervalo = window.setInterval(() => {
    cravar();
    voltas += 1;
    if (voltas >= 10) window.clearInterval(intervalo);
  }, 1500);

  // Ao voltar para a aba, corrige de imediato o que ficou congelado
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) window.setTimeout(cravar, 300);
  });
}

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

  failsafeReveal();
}
