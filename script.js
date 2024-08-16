// global variables
let pattern = [];
let progress = 0;
let gamePlaying = false;
let guessCounter = 0;
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
const patternLength = 8; // Set the desired length of the random pattern

// global constants
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

// Function to generate a random pattern
function generateRandomPattern(length) {
  let randomPattern = [];
  for (let i = 0; i < length; i++) {
    // Generate a random number between 1 and 4 (assuming you have 4 buttons)
    randomPattern.push(Math.floor(Math.random() * 4) + 1);
  }
  return randomPattern;
}

// start game function
function startGame() {
  progress = 0;
  gamePlaying = true;
  pattern = generateRandomPattern(patternLength); // Generate a new random pattern
  console.log("Generated pattern: " + pattern); // Optional: Log the pattern for debugging
  
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;

  stopBtn.classList.add("hidden");
  startBtn.classList.remove("hidden");
}

// Function to highlight the button and display a background image
function lightButton(btn) {
  var button = document.getElementById("button" + btn);
  button.classList.add("lit");
  button.style.backgroundImage = "url('https://upload.wikimedia.org/wikipedia/en/b/b4/Howard_Bison_logo.svg')";
  button.style.backgroundPosition = "center";
  button.style.backgroundSize = "195px";
}

// clear button function
function clearButton(btn) {
  var button = document.getElementById("button" + btn);
  button.style.background = "";
  document.getElementById("button" + btn).classList.remove("lit");
}

// play single clue function
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

// play clue sequence function
function playClueSequence() {
  context.resume();
  let delay = nextClueWaitTime;
  guessCounter = 0;
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function winGame() {
  stopGame();
  var win_emoji = '\u{1F389}';
  console.log(win_emoji);
  alert("Congratulations! You won the game!" + win_emoji);
}

function loseGame() {
  stopGame();
  var lose_emoji = '\u{1F604}';
  console.log(lose_emoji);
  alert("Game over, You lost" + lose_emoji);
}

// Function to handle user guesses
function guess(btn) {
  console.log("user guessed: " + btn);
  lightButton(btn);
  setTimeout(clearButton, 250, btn);

  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    loseGame();
  }
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.63,
  2: 293.66,
  3: 329.63,
  4: 349.23,
}

let tonePlaying = false;
let volume = 0.5;

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

let AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext();
let o = context.createOscillator();
let g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
