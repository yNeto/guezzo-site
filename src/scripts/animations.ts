import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenis, getLenis, prefersReducedMotion } from './lenis-setup';

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   Fontes
   -------------------------------------------------------------------------- */

/**
 * As fontes usam font-display:swap e chegam depois do bundle. Se um
 * ScrollTrigger for criado antes delas, a métrica usada pra medir a posição
 * de start/end é a da fonte fallback — quando o Anton troca, o layout muda
 * de altura e a posição fica errada. Um `ScrollTrigger.refresh()` corrige
 * isso, mas se ele rodar bem no instante em que uma tween já começou a
 * tocar, a remedição pode travar essa tween no meio do progresso (título
 * trava cortado, só corrigido depois pelo failsafe). Em vez de criar cedo e
 * corrigir depois com refresh, todo ScrollTrigger espera a mesma fonte
 * pronta (teto de 400ms) antes de nascer — layout já é o final, nunca
 * precisa remedir nada no meio de uma animação em andamento.
 */
function fontsSettled(): Promise<void> {
  const prontas = document.fonts?.ready ?? Promise.resolve();
  const teto = new Promise<void>((resolve) => setTimeout(resolve, 400));
  return Promise.race([prontas, teto]).then(() => undefined);
}

/* --------------------------------------------------------------------------
   Reveals
   -------------------------------------------------------------------------- */

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

/**
 * Fade+slide via IntersectionObserver + transição CSS, sem GSAP/ScrollTrigger
 * /Lenis no caminho. Usado em [data-reveal-simple] e [data-reveal-lines] —
 * pontos onde o [data-reveal] com GSAP não disparava.
 */
function observeReveal(selector: string): void {
  const els = document.querySelectorAll<HTMLElement>(selector);
  if (!els.length) return;

  els.forEach((el) => {
    const delay = Number(el.dataset.revealDelay ?? 0);
    if (delay) el.style.setProperty('--reveal-delay', `${delay}s`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: '0px 0px -12% 0px' }
  );

  els.forEach((el) => observer.observe(el));
}

function revealSimple(): void {
  observeReveal('[data-reveal-simple]');
  observeReveal('[data-reveal-lines]');
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

    // [data-reveal-simple] e [data-reveal-lines] usam transição CSS via
    // IntersectionObserver, não GSAP — não travam no meio (transition não
    // pausa por rAF congelado), só falta a classe se o observer nunca
    // disparou (ex: aba já veio restaurada com scroll).
    document
      .querySelectorAll<HTMLElement>('[data-reveal-simple], [data-reveal-lines]')
      .forEach((el) => {
        if (!jaDeveriaEstarVisivel(el)) return;
        el.classList.add('is-visible');
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
  //
  // A primeira checagem não pode ser cedo demais: o contador ainda espera a
  // fonte (até 400ms) antes de começar a tween, que leva 1.8s pra terminar.
  // Menos que ~2s de folga e o failsafe crava o valor final no meio da
  // contagem, cortando a animação dele.
  window.setTimeout(() => {
    cravar();
    let voltas = 1;
    const intervalo = window.setInterval(() => {
      cravar();
      voltas += 1;
      if (voltas >= 10) window.clearInterval(intervalo);
    }, 1500);
  }, 2200);

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

  headerState();

  // IntersectionObserver não depende de métrica de fonte, roda já.
  revealSimple();

  // O que ainda usa ScrollTrigger (blocos, contador, parallax) espera a
  // fonte pronta (teto 400ms) — evita medir posição em pixel com a métrica
  // errada da fonte fallback antes do Anton trocar.
  fontsSettled().then(() => {
    revealBlocks();
    counters();
    parallax();
  });

  failsafeReveal();
}
