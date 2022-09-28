import { doc } from 'firebase/firestore';
import qrcode from 'qrcode';
import { getRecentlyCompletedSessionVotes, getVotesForInProgressSession } from '../../common/firebase';

const canvas = document.getElementById('qrcode');
qrcode.toCanvas(canvas, `${location.origin}/app`, {
  scale: 5,
});

// get votes and sort them
//const votes = getVotesForInProgressSession();
//console.log('votes: ' + votes);


export function findWinner() {
  // [red, green, yellow, blue, orange]
  var voteArray = [3, 1, 5, 0, 2];
  var colorIndex = ['red', 'green', 'yellow', 'blue', 'orange'];

  //console.log(voteArray);

  //voteArray.sort(function(a, b){return b-a});

  var mostVotes = voteArray[0];
  var mostVotesIndex = 0;

  for (let i = 1; i < 4; i++) {
    if (voteArray[i] > mostVotes) {
      mostVotes = voteArray[i];
      mostVotesIndex = i;
    }
  }

  var winner = colorIndex[mostVotesIndex];
  var winnerIndex = mostVotesIndex;
  //console.log("winner: " + winner);

  //console.log(voteArray);
  
  return winnerIndex;
}


var winnerBox = document.getElementById("currentColor"); 

//if (winnerBox != undefined) {
  //winnerBox.style.backgroundColor = '#ff0000';
//}

export function changeCurrColor(winnerIndex) {
  var hexCodes = ['#ff0000', '#35E529', '#fff000', '#0000ff', '#ff9933'];
  var winnerHexCode = hexCodes[winnerIndex];

  console.log('winner hex color: ' + winnerHexCode);

  if (winnerBox != undefined) {
    //winnerBox.style.backgroundColor = winnerHexCode;
    winnerBox.style.backgroundColor = '#fff000';
  }
  console.log('changeCurrColor executed');
}

