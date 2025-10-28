const palette = [
  {
    name: 'Coral Nebuloso',
    gradient: ['#ff6f91', '#ff9671'],
  },
  {
    name: 'Menta Glacial',
    gradient: ['#00c9a7', '#92fe9d'],
  },
  {
    name: 'Aurora Índigo',
    gradient: ['#6a11cb', '#2575fc'],
  },
  {
    name: 'Solar Mango',
    gradient: ['#f7971e', '#ffd200'],
  },
  {
    name: 'Galaxia Frambuesa',
    gradient: ['#ff4b2b', '#ff416c'],
  },
  {
    name: 'Oceáno Boreal',
    gradient: ['#2bc0e4', '#eaecc6'],
  },
  {
    name: 'Violeta Prisma',
    gradient: ['#7f00ff', '#e100ff'],
  },
  {
    name: 'Lima Eléctrica',
    gradient: ['#a8ff78', '#78ffd6'],
  },
  {
    name: 'Amanecer Candy',
    gradient: ['#fcb045', '#fd1d1d'],
  },
];

const praiseMessages = [
  '¡Brillo total!',
  '¡Combo reluciente!',
  '¡Reflejos de campeón!',
  '¡Ritmo perfecto!',
  '¡Sigues encendido!',
];

const missMessages = [
  'Casi lo tienes, sigue intentando.',
  'Respira hondo y vuelve al ritmo.',
  'El color escapó, pero no por mucho tiempo.',
  'Sacude el polvo, la aurora te espera.',
];

const state = {
  active: false,
  targetIndex: null,
  score: 0,
  timeLeft: 30,
  streak: 0,
};

let countdownId = null;
let roundTimeoutId = null;

document.addEventListener('DOMContentLoaded', () => {
  const tilesGrid = document.getElementById('tilesGrid');
  const startButton = document.getElementById('startButton');
  const targetName = document.getElementById('targetName');
  const scoreValue = document.getElementById('score');
  const timeValue = document.getElementById('time');
  const streakValue = document.getElementById('streak');
  const statusMessage = document.getElementById('statusMessage');
  const confettiContainer = document.getElementById('confettiContainer');

  const tiles = palette.map((color, index) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'color-tile';
    tile.dataset.name = color.name;
    tile.dataset.index = index;
    tile.disabled = true;
    const gradient = `linear-gradient(135deg, ${color.gradient[0]}, ${color.gradient[1]})`;
    tile.style.setProperty('--tile-gradient', gradient);

    tile.addEventListener('click', () => handleSelection(index));
    tilesGrid.appendChild(tile);
    return tile;
  });

  startButton.addEventListener('click', startGame);

  function startGame() {
    if (countdownId) {
      clearInterval(countdownId);
      countdownId = null;
    }
    if (roundTimeoutId) {
      clearTimeout(roundTimeoutId);
      roundTimeoutId = null;
    }

    state.active = true;
    state.score = 0;
    state.timeLeft = 30;
    state.streak = 0;
    state.targetIndex = null;

    startButton.textContent = 'Reiniciar';
    statusMessage.textContent = '¡Atrapa los colores brillantes y encadena combos!';
    statusMessage.className = 'status-message highlight';

    updateDashboard();
    setTargetName('Pulsa en el brillo correcto', '#ffffff', 'rgba(255,255,255,0.35)');

    tiles.forEach(tile => {
      tile.disabled = false;
      tile.classList.remove('is-target', 'correct', 'wrong');
    });

    nextRound(150);
    countdownId = setInterval(() => {
      state.timeLeft -= 1;
      timeValue.textContent = state.timeLeft;
      if (state.timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function nextRound(delay = 0) {
    if (roundTimeoutId) {
      clearTimeout(roundTimeoutId);
    }

    roundTimeoutId = setTimeout(() => {
      const previousIndex = state.targetIndex;
      if (previousIndex !== null) {
        tiles[previousIndex].classList.remove('is-target');
      }

      let newIndex = Math.floor(Math.random() * palette.length);
      if (palette.length > 1) {
        while (newIndex === previousIndex) {
          newIndex = Math.floor(Math.random() * palette.length);
        }
      }

      state.targetIndex = newIndex;
      const color = palette[newIndex];
      tiles[newIndex].classList.add('is-target');

      const accent = color.gradient[1];
      const glow = `${color.gradient[0]}88`;
      setTargetName(color.name, accent, glow);
    }, delay);
  }

  function handleSelection(index) {
    if (!state.active) return;

    const tile = tiles[index];
    if (index === state.targetIndex) {
      state.streak += 1;
      const basePoints = 20;
      const bonus = Math.max(0, state.streak - 1) * 5;
      state.score += basePoints + bonus;
      updateDashboard();

      tile.classList.remove('wrong');
      tile.classList.add('correct');
      setTimeout(() => tile.classList.remove('correct'), 450);

      const celebration = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
      statusMessage.textContent = `${celebration} +${basePoints + bonus} pts`;
      statusMessage.className = 'status-message highlight';

      nextRound(260);
    } else {
      state.streak = 0;
      state.score = Math.max(0, state.score - 10);
      updateDashboard();

      tile.classList.remove('correct');
      tile.classList.add('wrong');
      setTimeout(() => tile.classList.remove('wrong'), 550);

      const encouragement = missMessages[Math.floor(Math.random() * missMessages.length)];
      statusMessage.textContent = encouragement;
      statusMessage.className = 'status-message muted';

      if (navigator.vibrate) {
        navigator.vibrate(40);
      }
    }
  }

  function endGame() {
    state.active = false;
    clearInterval(countdownId);
    countdownId = null;
    clearTimeout(roundTimeoutId);
    roundTimeoutId = null;

    tiles.forEach(tile => {
      tile.disabled = true;
      tile.classList.remove('is-target');
    });

    const finalMessage = state.score >= 200
      ? '¡Aurora épica! Tu puntaje fue ' + state.score
      : 'Tiempo agotado. Puntaje final: ' + state.score;

    statusMessage.textContent = finalMessage;
    statusMessage.className = 'status-message highlight';
    setTargetName('Juego terminado', '#ffffff', 'rgba(255,255,255,0.25)');
    timeValue.textContent = '0';

    if (state.score >= 200) {
      launchConfetti();
    }
  }

  function updateDashboard() {
    scoreValue.textContent = state.score;
    timeValue.textContent = state.timeLeft;
    streakValue.textContent = state.streak;
  }

  function setTargetName(text, color, glow) {
    targetName.textContent = text;
    targetName.style.color = color;
    targetName.style.textShadow = `0 0 18px ${glow}`;
  }

  function launchConfetti() {
    const pieces = 28;
    for (let i = 0; i < pieces; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = randomGradientColor();
      piece.style.setProperty('--x-start', `${Math.random() * 40 - 20}%`);
      piece.style.setProperty('--x-end', `${Math.random() * 80 - 40}%`);
      const duration = 3 + Math.random() * 1.5;
      piece.style.animationDuration = `${duration}s`;
      piece.style.animationDelay = `${Math.random() * 0.3}s`;

      confettiContainer.appendChild(piece);
      setTimeout(() => {
        piece.remove();
      }, duration * 1000 + 400);
    }
  }

  function randomGradientColor() {
    const colors = palette[Math.floor(Math.random() * palette.length)].gradient;
    const mix = Math.random();
    const hexToRgb = hex => {
      const value = hex.replace('#', '');
      const bigint = parseInt(value, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return { r, g, b };
    };

    const colorA = hexToRgb(colors[0]);
    const colorB = hexToRgb(colors[1]);

    const r = Math.round(colorA.r * (1 - mix) + colorB.r * mix);
    const g = Math.round(colorA.g * (1 - mix) + colorB.g * mix);
    const b = Math.round(colorA.b * (1 - mix) + colorB.b * mix);

    return `rgb(${r}, ${g}, ${b})`;
  }
});
