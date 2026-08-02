/**
 * Fonte única de verdade do conteúdo do site.
 * Preço mudou? Depoimento novo? Modalidade nova? É aqui — e só aqui.
 */

/* --------------------------------------------------------------------------
   Negócio / contato
   -------------------------------------------------------------------------- */

export const negocio = {
  nome: 'Guezzo TS Fit Club',
  claim: '1ª academia 24h do Recôncavo da Bahia',
  endereco: {
    rua: 'Rua Silvestre Mendes, nº 329',
    bairro: 'Centro',
    cidade: 'Cruz das Almas',
    uf: 'BA',
    cep: '44380-000',
    referencia: 'a ~500m da Biblioteca Municipal',
  },
  horario: 'Aberta 24 horas, todos os dias',
  telefone: '(75) 98357-2029',
  whatsappNumero: '5575983572029',
  instagram: {
    handle: '@guezzotsfitclub',
    url: 'https://www.instagram.com/guezzotsfitclub/',
    seguidores: 8300,
  },
  google: {
    nota: '4,9',
    avaliacoes: 115,
  },
  mapsEmbed:
    'https://www.google.com/maps?q=Rua+Silvestre+Mendes,+329,+Centro,+Cruz+das+Almas+-+BA,+44380-000&output=embed',
  mapsLink:
    'https://www.google.com/maps/search/?api=1&query=Guezzo+TS+Fit+Club+Cruz+das+Almas+BA',
} as const;

/** Monta um link wa.me com mensagem pré-preenchida. */
export function whatsappLink(mensagem: string): string {
  return `https://wa.me/${negocio.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}

export const whatsappPadrao = whatsappLink(
  'Oi! Quero saber mais sobre a Guezzo TS Fit Club.'
);

/* --------------------------------------------------------------------------
   Fotos
   -------------------------------------------------------------------------- */

import fachadaImg from '../assets/estrutura-fachada.jpg';
import musculacaoImg from '../assets/estrutura-musculacao.jpg';
import cardioImg from '../assets/estrutura-cardio.jpg';

// Banco Pexels (uso comercial livre, sem atribuição obrigatória): ainda cobre
// as seções que não têm foto própria do cliente.
const px = (path: string, w = 1600) =>
  `${path}?auto=compress&cs=tinysrgb&w=${w}`;

export const fotos = {
  hero: px('https://images.pexels.com/photos/3253515/pexels-photo-3253515.jpeg', 1920),
  cross: px('https://images.pexels.com/photos/4720796/pexels-photo-4720796.jpeg'),
  musculacao: px('https://images.pexels.com/photos/4720758/pexels-photo-4720758.jpeg'),
  personal: px('https://images.pexels.com/photos/13451904/pexels-photo-13451904.jpeg'),
  interior: px(
    'https://images.pexels.com/photos/29392546/pexels-photo-29392546/free-photo-of-dimly-lit-modern-gym-with-equipment-reflection.jpeg'
  ),
  danca: px('https://images.pexels.com/photos/4090012/pexels-photo-4090012.jpeg'),
  equipamentos: px(
    'https://images.pexels.com/photos/19025674/pexels-photo-19025674/free-photo-of-a-row-of-dumbbells-in-a-gym.jpeg'
  ),
  yoga: px(
    'https://images.pexels.com/photos/37573625/pexels-photo-37573625/free-photo-of-sunlit-modern-pilates-studio-with-equipment.jpeg'
  ),
  kids: px(
    'https://images.pexels.com/photos/26283685/pexels-photo-26283685/free-photo-of-boys-playing-soccer-on-pitch.jpeg'
  ),
} as const;

/** Fotos reais do espaço, enviadas pelo cliente. */
export const fotosReais = {
  fachada: fachadaImg,
  musculacao: musculacaoImg,
  cardio: cardioImg,
} as const;

/* --------------------------------------------------------------------------
   Modalidades
   -------------------------------------------------------------------------- */

export type Modalidade = {
  nome: string;
  descricao: string;
  icone: string; // path SVG (viewBox 0 0 24 24, stroke)
};

export const modalidades: Modalidade[] = [
  {
    nome: 'Musculação',
    descricao: 'Sala ampla, climatizada e equipamento novo.',
    icone: 'M6.5 8v8M17.5 8v8M4 10v4M20 10v4M6.5 12h11',
  },
  {
    nome: 'Cross Training',
    descricao: 'Treino funcional de alta intensidade, em turmas.',
    icone: 'M12 3v4M12 17v4M4.9 7.5l2.8 2.8M16.3 13.7l2.8 2.8M3 12h4M17 12h4M4.9 16.5l2.8-2.8M16.3 10.3l2.8-2.8',
  },
  {
    nome: 'Personal Trainer',
    descricao: 'Acompanhamento individual do início ao fim.',
    icone: 'M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 3a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7M19 8v6M22 11h-6',
  },
  {
    nome: 'Dança',
    descricao: 'Aulas com coreografia, ritmo e muito gasto calórico.',
    icone: 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 18V6l11-3v12M20 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  },
  {
    nome: 'Espaço Kids',
    descricao: 'Seu filho seguro enquanto você treina.',
    icone: 'M12 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM7 21v-4M17 21v-4M7 17h10l-1-6H8l-1 6Z',
  },
  {
    nome: 'Yoga & Pilates',
    descricao: 'Força, mobilidade e respiração em sala reservada.',
    icone: 'M12 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM12 8v6M5 11h14M9 20l3-6 3 6',
  },
  {
    nome: 'Alongamento',
    descricao: 'Sessões guiadas para recuperação e amplitude.',
    icone: 'M4 20L10 8l4 6 6-10M4 20h16',
  },
  {
    nome: 'Avaliação Física',
    descricao: 'Medidas, metas e treino desenhado pra você.',
    icone: 'M9 3h6v4H9zM7 7h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2ZM9 13h6M9 17h4',
  },
];

/** Fita do marquee: modalidades + o diferencial 24h a cada volta. */
export const marqueeItens: string[] = [
  'Musculação',
  'Cross Training',
  'Personal',
  'Dança',
  'Aberto 24h',
  'Espaço Kids',
  'Yoga',
  'Pilates',
  'Alongamento',
  'Aberto 24h',
  'Ginástica',
  'Avaliação Física',
];

/* --------------------------------------------------------------------------
   Estatísticas
   -------------------------------------------------------------------------- */

export type Stat = {
  valor: number | null; // null = não é count-up (ver `texto`)
  texto: string;
  sufixo?: string;
  rotulo: string;
  destaque?: boolean;
};

export const stats: Stat[] = [
  { valor: null, texto: '24H', rotulo: 'Aberta todos os dias', destaque: true },
  { valor: 8300, texto: '8300', sufixo: '+', rotulo: 'Na comunidade do Instagram' },
  { valor: 10, texto: '10', rotulo: 'Modalidades no mesmo lugar' },
  { valor: 500, texto: '500', sufixo: 'm', rotulo: 'Do centro de Cruz das Almas' },
];

/* --------------------------------------------------------------------------
   Horários "impossíveis" — storytelling do 24h
   -------------------------------------------------------------------------- */

export const horarios = [
  {
    hora: '05:00',
    titulo: 'Antes do trabalho',
    texto: 'Treino feito antes do sol nascer. O dia começa com uma vitória.',
    foto: fotos.musculacao,
  },
  {
    hora: '22:00',
    titulo: 'Depois do plantão',
    texto: 'Saiu tarde do serviço? A porta continua aberta.',
    foto: fotos.equipamentos,
  },
  {
    hora: '02:00',
    titulo: 'De madrugada',
    texto: 'Insônia, turno da noite ou só a sua hora. Sem fila, sem espera.',
    foto: fotos.interior,
  },
];

/* --------------------------------------------------------------------------
   Estrutura
   -------------------------------------------------------------------------- */

export const estrutura = [
  {
    titulo: 'Nossa fachada',
    texto: 'Rua Silvestre Mendes, 329, Centro. É só entrar.',
    foto: fotosReais.fachada,
  },
  {
    titulo: 'Sala de musculação',
    texto: 'Equipamento novo, espaço amplo e piso emborrachado.',
    foto: fotosReais.musculacao,
  },
  {
    titulo: 'Cardio e funcional',
    texto: 'Esteiras, leg press e telas para você não enjoar do treino.',
    foto: fotosReais.cardio,
  },
];

/* --------------------------------------------------------------------------
   Planos (material oficial do cliente)
   -------------------------------------------------------------------------- */

export type Plano = {
  nome: string;
  preco: string;
  periodo: string;
  detalhe: string;
  beneficios: string[];
  destaque?: boolean;
};

export const planos: Plano[] = [
  {
    nome: 'Individual',
    preco: 'R$ 170,00',
    periodo: '/mês',
    detalhe: 'Liberdade total de horários',
    beneficios: [
      'Acesso 24h, todos os dias',
      'Pode treinar mais de uma vez por dia',
      'Todas as modalidades inclusas',
    ],
    destaque: true,
  },
  {
    nome: 'Amigo',
    preco: 'R$ 120,00',
    periodo: '/mês por pessoa',
    detalhe: 'Matricule-se com um amigo',
    beneficios: [
      'Benefício exclusivo para dupla',
      'Acesso 24h, todos os dias',
      'Vale para novas matrículas',
    ],
  },
  {
    nome: 'Família',
    preco: 'R$ 120,00',
    periodo: '/mês por pessoa',
    detalhe: 'Com um familiar na Guezzo',
    beneficios: [
      'Vale também se já tem parente treinando',
      'Acesso 24h, todos os dias',
      'Sem limite de parentes no plano',
    ],
  },
  {
    nome: 'Estudante',
    preco: 'R$ 120,00',
    periodo: '/mês',
    detalhe: 'Com comprovante escolar',
    beneficios: [
      'Comprovante escolar ou acadêmico',
      'Acesso 24h, todos os dias',
      'Todas as modalidades inclusas',
    ],
  },
  {
    nome: 'Flex',
    preco: 'R$ 69,90',
    periodo: '/5 dias',
    detalhe: 'Ideal para quem está de passagem',
    beneficios: [
      '5 dias corridos a partir da ativação',
      '1 acesso por dia',
      'Sem opção de trancamento',
    ],
  },
];

export const diaria = {
  nome: 'Diária avulsa',
  preco: 'R$ 20,00',
  detalhe: 'Passe de um dia único. Treine hoje e decida depois.',
};

export const regras = [
  {
    pergunta: 'Posso trancar o plano?',
    resposta:
      'Sim. O trancamento é permitido por até 15 dias, uma vez ao mês.',
  },
  {
    pergunta: 'Qual a idade mínima para treinar?',
    resposta:
      'A partir de 13 anos o treino é liberado normalmente. Menores de 13 anos só com Personal Trainer exclusivo. Menores de 18 precisam de autorização assinada dos pais ou responsáveis para a matrícula.',
  },
  {
    pergunta: 'Como funcionam os armários?',
    resposta:
      'Uso rotativo, exclusivo para o horário do treino. O cadeado é responsabilidade do aluno.',
  },
  {
    pergunta: 'E se eu atrasar o pagamento?',
    resposta: 'Há 2 dias de tolerância após o vencimento.',
  },
  {
    pergunta: 'Aceitam Gympass e TotalPass?',
    resposta:
      'Sim. 1 check-in diário, seguindo as regras de cada plataforma.',
  },
  {
    pergunta: 'Tenho um problema de saúde. Como fica?',
    resposta:
      'Casos de saúde com atestado médico são avaliados como exceção às regras de trancamento.',
  },
];

/* --------------------------------------------------------------------------
   Depoimentos (avaliações reais do Google)
   -------------------------------------------------------------------------- */

export const depoimentos = [
  {
    texto:
      'Excelente! Tudo novinho e bem cuidado! Atendimento excelente! Um agradecimento ao Lucas e à Bia pelo auxílio na recepção e no treino!',
    autor: 'Eliabe Silva',
    origem: 'Avaliação no Google',
  },
  {
    texto:
      'A melhor academia da cidade! Bem ampla, com grande variedade de aparelhos e instrutores maravilhosos!',
    autor: 'Iumi Toyosumi',
    origem: 'Avaliação no Google',
  },
  {
    texto:
      'A melhor academia de Cruz das Almas, com um ótimo atendimento, local climatizado, bons aparelhos!',
    autor: 'Natalia Cardim',
    origem: 'Avaliação no Google',
  },
];

/* --------------------------------------------------------------------------
   Navegação
   -------------------------------------------------------------------------- */

export const navLinks = [
  { rotulo: 'Modalidades', href: '#modalidades' },
  { rotulo: 'Estrutura', href: '#estrutura' },
  { rotulo: 'Planos', href: '#planos' },
];

export const navLinksMenu = [
  ...navLinks,
  { rotulo: 'Depoimentos', href: '#depoimentos' },
  { rotulo: 'Onde estamos', href: '#localizacao' },
];
