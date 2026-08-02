import { stopScroll, startScroll } from './lenis-setup';

const WHATSAPP = '5575983572029';

/**
 * Modal "Quero me matricular".
 * O submit não depende de backend: monta um link wa.me com os dados
 * preenchidos e abre a conversa — o lead chega de verdade.
 */
export function initModal(): void {
  const modal = document.querySelector<HTMLElement>('[data-modal]');
  if (!modal) return;

  const form = modal.querySelector<HTMLFormElement>('[data-modal-form]');
  const select = modal.querySelector<HTMLSelectElement>('#plano');
  const nomeInput = modal.querySelector<HTMLInputElement>('#nome');
  let lastFocused: HTMLElement | null = null;

  const open = (plano?: string) => {
    lastFocused = document.activeElement as HTMLElement;
    if (plano && select) {
      const match = Array.from(select.options).find((o) => o.value === plano);
      if (match) select.value = plano;
    }
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    stopScroll();
    window.setTimeout(() => nomeInput?.focus(), 320);
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    startScroll();
    lastFocused?.focus();
  };

  document.querySelectorAll<HTMLElement>('[data-modal-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      open(trigger.dataset.modalOpen || undefined);
    });
  });

  modal.querySelectorAll<HTMLElement>('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nome = String(data.get('nome') ?? '').trim();
    const telefone = String(data.get('telefone') ?? '').trim();
    const plano = String(data.get('plano') ?? '').trim();

    const mensagem =
      `Olá! Meu nome é ${nome}, tenho interesse no plano ${plano} da Guezzo TS Fit Club.` +
      (telefone ? ` Meu WhatsApp é ${telefone}.` : '');

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`,
      '_blank',
      'noopener'
    );

    modal.classList.add('is-sent');
    window.setTimeout(() => {
      close();
      modal.classList.remove('is-sent');
      form.reset();
    }, 2400);
  });
}
