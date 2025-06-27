document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const grid = document.getElementById('grid');
    const messageEl = document.getElementById('message');
    const currentPlayerEl = document.getElementById('current-player');
    const noSwingBtn = document.getElementById('no-swing');
    const scoreEl = document.getElementById('score');
    
    // Estado do jogo
    let downInning = false; // 'away' ou 'home'
    let gameState = 'pitching'; // 'pitching' ou 'batting'
    let pitcherChoice = null;
    let scores = { innings: 0, away:0, home: 0, strikes: 0, balls: 0, batter: 0, outs: 0 };
    
    // Criar o grid 5x5
    function createGrid() {
        grid.innerHTML = '';
        
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                // Marcar a zona de strike (3x3 central)
                if (row >= 1 && row <= 3 && col >= 1 && col <= 3) {
                    cell.classList.add('strike-zone');
                }
                
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', handleCellClick);
                grid.appendChild(cell);
            }
        }
    }
    
    // Manipulador de clique nas células
    function handleCellClick(e) {
        const row = parseInt(e.target.dataset.row);
        const col = parseInt(e.target.dataset.col);
        
        if (gameState === 'pitching') {
            // Lançador escolhe a posição
            pitcherChoice = { row, col };
            messageEl.textContent = `Bola Lançada. Rebatedor: escolha onde rebater.`;
            currentPlayerEl.textContent = 'Time do Rebatedor';
            gameState = 'batting';
            document.getElementById('no-swing').removeAttribute('disabled');
            
            
            // Destacar a escolha do lançador
            clearHighlights();
            //e.target.style.backgroundColor = '#aaffaa';
        } else if (gameState === 'batting') {
            // Rebatedor escolhe a posição
            
            if (row === pitcherChoice.row && col === pitcherChoice.col) {
                // Acertou a rebatida
                messageEl.textContent = `REBATIDA! Ponto para o rebatedor!`;
                scores.batter++;
                e.target.style.backgroundColor = '#aaffaa';
                
            } else {
                messageEl.textContent = `STRIKE! Ponto para o lançador!`;
                scores.strikes++;
                e.target.style.backgroundColor = '#ffff00';
            }
            updateScore();       
            setTimeout(resetRound, 750);
        }
    }
    
    // Botão "Não Rebater"
    noSwingBtn.addEventListener('click', function() {
        if (gameState === 'batting') {
            const isStrike = (pitcherChoice.row >= 1 && pitcherChoice.row <= 3 && 
                             pitcherChoice.col >= 1 && pitcherChoice.col <= 3);
            
            if (isStrike) {
                messageEl.textContent = `STRIKE! Ponto para o lançador!`;
                scores.pitcher++;
                e.target.style.backgroundColor = '#ffff00';
            } else {
                messageEl.textContent = `BOLA! Ninguém pontua.`;
                scores.balls++;
            }
            
            updateScore();
            setTimeout(resetRound, 750);
        }
    });
    
    // Limpar destaques das células
    function clearHighlights() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
            if (cell.classList.contains('strike-zone')) {
                cell.style.backgroundColor = '#ffcccc';
            } else {
                cell.style.backgroundColor = '#f0f0f0';
            }
        });
    }
    
    // Atualizar placar
    function updateScore() {
        
        if (scores.strikes >= 3) {
            scores.outs++;
            scores.strikes = 0;
            scores.balls = 0;
            messageEl.textContent = `3 Strikes! Rebatedor eliminado.`;
            if (scores.outs >= 3) {
                scores.outs = 0;
                scores.batter = 0;
                downInning = !downInning; // Trocar time
                messageEl.textContent += ` Turnover. Próximo time: ${downInning ? 'Home' : 'Away'}`;
                if (!downInning) {
                    scores.innings++;
                }
            }
        }
        if (scores.balls > 3){
            scores.balls = 0;
            scores.strikes = 0;
            messageEl.textContent += ` 4 Balls! Rebatedor avança para a primeira base.`;
            scores.batter++;
        }
        if (scores.batter > 3){
            scores.batter--;
            if (downInning){
                scores.home++;
                messageEl.textContent += ` Time da casa marcou um ponto!`;
            }
            else {
                scores.away++;
                messageEl.textContent += ` Time visitante marcou um ponto!`;
            }
        }
        
        scoreEl.textContent = `Home: ${scores.home} - Away: ${scores.away} | Inning: ${scores.innings} ${downInning? '\\/': '/\\'} | Strikes: ${scores.strikes} | Balls: ${scores.balls} | Outs: ${scores.outs} | Bases: ${scores.batter}`;
    }
    
    // Reiniciar o round
    function resetRound() {
        gameState = 'pitching';
        pitcherChoice = null;
        currentPlayerEl.textContent = 'Time do Lançador';
        messageEl.textContent = 'Lançador: escolha onde lançar a bola';
        document.getElementById('no-swing').setAttribute('disabled', 'true');
        clearHighlights();
    }
    
    // Inicializar o jogo
    createGrid();
    updateScore();
});