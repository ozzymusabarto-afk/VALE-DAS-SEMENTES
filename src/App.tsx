import { useState } from 'react';
import './App.css';
import type { GameStage, SeedAllocation, AccessibilitySettings } from './types/game';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ValleyMap } from './components/ValleyMap';
import { NarrativeCardModal } from './components/NarrativeCardModal';
import { PredictionStage } from './components/PredictionStage';
import { SeedAllocationStage } from './components/SeedAllocationStage';
import { ConfirmationStage } from './components/ConfirmationStage';
import { SeasonTransitionStage } from './components/SeasonTransitionStage';
import { ConsequenceStage } from './components/ConsequenceStage';
import { JournalModal } from './components/JournalModal';
import { TransferChallengeStage } from './components/TransferChallengeStage';
import { StageCompletedScreen } from './components/StageCompletedScreen';
import { AmbientParticles } from './components/AmbientParticles';

export function App() {
  const [guardianName, setGuardianName] = useState('Guardião do Vale');
  const [stage, setStage] = useState<GameStage>('welcome');
  const [totalSeeds] = useState(12);
  const [allocation, setAllocation] = useState<SeedAllocation>({ now: 4, protection: 4, future: 4 });
  const [predictionCards, setPredictionCards] = useState<string[]>(['silo_care']);
  const [predictionText, setPredictionText] = useState('');
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [transferSummary, setTransferSummary] = useState('');
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    largeText: false,
    highContrast: false,
    soundEnabled: true,
    musicEnabled: false,
    autoNarrate: false
  });

  const remainingFreeSeeds = totalSeeds - (allocation.now + allocation.protection + allocation.future);

  // Texto para narração da tela atual (quando a criança clica em "Ouvir")
  const getCurrentNarrationText = (): string => {
    switch (stage) {
      case 'map_overview':
        return `Você está no mapa do Vale das Sementes. Aqui você pode explorar a Casa, o Campo, o Mercado, o Silo da Reserva e a Praça Comunitária. Clique em Abrir História da Rodada para começar!`;
      case 'narrative_card':
        return `A Ponte de Madeira e a Festa das Flores. Olá, ${guardianName}! A primavera chegou ao Vale. A ponte precisa de reforço e teremos a festa na praça. Você tem 12 sementes para cuidar desta estação.`;
      case 'prediction':
        return `Hora da previsão! O que você acha que pode acontecer antes de distribuir as sementes? Pense com carinho: reservar sementes no Silo ajuda a ter opções se chover forte.`;
      case 'seed_allocation':
        return `Distribua suas 12 sementes entre Agora para a casa e festa, Proteção no Silo para imprevistos, e Depois para o conserto da ponte.`;
      case 'consequence':
        return `Compreendendo o resultado: O vento soprou e soltou algumas telhas. Você não podia controlar o vento, mas sua preparação fez toda a diferença.`;
      default:
        return `O Vale das Sementes é um jogo de escolhas, cuidado e planejamento.`;
    }
  };

  const handleStartGame = (name: string) => {
    setGuardianName(name);
    setStage('map_overview');
  };

  const handleRestart = () => {
    setAllocation({ now: 4, protection: 4, future: 4 });
    setPredictionCards(['silo_care']);
    setPredictionText('');
    setStage('map_overview');
  };

  return (
    <div className="app-container">
      <AmbientParticles />
      {stage !== 'welcome' && (
        <Header
          currentSeeds={Math.max(0, remainingFreeSeeds)}
          totalSeeds={totalSeeds}
          seasonText="Primavera • Ano 1"
          goalText="A Ponte e a Casa"
          onOpenJournal={() => setIsJournalOpen(true)}
          accessibility={accessibility}
          setAccessibility={setAccessibility}
          currentNarrationText={getCurrentNarrationText()}
        />
      )}

      <main role="main">
        {stage === 'welcome' && (
          <WelcomeScreen onStart={handleStartGame} />
        )}

        {stage === 'map_overview' && (
          <ValleyMap
            onStartRound={() => setStage('narrative_card')}
            activeRoundTitle="Capítulo 1: A Ponte de Madeira e a Festa das Flores"
          />
        )}

        {stage === 'narrative_card' && (
          <NarrativeCardModal
            guardianName={guardianName}
            onProceedToPrediction={() => setStage('prediction')}
            onClose={() => setStage('map_overview')}
          />
        )}

        {stage === 'prediction' && (
          <PredictionStage
            onConfirmPrediction={(cards, customText) => {
              setPredictionCards(cards);
              setPredictionText(customText);
              setStage('seed_allocation');
            }}
            onBack={() => setStage('narrative_card')}
          />
        )}

        {stage === 'seed_allocation' && (
          <SeedAllocationStage
            totalSeeds={totalSeeds}
            initialAllocation={allocation}
            onConfirmAllocation={(newAlloc) => {
              setAllocation(newAlloc);
              setStage('confirmation');
            }}
            onBack={() => setStage('prediction')}
          />
        )}

        {stage === 'confirmation' && (
          <ConfirmationStage
            allocation={allocation}
            onConfirm={() => setStage('season_transition')}
            onModify={() => setStage('seed_allocation')}
          />
        )}

        {stage === 'season_transition' && (
          <SeasonTransitionStage
            onContinue={() => setStage('consequence')}
          />
        )}

        {stage === 'consequence' && (
          <ConsequenceStage
            allocation={allocation}
            onOpenJournal={() => setIsJournalOpen(true)}
          />
        )}

        {stage === 'transfer_challenge' && (
          <TransferChallengeStage
            onCompleteTransfer={(summary) => {
              setTransferSummary(summary);
              setStage('stage_completed');
            }}
          />
        )}

        {stage === 'stage_completed' && (
          <StageCompletedScreen
            guardianName={guardianName}
            summaryText={transferSummary}
            onRestart={handleRestart}
            onExploreMap={() => setStage('map_overview')}
            onOpenJournal={() => setIsJournalOpen(true)}
          />
        )}
      </main>

      {/* Modal do Diário de Bordo disponível para consulta e registro a qualquer momento */}
      <JournalModal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        predictionCards={predictionCards}
        predictionText={predictionText}
        allocation={allocation}
        isPostRound={stage === 'consequence'}
        onProceedToTransfer={() => {
          setIsJournalOpen(false);
          setStage('transfer_challenge');
        }}
      />
    </div>
  );
}

export default App;
