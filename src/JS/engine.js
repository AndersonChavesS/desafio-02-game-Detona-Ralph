const state = {
  view: {
    squares: document.querySelectorAll('.square'),
    enemy: document.querySelector('.enemy'),
    timeLeft: document.querySelector('#time-left'),
    score: document.querySelector('#score'),
    lives: document.querySelector('#lives'),
    play: document.querySelector('#play'),
    stop: document.querySelector('#stop'),
    pause: document.querySelector('#pause'),
  },
  values: {
    lives: 3,
    gameVelocity: 800,
    hitPosition: null,
    result: 0,
    currentTime: 60,
  },
  actions: {
    timerId: 0,
    countDownId: 0,
  },
};

function playGame() {
  initialize();
}

function stopGame() {
  clearInterval(state.values.timerId);
  clearInterval(state.actions.countDownId);
  alert('GAME OVER! Your final score is ' + state.values.result);
  state.values.lives = 3;
  state.values.result = 0;
  state.values.currentTime = 0;
  state.view.lives.textContent = state.values.lives;
  state.view.score.textContent = state.values.result;
  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.squares.forEach((square) => {
    square.classList.remove('enemy');
  });

}

function pauseGame() {
  if (state.values.timerId) {
    clearInterval(state.values.timerId);
  }
  if (state.actions.countDownId) {
    clearInterval(state.actions.countDownId);
  }
}

function valuesLives() {
  if (state.values.lives > 0) {
    state.values.lives--;
    state.view.lives.textContent = state.values.lives;

    if (state.values.lives === 0) {
     stopGame();
    }
  }
}

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  if (state.values.currentTime === 0 || state.values.lives === 0) {
    clearInterval(state.values.timerId);
    clearInterval(state.actions.countDownId);
    alert('GAME OVER! Your final score is ' + state.values.result);
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
      }
    });
  });
}

function initialize() {
  let timerId = state.actions.timerId;
  let countDownId = state.actions.countDownId;

  timerId = setInterval(randomSquare, 1000);
  countDownId = setInterval(countDown, 1000);

  moveEnemy();
  addListenerHitBox();
}
