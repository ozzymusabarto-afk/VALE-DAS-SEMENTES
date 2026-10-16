import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Volume2, Check, HelpCircle } from 'lucide-react';
import type { LocationId } from '../types/game';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';

import imgMarket from '../assets/cena-mercado-raposa.webp';
import imgWorkshop from '../assets/cena-oficina-ferramentas.webp';
import imgHouse from '../assets/cena-casa-fazenda.webp';
import imgSilo from '../assets/cena-silo-reserva.webp';
import imgField from '../assets/cena-horta-cornelio.webp';
import imgBridge from '../assets/cena-ponte-primavera.webp';
import imgWoods from '../assets/cena-bosque-montanhas.webp';

interface LocationSceneViewProps {
  locationId: LocationId;
  guardianName: string;
  onProceedToDecision: () => void;
  onBackToMap: () => void;
}

interface HotspotItem {
  id: string;
  icon: string;
  title: string;
  checkedLabel: string;
  uncheckLabel: string;
  clueText: string;
  top: string;
  left: string;
  soundType: 'wood' | 'hammer' | 'water' | 'chime' | 'drop';
}

interface DialogueCard {
  id: string;
  icon: string;
  question: string;
  shortAnswer: string;
  fullAnswer: string;
}

interface LocationSceneData {
  id: LocationId;
  title: string;
  badge: string;
  characterName: string;
  characterRole: string;
  characterAvatar: string;
  imageSrc: string;
  imageAlt: string;
  introSpeech: string;
  hotspots: HotspotItem[];
  dialogues: DialogueCard[];
}

const LOCATION_SCENES: Record<LocationId, LocationSceneData> = {
  market: {
    id: 'market',
    title: 'O Mercado da Raposa • Comparando Escolhas',
    badge: '🛍️ Consumo Consciente & Necessidade vs Desejo',
    characterName: 'Raposa Comerciante',
    characterRole: 'Guardiã da Comparação de Preços',
    characterAvatar: '🦊',
    imageSrc: imgMarket,
    imageAlt: 'O Mercado colorido da Raposa no Vale das Sementes com bancas de frutas e pães',
    introSpeech: 'Olá, Guardião! Tudo nesta banca parece delicioso e urgente. Mas uma semente bem pensada compra o que realmente alimenta nossa família. Compare as cestas antes de decidir!',
    hotspots: [
      {
        id: 'basket_needs',
        icon: '🍎',
        title: 'Cesta do Alimento Diário',
        uncheckLabel: 'Examinar cesta essencial',
        checkedLabel: '✓ Alimento essencial verificado',
        clueText: 'Maçãs, pão fresco e legumes da horta. São as necessidades básicas da nossa semana no Vale.',
        top: '64%',
        left: '28%',
        soundType: 'chime'
      },
      {
        id: 'basket_wants',
        icon: '🎁',
        title: 'Oferta Brilhante da Banca',
        uncheckLabel: 'Olhar oferta tentadora',
        checkedLabel: '✓ Desejo de momento identificado',
        clueText: 'Doces caramelizados e um brinquedo esculpido. Parece imperdível, mas podemos esperar e decidir outro dia!',
        top: '55%',
        left: '52%',
        soundType: 'drop'
      },
      {
        id: 'scale_balance',
        icon: '⚖️',
        title: 'Balança de Preço Real',
        uncheckLabel: 'Pesar o valor total',
        checkedLabel: '✓ Comparação realizada com calma',
        clueText: 'Comprar com calma e perguntar: "Eu preciso disso hoje ou é só um impulso passageiro?" economiza sementes preciosas.',
        top: '72%',
        left: '74%',
        soundType: 'chime'
      }
    ],
    dialogues: [
      {
        id: 'q1',
        icon: '🍎',
        question: 'Qual a diferença entre o que eu preciso e o que eu desejo?',
        shortAnswer: 'Necessidade mantém a vida; desejo alegra, mas pode esperar.',
        fullAnswer: 'Necessidades são coisas essenciais para nossa saúde e segurança, como comida e teto. Desejos são coisas prazerosas, mas que podemos adiar sem colocar em risco a família!'
      },
      {
        id: 'q2',
        icon: '🏷️',
        question: 'Por que algumas ofertas parecem tão urgentes?',
        shortAnswer: 'A urgência tenta nos fazer comprar sem pensar.',
        fullAnswer: 'Muitas vezes as placas dizem "só hoje!" para nos deixar apressados. Mas o verdadeiro Guardião respira fundo e pergunta o preço total antes de gastar suas sementes.'
      },
      {
        id: 'q3',
        icon: '💡',
        question: 'Como o consumo consciente ajuda o Vale?',
        shortAnswer: 'Gastar com sabedoria preserva sementes para o futuro.',
        fullAnswer: 'Quando não gastamos tudo por impulso, sobram sementes no Silo para quando o inverno ou um imprevisto chegar.'
      }
    ]
  },

  workshop: {
    id: 'workshop',
    title: 'A Oficina de Ferramentas • O Valor da Manutenção',
    badge: '🔨 Habilidades, Conserto & Trabalho Duradouro',
    characterName: 'Mestre Tomás, o Marceneiro',
    characterRole: 'Artesão e Mestre em Reparos',
    characterAvatar: '🐻',
    imageSrc: imgWorkshop,
    imageAlt: 'Oficina de madeira ensolarada com ferramentas rústicas e bancada de trabalho',
    introSpeech: 'Bem-vindo à oficina! Quem cuida da ferramenta hoje, não precisa parar o trabalho amanhã. Consertar antes de quebrar de vez é a forma mais sábia de poupar sementes!',
    hotspots: [
      {
        id: 'cracked_hoe',
        icon: '🌾',
        title: 'Cabo de Madeira da Enxada',
        uncheckLabel: 'Examinar cabo trincado',
        checkedLabel: '✓ Rachadura avaliada a tempo',
        clueText: 'O cabo tem uma pequena trinca. Uma tira de couro e resina agora custa 1 semente. Se quebrar na terra, uma enxada nova custará 4 sementes!',
        top: '60%',
        left: '32%',
        soundType: 'wood'
      },
      {
        id: 'tool_bench',
        icon: '🧰',
        title: 'Bancada com Óleo e Lixa',
        uncheckLabel: 'Aplicar manutenção preventiva',
        checkedLabel: '✓ Ferramentas limpas e protegidas',
        clueText: 'Passar óleo nas lâminas de ferro evita ferrugem e faz o arado durar por estações inteiras sem estragar.',
        top: '68%',
        left: '58%',
        soundType: 'hammer'
      },
      {
        id: 'oak_beam',
        icon: '🪵',
        title: 'Madeira de Carvalho Forte',
        uncheckLabel: 'Ver tábuas para projetos comunitários',
        checkedLabel: '✓ Tábuas selecionadas para o futuro',
        clueText: 'Com 3 a 4 sementes reservadas para o Depois, o vilarejo garante madeira resistente para consertos e pontes.',
        top: '48%',
        left: '78%',
        soundType: 'wood'
      }
    ],
    dialogues: [
      {
        id: 'q1',
        icon: '🔧',
        question: 'Vale mais a pena consertar ou comprar novo?',
        shortAnswer: 'Consertar custa menos e aproveita o que já temos.',
        fullAnswer: 'Quase sempre o conserto a tempo custa apenas uma fração de um objeto novo. Cuidar do que temos é uma das maiores fontes de autonomia financeira.'
      },
      {
        id: 'q2',
        icon: '⏳',
        question: 'O que acontece se deixarmos a manutenção para depois?',
        shortAnswer: 'Pequenos defeitos viram grandes despesas.',
        fullAnswer: 'Uma telha frouxa derruba o telhado; uma lâmina cega quebra o cabo. Prevenir imprevistos é agir antes que a emergência aconteça.'
      },
      {
        id: 'q3',
        icon: '🤝',
        question: 'Como o trabalho e o ofício geram sementes no Vale?',
        shortAnswer: 'Aprender uma habilidade cria valor duradouro.',
        fullAnswer: 'Quem sabe consertar, plantar ou construir oferece ajuda útil para toda a comunidade e sempre encontra formas dignas de trabalhar.'
      }
    ]
  },

  house: {
    id: 'house',
    title: 'A Casa da Fazenda • Bem-Estar e Rotina',
    badge: '🏡 Alimento, Aconchego & Compromissos em Dia',
    characterName: 'A Família Guardiã',
    characterRole: 'Coração da Vida Cotidiana no Vale',
    characterAvatar: '🏠',
    imageSrc: imgHouse,
    imageAlt: 'Interior simples e acolhedor de uma casa de fazenda com mesa de madeira e pão fresco',
    introSpeech: 'A casa é o nosso refúgio. Usar parte das sementes no presente para viver com saúde, afeto e dignidade não é desperdício: é a própria razão pela qual nós trabalhamos!',
    hotspots: [
      {
        id: 'table_bread',
        icon: '🥖',
        title: 'Mesa de Alimento Fresco',
        uncheckLabel: 'Conferir mantimentos da casa',
        checkedLabel: '✓ Alimentação saudável garantida',
        clueText: 'Pão de milho, leite e sopa quente. Separar sementes no Agora garante comida nutritiva sem ansiedade.',
        top: '66%',
        left: '36%',
        soundType: 'chime'
      },
      {
        id: 'logbook_notes',
        icon: '📜',
        title: 'Caderno de Contas da Família',
        uncheckLabel: 'Checar compromissos do mês',
        checkedLabel: '✓ Compromissos anotados com clareza',
        clueText: 'Anotar entradas e saídas evita surpresas desagradáveis e permite dormir com o coração tranquilo.',
        top: '60%',
        left: '60%',
        soundType: 'drop'
      },
      {
        id: 'hearth_window',
        icon: '🪟',
        title: 'Lareira e Janelas Quentes',
        uncheckLabel: 'Checar frestas contra o vento',
        checkedLabel: '✓ Casa vedada e acolhedora',
        clueText: 'O conforto térmico da família previne resfriados e gastos com remédios quando a estação vira.',
        top: '42%',
        left: '75%',
        soundType: 'hammer'
      }
    ],
    dialogues: [
      {
        id: 'q1',
        icon: '🍲',
        question: 'Por que usar sementes no presente é tão importante?',
        shortAnswer: 'Viver bem hoje é o propósito do nosso trabalho.',
        fullAnswer: 'Poupar não significa passar necessidade ou abrir mão de tudo. Uma parte dos recursos deve cuidar do nosso bem-estar, refeições e saúde agora.'
      },
      {
        id: 'q2',
        icon: '📑',
        question: 'Como manter os compromissos em dia nos ajuda?',
        shortAnswer: 'Compromissos em dia trazem paz de espírito.',
        fullAnswer: 'Pagar as trocas combinadas na data certa cria confiança no vilarejo e impede que as dívidas cresçam como ervas daninhas.'
      },
      {
        id: 'q3',
        icon: '💛',
        question: 'O que é a verdadeira prosperidade em um lar?',
        shortAnswer: 'Harmonia, segurança e liberdade de escolha.',
        fullAnswer: 'Prosperidade não é ter luxos caros, e sim saber que a despensa tem comida, a casa está protegida e há serenidade entre as pessoas que amamos.'
      }
    ]
  },

  silo: {
    id: 'silo',
    title: 'O Silo da Reserva • A Torre Protetora',
    badge: '🌾 Reserva de Emergência & Autonomia em Tempestades',
    characterName: 'O Guardião do Silo',
    characterRole: 'Protetor das Sementes Comunitárias',
    characterAvatar: '🛡️',
    imageSrc: imgSilo,
    imageAlt: 'Torre de pedra do Silo com portas abertas e sacos de sementes organizados',
    introSpeech: 'O Silo não serve para nos tornar mais ricos que os vizinhos. Ele serve para comprar tempo e liberdade de escolha quando o clima do mundo mudar!',
    hotspots: [
      {
        id: 'dry_sacks',
        icon: '🌾',
        title: 'Sacos de Sementes Secas',
        uncheckLabel: 'Conferir reserva contra imprevistos',
        checkedLabel: '✓ Reserva de emergência inspecionada',
        clueText: 'Sementes guardadas em local seco e elevado. Se a ventania quebrar o telhado, não precisaremos tirar comida da mesa.',
        top: '68%',
        left: '30%',
        soundType: 'drop'
      },
      {
        id: 'stone_latch',
        icon: '🚪',
        title: 'Tranca de Ferro Forjado',
        uncheckLabel: 'Testar tranca da porta',
        checkedLabel: '✓ Proteção física reforçada',
        clueText: 'A tranca pesada impede que a água da chuva entre no celeiro mesmo durante a maior tempestade da estação.',
        top: '50%',
        left: '52%',
        soundType: 'hammer'
      },
      {
        id: 'reserve_gauge',
        icon: '📊',
        title: 'Medidor de Tranquilidade',
        uncheckLabel: 'Checar nível de segurança',
        checkedLabel: '✓ Nível de proteção mapeado',
        clueText: 'Com 3 a 4 sementes no Silo, o Vale aguenta semanas de imprevistos com calma e cabeça fria.',
        top: '62%',
        left: '76%',
        soundType: 'chime'
      }
    ],
    dialogues: [
      {
        id: 'q1',
        icon: '🛡️',
        question: 'Por que guardar sementes não é ganância?',
        shortAnswer: 'Reserva não é acúmulo vaidoso, é escudo protetor.',
        fullAnswer: 'Quem guarda para ostentar quer ser maior que os outros. Quem guarda para proteção quer ter segurança para si e capacidade de amparar os outros quando a tempestade passar.'
      },
      {
        id: 'q2',
        icon: '🌪️',
        question: 'O que acontece se vier um imprevisto e o Silo estiver vazio?',
        shortAnswer: 'Falta de reserva nos obriga a escolhas difíceis.',
        fullAnswer: 'Sem reserva, qualquer chuva forte nos obriga a vender ferramentas ou passar fome. O Silo nos dá tempo para pensar e agir sem desespero.'
      },
      {
        id: 'q3',
        icon: '🕊️',
        question: 'Como a reserva compra nossa liberdade?',
        shortAnswer: 'Quem tem reserva pode dizer "não" a maus negócios.',
        fullAnswer: 'Quando você tem sementes guardadas, você não aceita ofertas enganosas nem precisa aceitar condições abusivas por desespero.'
      }
    ]
  },

  field: {
    id: 'field',
    title: 'A Horta do Professor Cornélio • Tempo e Cultivo',
    badge: '🌱 Trabalho, Paciência & Respeito ao Crescimento',
    characterName: 'Professor Cornélio',
    characterRole: 'Mestre da Terra e da Paciência',
    characterAvatar: '🦉',
    imageSrc: imgField,
    imageAlt: 'Horta viçosa com canteiros floridos e hortaliças viçosas sob a luz da primavera',
    introSpeech: 'Na horta, não adianta puxar a folha para ela crescer mais rápido. Cada semente tem seu tempo, e a dedicação diária é o maior segredo da verdadeira colheita!',
    hotspots: [
      {
        id: 'sprout_bed',
        icon: '🌱',
        title: 'Canteiro de Mudas Novas',
        uncheckLabel: 'Verificar brotos recém-plantados',
        checkedLabel: '✓ Brotos recebendo água e sol',
        clueText: 'Pequenos brotos verdes. Eles precisam de rega diária e paciência. Não há atalhos na natureza nem nos projetos humanos.',
        top: '65%',
        left: '32%',
        soundType: 'water'
      },
      {
        id: 'ripe_carrots',
        icon: '🥕',
        title: 'Hortaliças Prontas da Estação',
        uncheckLabel: 'Identificar colheita madura',
        checkedLabel: '✓ Frutos da paciência colhidos',
        clueText: 'Cenouras doces e rabanetes firmes. Foram plantados na estação passada e hoje alimentam os moradores.',
        top: '72%',
        left: '55%',
        soundType: 'drop'
      },
      {
        id: 'water_can',
        icon: '🚿',
        title: 'Regador e Adubo Orgânico',
        uncheckLabel: 'Alimentar a terra com carinho',
        checkedLabel: '✓ Nutrição e constância aplicadas',
        clueText: 'Pequenas ações constantes todos os dias geram colheitas muito maiores do que um esforço desordenado de última hora.',
        top: '52%',
        left: '78%',
        soundType: 'water'
      }
    ],
    dialogues: [
      {
        id: 'q1',
        icon: '⏳',
        question: 'Por que o crescimento exige paciência e não pode ser apressado?',
        shortAnswer: 'Plantas e investimentos precisam de tempo para criar raízes.',
        fullAnswer: 'Promessas de crescimento rápido e milagroso costumam ser armadilhas. Coisas sólidas pedem constância, cuidado e respeito às estações.'
      },
      {
        id: 'q2',
        icon: '🥕',
        question: 'Qual a diferença entre colher agora ou esperar?',
        shortAnswer: 'Colher antes da hora gera frutos amargos.',
        fullAnswer: 'Se colhermos a muda pequenininha, comemos hoje mas ficamos sem nada amanhã. Saber esperar o tempo de maturação multiplica o valor das sementes.'
      },
      {
        id: 'q3',
        icon: '💧',
        question: 'Como pequenas sementes diárias viram grandes colheitas?',
        shortAnswer: 'O hábito diário é mais poderoso que a pressa.',
        fullAnswer: 'Colocar uma única semente no Silo com frequência constrói uma reserva monumental ao longo do ano, sem exigir sacrifícios pesados.'
      }
    ]
  },

  bridge: {
    id: 'bridge',
    title: 'A Ponte do Vilarejo • Projetos Comunitários',
    badge: '🌉 Conexão, Metas Coletivas & Solidariedade',
    characterName: 'Dona Clara, a Guardiã Anciã',
    characterRole: 'Guardiã da Conexão e do Futuro',
    characterAvatar: '🦉',
    imageSrc: imgBridge,
    imageAlt: 'Ponte de pedra e madeira sobre o rio com flores da primavera e montanhas ao fundo',
    introSpeech: 'Olá, Guardião! A ponte ainda aguenta nossos passos, mas as chuvas da virada de estação costumam ser imprevisíveis. Cuidar dela agora garante que o mercado continue acessível para todos!',
    hotspots: [
      {
        id: 'beam_crack',
        icon: '🪵',
        title: 'Viga de Apoio da Ponte',
        uncheckLabel: 'Tocar na madeira da ponte',
        checkedLabel: '✓ Viga estalou (precisa de reforço)',
        clueText: 'A madeira emitiu um estalo. Se a chuva vier forte sem reforço, a travessia para o mercado pode fechar.',
        top: '56%',
        left: '46%',
        soundType: 'wood'
      },
      {
        id: 'supplies_basket',
        icon: '🧺',
        title: 'Cesta de Mantimentos',
        uncheckLabel: 'Cobrir alimentos com lona',
        checkedLabel: '✓ Mantimentos protegidos da chuva!',
        clueText: 'Cesta coberta com lona protetora contra respingos do rio e garoas passageiras.',
        top: '78%',
        left: '22%',
        soundType: 'hammer'
      },
      {
        id: 'river_flow',
        icon: '💧',
        title: 'Correnteza do Rio',
        uncheckLabel: 'Observar o fluxo do rio',
        checkedLabel: '✓ Rio calmo, mas com volume subindo',
        clueText: 'O leito do rio recebe águas da serra. Na virada de estação, o volume sobe rapidamente.',
        top: '72%',
        left: '72%',
        soundType: 'water'
      }
    ],
    dialogues: [
      {
        id: 'q1',
        icon: '🌦️',
        question: 'A chuva forte é uma certeza?',
        shortAnswer: 'A natureza nunca avisa o dia exato!',
        fullAnswer: 'A natureza nunca dá certeza absoluta. Pode ser apenas uma garoa passageira, ou uma ventania com cheia do rio. Por isso quem guarda uma reserva no Silo não precisa tentar adivinhar o futuro: fica tranquilo de qualquer jeito!'
      },
      {
        id: 'q2',
        icon: '🪵',
        question: 'Quanto custa consertar a ponte?',
        shortAnswer: 'Com 3 a 4 sementes no Futuro reforçamos a estrutura.',
        fullAnswer: 'Com 3 a 4 sementes reservadas para o Depois, conseguimos vigas de carvalho firmes com o Mestre Tomás na Oficina. Se a ponte ruir de vez, custará mais que o dobro para reconstruir!'
      },
      {
        id: 'q3',
        icon: '🌾',
        question: 'Para que serve o Silo da Reserva nesta estação?',
        shortAnswer: 'O Silo é o nosso escudo de paz e autonomia.',
        fullAnswer: 'O Silo é a proteção do Vale. Se o vento soltar telhas da casa ou se a colheita atrasar, ter sementes no Silo nos dá tempo e calma para consertar as coisas sem precisar passar aperto ou tirar comida da mesa.'
      }
    ]
  },

  woods: {
    id: 'woods',
    title: 'O Bosque & As Montanhas • Sonhos de Longo Prazo',
    badge: '🌲 Metas Distantes, Paciência & Constância',
    characterName: 'A Guia dos Caminhos',
    characterRole: 'Exploradora das Trilhas e Montanhas',
    characterAvatar: '🦅',
    imageSrc: imgWoods,
    imageAlt: 'Trilha suave serpenteando por um bosque de pinheiros antigos em direção às montanhas azuis',
    introSpeech: 'O bosque nos ensina a olhar longe. Uma semente plantada para o longo prazo precisa de raízes fundas e constância, mesmo quando ninguém está olhando!',
    hotspots: [
      {
        id: 'ancient_oak',
        icon: '🌲',
        title: 'Carvalho de Três Gerações',
        uncheckLabel: 'Tocar no tronco centenário',
        checkedLabel: '✓ Raízes profundas examinadas',
        clueText: 'Esta árvore começou como uma única semente plantada há muitas estações. Hoje ela protege toda a fauna e dá sombra ao caminho.',
        top: '58%',
        left: '32%',
        soundType: 'wood'
      },
      {
        id: 'path_map',
        icon: '🗺️',
        title: 'Pedra do Mapa e Bússola',
        uncheckLabel: 'Consultar o mapa de metas',
        checkedLabel: '✓ Rumo do futuro verificado',
        clueText: 'Ter um mapa de objetivos nos impede de nos perdermos pelos atalhos fáceis que não levam a lugar nenhum.',
        top: '68%',
        left: '54%',
        soundType: 'drop'
      },
      {
        id: 'mountain_view',
        icon: '🔭',
        title: 'Mirante dos Picos Azuis',
        uncheckLabel: 'Olhar o horizonte da montanha',
        checkedLabel: '✓ Visão de longo prazo contemplada',
        clueText: 'A montanha é alta, mas se sobe um passo de cada vez. Sonhos grandes pedem prazos longos e constância diária.',
        top: '42%',
        left: '78%',
        soundType: 'chime'
      }
    ],
    dialogues: [
      {
        id: 'q1',
        icon: '🏔️',
        question: 'Por que metas de longo prazo pedem tanta paciência?',
        shortAnswer: 'Grandes realizações não acontecem de um dia para o outro.',
        fullAnswer: 'Aprender uma profissão, reflorestar uma colina ou construir uma casa firme leva tempo. Se desistirmos no primeiro mês, nunca veremos a copa da árvore florescer.'
      },
      {
        id: 'q2',
        icon: '🌲',
        question: 'Como separar sementes para o "Depois" sem passar aperto hoje?',
        shortAnswer: 'Separar um pouco com constância, sem exageros.',
        fullAnswer: 'Você não precisa guardar todas as suas sementes para o futuro distante. Guardar 3 ou 4 sementes por estação é suficiente para transformar a sua vida ao longo dos anos.'
      },
      {
        id: 'q3',
        icon: '👣',
        question: 'O que fazer quando o caminho parecer longo demais?',
        shortAnswer: 'Comemore os pequenos passos de cada estação.',
        fullAnswer: 'Olhe para trás e veja o quanto você já aprendeu e cuidou. A jornada com propósito é tão bela quanto o topo da montanha!'
      }
    ]
  }
};

export const LocationSceneView: React.FC<LocationSceneViewProps> = ({
  locationId,
  guardianName,
  onProceedToDecision,
  onBackToMap
}) => {
  const sceneData = LOCATION_SCENES[locationId] || LOCATION_SCENES.bridge;
  const [checkedHotspots, setCheckedHotspots] = useState<Record<string, boolean>>({});
  const [activeQuestionId, setActiveQuestionId] = useState<string>(sceneData.dialogues[0]?.id || 'q1');

  const handleTouchHotspot = (hotspot: HotspotItem) => {
    switch (hotspot.soundType) {
      case 'wood': soundManager.playWoodCreak(); break;
      case 'hammer': soundManager.playHammer(); break;
      case 'water': soundManager.playWaterSplash(); break;
      case 'drop': soundManager.playSeedDrop(1); break;
      case 'chime':
      default: soundManager.playChime(); break;
    }

    setCheckedHotspots(prev => ({
      ...prev,
      [hotspot.id]: true
    }));
  };

  const handleSelectQuestion = (q: DialogueCard) => {
    soundManager.playPageFlip();
    setActiveQuestionId(q.id);
    speechHelper.speak(`${sceneData.characterName} explica: ${q.fullAnswer}`);
  };

  const handleListenIntro = () => {
    speechHelper.speak(`${sceneData.characterName} diz: Olá, Guardião ${guardianName}! ${sceneData.introSpeech}`);
  };

  const totalCluesFound = sceneData.hotspots.filter(h => checkedHotspots[h.id]).length;

  return (
    <div className="interactive-scene-card">
      {/* Barra Superior da Cena */}
      <div className="scene-top-bar">
        <button onClick={onBackToMap} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} />
          <span>Voltar ao Tabuleiro</span>
        </button>

        <span className="scene-badge">
          🔍 {sceneData.badge}
        </span>

        <button onClick={handleListenIntro} className="btn-icon" title="Ouvir introdução da cena">
          <Volume2 size={16} />
          <span>Ouvir Introdução</span>
        </button>
      </div>

      {/* Cenário Ilustrado Completo com Hotspots Interativos */}
      <div className="scene-stage-canvas" style={{ height: '420px', position: 'relative' }}>
        <img 
          src={sceneData.imageSrc} 
          alt={sceneData.imageAlt}
          onError={(e) => {
            // Fallback gracioso para a pintura conceitual caso o arquivo esteja sendo finalizado
            (e.target as HTMLImageElement).src = '/concept_vale_das_sementes.jpg';
          }}
          className="scene-full-artwork"
        />

        {sceneData.hotspots.map((hotspot) => {
          const isChecked = Boolean(checkedHotspots[hotspot.id]);
          return (
            <button
              key={hotspot.id}
              onClick={() => handleTouchHotspot(hotspot)}
              className={`bridge-hotspot ${isChecked ? 'checked' : ''}`}
              title={isChecked ? hotspot.checkedLabel : hotspot.uncheckLabel}
              style={{ top: hotspot.top, left: hotspot.left }}
            >
              <div className="hotspot-pulse-circle">
                {isChecked ? <Check size={18} color="#15803d" /> : <span style={{ fontSize: '1rem' }}>{hotspot.icon}</span>}
              </div>
              <span className="hotspot-pill-tag">
                {isChecked ? hotspot.checkedLabel : `👆 ${hotspot.uncheckLabel}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Painel de Pistas e Observações: Todas visíveis lado a lado sem cobrir o cenário */}
      <div className="investigation-checklist-row">
        {sceneData.hotspots.map((hotspot, idx) => {
          const isChecked = Boolean(checkedHotspots[hotspot.id]);
          return (
            <div key={hotspot.id} className={`clue-box ${isChecked ? 'found' : ''}`}>
              <div className="clue-header">
                <span className="clue-num">{isChecked ? '✓' : idx + 1}</span>
                <strong>{hotspot.title}</strong>
              </div>
              <p className="clue-desc">
                {isChecked ? hotspot.clueText : `Toque no elemento da cena acima para descobrir.`}
              </p>
            </div>
          );
        })}
      </div>

      {/* Seção de Diálogo com Personagem: TODAS as 3 opções e respostas VISÍVEIS ao mesmo tempo */}
      <div className="character-dialogue-section">
        <div className="character-avatar-bubble">
          <span style={{ fontSize: '2.5rem' }}>{sceneData.characterAvatar}</span>
        </div>

        <div className="character-dialogue-body" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div className="character-name-tag">{sceneData.characterName} • {sceneData.characterRole}</div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              12 sementes para cuidar do Vale
            </span>
          </div>

          <p className="character-speech-text">
            "Olá, <strong>{guardianName}</strong>! {sceneData.introSpeech}"
          </p>

          {/* TODAS AS 3 RESPOSTAS VISÍVEIS EM CARDS SIMULTÂNEOS */}
          <div className="dialogue-cards-grid">
            {sceneData.dialogues.map((item) => {
              const isSelected = activeQuestionId === item.id;
              return (
                <div
                  key={item.id}
                  className={`dialogue-card-item ${isSelected ? 'highlighted' : ''}`}
                  onClick={() => handleSelectQuestion(item)}
                >
                  <div className="dialogue-card-top">
                    <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                    <strong className="dialogue-card-q">{item.question}</strong>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speechHelper.speak(`${sceneData.characterName} explica: ${item.fullAnswer}`);
                      }}
                      className="btn-icon-subtle"
                      title="Ouvir esta resposta"
                    >
                      <Volume2 size={15} />
                    </button>
                  </div>

                  <div className="dialogue-card-summary">
                    💡 <em>{item.shortAnswer}</em>
                  </div>

                  <p className="dialogue-card-full">
                    {item.fullAnswer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra de Ação Final */}
      <div className="scene-bottom-action">
        <div className="inspection-status-text">
          {totalCluesFound >= 2 ? (
            <span style={{ color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={20} />
              Excelente investigação! Você explorou este local e já tem os ensinamentos necessários para planejar.
            </span>
          ) : (
            <span style={{ color: '#b45309', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={18} />
              Dica: Você explorou {totalCluesFound} de {sceneData.hotspots.length} elementos deste local. Pode avançar ou continuar explorando!
            </span>
          )}
        </div>

        <button
          onClick={() => {
            soundManager.playMagicSparkle();
            onProceedToDecision();
          }}
          className="btn-hero-start"
          style={{ padding: '14px 32px', fontSize: '1.15rem' }}
        >
          <Sparkles size={20} />
          <span>Fazer Minha Previsão & Escolher Sementes</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
