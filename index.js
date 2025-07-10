// pre-game.js

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('btn-editar-times').addEventListener('click', function() {
        window.location.href = 'edit-teams.html';
    });
    document.getElementById('btn-comecar-jogo').addEventListener('click', function() {
        window.location.href = 'choose-teams.html';
    });
});
