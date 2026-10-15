# O Vale das Sementes 🌱

> **Jogo narrativo e educativo em 2D para navegador.**  
> A criança cuida de uma fazenda e de um pequeno vilarejo, toma decisões sobre recursos limitados (sementes), prevê consequências, enfrenta imprevistos e registra suas descobertas em um Diário de Bordo para aprender educação financeira prática, acolhedora e sem associar prosperidade a riqueza.

---

## 🌟 Pilares do Jogo

- **Metáfora das Sementes:** Recursos limitados (dinheiro, tempo, atenção e energia). Não é possível fazer tudo ao mesmo tempo, mas cada escolha consciente tem valor.
- **Definição de Prosperidade:** Prosperidade é autonomia, saber pedir ajuda, proteger o que importa e adaptar-se. Trabalhar para alguém, empreender, alugar, comprar ou ter uma vida simples são caminhos igualmente válidos.
- **O Silo como Proteção:** Reserva para emergências e imprevistos, ensinando que guardar cria tempo e liberdade de escolha.
- **Diário de Bordo do Explorador:** Caderno de reflexão pré e pós-decisão, com espaço para sentimentos, escrita e desenho em canvas, sem notas ou punições.
- **Justiça Pedagógica:** Separação entre o que estava sob controle da criança e o que foi acaso da natureza (ex: ventania). Sem humilhação ou julgamentos morais.
- **Acessibilidade Universal:** Narração em voz alta em português (Web Speech API), instrumentos suaves de câmara sintetizados (Web Audio API), botões de alto contraste e texto ampliado.

---

## 🎮 Estrutura do MVP (Etapa 1 Implementada)

1. **Tela de Boas-Vindas:** Identificação do Guardião e apresentação dos valores.
2. **Mapa do Vale (2D Storybook):** Casa, Campo/Fazenda, Mercado, Silo, Praça Comunitária e Bosque.
3. **Carta Narrativa (Capítulo 1):** *A Ponte de Madeira e a Festa das Flores* com a guia Dona Clara.
4. **Pausa de Reflexão (Previsão):** Cartões de previsão visual e escrita livre no Diário.
5. **Distribuição das 12 Sementes:** Cestos *Agora*, *Proteção (Silo)* e *Depois (Ponte)* com contador visual.
6. **Confirmação Gentil:** Revisão amigável da escolha antes de avançar.
7. **Passagem de Estação & O Imprevisto:** A ventania inesperada que soltou telhas da Casa.
8. **Consequência Explicada:** Explicação pedagógica do impacto da reserva do Silo sem julgamento.
9. **Diário de Bordo:** Registro com seleção de sentimentos e canvas para desenhos.
10. **Desafio de Transferência:** Aplicação dos mesmos princípios em uma nova estação (Verão na Horta Comunitária com 10 sementes).
11. **Encerramento da Rodada:** Mensagem de sabedoria e incentivo para novas tentativas.

---

## 🚀 Como Executar Localmente

No terminal, dentro da pasta do projeto:

```bash
# Instalar dependências (já instaladas)
npm install

# Iniciar servidor de desenvolvimento (Porta 5176)
npm run dev

# Acesse no navegador:
# http://127.0.0.1:5176 (ou http://localhost:5176)
npm run build
```
