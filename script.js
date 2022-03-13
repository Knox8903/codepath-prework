// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const turnTime = 8000;

//Global Variables
var pattern = [];
var progress = 0; 
var gamePlaying = false;
var guessCounter = 0;
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var mistakes = 0;
var guessTimer;

function startGame(){
  // create random pattern
  createPattern();
  //initialize game variables
  progress = 0;
  mistakes = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
  document.getElementById("mistakeStatus").innerHTML=("Mistakes: "+mistakes);
}

function createPattern(){
  pattern = [];
  for(let i =0; i<= 6; ++i){
    pattern.push(Math.floor(Math.random() * 6)+1);
  }
  console.log(pattern);
}

function stopGame(){
  console.log("Stopped timer");
  clearInterval(guessTimer);// stop timer
  gamePlaying=false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}

function winGame(){
  stopGame();
  alert("Congrats! You won.");
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playMyAudio(btn);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}



function playClueSequence(){
  clearInterval(guessTimer);
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  // start timer after all clues have been revealed
    guessTimer = setInterval(loseGame, turnTime);
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  // end timer and compute guess result
  clearInterval(guessTimer);
  // start timer once again
  guessTimer = setInterval(loseGame, turnTime);

  if(btn == pattern[guessCounter]){
    if(guessCounter < progress){
      guessCounter += 1;
    }else{
      if(progress+1 == pattern.length){
        winGame();
      }else{
        progress += 1;
        // Decrease the clueHoldTime by a factor, rather than subtracting this allows for longer patterns
        clueHoldTime *= (pattern.length-3)/(pattern.length) 
        playClueSequence();
      }
    }
  }else{
    mistakes += 1;
    document.getElementById("mistakeStatus").innerHTML=("Mistakes: "+mistakes);
    if(mistakes == 3){
      loseGame();
    }

  }
}

var context = new AudioContext()

const colors = {
  1: "purple",
  2: "red",
  3: "pink",
  4: "green",
  5: "brown",
  6: "brown"
}

function lightButton(btn){
  document.getElementById(colors[btn]+"off").classList.add("lit");
}
function clearButton(btn){
  document.getElementById(colors[btn]+"off").classList.remove("lit");
}

// Optional

// dictionary for IDs associated with either audio file
const soundMap = {
  1: "workIt",
  2: "makeIt",
  3: "doIt",
  4: "makesUs",
  5: "harder",
  6: "better"
}

// play audio associated with given button
function playMyAudio(btn){
  // I didn't include an audio stopping mechanic since it sounded extremely buggy even though it was working perfectly
  document.getElementById(soundMap[btn]).cloneNode(true).play(); 
}