const state = {
  view: {
    squares: document.querySelectorAll('.square'),
    enemy: document.querySelector('.enemy'),
    timeLeft: document.querySelector('#time-left'),
    score: document.querySelector('#score'),
    livesImg: document.querySelector('#lives-img'),
    lives: document.querySelector('#lives'),
    play: document.querySelector('#play'),
    stop: document.querySelector('#stop'),
    pause: document.querySelector('#pause'),
  },
  values: {
    currentTime: 60,
    result: 0,
    lives: 5,
    gameVelocity: 1000,
    hitPosition: null,
    randonSquareId: null,
  },
  actions: {
    timerId: 0,
    countDownId: 0,
  },
};

const sounds = {
  gameOver: new Audio('./src/assets/audios/game-over.mp3'),
  musicGame: new Audio('./src/assets/audios/audio-game.mp3'),
};

Object.values(sounds).forEach((sound) => {
  sound.volume = 0.2;
});

function playGame() {
  initialize();
}

function stopGame() {
  clearInterval(state.values.timerId);
  clearInterval(state.actions.countDownId);
  alert(`Game over! Your score is ${state.values.result}`);
  state.view.squares.forEach((square) => {
    square.classList.remove('enemy');
  });
  state.view.play.removeEventListener('click', playGame);
  state.view.play.addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();
  });
  state.view.play.textContent = 'Play again';
  state.view.play.style.display = 'block';
  state.view.stop.style.display = 'none';
  state.view.pause.style.display = 'none';
  inactiveCursorPointer();
}

function pauseGame() {
  clearInterval(state.values.timerId);
  clearInterval(state.actions.countDownId);
  state.view.play.style.display = 'block';
  state.view.stop.style.display = 'block';
  state.view.pause.style.display = 'none';
  inactiveCursorPointer();
}

function valuesLives() {
  state.view.squares.forEach((square) => {
    square.addEventListener('mousedown', () => {
      if (square.id !== state.values.hitPosition) {
        state.values.lives--;
        state.view.lives.textContent = state.values.lives;
        playAudio('err');
      }
      if (state.values.lives === 0) {
        playMusic('gameOver');
        stopGame();
      }
    });
  });
}

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime <= 0) {
    playMusic('gameOver');
    stopGame();
  }
}

function randomSquare() {
  state.view.squares.forEach((square) => {
    square.classList.remove('enemy');
  });
  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add('enemy');
  state.values.hitPosition = randomSquare.id;
}

function moveEnemy() {
  state.values.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener('mousedown', () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playAudio('hit');
      }
    });
  });
}

function initialize() {
  state.actions.countDownId = setInterval(countDown, 1000);
  playMusic('musicGame');
  moveEnemy();
  valuesLives();
  activeCursorPointer();
  addListenerHitBox();

  state.view.play.style.display = 'none';
  state.view.stop.style.display = 'block';
  state.view.pause.style.display = 'block';
  state.view.livesImg.style.display = 'block';
  state.view.lives.style.display = 'block';
  state.view.lives.textContent = state.values.lives;
  state.view.score.textContent = state.values.result;
}

function activeCursorPointer() {
  state.view.squares.forEach((square) => {
    square.style.cursor = 'pointer';
  });
}

function inactiveCursorPointer() {
  state.view.squares.forEach((square) => {
    square.style.cursor = 'default';
  });
}

function playAudio(sound) {
  let audio = new Audio(`./src/assets/audios/${sound}.mp3`);
  audio.volume = 0.2;
  audio.play();
}

function playMusic(soundName) {
  stopMusic();
  if (sounds[soundName]) {
    sounds[soundName].play();
  } else {
    console.error(`Sound ${soundName} not found`);
  }
}

function stopMusic() {
  Object.values(sounds).forEach((sound) => {
    sound.pause();
    sound.currentTime = 0;
  });
}
