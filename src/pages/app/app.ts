import { doc } from 'firebase/firestore';
import { sendVote, VoteColor } from '../../common/firebase';
import { AppData, subscribeToAppData } from '../../common/firebase';


// Store the  app data for access to this closure.
let appData: AppData;
let timer: any;

// vote buttons
const redButton = document.getElementById('red');
const greenButton = document.getElementById('green');
const yellowButton = document.getElementById('yellow');
const blueButton = document.getElementById('blue');
const orangeButton = document.getElementById('orange');
const pinkButton = document.getElementById('pink');




let isVoted = {};
function handleClick(color: VoteColor, self) {

  isVoted[color] = !isVoted[color];
  sendVote(color, !isVoted[color]);

  console.log("clicked: " + color);

  
  self.style.backgroundColor = '#808080';
  //disable buttons

}

redButton?.addEventListener('click', () => handleClick('red', redButton));
greenButton?.addEventListener('click', () => handleClick('green', greenButton));
yellowButton?.addEventListener('click', () => handleClick('yellow', yellowButton));
blueButton?.addEventListener('click', () => handleClick('blue', blueButton));
orangeButton?.addEventListener('click', () => handleClick('orange', orangeButton));
pinkButton?.addEventListener('click', () => handleClick('pink', pinkButton));

function renderAppState(_appData: AppData) {
  const secondsDisplay = document.getElementById('seconds');

  appData = _appData;

  if (timer) {
    clearInterval(timer);
  }


  if (appData.isStarted) {
    timer = setInterval(() => {
      const remaining =
        appData.timerAmt -
        (Math.floor((new Date().getTime() - appData.startTime) / 1000) %
          (appData.timerAmt + 1));
      
      if (remaining == 0) {
        resetButtonColors();
      }
      
      if (secondsDisplay) {
        secondsDisplay.textContent = remaining.toString();
        console.log("secondDisplay remaining.toString(): " + remaining.toString());
      }
    }, 250);
  } else {
    if (timer) {
      clearInterval(timer);
    }
    if (secondsDisplay) {
      secondsDisplay.textContent = `NOT RUNNING`;
    }
  }
  
}

// Alright, let's go.
subscribeToAppData((appData) => renderAppState(appData));

function resetButtonColors() {
  if (redButton) {
    redButton.style.backgroundColor = 'red';
  }
}
 





/*
// timer
// var intervalID = setInterval(startTimer, 1000);
const secondsDisplay = document.getElementById('seconds');

var timerLength = 10;
var currentTime = 10;

//var sessionEnd = false;

function startTimer() {
  //console.log(currentTime);

  if (currentTime == 0) {
    currentTime = timerLength + 1;
    //console.log(currentTime);
    //sessionEnd = true;
    setWinner();
  }
  //else sessionEnd = false;

  currentTime = currentTime - 1;

  if (secondsDisplay != null) {
    secondsDisplay.textContent = currentTime.toString();
  }

  //console.log('sessionEnd?: ' + sessionEnd);
}

function setWinner() {}
*/