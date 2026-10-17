import { useState } from 'react';
import './App.css';
import type { GameStage, SeedAllocation, AccessibilitySettings, Season, LocationId } from './types/game';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ValleyMap } from './components/ValleyMap';
import { LocationSceneView } from './components/LocationSceneView';
import { StormInteractiveScene } from './components/StormInteractiveScene';
import { NarrativeCardModal } from './components/NarrativeCardModal';
import { PredictionStage } from './components/PredictionStage';
import { SeedAllocationStage } from './components/SeedAllocationStage';
import { ConfirmationStage } from './components/ConfirmationStage';
import { ConsequenceStage } from './components/ConsequenceStage';
import { JournalModal } from './components/JournalModal';
import { TransferChallengeStage } from './components/TransferChallengeStage';
import { StageCompletedScreen } from './components/StageCompletedScreen';
import { AmbientParticles } from './components/AmbientParticles';
import { MagicGlitterCursor } from './components/MagicGlitterCursor';

export function App() {
  const [guardianName, setGuardianName] = useState('Guardião do Vale');
  const [stage, setStage] = useState<GameStage>('welcome');
  const [selectedLocation, setSelectedLocation] = useState<LocationId>('bridge');
  const [currentSeason, setCurrentSeason] = useState<Season>('Primavera');
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
    autoNarrate: false,
    reducedMotion: false
  });

  const remainingFreeSeeds = totalSeeds - (allocation.now + allocation.protection + allocation.future);

  // Texto para narração da tela atual (quando a criança clica em "Ouvir")
  const getCurrentNarrationText = (): string => {
    switch (stage) {
      case 'map_overview':
        return `Você está no mapa do Vale das Sementes. Aqui você pode explorar a Casa, o Campo, o Mercado, o Silo da Reserva e a Praça Comunitária. Clique em Cuidar do Vale para começar a aventura!`;
      case 'location_scene':
      case 'bridge_inspection':
        return `Investigação no Vale! Toque nos elementos da cena para descobrir informações, converse com os moradores e veja todas as opções antes de distribuir suas sementes.`;
      case 'narrative_card':
        return `A Ponte de Madeira e a Festa das Flores. Olá, ${guardianName}! A primavera chegou ao Vale. A ponte precisa de reforço e teremos a festa na praça. Você tem 12 sementes para cuidar desta estação.`;
      case 'prediction':
        return `Hora da previsão! O que você acha que pode acontecer antes de distribuir as sementes? Pense com carinho: reservar sementes no Silo ajuda a ter opções se chover forte.`;
      case 'seed_allocation':
        return `Distribua suas 12 sementes entre Agora para a casa e festa, Proteção no Silo para imprevistos, e Depois para o conserto da ponte.`;
      case 'season_transition':
        return `A ventania da virada de estação começou! Toque para fechar as janelas da casa e proteger os suprimentos antes da chuva aumentar.`;
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

  const handleStartLocation = (locationId: LocationId = 'bridge') => {
    setSelectedLocation(locationId);
    setStage('location_scene');
  };

  const handleRestart = () => {
    setAllocation({ now: 4, protection: 4, future: 4 });
    setPredictionCards(['silo_care']);
    setPredictionText('');
    setCurrentSeason('Primavera');
    setSelectedLocation('bridge');
    setStage('map_overview');
  };

  const getLocationGoalText = (loc: LocationId) => {
    switch (loc) {
      case 'market': return "O Mercado e o Consumo Consciente";
      case 'workshop': return "A Oficina e a Manutenção Preventiva";
      case 'house': return "A Casa e o Alimento em Família";
      case 'silo': return "O Silo e a Reserva de Proteção";
      case 'field': return "A Horta e a Paciência do Tempo";
      case 'bridge': return "A Ponte e a Cooperação Comunitária";
      case 'woods': return "O Bosque e os Sonhos de Longo Prazo";
      default: return "A Ponte e o Vilarejo";
    }
  };

  return (
    <div className="app-container">
      <AmbientParticles season={currentSeason} />
      <MagicGlitterCursor onlyWelcome={stage === 'welcome'} />
      {stage !== 'welcome' && (
        <Header
          currentSeeds={Math.max(0, remainingFreeSeeds)}
          totalSeeds={totalSeeds}
          seasonText={`${currentSeason} • Ano 1`}
          goalText={getLocationGoalText(selectedLocation)}
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
            onStartRound={handleStartLocation}
            activeRoundTitle="Capítulo 1: A Ponte de Madeira e a Festa das Flores"
            onOpenJournal={() => setIsJournalOpen(true)}
          />
        )}

        {(stage === 'location_scene' || stage === 'bridge_inspection') && (
          <LocationSceneView
            locationId={selectedLocation}
            guardianName={guardianName}
            onProceedToDecision={() => setStage('prediction')}
            onBackToMap={() => setStage('map_overview')}
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
            key={selectedLocation}
            locationId={selectedLocation}
            onConfirmPrediction={(cards, customText) => {
              setPredictionCards(cards);
              setPredictionText(customText);
              setStage('seed_allocation');
            }}
            onBack={() => setStage('location_scene')}
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
          <StormInteractiveScene
            onContinue={() => setStage('consequence')}
          />
        )}

        {stage === 'consequence' && (
          <ConsequenceStage
            key={selectedLocation}
            locationId={selectedLocation}
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
          setCurrentSeason('Verão');
          setStage('transfer_challenge');
        }}
      />
    </div>
  );
}

export default App;
