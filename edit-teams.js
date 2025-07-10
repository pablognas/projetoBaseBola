// edit-teams.js


// Estrutura dos dados dos times e jogadores
// times = [{ name: 'Time A', players: [{ name, lancamento, rebatida, captura }] }, ...]
// times ficam salvos no localStorage e podem ser reutilizados em qualquer sessão
let times = JSON.parse(localStorage.getItem('times') || '[]');

// Função para exportar times para um arquivo JSON
function exportarTimes() {
    const blob = new Blob([JSON.stringify(times, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'times_baseball.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Função para importar times de um arquivo JSON
function importarTimes(arquivo, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            if (Array.isArray(dados)) {
                times = dados;
                saveTimes();
                alert('Times importados com sucesso!');
                if (callback) callback();
            } else {
                alert('Arquivo inválido.');
            }
        } catch {
            alert('Erro ao ler arquivo.');
        }
    };
    reader.readAsText(arquivo);
}

function saveTimes() {
    localStorage.setItem('times', JSON.stringify(times));
}

function atualizarTimesDropdown(dropdown) {
    dropdown.innerHTML = '';
    times.forEach((t, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = t.name;
        dropdown.appendChild(opt);
    });
}

function atualizarJogadoresDropdown(dropdown, timeIdx) {
    dropdown.innerHTML = '';
    if (times[timeIdx]) {
        times[timeIdx].players.forEach((p, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = p.name;
            dropdown.appendChild(opt);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-voltar-edit').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Botão para exportar times
    let btnExport = document.createElement('button');
    btnExport.textContent = 'Exportar Times';
    btnExport.className = 'button';
    btnExport.onclick = exportarTimes;
    document.querySelector('#edit-teams > div').appendChild(btnExport);

    // Botão para importar times
    let btnImport = document.createElement('button');
    btnImport.textContent = 'Importar Times';
    btnImport.className = 'button';
    btnImport.onclick = function() {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,application/json';
        input.onchange = function(e) {
            if (e.target.files.length > 0) {
                importarTimes(e.target.files[0]);
            }
        };
        input.click();
    };
    document.querySelector('#edit-teams > div').appendChild(btnImport);

    // Botão para adicionar time
    let btnAddTime = document.createElement('button');
    btnAddTime.textContent = 'Adicionar Time';
    btnAddTime.className = 'button';
    btnAddTime.onclick = function() {
        const nome = prompt('Digite o nome do novo time:');
        if (nome && nome.trim()) {
            times.push({ name: nome.trim(), players: [] });
            saveTimes();
            alert('Time criado!');
        }
    };
    document.querySelector('#edit-teams > div').appendChild(btnAddTime);

    // Criar time (atalho antigo, pode ser removido se quiser)
    document.getElementById('btn-editar-nome-time').addEventListener('click', function() {
        const nome = prompt('Digite o nome do novo time:');
        if (nome && nome.trim()) {
            times.push({ name: nome.trim(), players: [] });
            saveTimes();
            alert('Time criado!');
        }
    });

    // Adicionar jogador
    document.getElementById('btn-adicionar-jogador').addEventListener('click', function() {
        if (times.length === 0) {
            alert('Crie um time antes de adicionar jogadores!');
            return;
        }
        const timeIdx = prompt('Digite o número do time para adicionar jogador (0 para o primeiro, 1 para o segundo, etc):\n' + times.map((t, i) => `${i}: ${t.name}`).join('\n'));
        if (timeIdx === null || isNaN(timeIdx) || !times[timeIdx]) return;
        const nome = prompt('Nome do jogador:');
        if (!nome || !nome.trim()) return;
        const lancamento = Math.floor(Math.random() * 99) + 1;
        const rebatida = Math.floor(Math.random() * 99) + 1;
        const captura = Math.floor(Math.random() * 99) + 1;
        times[timeIdx].players.push({ name: nome.trim(), lancamento, rebatida, captura });
        saveTimes();
        alert(`Jogador criado!\nLançamento: ${lancamento}\nRebatida: ${rebatida}\nCaptura: ${captura}`);
    });

    // Editar jogador
    document.getElementById('btn-editar-jogador').addEventListener('click', function() {
        if (times.length === 0) {
            alert('Nenhum time cadastrado!');
            return;
        }
        // Dropdown de times
        const timeIdx = prompt('Escolha o time para editar jogador (0 para o primeiro, 1 para o segundo, etc):\n' + times.map((t, i) => `${i}: ${t.name}`).join('\n'));
        if (timeIdx === null || isNaN(timeIdx) || !times[timeIdx]) return;
        if (times[timeIdx].players.length === 0) {
            alert('Este time não possui jogadores!');
            return;
        }
        // Dropdown de jogadores
        const jogIdx = prompt('Escolha o jogador para editar (0 para o primeiro, 1 para o segundo, etc):\n' + times[timeIdx].players.map((p, i) => `${i}: ${p.name}`).join('\n'));
        if (jogIdx === null || isNaN(jogIdx) || !times[timeIdx].players[jogIdx]) return;
        const jogador = times[timeIdx].players[jogIdx];
        const lancamento = prompt(`Novo valor de Lançamento (atual: ${jogador.lancamento}):`, jogador.lancamento);
        const rebatida = prompt(`Novo valor de Rebatida (atual: ${jogador.rebatida}):`, jogador.rebatida);
        const captura = prompt(`Novo valor de Captura (atual: ${jogador.captura}):`, jogador.captura);
        if (lancamento && rebatida && captura) {
            jogador.lancamento = parseInt(lancamento);
            jogador.rebatida = parseInt(rebatida);
            jogador.captura = parseInt(captura);
            saveTimes();
            alert('Jogador alterado!');
        }
    });

    // Excluir jogador
    document.getElementById('btn-excluir-jogador').addEventListener('click', function() {
        if (times.length === 0) {
            alert('Nenhum time cadastrado!');
            return;
        }
        // Dropdown de times
        const timeIdx = prompt('Escolha o time para excluir jogador (0 para o primeiro, 1 para o segundo, etc):\n' + times.map((t, i) => `${i}: ${t.name}`).join('\n'));
        if (timeIdx === null || isNaN(timeIdx) || !times[timeIdx]) return;
        if (times[timeIdx].players.length === 0) {
            alert('Este time não possui jogadores!');
            return;
        }
        // Dropdown de jogadores
        const jogIdx = prompt('Escolha o jogador para excluir (0 para o primeiro, 1 para o segundo, etc):\n' + times[timeIdx].players.map((p, i) => `${i}: ${p.name}`).join('\n'));
        if (jogIdx === null || isNaN(jogIdx) || !times[timeIdx].players[jogIdx]) return;
        if (confirm(`Tem certeza que deseja excluir o jogador ${times[timeIdx].players[jogIdx].name}?`)) {
            times[timeIdx].players.splice(jogIdx, 1);
            saveTimes();
            alert('Jogador excluído!');
        }
    });
});
