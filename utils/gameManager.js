const fs = require('fs');
const path = './data/scores.json';

let gameRunning = false;
let currentRound = 0;
const maxRounds = 10;

let currentWord = '';
let winnerId = null;

const words = [...Array(200).keys()].map(i => 'كلمة' + (i + 1)); // مختصر لكلمات كثيرة

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function loadScores() {
  if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');
  return JSON.parse(fs.readFileSync(path));
}

function saveScores(scores) {
  fs.writeFileSync(path, JSON.stringify(scores, null, 2));
}

module.exports = {
  isRunning: () => gameRunning,
  startGame: () => {
    gameRunning = true;
    currentRound = 0;
  },
  stopGame: () => {
    gameRunning = false;
  },
  nextRound: () => {
    currentRound++;
    currentWord = getRandomWord();
    winnerId = null;
    return currentWord;
  },
  isGameOver: () => currentRound >= maxRounds,
  getRound: () => currentRound,
  setWinner: (id) => {
    winnerId = id;
    const scores = loadScores();
    scores[id] = (scores[id] || 0) + 1;
    saveScores(scores);
  },
  getScores: () => loadScores(),
  getWinner: () => winnerId,
  clearWinner: () => { winnerId = null; }
};