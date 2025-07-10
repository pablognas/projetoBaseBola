// choose-teams.js

document.addEventListener('DOMContentLoaded', function() {
    const btnMandante = document.getElementById('btn-escolher-mandante');
    const btnVisitante = document.getElementById('btn-escolher-visitante');
    const btnVoltar = document.getElementById('btn-voltar-choose');

    btnMandante.addEventListener('click', function() {
        // Aqui você pode abrir um modal ou página para escolher o time da casa
        btnMandante.disabled = true;
        btnVisitante.disabled = false;
    });

    btnVisitante.addEventListener('click', function() {
        // Aqui você pode abrir um modal ou página para escolher o time visitante
        // Após escolher, redirecionar para o jogo
        window.location.href = 'index.html';
    });

    btnVoltar.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});
