import {
  AppData,
  subscribeToAppData,
  writeAppData,
} from '../../common/firebase';
import './app.scss';

(async function (global) {
  // Please dont run on nodejs.
  if (!global.document) throw 'Please run in browser environment';

  // JQuery style $ object.
  const $ = document.querySelector.bind(document);

  // Get a handle to the play and stop button.
  const $playButton = $('#play-button'),
    $stopButton = $('#stop-button'),
    $startPanel = $('#start'),
    $stopPanel = $('#stop'),
    $timeRemaining = $('#time-remaining');

  $playButton.addEventListener('click', playButtonClicked);
  $stopButton.addEventListener('click', stopButtonClicked);

  // Store the  app data for access to this closure.
  let appData: AppData;
  let timer: any;

  /**
   * This function is responsible for rendering the UI based on the app data given to it.
   *
   * @param _appData The most recent app data.
   */
  function renderAppState(_appData: AppData) {
    appData = _appData;

    if (timer) {
      clearInterval(timer);
    }

    if (_appData.isStarted) {
      $stopPanel.style.display = 'inline-flex';
      $startPanel.style.display = 'none';
    } else {
      $stopPanel.style.display = 'none';
      $startPanel.style.display = 'inline-flex';
    }

    if (appData.isStarted) {
      timer = setInterval(() => {
        const remaining =
          appData.timerAmt -
          (Math.floor((new Date().getTime() - appData.startTime) / 1000) %
            appData.timerAmt);

        $timeRemaining.innerText = `${remaining} s`;
      }, 250);
    } else {
      if (timer) {
        clearInterval(timer);
      }

      $timeRemaining.innerText = 'NOT RUNNING';
    }
  }

  /**
   * Click handler for the play button. The play button will reset the state and "start" the timer virtually.
   *
   * Step 1: Create new app data object.
   * Step 2: Send to firebase.
   * Step 3: Polling mechanism automatically picks up changes and re-renders the UI.
   */
  async function playButtonClicked() {
    writeAppData({
      startTime: new Date().getTime(),
      isStarted: true,
    });
  }

  /**
   * Click handler for the stop button. The stop button will reset the state ensuring the UI is in an empty state.
   */
  async function stopButtonClicked() {
    const winningColor = Object.keys(appData.colors)
      .map((color) => ({
        color,
        count: appData.colors[color],
      }))
      .sort((a, b) => a.count - b.count)[0];

    writeAppData({
      isStarted: false,
      currentColor: winningColor.color,
      colors: {
        red: 0,
        green: 0,
        blue: 0,
        orange: 0,
        pink: 0,
        yellow: 0,
      },
    });
  }

  // Alright, let's go.
  subscribeToAppData((appData) => renderAppState(appData));
})(globalThis);
