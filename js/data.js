/**
 * COTA ZERO — data.js
 * Fonte única de verdade do site. Editar aqui os projetos, materiais,
 * processo, equipa e dados do estúdio. Nenhum conteúdo estrutural vive no HTML.
 */

/* --------------------------------------------------------------------------
   Estúdio
   -------------------------------------------------------------------------- */
export const studio = {
  nome: "Cota Zero",
  nomeCompleto: "Cota Zero, Atelier de Arquitetura",
  lema: "Tudo começa na cota zero.",
  fundacao: 2011,
  morada: "Rua de Mouzinho da Silveira, 120",
  codigoPostal: "4050-417",
  localidade: "Porto",
  pais: "Portugal",
  telefone: "22 600 12 34",
  telefoneHref: "+351226001234",
  email: "estudio@cotazero.pt",
  instagram: "@cotazero.atelier",
  instagramUrl: "https://instagram.com/cotazero.atelier",
  coordenadas: { lat: 41.1479, lng: -8.6122 },
  coordenadasTexto: "41°08′52″N · 8°36′44″O",
  horario: [
    ["Segunda — Quinta", "09:00 — 18:30"],
    ["Sexta", "09:00 — 17:30"],
    ["Sábado — Domingo", "Fechado"]
  ]
};

/* --------------------------------------------------------------------------
   Projetos
   -------------------------------------------------------------------------- */
/* Imagens de demonstração locais, optimizadas em WebP.
   A origem e as instruções de substituição estão em images/LEIA-ME.md. */
const photo = (id, w = 1600, h = 1200) => `images/demo/${id}-${w}x${h}.webp`;

export const projects = [
  {
    id: "casa-do-muro",
    codigo: "A-01",
    nome: "Casa do Muro",
    local: "Gerês",
    distrito: "Braga",
    lat: 41.7286,
    lng: -8.1612,
    ano: 2023,
    tipologia: "habitacao",
    tipologiaLabel: "Habitação",
    area: 280,
    estado: "Construído",
    estadoKey: "construido",
    programa: "Habitação unifamiliar · 3 quartos · atelier",
    materiais: ["betao", "madeira", "pedra", "vidro"],
    equipa: ["Ricardo Teles", "Inês Barroso", "Marta Sequeira"],
    fotografo: "Nuno Calejo",
    cliente: "Particular",
    descricaoCurta: "Dois volumes de betão apoiados num muro de granito existente, a 900 metros de altitude.",
    coordenadasTexto: "41°43′43″N · 8°09′40″O",
    memoria: [
      "A casa parte de um muro de granito que já existia no limite poente do terreno. Em vez de o demolir, o projeto fixa aí a cota zero e organiza a construção em dois volumes paralelos: um mais baixo, encostado ao muro, e outro que se destaca e abre para o vale. O desnível de 4,2 metros entre a entrada e o pátio é resolvido por uma plataforma de betão, sem escadas exteriores.",
      "A estrutura é de betão aparente, com cofragem de pinho e juntas marcadas. As paredes interiores acompanham a mesma modulação de 3,20 metros, o que permite trocar divisórias sem tocar na estrutura. A madeira aparece apenas onde o corpo pede contacto: pavimentos, caixilharia e o móvel contínuo da cozinha. O granito extraído no local foi reutilizado em muros de suporte e no pavimento do pátio. A cobertura inclinada a duas águas é a única concessão à paisagem; o resto da casa é uma secção constante, medida a partir do muro."
    ],
    citacao: {
      texto: "A casa não se apoia na paisagem. Delimita-a.",
      autor: "Ricardo Teles, sócio fundador"
    },
    capa: {
      src: photo("photo-1600585154340-be6161a56a0c", 1800, 1350),
      alt: "Volume de habitação em betão e madeira, encostado a um muro de pedra, entre vegetação de altitude.",
      legenda: "Fachada poente e muro de granito"
    },
    imagens: [
      {
        src: photo("photo-1600585154340-be6161a56a0c", 1800, 1350),
        alt: "Fachada principal da Casa do Muro, com betão aparente e caixilharia de madeira.",
        legenda: "FIG. 01 — Fachada poente — 2023",
        largura: 1800,
        altura: 1350
      },
      {
        src: photo("photo-1600607687939-ce8a6c25118c", 1400, 1750),
        alt: "Sala de estar com pé-direito alto, betão à vista e pavimento de madeira.",
        legenda: "FIG. 02 — Sala / pátio — 2023",
        largura: 1400,
        altura: 1750
      },
      {
        src: photo("photo-1511818966892-d7d671e672a2", 1600, 1200),
        alt: "Pormenor de fachada em betão aparente com sombras verticais.",
        legenda: "FIG. 03 — Betão / cofragem — 2023",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1600566753086-00f18fb6b3ea", 1600, 1200),
        alt: "Cozinha em madeira maciça com bancada de pedra e janela para o vale.",
        legenda: "FIG. 04 — Cozinha / móvel contínuo — 2023",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1508450859948-4e04fabaa4ea", 1200, 1600),
        alt: "Escada interior em betão, iluminada por uma fenda vertical.",
        legenda: "FIG. 05 — Escada / luz norte — 2023",
        largura: 1200,
        altura: 1600
      }
    ],
    desenho: {
      planta: {
        largura: 16,
        profundidade: 9.2,
        rooms: [
          { x: 0.4, y: 0.4, w: 4.6, h: 4.0, n: "SALA" },
          { x: 0.4, y: 4.6, w: 4.6, h: 4.2, n: "COZINHA" },
          { x: 5.2, y: 0.4, w: 4.4, h: 2.8, n: "SUITE" },
          { x: 5.2, y: 3.4, w: 4.4, h: 2.6, n: "QUARTO" },
          { x: 5.2, y: 6.2, w: 4.4, h: 2.6, n: "BANHO" },
          { x: 9.8, y: 0.4, w: 5.8, h: 4.0, n: "ATELIER" },
          { x: 9.8, y: 4.6, w: 5.8, h: 4.2, n: "PÁTIO" }
        ],
        aberturas: [
          { lado: "top", pos: 1.6, largura: 2.2 },
          { lado: "top", pos: 11.2, largura: 2.8 },
          { lado: "bottom", pos: 2.0, largura: 2.4 },
          { lado: "left", pos: 1.8, largura: 1.6 }
        ],
        portas: [
          { x: 5.2, y: 1.9, dir: "v" },
          { x: 5.2, y: 5.8, dir: "v" },
          { x: 9.8, y: 2.4, dir: "v" }
        ]
      },
      corte: {
        largura: 16,
        altura: 6.8,
        niveis: [0, 3.0, 6.8],
        vaos: [5.6, 4.8, 5.6],
        cobertura: "inclinada",
        beiral: 0.45
      },
      alcado: {
        largura: 16,
        altura: 6.8,
        vaos: [5.6, 4.8, 5.6],
        cobertura: "inclinada",
        aberturas: [
          { x: 1.4, w: 2.4, h: 2.4 },
          { x: 6.2, w: 2.0, h: 2.2 },
          { x: 11.2, w: 3.0, h: 2.6 }
        ]
      }
    },
    destaque: true
  },
  {
    id: "armazem-14",
    codigo: "A-02",
    nome: "Armazém 14",
    local: "Porto",
    distrito: "Porto",
    lat: 41.1465,
    lng: -8.6120,
    ano: 2022,
    tipologia: "reabilitacao",
    tipologiaLabel: "Reabilitação",
    area: 1450,
    estado: "Construído",
    estadoKey: "construido",
    programa: "Armazém · escritórios · arquivo · doca",
    materiais: ["betao", "aco-corten", "vidro"],
    equipa: ["Inês Barroso", "Ricardo Teles", "João Almeida"],
    fotografo: "João Margado",
    cliente: "Promotor privado",
    descricaoCurta: "Um armazém portuário devolvido à cidade, com a estrutura metálica e as marcas de uso à vista.",
    coordenadasTexto: "41°08′47″N · 8°36′43″O",
    memoria: [
      "O Armazém 14 é uma reabilitação de um edifício portuário do início do século XX, no eixo da Alfândega. A intervenção mantém a nave central, a estrutura metálica rebitada e as paredes de granito. Tudo o que foi acrescentado ao longo do tempo — mezaninos, divisórias, forros — foi retirado. A cota zero foi fixada no pavimento original, rebaixado 12 centímetros para receber infraestruturas e um novo piso de betão polido.",
      "Os escritórios ocupam uma caixa suspensa de aço corten no interior da nave, sem tocar nas paredes exteriores. A caixa é também o arquivo: uma pele perfurada regula a luz e a privacidade. A doca de carga foi convertida em entrada pública, com um pano de vidro recuado que deixa a estrutura antiga livre. O desenho das novas guardas repete o módulo dos caixilhos existentes. A obra foi concluída sem alterar a cércea nem abrir novos vãos, mantendo intacta a leitura do conjunto a partir da rua."
    ],
    citacao: {
      texto: "Não acrescentámos nada que a nave não pudesse suportar.",
      autor: "Inês Barroso, sócia fundadora"
    },
    capa: {
      src: photo("photo-1581094794329-c8112a89af12", 1800, 1200),
      alt: "Interior de armazém industrial com estrutura metálica e grande vão de luz.",
      legenda: "Nave central e estrutura original"
    },
    imagens: [
      {
        src: photo("photo-1581094794329-c8112a89af12", 1800, 1200),
        alt: "Nave central do Armazém 14 com estrutura metálica rebitada e pavimento de betão.",
        legenda: "FIG. 01 — Nave central — 2022",
        largura: 1800,
        altura: 1200
      },
      {
        src: photo("photo-1497366754035-f200968a6e72", 1600, 1200),
        alt: "Espaço de escritórios com mesas e iluminação natural vinda do lanternim.",
        legenda: "FIG. 02 — Escritórios suspensos — 2022",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1486406146926-c627a92ad1ab", 1200, 1600),
        alt: "Fachada do armazém com caixilharia metálica e marcação vertical dos vãos.",
        legenda: "FIG. 03 — Alçado sul — 2022",
        largura: 1200,
        altura: 1600
      },
      {
        src: photo("photo-1497366811353-6870744d04b2", 1600, 1200),
        alt: "Sala de reuniões integrada na caixa de aço corten, com mesa de madeira.",
        legenda: "FIG. 04 — Sala de reuniões — 2022",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1518005020951-eccb494ad742", 1200, 1600),
        alt: "Pormenor de betão e aço com junta de dilatação à vista.",
        legenda: "FIG. 05 — Betão / aço — 2022",
        largura: 1200,
        altura: 1600
      }
    ],
    desenho: {
      planta: {
        largura: 32,
        profundidade: 18,
        rooms: [
          { x: 0.5, y: 0.5, w: 19.0, h: 17.0, n: "NAVE PRINCIPAL" },
          { x: 20.5, y: 0.5, w: 11.0, h: 5.5, n: "ESCRITÓRIOS" },
          { x: 20.5, y: 6.5, w: 11.0, h: 5.2, n: "ARQUIVO" },
          { x: 20.5, y: 12.2, w: 11.0, h: 5.3, n: "DOCA / APOIO" }
        ],
        aberturas: [
          { lado: "top", pos: 3.0, largura: 6.0 },
          { lado: "top", pos: 12.0, largura: 5.0 },
          { lado: "bottom", pos: 8.0, largura: 4.0 },
          { lado: "right", pos: 7.4, largura: 2.2 }
        ],
        portas: [
          { x: 20.5, y: 3.2, dir: "v" },
          { x: 20.5, y: 9.0, dir: "v" }
        ]
      },
      corte: {
        largura: 32,
        altura: 9.0,
        niveis: [0, 4.2, 9.0],
        vaos: [8, 8, 8, 8],
        cobertura: "plana",
        mezanino: 4.2
      },
      alcado: {
        largura: 32,
        altura: 9.0,
        vaos: [8, 8, 8, 8],
        cobertura: "plana",
        aberturas: [
          { x: 2.2, w: 4.4, h: 3.8 },
          { x: 10.0, w: 4.4, h: 3.8 },
          { x: 18.0, w: 4.4, h: 3.8 },
          { x: 26.0, w: 3.0, h: 3.8 }
        ]
      }
    },
    destaque: true
  },
  {
    id: "escola-valongo",
    codigo: "A-03",
    nome: "Escola Básica de Valongo",
    local: "Valongo",
    distrito: "Porto",
    lat: 41.1880,
    lng: -8.4980,
    ano: 2024,
    tipologia: "equipamento",
    tipologiaLabel: "Equipamento público",
    area: 3200,
    estado: "Em obra",
    estadoKey: "obra",
    programa: "Escola básica · 12 salas · refeitório · ginásio",
    materiais: ["betao", "tijolo", "madeira"],
    equipa: ["Ricardo Teles", "Marta Sequeira", "João Almeida"],
    fotografo: "A confirmar",
    cliente: "Câmara Municipal de Valongo",
    descricaoCurta: "Uma escola de dois pisos organizada em torno de um pátio, com a estrutura de betão exposta ao exterior.",
    coordenadasTexto: "41°11′17″N · 8°29′53″O",
    memoria: [
      "A escola ocupa um terreno em declive no limite entre Valongo e a serra. O projeto enterra parcialmente o ginásio e liberta o piso térreo para o pátio, a biblioteca e o refeitório. As doze salas distribuem-se por dois pisos, todas com ventilação cruzada e luz natural a norte e a sul. A cota zero foi colocada no patamar superior do terreno; a partir daí, a construção desce em três plataformas ligadas por rampas, sem elevadores.",
      "A estrutura de betão é aparente nos pórticos exteriores, com enchimentos de tijolo cerâmico. Os corredores são galerias abertas, protegidas por uma grelha de madeira que faz sombra e controla o ruído. O pátio central é o principal espaço colectivo e funciona como extensão das salas. Os materiais foram escolhidos pela durabilidade e pela possibilidade de reparação local: betão, tijolo e madeira de pinho tratada. A obra está em curso, com conclusão prevista para o ano lectivo de 2026/2027."
    ],
    citacao: {
      texto: "A escola não é um edifício com pátio. É um pátio com salas à volta.",
      autor: "Marta Sequeira, arquiteta sénior"
    },
    capa: {
      src: photo("photo-1527576539890-dfa815648363", 1800, 1200),
      alt: "Volume escolar de betão com galerias exteriores e pátio, em luz de manhã.",
      legenda: "Galerias e pátio central"
    },
    imagens: [
      {
        src: photo("photo-1527576539890-dfa815648363", 1800, 1200),
        alt: "Vista exterior da escola com pórticos de betão e galerias abertas.",
        legenda: "FIG. 01 — Alçado sul — 2024",
        largura: 1800,
        altura: 1200
      },
      {
        src: photo("photo-1487958449943-2429e8be8625", 1600, 1200),
        alt: "Galerias exteriores da escola com sombra projetada pela grelha de madeira.",
        legenda: "FIG. 02 — Galeria / sombra — 2024",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1503387762-592deb58ef4e", 1200, 1600),
        alt: "Maquete de estudo da implantação da escola sobre o terreno em declive.",
        legenda: "FIG. 03 — Maquete de implantação — 2023",
        largura: 1200,
        altura: 1600
      },
      {
        src: photo("photo-1541888946425-d81bb19240f5", 1600, 1200),
        alt: "Frente de obra com estrutura de betão e andaimes.",
        legenda: "FIG. 04 — Frente de obra — 2024",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1518005020951-eccb494ad742", 1200, 1600),
        alt: "Pormenor de betão aparente e tijolo cerâmico em parede exterior.",
        legenda: "FIG. 05 — Betão / tijolo — 2024",
        largura: 1200,
        altura: 1600
      }
    ],
    desenho: {
      planta: {
        largura: 48,
        profundidade: 26,
        rooms: [
          { x: 0.6, y: 0.6, w: 11.0, h: 7.4, n: "SALAS 1—4" },
          { x: 0.6, y: 8.6, w: 11.0, h: 7.4, n: "SALAS 5—8" },
          { x: 0.6, y: 16.6, w: 11.0, h: 8.8, n: "SALAS 9—12" },
          { x: 12.4, y: 0.6, w: 15.0, h: 11.0, n: "PÁTIO COBERTO" },
          { x: 12.4, y: 12.2, w: 15.0, h: 13.2, n: "GINÁSIO" },
          { x: 28.2, y: 0.6, w: 19.0, h: 7.2, n: "REFEITÓRIO" },
          { x: 28.2, y: 8.4, w: 19.0, h: 7.0, n: "BIBLIOTECA" },
          { x: 28.2, y: 16.0, w: 19.0, h: 9.4, n: "AUDITÓRIO" }
        ],
        aberturas: [
          { lado: "top", pos: 3.0, largura: 3.0 },
          { lado: "top", pos: 30.0, largura: 5.0 },
          { lado: "left", pos: 2.0, largura: 3.0 },
          { lado: "left", pos: 10.0, largura: 3.0 },
          { lado: "bottom", pos: 4.0, largura: 5.0 },
          { lado: "bottom", pos: 30.0, largura: 6.0 }
        ],
        portas: [
          { x: 12.4, y: 5.8, dir: "v" },
          { x: 28.2, y: 3.8, dir: "v" },
          { x: 12.4, y: 18.0, dir: "v" }
        ]
      },
      corte: {
        largura: 48,
        altura: 10,
        niveis: [0, 4.2, 10],
        vaos: [12, 15, 10, 11],
        cobertura: "plana"
      },
      alcado: {
        largura: 48,
        altura: 10,
        vaos: [12, 15, 10, 11],
        cobertura: "plana",
        aberturas: [
          { x: 1.4, w: 3.0, h: 2.6 },
          { x: 5.4, w: 3.0, h: 2.6 },
          { x: 13.0, w: 8.0, h: 3.2 },
          { x: 28.0, w: 7.0, h: 3.2 },
          { x: 37.0, w: 8.0, h: 3.2 }
        ]
      }
    },
    destaque: true
  },
  {
    id: "casa-corten",
    codigo: "A-04",
    nome: "Casa Corten",
    local: "Comporta",
    distrito: "Setúbal",
    lat: 38.3850,
    lng: -8.7860,
    ano: 2021,
    tipologia: "habitacao",
    tipologiaLabel: "Habitação",
    area: 190,
    estado: "Construído",
    estadoKey: "construido",
    programa: "Habitação sazonal · 2 quartos · pátio",
    materiais: ["aco-corten", "madeira", "vidro"],
    equipa: ["Inês Barroso", "Ricardo Teles", "João Almeida"],
    fotografo: "Nuno Calejo",
    cliente: "Particular",
    descricaoCurta: "Um volume de aço corten entre pinheiros, aberto por dois pátios e uma fenda de luz.",
    coordenadasTexto: "38°23′06″N · 8°47′10″O",
    memoria: [
      "A casa é um único volume de 13 por 8 metros, elevado 40 centímetros sobre o solo arenoso para proteger as raízes dos pinheiros. O aço corten foi escolhido pela cor e pela resistência à maresia; a película de óxido estabiliza ao longo de dois anos e passa a confundir-se com a sombra dos troncos. A cota zero foi fixada no ponto mais alto do lote e a plataforma de betão estende-se para fora da casa, formando um pátio.",
      "O interior é organizado por uma faixa de serviços a norte e uma faixa habitada a sul. Duas aberturas — uma horizontal, para o pátio, e outra vertical, sobre a mesa — conduzem a luz. A madeira de pinho tratada aparece no pavimento e nos roupeiros; o vidro é fixo nos vãos maiores, com caixilharia mínima. O aquecimento é feito por uma bomba de calor e o arrefecimento é passivo, através da sombra do alpendre e da ventilação cruzada. A casa foi construída em oito meses, com pré-fabricação parcial dos painéis de aço."
    ],
    citacao: {
      texto: "O aço não envelhece. Aprende o lugar.",
      autor: "Inês Barroso, sócia fundadora"
    },
    capa: {
      src: photo("photo-1523217582562-09d0def993a6", 1800, 1350),
      alt: "Casa baixa de aço corten entre pinheiros, com alpendre e pátio de areia.",
      legenda: "Volume único e alpendre sul"
    },
    imagens: [
      {
        src: photo("photo-1523217582562-09d0def993a6", 1800, 1350),
        alt: "Fachada da Casa Corten em aço oxidado, com pinheiros em primeiro plano.",
        legenda: "FIG. 01 — Fachada sul — 2021",
        largura: 1800,
        altura: 1350
      },
      {
        src: photo("photo-1600585154526-990dced4db0d", 1600, 1200),
        alt: "Sala aberta para o pátio, com pavimento de madeira e caixilharia de vidro.",
        legenda: "FIG. 02 — Sala / pátio — 2021",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1510798831971-661eb04b3739", 1200, 1600),
        alt: "Alpendre sombreado com estrutura de aço e mobiliário de madeira.",
        legenda: "FIG. 03 — Alpendre — 2021",
        largura: 1200,
        altura: 1600
      },
      {
        src: photo("photo-1600210492486-724fe5c67fb0", 1600, 1200),
        alt: "Quarto com parede de madeira e janela vertical para o pinhal.",
        legenda: "FIG. 04 — Quarto / fenda de luz — 2021",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1613490493576-7fde63acd811", 1200, 1600),
        alt: "Pormenor da chapa de aço corten com óxido estabilizado.",
        legenda: "FIG. 05 — Aço corten / pátina — 2021",
        largura: 1200,
        altura: 1600
      }
    ],
    desenho: {
      planta: {
        largura: 13,
        profundidade: 8,
        rooms: [
          { x: 0.35, y: 0.35, w: 5.0, h: 3.6, n: "SALA" },
          { x: 0.35, y: 4.15, w: 5.0, h: 3.5, n: "COZINHA" },
          { x: 5.6, y: 0.35, w: 3.3, h: 3.6, n: "SUITE" },
          { x: 5.6, y: 4.15, w: 3.3, h: 3.5, n: "QUARTO" },
          { x: 9.1, y: 0.35, w: 3.55, h: 7.3, n: "PÁTIO" }
        ],
        aberturas: [
          { lado: "bottom", pos: 1.4, largura: 3.0 },
          { lado: "top", pos: 6.0, largura: 2.0 },
          { lado: "left", pos: 2.0, largura: 2.2 }
        ],
        portas: [
          { x: 5.6, y: 2.0, dir: "v" },
          { x: 9.1, y: 2.2, dir: "v" }
        ]
      },
      corte: {
        largura: 13,
        altura: 5.4,
        niveis: [0, 2.9, 5.4],
        vaos: [5.2, 3.6, 4.2],
        cobertura: "inclinada",
        beiral: 0.6
      },
      alcado: {
        largura: 13,
        altura: 5.4,
        vaos: [5.2, 3.6, 4.2],
        cobertura: "inclinada",
        aberturas: [
          { x: 1.2, w: 3.2, h: 2.6 },
          { x: 6.0, w: 2.0, h: 2.4 },
          { x: 10.1, w: 1.4, h: 3.0 }
        ]
      }
    },
    destaque: false
  },
  {
    id: "oficina-aurora",
    codigo: "A-05",
    nome: "Oficina Aurora",
    local: "Lisboa",
    distrito: "Lisboa",
    lat: 38.7130,
    lng: -9.1420,
    ano: 2020,
    tipologia: "interiores",
    tipologiaLabel: "Interiores / Comércio",
    area: 85,
    estado: "Construído",
    estadoKey: "construido",
    programa: "Loja e oficina de cerâmica · arquivo",
    materiais: ["madeira", "pedra", "vidro"],
    equipa: ["Marta Sequeira", "Inês Barroso"],
    fotografo: "Rita Pires",
    cliente: "Aurora Cerâmica",
    descricaoCurta: "Uma loja-oficina de cerâmica em Lisboa, onde o balcão é também a mesa de trabalho e a montra.",
    coordenadasTexto: "38°42′47″N · 9°08′31″O",
    memoria: [
      "A Oficina Aurora ocupa a loja de um edifício pombalino, com 85 metros quadrados e uma frente estreita para a rua. O projeto retira o balcão tradicional e coloca no centro uma mesa contínua de pedra, onde se vende, se embala e se trabalha. A mesa é o único móvel fixo; as restantes peças são prateleiras de madeira suspensas e caixas de arquivo empilháveis. A cota zero é o pavimento original de cantaria, recuperado e deixado à vista.",
      "A luz natural entra pela montra e por uma clarabóia existente, agora desobstruída. O fundo da loja é a oficina, separada por um pano de vidro que deixa ver o trabalho sem o expor ao pó. O forno foi instalado numa caixa ventilada de aço, contra a parede meeira, sem alterar a estrutura. As cores são as dos materiais: pedra calcária, madeira de castanho, vidro e o branco dos testos. A intervenção foi concluída em quatro meses e manteve todos os elementos protegidos do edifício."
    ],
    citacao: {
      texto: "O balcão não separa. É a mesa onde tudo acontece.",
      autor: "Marta Sequeira, arquiteta sénior"
    },
    capa: {
      src: photo("photo-1524758631624-e2822e304c36", 1800, 1200),
      alt: "Interior de loja-oficina com mesa central de pedra e prateleiras de madeira.",
      legenda: "Mesa central e montra"
    },
    imagens: [
      {
        src: photo("photo-1524758631624-e2822e304c36", 1800, 1200),
        alt: "Mesa contínua de pedra no centro da Oficina Aurora, com peças de cerâmica.",
        legenda: "FIG. 01 — Mesa central — 2020",
        largura: 1800,
        altura: 1200
      },
      {
        src: photo("photo-1521401830884-6c03c1c87ebb", 1600, 1200),
        alt: "Prateleiras de madeira com cerâmica e parede de pedra ao fundo.",
        legenda: "FIG. 02 — Prateleiras / arquivo — 2020",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1490644658840-3f2e3f8c5625", 1600, 1200),
        alt: "Pormenor de madeira de castanho com junta e encaixe à vista.",
        legenda: "FIG. 03 — Castanho / pormenor — 2020",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1470723710355-95304d8aece4", 1200, 1600),
        alt: "Oficina ao fundo da loja, vista através de um pano de vidro.",
        legenda: "FIG. 04 — Oficina / vidro — 2020",
        largura: 1200,
        altura: 1600
      },
      {
        src: photo("photo-1517581177682-a085bb7ffb15", 1600, 1200),
        alt: "Pormenor de superfície de madeira e pedra em luz rasante.",
        legenda: "FIG. 05 — Matéria / luz — 2020",
        largura: 1600,
        altura: 1200
      }
    ],
    desenho: {
      planta: {
        largura: 14,
        profundidade: 6.5,
        rooms: [
          { x: 0.3, y: 0.3, w: 6.4, h: 3.0, n: "LOJA" },
          { x: 0.3, y: 3.5, w: 6.4, h: 2.7, n: "OFICINA" },
          { x: 7.0, y: 0.3, w: 6.7, h: 3.0, n: "ARMAZÉM" },
          { x: 7.0, y: 3.5, w: 3.2, h: 2.7, n: "BANHO" },
          { x: 10.5, y: 3.5, w: 3.2, h: 2.7, n: "APOIO" }
        ],
        aberturas: [
          { lado: "left", pos: 1.0, largura: 2.6 },
          { lado: "top", pos: 9.0, largura: 1.2 },
          { lado: "bottom", pos: 2.0, largura: 1.6 }
        ],
        portas: [
          { x: 7.0, y: 1.6, dir: "v" },
          { x: 10.5, y: 4.5, dir: "v" }
        ]
      },
      corte: {
        largura: 14,
        altura: 3.8,
        niveis: [0, 2.8, 3.8],
        vaos: [7, 7],
        cobertura: "plana"
      },
      alcado: {
        largura: 14,
        altura: 3.8,
        vaos: [7, 7],
        cobertura: "plana",
        aberturas: [
          { x: 1.0, w: 3.0, h: 2.2 },
          { x: 8.0, w: 1.6, h: 2.2 }
        ]
      }
    },
    destaque: false
  },
  {
    id: "torre-do-relogio",
    codigo: "A-06",
    nome: "Torre do Relógio",
    local: "Guimarães",
    distrito: "Braga",
    lat: 41.4425,
    lng: -8.2918,
    ano: 2019,
    tipologia: "reabilitacao",
    tipologiaLabel: "Reabilitação",
    area: 620,
    estado: "Em obra",
    estadoKey: "obra",
    programa: "Centro de interpretação · torre · arquivo",
    materiais: ["pedra", "tijolo", "betao", "vidro"],
    equipa: ["Ricardo Teles", "Inês Barroso", "Marta Sequeira", "João Almeida"],
    fotografo: "A confirmar",
    cliente: "Município de Guimarães",
    descricaoCurta: "Reabilitação de uma torre medieval e do edifício anexo, com um núcleo contemporâneo de betão e vidro.",
    coordenadasTexto: "41°26′33″N · 8°17′30″O",
    memoria: [
      "A Torre do Relógio é um conjunto de origem medieval, composto pela torre, por um corpo anexo e por um pátio murado. A intervenção consolida a estrutura de granito, substitui os elementos de betão introduzidos nos anos oitenta e devolve ao pátio a sua leitura original. A cota zero foi fixada no pavimento do pátio; a torre conserva os cinco níveis históricos, ligados por uma nova escada de betão que não toca nas paredes antigas.",
      "O centro de interpretação ocupa o corpo anexo, com uma caixa de vidro recuada que protege o edifício existente e cria um percurso contínuo entre a rua e o pátio. O arquivo e as instalações técnicas estão enterrados sob o pátio, cobertos por uma laje de betão com juntas abertas. O tijolo novo repete a dimensão do tijolo antigo, sem imitar o desenho. A obra está a decorrer por fases, para permitir a abertura da torre ao público durante os trabalhos. A conclusão está prevista para 2027."
    ],
    citacao: {
      texto: "Conservar não é parar. É voltar a pôr a construção a trabalhar.",
      autor: "Ricardo Teles, sócio fundador"
    },
    capa: {
      src: photo("photo-1545324418-cc1a3fa10c00", 1800, 1350),
      alt: "Torre histórica de pedra vista de baixo, com edifício anexo e céu claro.",
      legenda: "Torre e corpo anexo"
    },
    imagens: [
      {
        src: photo("photo-1545324418-cc1a3fa10c00", 1800, 1350),
        alt: "Torre do Relógio em granito, com o novo acesso de vidro ao nível do pátio.",
        legenda: "FIG. 01 — Torre / pátio — 2019",
        largura: 1800,
        altura: 1350
      },
      {
        src: photo("photo-1449157291145-7efd050a4d0e", 1200, 1600),
        alt: "Interior da torre com escada de betão e abertura para os níveis superiores.",
        legenda: "FIG. 02 — Núcleo / escada — 2019",
        largura: 1200,
        altura: 1600
      },
      {
        src: photo("photo-1479839672679-a46483c0e7c8", 1600, 1200),
        alt: "Fachada de pedra da torre com marcações de cota e juntas consolidadas.",
        legenda: "FIG. 03 — Alçado poente — 2019",
        largura: 1600,
        altura: 1200
      },
      {
        src: photo("photo-1524230572899-a752b3835840", 1200, 1600),
        alt: "Pátio murado com laje de betão e juntas abertas para ventilação do arquivo.",
        legenda: "FIG. 04 — Pátio / arquivo — 2019",
        largura: 1200,
        altura: 1600
      },
      {
        src: photo("photo-1486406146926-c627a92ad1ab", 1600, 1200),
        alt: "Pormenor de caixilharia de vidro recuada face à parede de granito.",
        legenda: "FIG. 05 — Vidro / granito — 2019",
        largura: 1600,
        altura: 1200
      }
    ],
    desenho: {
      planta: {
        largura: 12,
        profundidade: 12,
        rooms: [
          { x: 0.7, y: 0.7, w: 10.6, h: 2.4, n: "GALERIA NORTE" },
          { x: 0.7, y: 3.1, w: 2.8, h: 5.8, n: "ESCADA" },
          { x: 3.5, y: 3.1, w: 4.9, h: 5.8, n: "NÚCLEO" },
          { x: 8.4, y: 3.1, w: 2.9, h: 5.8, n: "APOIO" },
          { x: 0.7, y: 8.9, w: 10.6, h: 2.4, n: "GALERIA SUL" }
        ],
        aberturas: [
          { lado: "top", pos: 4.0, largura: 1.4 },
          { lado: "left", pos: 4.0, largura: 1.4 },
          { lado: "right", pos: 4.0, largura: 1.4 }
        ],
        portas: [
          { x: 3.5, y: 4.2, dir: "v" },
          { x: 8.4, y: 7.0, dir: "v" }
        ]
      },
      corte: {
        largura: 12,
        altura: 17,
        niveis: [0, 3.2, 6.4, 9.6, 12.8, 16.2],
        vaos: [4, 4, 4],
        cobertura: "plana"
      },
      alcado: {
        largura: 12,
        altura: 17,
        vaos: [4, 4, 4],
        cobertura: "plana",
        aberturas: [
          { x: 2.8, w: 1.2, h: 6.4 },
          { x: 7.8, w: 1.2, h: 3.4 },
          { x: 2.8, w: 1.0, h: 3.4 }
        ]
      }
    },
    destaque: false
  }
];

/* --------------------------------------------------------------------------
   Materiais
   -------------------------------------------------------------------------- */
export const materials = [
  {
    key: "betao",
    codigo: "M-01",
    nome: "Betão",
    classe: "tex--betao",
    origem: "Cimento Portland, areia e brita de origem local",
    acabamento: "À vista, cofragem de pinho, duas faces",
    uso: "Estrutura, lajes, paredes, pavimentos",
    nota: "As juntas de cofragem são desenhadas antes da betonagem. Nada é corrigido depois.",
    descricao: "O betão é usado como estrutura e acabamento, sem revestimento. A composição é ajustada em obra para manter a cor constante entre betonagens. As marcas da cofragem e os tubos de ventilação ficam à vista."
  },
  {
    key: "madeira",
    codigo: "M-02",
    nome: "Madeira",
    classe: "tex--madeira",
    origem: "Pinho bravo e castanho de produção nacional",
    acabamento: "Lascada, óleo de linhaça, sem verniz",
    uso: "Pavimentos, caixilharia, mobiliário fixo",
    nota: "A madeira é escolhida pela secção, não pelo defeito. Os nós ficam.",
    descricao: "A madeira entra onde há contacto humano: pés, mãos, portas e bancadas. Não é tingida nem envernizada. A manutenção é feita com óleo, de dois em dois anos, e pode ser executada por pessoal local."
  },
  {
    key: "aco-corten",
    codigo: "M-03",
    nome: "Aço corten",
    classe: "tex--aco-corten",
    origem: "Aço estrutural S355 com ligas de cobre",
    acabamento: "Jato de areia, oxidação controlada em obra",
    uso: "Revestimento exterior, guardas, caixas interiores",
    nota: "A pátina fecha ao fim de dois anos. Até lá, a obra continua a mudar.",
    descricao: "O aço corten é usado como pele exterior e como volume interior. A película de óxido é estabilizada antes da montagem e protegida das escorrências sobre materiais porosos. A cor muda com a orientação e a humidade."
  },
  {
    key: "vidro",
    codigo: "M-04",
    nome: "Vidro",
    classe: "tex--vidro",
    origem: "Vidro float incolor de baixo teor de ferro",
    acabamento: "Duplo, com câmara de ar e caixilharia mínima",
    uso: "Vãos, clarabóias, divisórias interiores",
    nota: "O vidro não é uma parede. É uma ausência de parede, com espessura.",
    descricao: "O vidro é dimensionado para reduzir a caixilharia ao mínimo e deixar a estrutura visível. Nos vãos maiores usa-se vidro laminado e fixações pontuais. As divisórias interiores são simples e desmontáveis."
  },
  {
    key: "pedra",
    codigo: "M-05",
    nome: "Pedra",
    classe: "tex--pedra",
    origem: "Granito do Gerês e calcário de Pero Pinheiro",
    acabamento: "Talhe manual, face serrada ou bujardada",
    uso: "Pavimentos, muros, bancadas, fundações",
    nota: "A pedra que sai da escavação fica no lote. É medida, numerada e recolocada.",
    descricao: "A pedra é o material mais antigo em obra e o que melhor envelhece. As peças recuperadas são numeradas e recolocadas segundo o desenho. Nos pavimentos, a face serrada garante aderência sem polimento."
  },
  {
    key: "tijolo",
    codigo: "M-06",
    nome: "Tijolo",
    classe: "tex--tijolo",
    origem: "Argila nacional, cozedura contínua",
    acabamento: "Assente em junta contínua, sem reboco",
    uso: "Paredes, abóbadas, enchimentos",
    nota: "O tijolo novo repete a dimensão do antigo, não o desenho.",
    descricao: "O tijolo cerâmico é usado em paredes de enchimento e em abóbadas. A dimensão é compatível com a alvenaria existente, para que as novas paredes possam ser lidas sem imitar o passado. A junta é deixada à vista."
  }
];

/* --------------------------------------------------------------------------
   Processo
   -------------------------------------------------------------------------- */
export const phases = [
  {
    num: "01",
    id: "conceito",
    titulo: "Conceito",
    semanas: "Semanas 01—03",
    entrega: "Plano de intenções · 1:500",
    texto: "Antes do desenho, medimos. Levantamos o terreno, a construção existente, os acessos e o que não se pode perder. O conceito é uma hipótese de organização — não uma imagem. Só avança quando resiste às cotas.",
    nota: "Primeiro a cota. Depois a forma.",
    desenho: "conceito"
  },
  {
    num: "02",
    id: "planta",
    titulo: "Planta",
    semanas: "Semanas 04—10",
    entrega: "Plantas · 1:100",
    texto: "A planta é o documento mais político do projeto. Define percursos, hierarquias e o que cada pessoa vê. Testamos três organizações antes de fixar a estrutura. As paredes que não suportam nada são as primeiras a desaparecer.",
    nota: "Se a planta não funciona, o alçado é decoração.",
    desenho: "planta"
  },
  {
    num: "03",
    id: "corte",
    titulo: "Corte",
    semanas: "Semanas 08—14",
    entrega: "Cortes · 1:50",
    texto: "O corte resolve tudo o que a planta esconde: alturas, espessuras, isolamento, luz. Trabalhamos o corte até cada camada poder ser construída. A cota zero é marcada uma vez e nunca mais se move.",
    nota: "Cada centímetro do corte tem de saber o que é.",
    desenho: "corte"
  },
  {
    num: "04",
    id: "alcado",
    titulo: "Alçado",
    semanas: "Semanas 12—18",
    entrega: "Alçados · 1:50",
    texto: "O alçado não é uma fachada. É a consequência do corte e da planta. Desenhamos os vãos, as juntas, as sombras e a posição dos materiais. Nada é aplicado por cima da estrutura.",
    nota: "A fachada não se decora. Mostra-se.",
    desenho: "alcado"
  },
  {
    num: "05",
    id: "obra",
    titulo: "Obra",
    semanas: "Semanas 18—52",
    entrega: "Caderno de obra · revisões contínuas",
    texto: "A obra é projeto. Acompanhamos a execução, corrigimos desvios e registamos tudo. O caderno de obra guarda as decisões, as medições e as alterações. O que fica construído é a versão final do desenho.",
    nota: "O desenho só acaba quando a obra fecha.",
    desenho: "obra"
  }
];

/* --------------------------------------------------------------------------
   Equipa
   -------------------------------------------------------------------------- */
export const team = [
  {
    nome: "Ricardo Teles",
    cargo: "Sócio fundador · Direção de projeto",
    formacao: "FAUP, 2004",
    cedula: "OA 00000",
    desde: "2011",
    nota: "Conceito, coordenação e relação com clientes públicos."
  },
  {
    nome: "Inês Barroso",
    cargo: "Sócia fundadora · Direção de obra",
    formacao: "FAUP, 2006",
    cedula: "OA 00000",
    desde: "2011",
    nota: "Construção, materiais e acompanhamento de obra."
  },
  {
    nome: "Marta Sequeira",
    cargo: "Arquiteta sénior",
    formacao: "FAUP, 2013",
    cedula: "OA 00000",
    desde: "2016",
    nota: "Programa, interiores e equipamentos públicos."
  },
  {
    nome: "João Almeida",
    cargo: "Arquiteto · Desenho técnico",
    formacao: "FAUP, 2017",
    cedula: "OA 00000",
    desde: "2019",
    nota: "Maquetes, desenho de execução e caderno de obra."
  }
];

/* --------------------------------------------------------------------------
   Prémios e publicações (fictícios)
   -------------------------------------------------------------------------- */
export const awards = [
  { ano: "2024", nome: "Prémio Arquitetura Pública", lugar: "Menção · Escola de Valongo" },
  { ano: "2023", nome: "Prémio Madeira", lugar: "Finalista · Casa do Muro" },
  { ano: "2022", nome: "Prémio Reabilitação Urbana", lugar: "Vencedor · Armazém 14" },
  { ano: "2020", nome: "Prémio Interior Lisboa", lugar: "Selecionado · Oficina Aurora" },
  { ano: "2018", nome: "Prémio Novo Edifício", lugar: "Finalista · Torre do Relógio" }
];

export const publications = [
  { ano: "2025", nome: "Arquitectura Ibérica", lugar: "«A cota zero» · n.º 88" },
  { ano: "2024", nome: "A+U", lugar: "Valongo School · n.º 641" },
  { ano: "2023", nome: "Monocle", lugar: "Porto report · n.º 167" },
  { ano: "2022", nome: "JA — Jornal Arquitectos", lugar: "Armazém 14 · n.º 272" },
  { ano: "2020", nome: "Domus", lugar: "Aurora Studio · n.º 1046" }
];

/* --------------------------------------------------------------------------
   Números do estúdio
   -------------------------------------------------------------------------- */
export const stats = [
  { valor: 15, sufixo: "", label: "Anos de atelier", nota: "Desde 2011, sem interrupção" },
  { valor: 48, sufixo: "", label: "Projetos", nota: "Construídos, em obra e em estudo" },
  { valor: 18400, sufixo: " m²", label: "Construídos", nota: "Área bruta de intervenção" },
  { valor: 7, sufixo: "", label: "Distritos", nota: "Do Minho ao Alentejo" }
];

/* --------------------------------------------------------------------------
   Opções para filtros
   -------------------------------------------------------------------------- */
export const tipologias = [
  { value: "habitacao", label: "Habitação" },
  { value: "equipamento", label: "Equipamento público" },
  { value: "reabilitacao", label: "Reabilitação" },
  { value: "interiores", label: "Interiores / Comércio" }
];

export const estados = [
  { value: "construido", label: "Construído" },
  { value: "obra", label: "Em obra" },
  { value: "projeto", label: "Projeto" }
];

export const anos = [...new Set(projects.map((p) => p.ano))].sort((a, b) => b - a);

/* --------------------------------------------------------------------------
   Utilitários
   -------------------------------------------------------------------------- */
export const getProject = (id) => projects.find((p) => p.id === id) || null;

export const getMaterial = (key) => materials.find((m) => m.key === key) || null;

export const getProjectsByMaterial = (key) =>
  projects.filter((p) => p.materiais.includes(key));

export const getRelatedProjects = (id, limit = 3) => {
  const current = getProject(id);
  if (!current) return projects.slice(0, limit);
  return projects
    .filter((p) => p.id !== id)
    .map((p) => {
      let score = 0;
      if (p.tipologia === current.tipologia) score += 3;
      score += p.materiais.filter((m) => current.materiais.includes(m)).length;
      if (p.distrito === current.distrito) score += 1;
      return { project: p, score };
    })
    .sort((a, b) => b.score - a.score || b.project.ano - a.project.ano)
    .slice(0, limit)
    .map((item) => item.project);
};

export const formatNumber = (n) =>
  new Intl.NumberFormat("pt-PT").format(n).replace(/\u00a0/g, " ");

export const formatArea = (n) => `${formatNumber(n)} m²`;
