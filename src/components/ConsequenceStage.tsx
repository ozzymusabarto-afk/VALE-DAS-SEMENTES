import React from 'react';
import { ShieldCheck, ArrowRight, BookOpen, HeartHandshake, Volume2 } from 'lucide-react';
import type { LocationId, SeedAllocation } from '../types/game';
import { soundManager } from '../utils/audio';
import { speechHelper } from '../utils/speech';

import imgMarket from '../assets/cena-mercado-raposa.webp';
import imgWorkshop from '../assets/cena-oficina-ferramentas.webp';
import imgHouse from '../assets/cena-casa-fazenda.webp';
import imgSilo from '../assets/cena-silo-reserva.webp';
import imgField from '../assets/cena-horta-cornelio.webp';
import imgBridge from '../assets/cena-ponte-primavera.webp';
import imgWoods from '../assets/cena-bosque-montanhas.webp';

interface ConsequenceStageProps {
  locationId?: LocationId;
  allocation: SeedAllocation;
  onOpenJournal: () => void;
}

interface LocationConsequenceConfig {
  stepBadge: string;
  image: string;
  imageAlt: string;
  statusIcon: string;
  statusTitle: string;
  statusInfo: string;
  controlText: string;
  uncertaintyText: string;
  prepHelpGood: string;
  prepHelpLearning: string;
  positiveTitle: string;
  positiveDesc: string;
  positiveQuote: string;
  learningTitle: string;
  learningDesc: string;
  learningQuote: string;
  voicePositive: string;
  voiceLearning: string;
}

const LOCATION_CONSEQUENCES: Record<LocationId, LocationConsequenceConfig> = {
  market: {
    stepBadge: 'Passo 3 de 4 • O Mercado da Raposa e o Resultado da Feira',
    image: imgMarket,
    imageAlt: 'O Mercado da Raposa com bancas cheias de frutas e pães frescos',
    statusIcon: '🧺',
    statusTitle: 'Balanço da Feira:',
    statusInfo: 'Alimento básico: 3 sementes • Reserva no Silo: 3 sementes recomendadas',
    controlText: 'Comparar preços, comprar com lista e decidir quantas sementes usar em alimentos hoje, na reserva e no futuro.',
    uncertaintyText: 'A variação dos preços de frutas e sementes trazidas de longe. Ninguém controla os preços da feira, apenas como escolhe.',
    prepHelpGood: 'Você comprou o essencial e a reserva no Silo cobriu imprevistos sem você precisar se endividar nem cortar o alimento diário!',
    prepHelpLearning: 'Alguns desejos de impulso levaram mais sementes na feira. Mas isso é um grande aprendizado para pesquisar com calma na próxima estação.',
    positiveTitle: 'Consumo consciente e paz na despensa!',
    positiveDesc: 'Você comparou as cestas com sabedoria. A casa tem alimento saudável e o Silo tem sementes guardadas para caso os preços subam no inverno.',
    positiveQuote: '"Comprar o que realmente alimenta hoje e guardar para o amanhã é a chave da liberdade."',
    learningTitle: 'Uma descoberta valiosa sobre desejos e necessidades!',
    learningDesc: 'Tudo na feira parecia tentador. Quando usamos muitas sementes de uma vez, falta para a reserva. Mas errar faz parte: na próxima, faremos uma lista com antecedência!',
    learningQuote: '"Não precisamos comprar tudo o que vemos. Saber esperar é um superpoder de sabedoria."',
    voicePositive: 'Parabéns! No Mercado da Raposa, você comprou o que era necessário e manteve uma reserva segura no Silo.',
    voiceLearning: 'No Mercado, muitas coisas chamavam a atenção. O importante agora é refletir no Diário sobre o que foi essencial e o que pode esperar.'
  },
  workshop: {
    stepBadge: 'Passo 3 de 4 • A Oficina de Ferramentas e o Cuidado Preventivo',
    image: imgWorkshop,
    imageAlt: 'A Oficina de Ferramentas ensolarada com Mestre Tomás',
    statusIcon: '🔨',
    statusTitle: 'Balanço da Oficina:',
    statusInfo: 'Manutenção de enxadas e arados: 3 sementes necessárias',
    controlText: 'Cuidar das ferramentas antes do plantio pesado e decidir o quanto investir em reparos preventivos.',
    uncertaintyText: 'O desgaste natural das lâminas de ferro e cabos de madeira no solo duro. Toda ferramenta um dia se desgasta.',
    prepHelpGood: 'As ferramentas foram afiadas e ajustadas no momento certo. O plantio correu sem interrupções e com segurança.',
    prepHelpLearning: 'Uma ferramenta quebrou inesperadamente no campo. Tomás ajudou a consertar e você aprendeu que prevenir custa menos que consertar na emergência.',
    positiveTitle: 'Manutenção preventiva com sucesso!',
    positiveDesc: 'Cuidar das ferramentas antes que quebrassem poupou tempo precioso e evitou gastos dobrados de emergência.',
    positiveQuote: '"Quem afia a ferramenta com calma hoje, colhe com tranquilidade e sem sustos amanhã."',
    learningTitle: 'Um aprendizado prático sobre consertos!',
    learningDesc: 'Deixar para consertar na pressa exige mais esforço e sementes. No Vale, Mestre Tomás nos acolhe e ensina a planejar o cuidado com antecedência.',
    learningQuote: '"Cuidar do que temos com carinho é tão valioso quanto semear coisas novas."',
    voicePositive: 'Excelente! Suas ferramentas estão prontas e a fazenda tem reserva para qualquer peça de reposição.',
    voiceLearning: 'As ferramentas precisavam de atenção. Agora sabemos que a manutenção preventiva protege nosso trabalho e nosso tempo.'
  },
  house: {
    stepBadge: 'Passo 3 de 4 • A Casa da Fazenda e o Alimento em Família',
    image: imgHouse,
    imageAlt: 'Interior acolhedor da Casa da Fazenda com a família à mesa',
    statusIcon: '🏠',
    statusTitle: 'Balanço do Lar:',
    statusInfo: 'Alimento e conforto da rotina: 3 sementes • Reserva no Silo',
    controlText: 'Decidir como nutrir a rotina familiar no presente sem descuidar da segurança do teto e das reservas.',
    uncertaintyText: 'Uma frente fria repentina com ventos fortes. Ninguém controla as tempestades, apenas a preparação da casa.',
    prepHelpGood: 'A mesa teve pão fresco e carinho, e o Silo garantiu lenha seca e telhas sem aperto.',
    prepHelpLearning: 'O vento balançou as telhas. A família se uniu e agora podemos pedir auxílio aos vizinhos para reforçar o telhado.',
    positiveTitle: 'Dignidade e calor humano no lar!',
    positiveDesc: 'Usar sementes no presente para viver com afeto, boa comida e saúde é o objetivo do nosso esforço.',
    positiveQuote: '"Guardar sementes serve para que os dias de hoje e de amanhã sejam vividos com paz e dignidade."',
    learningTitle: 'A união familiar em tempos de mudança!',
    learningDesc: 'Quando o clima aperta e a reserva é pouca, a família e a comunidade se acolhem. No Vale, ninguém passa por isso sozinho.',
    learningQuote: '"O maior tesouro de uma casa não são as sementes empilhadas, mas o amor e a união de quem vive nela."',
    voicePositive: 'Que alegria! A casa da família está protegida, acolhedora e pronta para todas as estações.',
    voiceLearning: 'A casa enfrentou o vento com coragem. Juntos vamos registrar no Diário o que aprendemos sobre proteger o lar.'
  },
  silo: {
    stepBadge: 'Passo 3 de 4 • O Silo da Reserva e a Segurança do Vale',
    image: imgSilo,
    imageAlt: 'A imponente torre de pedra do Silo da Reserva sob o sol',
    statusIcon: '🛡️',
    statusTitle: 'Balanço da Reserva:',
    statusInfo: 'Segurança contra intempéries: 3 sementes necessárias no Silo',
    controlText: 'Separar sementes com constância para a torre de proteção antes de gastar em supérfluos.',
    uncertaintyText: 'Eventos climáticos do mundo: geadas fora de época, secas ou ventanias que fogem do nosso controle.',
    prepHelpGood: 'O Silo estava abastecido e forte! A comunidade passou pelo imprevisto com serenidade e fartura.',
    prepHelpLearning: 'O Silo precisava de mais reforço. Aprendemos juntos que a reserva não é avareza, mas sim cuidado com quem amamos.',
    positiveTitle: 'A tranquilidade de quem tem reserva!',
    positiveDesc: 'Quem tem reserva não é melhor que ninguém, mas tem mais tempo e liberdade para respirar e escolher com calma.',
    positiveQuote: '"A reserva de emergência transforma o pânico de uma surpresa em apenas mais um problema que se resolve com calma."',
    learningTitle: 'Uma lição de ouro sobre a paciência da poupança!',
    learningDesc: 'Construir uma reserva leva tempo e pequenas renúncias hoje. No Vale, cada rodada é uma nova chance de fortalecer o Silo.',
    learningQuote: '"Cada semente guardada com paciência é uma semente de paz no futuro."',
    voicePositive: 'Muito bem! O Silo da Reserva cumpriu seu papel de trazer paz e segurança para todo o Vale.',
    voiceLearning: 'O Silo nos deu uma grande lição hoje. Vamos anotar essa sabedoria no Diário de Bordo!'
  },
  field: {
    stepBadge: 'Passo 3 de 4 • A Horta do Professor Cornélio e a Colheita',
    image: imgField,
    imageAlt: 'A Horta viçosa do Professor Cornélio com girassóis e vegetais',
    statusIcon: '🌱',
    statusTitle: 'Balanço da Terra:',
    statusInfo: 'Rega e preparo do solo: 3 sementes • Reserva no Silo',
    controlText: 'Dedicar esforço diário de rega e respeito aos ciclos naturais da germinação.',
    uncertaintyText: 'O número de dias de sol e chuva da estação. Não controlamos o céu, mas preparamos a terra com amor.',
    prepHelpGood: 'Os brotos verdes cresceram fortes e saudáveis. A dedicação constante gerou frutos doces para o vilarejo.',
    prepHelpLearning: 'Algumas mudas pediam mais paciência e água guardada. Com as orientações do professor, a próxima safra será ainda melhor.',
    positiveTitle: 'A colheita generosa da paciência!',
    positiveDesc: 'Você entendeu que tudo tem seu tempo certo. Regar e cuidar sem pressa gera a verdadeira abundância duradoura.',
    positiveQuote: '"Na horta e na vida, colhemos exatamente a constância e o amor que semeamos a cada dia."',
    learningTitle: 'A sabedoria do tempo que amadurece!',
    learningDesc: 'Querer colher antes da hora não ajuda a planta a crescer. O professor Cornélio nos ensina que a paciência é a melhor jardineira.',
    learningQuote: '"Não adianta puxar as folhas: a natureza ensina quem sabe esperar e cuidar com dedicação."',
    voicePositive: 'Parabéns pela dedicação na Horta! As plantas cresceram com vigor graças ao seu cuidado.',
    voiceLearning: 'A terra ensina com calma. Vamos ao Diário para anotar o que a horta nos ensinou sobre a paciência.'
  },
  bridge: {
    stepBadge: 'Passo 3 de 4 • A Ponte do Vilarejo e a Conexão Comunitária',
    image: imgBridge,
    imageAlt: 'A ponte de pedra e madeira sobre o rio límpido na primavera',
    statusIcon: '🌉',
    statusTitle: 'Balanço da Ponte:',
    statusInfo: 'Reforço estrutural da ponte: 3 sementes comunitárias',
    controlText: 'Contribuir para obras coletivas que mantêm o vilarejo conectado e as famílias em segurança.',
    uncertaintyText: 'A subida repentina das águas do rio com as chuvas da cabeceira da serra.',
    prepHelpGood: 'A ponte foi reforçada antes da cheia do rio! Os moradores e carroças continuam cruzando com segurança.',
    prepHelpLearning: 'A cheia do rio mostrou que a ponte precisa de mais apoio de todos. Juntos vamos organizar uma força-tarefa comunitária.',
    positiveTitle: 'Cooperação que constrói caminhos!',
    positiveDesc: 'Ao pensar além do próprio quintal, você garantiu que o mercado, a escola e a oficina continuassem acessíveis para todos.',
    positiveQuote: '"Projetos coletivos mostram que quando o vilarejo coopera, cada um fica mais forte e protegido."',
    learningTitle: 'O poder da colaboração comunitária!',
    learningDesc: 'Construir pontes grandes demais sozinhos é difícil. No Vale, aprendemos a dividir os custos comunitários entre todas as famílias.',
    learningQuote: '"Uma ponte sólida não se constrói com pressa, mas com união de braços e sementes compartilhadas."',
    voicePositive: 'Excelente trabalho na Ponte! A comunidade está unida e segura para a Festa das Flores.',
    voiceLearning: 'A ponte precisa de mais união de todos. Vamos registrar essa lição comunitária no Diário!'
  },
  woods: {
    stepBadge: 'Passo 3 de 4 • O Bosque & As Montanhas e o Futuro',
    image: imgWoods,
    imageAlt: 'O mirante do Bosque com a Guardiã contemplando o horizonte distante',
    statusIcon: '🌲',
    statusTitle: 'Balanço da Trilha:',
    statusInfo: 'Projetos de longo prazo: sementes plantadas para os próximos anos',
    controlText: 'Ter visão além do horizonte imediato e semear planos que levarão tempo para florescer com grandeza.',
    uncertaintyText: 'As pedras e desvios no caminho das montanhas. O futuro tem surpresas, mas quem tem mapa caminha firme.',
    prepHelpGood: 'Suas sementes de longo prazo já criaram raízes fortes! A trilha do futuro está aberta e promissora.',
    prepHelpLearning: 'A caminhada pareceu longa e cansativa. Mas dar um passo de cada vez sem desistir é o segredo dos grandes exploradores.',
    positiveTitle: 'Visão de futuro e horizontes amplos!',
    positiveDesc: 'Você olhou além do hoje. Plantar carvalhos e pinheiros centenários é um presente para você mesmo e para as próximas gerações.',
    positiveQuote: '"Grandes montanhas são escaladas com constância, passo a passo, sem perder a calma."',
    learningTitle: 'A bússola da constância diária!',
    learningDesc: 'Sonhos distantes podem parecer difíceis quando olhamos de longe. O bosque nos ensina a ter raízes firmes e avançar aos poucos.',
    learningQuote: '"O futuro não se constrói de uma só vez, mas com as escolhas pacientes que fazemos todos os dias."',
    voicePositive: 'Que visão magnífica do alto do Bosque! Seus sonhos de longo prazo ganharam raízes fortes.',
    voiceLearning: 'O mirante nos mostrou o valor da constância. Vamos registrar no Diário nossas metas para o futuro!'
  }
};

export const ConsequenceStage: React.FC<ConsequenceStageProps> = ({
  locationId = 'bridge',
  allocation,
  onOpenJournal
}) => {
  const config = LOCATION_CONSEQUENCES[locationId] || LOCATION_CONSEQUENCES.bridge;
  const hasEnoughProtection = allocation.protection >= 3;

  const handleListen = () => {
    speechHelper.speak(hasEnoughProtection ? config.voicePositive : config.voiceLearning);
  };

  return (
    <div className="paper-card" style={{ maxWidth: '850px', margin: '20px auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ 
          background: 'var(--color-nature-light)', 
          color: 'var(--color-nature-green)', 
          fontWeight: 800, 
          padding: '5px 14px', 
          borderRadius: '999px',
          fontSize: '0.88rem'
        }}>
          {config.stepBadge}
        </span>

        <button 
          onClick={handleListen}
          className="btn-icon"
          title="Ouvir explicação da Guardiã"
        >
          <Volume2 size={16} />
          <span>Ouvir Reflexão</span>
        </button>
      </div>

      {/* Ilustração Dedicada do Local */}
      <div style={{ 
        position: 'relative', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        marginBottom: '22px',
        boxShadow: '0 8px 24px rgba(60, 45, 20, 0.15)',
        border: '3px solid #ded3be'
      }}>
        <img 
          src={config.image} 
          alt={config.imageAlt} 
          style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          right: '14px',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(4px)',
          borderRadius: '14px',
          padding: '10px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          border: '1.5px solid #e2d5c2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem' }}>{config.statusIcon}</span>
            <strong style={{ color: '#1e293b' }}>{config.statusTitle}</strong>
            <span style={{ color: '#166534', fontWeight: 700 }}>{allocation.protection} sementes no Silo</span>
          </div>

          <div style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
            {config.statusInfo}
          </div>
        </div>
      </div>

      <h2 style={{ margin: '0 0 12px', fontSize: '1.8rem', color: 'var(--text-main)' }}>
        O que as escolhas e as circunstâncias nos ensinaram?
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: '0 0 20px', lineHeight: '1.5' }}>
        No Vale, nós sempre separamos o que dependeu de nós e o que foi um acontecimento da natureza:
      </p>

      {/* Os 3 elementos pedagógicos fundamentais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '16px' }}>
          <strong style={{ display: 'block', color: '#1e293b', marginBottom: '6px', fontSize: '1rem' }}>
            1. O que estava sob seu controle:
          </strong>
          <span style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.5' }}>
            {config.controlText} (Distribuído: <strong>{allocation.now}</strong> no Agora, <strong>{allocation.protection}</strong> no Silo e <strong>{allocation.future}</strong> no Futuro).
          </span>
        </div>

        <div style={{ background: '#fef2f2', border: '1.5px solid #fee2e2', borderRadius: '14px', padding: '16px' }}>
          <strong style={{ display: 'block', color: '#991b1b', marginBottom: '6px', fontSize: '1rem' }}>
            2. O que foi incerteza da natureza:
          </strong>
          <span style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.5' }}>
            {config.uncertaintyText}
          </span>
        </div>

        <div style={{ background: hasEnoughProtection ? '#f0fdf4' : '#fffbeb', border: `1.5px solid ${hasEnoughProtection ? '#bbf7d0' : '#fde68a'}`, borderRadius: '14px', padding: '16px' }}>
          <strong style={{ display: 'block', color: hasEnoughProtection ? '#166534' : '#92400e', marginBottom: '6px', fontSize: '1rem' }}>
            3. Como sua preparação ajudou:
          </strong>
          <span style={{ fontSize: '0.92rem', color: '#475569', lineHeight: '1.5' }}>
            {hasEnoughProtection ? config.prepHelpGood : config.prepHelpLearning}
          </span>
        </div>
      </div>

      {/* Caixa de Explicação Gentil sem Julgamento */}
      {hasEnoughProtection ? (
        <div className="callout-gentle" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '18px', borderRadius: '16px' }}>
          <ShieldCheck size={32} color="#2e7d32" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ margin: '0 0 6px', color: '#1b5e20', fontSize: '1.25rem' }}>
              {config.positiveTitle}
            </h3>
            <p style={{ margin: '0 0 8px', fontSize: '1rem', color: '#2e7d32', lineHeight: '1.5' }}>
              {config.positiveDesc}
            </p>
            <div style={{ fontSize: '0.9rem', color: '#15803d', fontStyle: 'italic' }}>
              {config.positiveQuote}
            </div>
          </div>
        </div>
      ) : (
        <div className="callout-pedagogical" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '18px', borderRadius: '16px' }}>
          <HeartHandshake size={32} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ margin: '0 0 6px', color: '#b45309', fontSize: '1.25rem' }}>
              {config.learningTitle}
            </h3>
            <p style={{ margin: '0 0 8px', fontSize: '1rem', color: '#78350f', lineHeight: '1.5' }}>
              {config.learningDesc}
            </p>
            <div style={{ fontSize: '0.9rem', color: '#92400e', fontStyle: 'italic' }}>
              {config.learningQuote}
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        marginTop: '28px', 
        borderTop: '2px dashed #e5dcce', 
        paddingTop: '20px',
        gap: '12px'
      }}>
        <button 
          onClick={() => {
            soundManager.playPageFlip();
            onOpenJournal();
          }}
          className="btn-primary"
          style={{ padding: '14px 28px', fontSize: '1.1rem' }}
        >
          <BookOpen size={20} />
          <span>Registrar Descoberta no Diário de Bordo</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};
