import { doc } from 'firebase/firestore';
import { sendVote, VoteColor } from '../../common/firebase';
import { AppData, subscribeToAppData } from '../../common/firebase';


// Store the  app data for access to this closure.
let appData: AppData;
let timer: any;

// vote buttons
const redButton = document.getElementById('red') as HTMLButtonElement | null;
const greenButton = document.getElementById('green') as HTMLButtonElement | null;
const yellowButton = document.getElementById('yellow') as HTMLButtonElement | null;
const blueButton = document.getElementById('blue') as HTMLButtonElement | null;
const orangeButton = document.getElementById('orange') as HTMLButtonElement | null;
const pinkButton = document.getElementById('pink') as HTMLButtonElement | null;


let isVoted = {};
function handleClick(color: VoteColor, self) {

  isVoted[color] = !isVoted[color];
  sendVote(color);
  //console.log("clicked: " + color);

  self.style.backgroundColor = '#808080';
  //disable buttons
  disableBtns();

  //self.disabled = true;

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
        enableBtns();
      }
      
      if (secondsDisplay) {
        secondsDisplay.textContent = remaining.toString();
        //console.log("secondDisplay remaining.toString(): " + remaining.toString());
      }
    }, 250);
  } else {
    if (timer) {
      clearInterval(timer);
    }
    if (secondsDisplay) {
      secondsDisplay.textContent = `NOT RUNNING`;
    }
    
    resetButtonColors();
    enableBtns();
  }
}

// Alright, let's go.
subscribeToAppData((appData) => renderAppState(appData));


function resetButtonColors() {
  if (redButton) {
    redButton.style.backgroundColor = 'red';
  }
  if (yellowButton) {
    yellowButton.style.backgroundColor = 'yellow';
  }
  if (greenButton) {
    greenButton.style.backgroundColor = 'green';
  }
  if (pinkButton) {
    pinkButton.style.backgroundColor = 'pink';
  }
  if (blueButton) {
    blueButton.style.backgroundColor = 'blue';
  }
  if (orangeButton) {
    orangeButton.style.backgroundColor = 'orange';
  }
}

function disableBtns() {
  let btns = [redButton, yellowButton, greenButton, blueButton, orangeButton, pinkButton];

  btns.forEach((btn) => {
    if (btn) {
      btn.disabled = true;
    }

    console.log("btns disabled");
  });
}

function enableBtns() {
  let btns = [redButton, yellowButton, greenButton, blueButton, orangeButton, pinkButton];

  btns.forEach((btn) => {
    if (btn) {
      btn.disabled = false;
    }

    console.log("btns enabled");
  });
}

