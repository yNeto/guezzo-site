# Guezzo TS Fit Club — landing page

Site institucional de conversão da **Guezzo TS Fit Club**, Cruz das Almas – BA — a
primeira academia 24 horas do Recôncavo da Bahia.

Astro (estático, zero JS por padrão) + GSAP/ScrollTrigger + Lenis. O build gera `dist/`
100% estático: sobe em Vercel, Netlify, GitHub Pages ou qualquer host.

## Rodar

```bash
npm install
npm run dev
```

- `npm run dev` — servidor local em http://localhost:4321
- `npm run build` — gera `dist/`
- `npm run preview` — serve o `dist/` já buildado

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| Preço, plano, regra, depoimento, modalidade, endereço, WhatsApp | `src/data/conteudo.ts` |
| Cores, raios, espaçamento, escala de fonte | `src/styles/tokens.css` |
| Uma seção específica | `src/components/<Secao>.astro` |
| Ordem das seções | `src/pages/index.astro` |
| Animações (reveals, contadores, parallax) | `src/scripts/animations.ts` |
| Comportamento do modal de matrícula | `src/scripts/modal.ts` |
| Meta tags, SEO, JSON-LD | `src/layouts/BaseLayout.astro` |

**`src/data/conteudo.ts` é a fonte única de verdade.** Preço mudou? É uma linha lá — não
precisa caçar texto espalhado no HTML.

## Decisões que valem saber

- **Sem "aula experimental"** em nenhum CTA. O material oficial do cliente diz que a
  academia não trabalha com essa modalidade. Os CTAs são "Fale no WhatsApp" e "Quero me
  matricular".
- **O modal não precisa de backend.** Ao enviar, ele monta um link `wa.me` com nome, plano
  e telefone preenchidos e abre a conversa — o lead chega de verdade.
- **Fotos são placeholders do Pexels** (uso comercial livre, sem atribuição obrigatória),
  otimizadas em build pelo `astro:assets` (WebP + lazy loading). Trocar por fotos reais é
  editar as URLs em `conteudo.ts` — ou colocar os arquivos em `src/assets/` e importar.
- **Movimento reduzido é respeitado**: com `prefers-reduced-motion`, o loader some, o
  marquee para, o Lenis não inicia e todo o conteúdo já nasce visível.

## O que ainda falta

- [ ] Fotos e vídeo reais do espaço, da fachada com o letreiro 24h e dos alunos —
      substituem os placeholders do Pexels.
- [ ] Domínio próprio. O `site:` em `astro.config.mjs` está com
      `guezzotsfitclub.com.br` como placeholder — ajustar antes de publicar, porque ele
      define a URL canônica e a do `og:image`.

`public/og-image.jpg` (preview de compartilhamento no WhatsApp/Instagram) já foi gerado
com a logo real e o selo 24h.
