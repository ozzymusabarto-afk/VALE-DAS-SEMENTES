import asyncio
import os
import edge_tts

OUTPUT_DIR = os.path.join(os.getcwd(), 'public', 'audio', 'narration')
VOICE = 'pt-BR-AntonioNeural'
RATE = '-12%'   # Ritmo sereno e pausado de vovô amoroso
PITCH = '-5Hz'  # Timbre maduro, caloroso e sereno

AUDIO_SCRIPTS = {
    'teste-narrador.mp3': 
        'Olá, guardião. Vamos caminhar com calma pelo Vale. Cada semente que você cuida pode ajudar a construir uma escolha mais tranquila.',

    'map_overview.mp3':
        'Você está no mapa do Vale das Sementes. Aqui você pode explorar a Casa, o Campo, o Mercado, o Silo da Reserva e a Praça Comunitária. Clique em Cuidar do Vale para começar a aventura!',

    'location_scene.mp3':
        'Investigação no Vale! Toque nos elementos da cena para descobrir informações, converse com os moradores e veja todas as opções antes de distribuir suas sementes.',

    'narrative_card.mp3':
        'A Ponte de Madeira e a Festa das Flores. Olá, Guardião! A primavera chegou ao Vale. A ponte precisa de reforço e teremos a festa na praça. Você tem doze sementes para cuidar desta estação.',

    'prediction.mp3':
        'Hora da previsão! O que você acha que pode acontecer antes de distribuir as sementes? Pense com carinho: reservar sementes no Silo ajuda a ter opções se chover forte.',

    'seed_allocation.mp3':
        'Distribua suas doze sementes entre Agora para a casa e festa, Proteção no Silo para imprevistos, e Depois para o conserto da ponte.',

    'season_transition.mp3':
        'A ventania da virada de estação começou! Toque para fechar as janelas da casa e proteger os suprimentos antes da chuva aumentar.',

    'consequence.mp3':
        'Compreendendo o resultado: O vento soprou e soltou algumas telhas. Você não podia controlar o vento, mas sua preparação fez toda a diferença.',

    'consequence_protected.mp3':
        'Excelente decisão de proteção! Graças às sementes guardadas no Silo, os reparos foram feitos com tranquilidade e a comunidade permaneceu segura e confiante.',

    'consequence_learning.mp3':
        'Toda escolha traz um aprendizado valioso. Quando os imprevistos chegam, ter uma reserva no Silo faz falta, mas agora sabemos como nos preparar ainda melhor na próxima estação.',

    'loc_bridge.mp3':
        'A Ponte de Madeira e a Festa das Flores. A ponte é o caminho que une o vilarejo. Com cooperação e planejamento cuidadoso, todos atravessam em segurança.',

    'loc_market.mp3':
        'O Mercado da Raposa. No mercado, encontramos muitas coisas tentadoras. O segredo é comparar necessidades e desejos com sabedoria e calma.',

    'loc_workshop.mp3':
        'A Oficina de Tomás. Cuidar e fazer a manutenção preventiva das ferramentas poupa muito mais esforço e sementes do que consertar quando tudo já quebrou.',

    'loc_house.mp3':
        'A Casa da Fazenda. O bem-estar da família e o alimento de cada dia vêm em primeiro lugar. Cuidar da casa é o alicerce de todas as nossas conquistas.',

    'loc_silo.mp3':
        'O Silo da Reserva. Guardar sementes quando o tempo está bom é o que traz paz e tranquilidade quando chegam as tempestades imprevistas.',

    'loc_field.mp3':
        'A Horta de Cornélio. Cada semente precisa de tempo, água e paciência para germinar e crescer. Respeitar o tempo é a maior sabedoria do agricultor.',

    'loc_woods.mp3':
        'O Bosque das Montanhas. Olhar para o horizonte nos ajuda a sonhar a longo prazo. Projetos grandes começam com pequenos passos diários.',
        
    'introducao_diario.mp3':
        'Diário de Bordo do Vale. Aqui ficam guardadas suas memórias, previsões e reflexões de cada estação. Consultar o diário ajuda a perceber quanto você já aprendeu.'
}

async def generate_file(filename: str, text: str):
    target_path = os.path.join(OUTPUT_DIR, filename)
    print(f"Gerando: {filename}...")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
    await communicate.save(target_path)
    print(f"[OK] Concluido: {filename} ({os.path.getsize(target_path)} bytes)")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Iniciando síntese de áudio do Vovô Narrador usando {VOICE}...")
    for filename, text in AUDIO_SCRIPTS.items():
        await generate_file(filename, text)
    print("Todos os áudios foram gerados com sucesso!")

if __name__ == '__main__':
    asyncio.run(main())
