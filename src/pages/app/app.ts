import {
  getInProgressSession,
  getRecentlyCompletedSessionVotes,
  sendVote,
  VoteColor,
} from '../../common/firebase';
import { changeCurrColor, findWinner } from '../results/app';

getRecentlyCompletedSessionVotes().then((votes) =>
  console.log('Received votes', votes)
);

// vote buttons
const redButton = document.getElementById('red');
const greenButton = document.getElementById('green');
const yellowButton = document.getElementById('yellow');
const blueButton = document.getElementById('blue');
const orangeButton = document.getElementById('orange');

function handleClick(color: VoteColor) {
  getInProgressSession().then((session) => {
    // Disable buttons.

    sendVote(color).then(() => {
      // Enable buttons.
    });
  });
}

redButton?.addEventListener('click', () => handleClick('red'));
greenButton?.addEventListener('click', () => handleClick('green'));
yellowButton?.addEventListener('click', () => handleClick('yellow'));
blueButton?.addEventListener('click', () => handleClick('blue'));
orangeButton?.addEventListener('click', () => handleClick('orange'));

// timer
var intervalID = setInterval(startTimer, 1000);
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

function setWinner() {
  var winnerIndex = findWinner();
  console.log('winner: ' + winnerIndex);
  changeCurrColor(winnerIndex);
  console.log('setWinner executed');
}
