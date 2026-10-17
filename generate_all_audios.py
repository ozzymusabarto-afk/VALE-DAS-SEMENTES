import asyncio
import os
import edge_tts

OUTPUT_DIR = os.path.join(os.getcwd(), 'public', 'audio', 'narration')
VOICE = 'pt-BR-AntonioNeural'
RATE = '-12%'   # Ritmo sereno e pausado de vovô amoroso
PITCH = '-5Hz'  # Timbre maduro, caloroso e sereno

AUDIO_SCRIPTS = {
    # 1. Demonstração / Teste
    'teste-narrador.mp3': 
        'Olá, guardião. Vamos caminhar com calma pelo Vale. Cada semente que você cuida pode ajudar a construir uma escolha mais tranquila.',

    # 2. Fases Principais do Jogo
    'map_overview.mp3':
        'Você está no mapa do Vale das Sementes. Aqui você pode explorar a Casa, o Campo, o Mercado, o Silo da Reserva e a Praça Comunitária. Clique em Cuidar do Vale para começar a aventura!',

    'location_scene.mp3':
        'Investigação no Vale! Toque nos elementos da cena para descobrir informações, converse com os moradores e veja todas as opções antes de distribuir suas sementes.',

    'narrative_card.mp3':
        'Olá, Guardião! A primavera chegou ao Vale das Sementes. A velha ponte de madeira que liga nossas casas ao Mercado precisa de reforço antes da temporada de tempestades. Ao mesmo tempo, teremos a comemoração da estação na Praça e precisamos manter a comida da casa em ordem. Você recebeu doze sementes para esta estação. Antes de distribuir seus recursos, vamos reservar um instante para pensar no que pode acontecer.',

    'prediction.mp3':
        'Hora da previsão! O que você acha que pode acontecer antes de distribuir as sementes? Pense com carinho: reservar sementes no Silo ajuda a ter opções se chover forte.',

    'seed_allocation.mp3':
        'Distribua suas doze sementes entre Agora para a casa e festa, Proteção no Silo para imprevistos, e Depois para o conserto da ponte.',

    'seed_allocation_instructions.mp3':
        'Você tem doze sementes douradas para distribuir. Arraste ou toque nas sementes para colocar nas três cestas: Agora para viver o presente, Proteção no Silo para os imprevistos, e Depois para plantar um plano de futuro.',

    'season_transition.mp3':
        'A ventania da virada de estação começou! Toque para fechar as janelas da casa e proteger os suprimentos antes da chuva aumentar.',

    'storm_alert.mp3':
        'Atenção no Vale! A ventania da virada de estação chegou com nuvens carregadas e chuva forte. Toque no botão para trancar as janelas da casa e proteger a colheita antes que o vento aumente!',

    'consequence.mp3':
        'Compreendendo o resultado: O vento soprou e soltou algumas telhas. Você não podia controlar o vento, mas sua preparação fez toda a diferença.',

    'consequence_protected.mp3':
        'Excelente decisão de proteção! Graças às sementes guardadas no Silo, os reparos foram feitos com tranquilidade e a comunidade permaneceu segura e confiante.',

    'consequence_learning.mp3':
        'Toda escolha traz um aprendizado valioso. Quando os imprevistos chegam, ter uma reserva no Silo faz falta, mas agora sabemos como nos preparar ainda melhor na próxima estação.',

    'introducao_diario.mp3':
        'Diário de Bordo do Vale. Aqui ficam guardadas suas memórias, previsões e reflexões de cada estação. Consultar o diário ajuda a perceber quanto você já aprendeu.',

    # 3. Metas e Apresentação dos Locais
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

    # 4. Falas de Introdução das Cenas dos Moradores
    'intro_scene_market.mp3':
        'Raposa Comerciante diz: Olá, Guardião! Tudo nesta banca parece delicioso e urgente. Mas uma semente bem pensada compra o que realmente alimenta nossa família. Compare as cestas antes de decidir!',

    'intro_scene_workshop.mp3':
        'Mestre Tomás diz: Olá, Guardião! Bem-vindo à oficina! Quem cuida da ferramenta hoje, não precisa parar o trabalho amanhã. Consertar antes de quebrar de vez é a forma mais sábia de poupar sementes!',

    'intro_scene_house.mp3':
        'A Família Guardiã diz: Olá, Guardião! A casa é o nosso refúgio. Usar parte das sementes no presente para viver com saúde, afeto e dignidade não é desperdício: é a própria razão pela qual nós trabalhamos!',

    'intro_scene_silo.mp3':
        'O Guardião do Silo diz: Olá, Guardião! O Silo não serve para nos tornar mais ricos que os vizinhos. Ele serve para comprar tempo e liberdade de escolha quando o clima do mundo mudar!',

    'intro_scene_field.mp3':
        'Professor Cornélio diz: Olá, Guardião! Na horta, não adianta puxar a folha para ela crescer mais rápido. Cada semente tem seu tempo, e a dedicação diária é o maior segredo da verdadeira colheita!',

    'intro_scene_bridge.mp3':
        'Dona Clara diz: Olá, Guardião! A ponte ainda aguenta nossos passos, mas as chuvas da virada de estação costumam ser imprevisíveis. Cuidar dela agora garante que o mercado continue acessível para todos!',

    'intro_scene_woods.mp3':
        'A Guia dos Caminhos diz: Olá, Guardião! O bosque nos ensina a olhar longe. Uma semente plantada para o longo prazo precisa de raízes fundas e constância, mesmo quando ninguém está olhando!',

    # 5. Previsões de Cada Local
    'pred_market.mp3':
        'Hora da previsão no Mercado da Raposa! Antes de gastar ou guardar suas sementes na feira, o que você acha mais sábio fazer? Escolha as ideias que combinam com seu plano!',

    'pred_workshop.mp3':
        'Hora da previsão na Oficina de Ferramentas! Como você planeja cuidar das ferramentas da fazenda para não passar apuros?',

    'pred_house.mp3':
        'Hora da previsão na Casa da Fazenda! O que suas sementes devem garantir para trazer paz e saúde à sua família?',

    'pred_silo.mp3':
        'Hora da previsão no Silo da Reserva! Quanto de segurança você deseja construir para enfrentar as surpresas da natureza?',

    'pred_field.mp3':
        'Hora da previsão na Horta de Cornélio! Como distribuir suas sementes para respeitar o tempo das colheitas futuras?',

    'pred_bridge.mp3':
        'Hora da previsão na Ponte de Madeira! Como você planeja colaborar com a travessia comunitária e com a festa do vilarejo?',

    'pred_woods.mp3':
        'Hora da previsão no Bosque das Montanhas! Que sonhos de longo prazo você quer semear para o futuro do Vale?',

    # 6. Consequências de Cada Local (Positivo e Aprendizado)
    'csq_market_pos.mp3':
        'Parabéns! No Mercado da Raposa, você comprou o que era necessário e manteve uma reserva segura no Silo.',

    'csq_market_lea.mp3':
        'No Mercado, muitas coisas chamavam a atenção. O importante agora é refletir no Diário sobre o que foi essencial e o que pode esperar.',

    'csq_workshop_pos.mp3':
        'Excelente! Suas ferramentas estão prontas e a fazenda tem reserva para qualquer peça de reposição.',

    'csq_workshop_lea.mp3':
        'Na Oficina, vimos que ferramentas quebram sem avisar. Da próxima vez, podemos guardar um pouco mais no Silo para manutenção.',

    'csq_house_pos.mp3':
        'Maravilhoso! A despensa da casa está cheia e a família protegida com tranquilidade e conforto.',

    'csq_house_lea.mp3':
        'A casa precisou de reparos extras. Ter uma reserva no Silo ajuda a manter o equilíbrio sem sustos.',

    'csq_silo_pos.mp3':
        'Sensacional! O Silo da Reserva cumpriu seu papel e garantiu a segurança de todos no Vale.',

    'csq_silo_lea.mp3':
        'O Silo precisava de mais suprimentos. Essa lição vai ajudar a planejar a próxima estação com mais proteção.',

    'csq_field_pos.mp3':
        'Que colheita abençoada! A paciência do tempo trouxe brotos viçosos e fartura para a comunidade.',

    'csq_field_lea.mp3':
        'A terra pede tempo e cuidado contínuo. Com sementes guardadas, podemos esperar a colheita sem afobação.',

    'csq_bridge_pos.mp3':
        'A ponte ficou firme e segura! A festa das flores pôde acontecer com alegria e cooperação.',

    'csq_bridge_lea.mp3':
        'O vento abalou a ponte de madeira. Na próxima estação, reforçaremos o Silo para apoiar as obras comunitárias.',

    'csq_woods_pos.mp3':
        'Que visão magnífica do alto do Bosque! Seus sonhos de longo prazo ganharam raízes fortes.',

    'csq_woods_lea.mp3':
        'O mirante nos mostrou o valor da constância. Vamos registrar no Diário nossas metas para o futuro!',

    # 7. Diálogos Explicativos dos Moradores
    'diag_market_q1.mp3':
        'Raposa Comerciante explica: Necessidades são coisas essenciais para nossa saúde e segurança, como comida e teto. Desejos são coisas prazerosas, mas que podemos adiar sem colocar em risco a família!',

    'diag_market_q2.mp3':
        'Raposa Comerciante explica: Muitas vezes as placas dizem só hoje para nos deixar apressados. Mas o verdadeiro Guardião respira fundo e pergunta o preço total antes de gastar suas sementes.',

    'diag_market_q3.mp3':
        'Raposa Comerciante explica: Quando não gastamos tudo por impulso, sobram sementes no Silo para quando o inverno ou um imprevisto chegar.',

    'diag_workshop_q1.mp3':
        'Mestre Tomás explica: Quase sempre o conserto a tempo custa apenas uma fração de um objeto novo. Cuidar do que temos é uma das maiores fontes de autonomia financeira.',

    'diag_workshop_q2.mp3':
        'Mestre Tomás explica: Uma telha frouxa derruba o telhado; uma lâmina cega quebra o cabo. Prevenir imprevistos é agir antes que a emergência aconteça.',

    'diag_workshop_q3.mp3':
        'Mestre Tomás explica: Quem sabe consertar, plantar ou construir oferece ajuda útil para toda a comunidade e sempre encontra formas dignas de trabalhar.',

    'diag_house_q1.mp3':
        'A Família Guardiã explica: Poupar não significa passar necessidade ou abrir mão de tudo. Uma parte dos recursos deve cuidar do nosso bem-estar, refeições e saúde agora.',

    'diag_house_q2.mp3':
        'A Família Guardiã explica: Pagar as trocas combinadas na data certa cria confiança no vilarejo e impede que as dívidas cresçam como ervas daninhas.',

    'diag_house_q3.mp3':
        'A Família Guardiã explica: Prosperidade não é ter luxos caros, e sim saber que a despensa tem comida, a casa está protegida e há serenidade entre as pessoas que amamos.',

    'diag_silo_q1.mp3':
        'O Guardião do Silo explica: Quem guarda para ostentar quer ser maior que os outros. Quem guarda para proteção quer ter segurança para si e capacidade de amparar os outros quando a tempestade passar.',

    'diag_silo_q2.mp3':
        'O Guardião do Silo explica: Sem reserva, qualquer chuva forte nos obriga a vender ferramentas ou passar fome. O Silo nos dá tempo para pensar e agir sem desespero.',

    'diag_silo_q3.mp3':
        'O Guardião do Silo explica: Quando você tem sementes guardadas, você não aceita ofertas enganosas nem precisa aceitar condições abusivas por desespero.',

    'diag_field_q1.mp3':
        'Professor Cornélio explica: Promessas de crescimento rápido e milagroso costumam ser armadilhas. Coisas sólidas pedem constância, cuidado e respeito às estações.',

    'diag_field_q2.mp3':
        'Professor Cornélio explica: Se colhermos a muda pequenininha, comemos hoje mas ficamos sem nada amanhã. Saber esperar o tempo de maturação multiplica o valor das sementes.',

    'diag_field_q3.mp3':
        'Professor Cornélio explica: Colocar uma única semente no Silo com frequência constrói uma reserva monumental ao longo do ano, sem exigir sacrifícios pesados.',

    'diag_bridge_q1.mp3':
        'Dona Clara explica: A natureza nunca dá certeza absoluta. Pode ser apenas uma garoa passageira, ou uma ventania com cheia do rio. Por isso quem guarda uma reserva no Silo não precisa tentar adivinhar o futuro: fica tranquilo de qualquer jeito!',

    'diag_bridge_q2.mp3':
        'Dona Clara explica: Com três a quatro sementes reservadas para o Depois, conseguimos vigas de carvalho firmes com o Mestre Tomás na Oficina. Se a ponte ruir de vez, custará mais que o dobro para reconstruir!',

    'diag_bridge_q3.mp3':
        'Dona Clara explica: O Silo é a proteção do Vale. Se o vento soltar telhas da casa ou se a colheita atrasar, ter sementes no Silo nos dá tempo e calma para consertar as coisas sem precisar passar aperto ou tirar comida da mesa.',

    'diag_woods_q1.mp3':
        'A Guia dos Caminhos explica: Aprender uma profissão, reflorestar uma colina ou construir uma casa firme leva tempo. Se desistirmos no primeiro mês, nunca veremos a copa da árvore florescer.',

    'diag_woods_q2.mp3':
        'A Guia dos Caminhos explica: Você não precisa guardar todas as suas sementes para o futuro distante. Guardar três ou quatro sementes por estação é suficiente para transformar a sua vida ao longo dos anos.',

    'diag_woods_q3.mp3':
        'A Guia dos Caminhos explica: Olhe para trás e veja o quanto você já aprendeu e cuidou. A jornada com propósito é tão bela quanto o topo da montanha!'
}

async def generate_file(filename: str, text: str):
    target_path = os.path.join(OUTPUT_DIR, filename)
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        print(f"[JA EXISTE] {filename}")
        return
    print(f"Gerando: {filename}...")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
    await communicate.save(target_path)
    print(f"[OK] Concluido: {filename} ({os.path.getsize(target_path)} bytes)")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"Iniciando geracao do pacote completo de audio do Vovo Narrador ({len(AUDIO_SCRIPTS)} audios)...")
    for filename, text in AUDIO_SCRIPTS.items():
        await generate_file(filename, text)
    print("Pacote completo gerado com sucesso!")

if __name__ == '__main__':
    asyncio.run(main())
