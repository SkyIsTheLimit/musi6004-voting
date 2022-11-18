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
  const $timerAmt = $('#timerAmt'),
    $disabledTimerAmt = $('#disabledTimerAmt'),
    $playButton = $('#play-button'),
    $stopButton = $('#stop-button'),
    $startPanel = $('#start'),
    $stopPanel = $('#stop'),
    $timeRemaining = $('#time-remaining');
  let isFirstLoad = true,
    isResetting = false;

  $timerAmt.addEventListener(
    'change',
    () => ($disabledTimerAmt.value = $timerAmt.value)
  );

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
    if (isResetting) return;

    console.log('RENDERING APP STATE');
    appData = _appData;

    if (isFirstLoad) {
      $timerAmt.value = _appData.timerAmt;
      $disabledTimerAmt.value = _appData.timerAmt;
      isFirstLoad = false;
    }

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

    if (appData.isStarted && !isResetting) {
      (function timerCallback() {
        const remaining = isResetting
          ? -1
          : appData.timerAmt -
            (Math.floor((new Date().getTime() - appData.startTime) / 1000) %
              (appData.timerAmt + 1));

        $timeRemaining.innerText = `${remaining} s`;

        console.log('[TIMEOUT]', remaining, isResetting);
        if (remaining === 0 && !isResetting) {
          isResetting = true;
          setTimeout(() => {
            performReset().then(() => {
              isResetting = false;

              setTimeout(timerCallback, 250);
            });
          }, 250);
        } else if (appData.isStarted && !isResetting) {
          setTimeout(timerCallback, 400);
        }
      })();
    } else {
      $timeRemaining.innerText = 'NOT RUNNING';
    }
  }

  async function performReset(
    isStarted: boolean = true,
    _isResetting: boolean = true
  ) {
    console.log('Performing Reset');
    isResetting = _isResetting;
    const sortedColors = Object.keys(appData.colors)
      .map((color) => ({
        color,
        count: appData.colors[color],
      }))
      .sort((a, b) => (a.count > b.count ? -1 : +1));
    const winningColor = sortedColors[0];
    console.log('Sorted Colors', sortedColors);

    return writeAppData({
      isStarted,
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

  /**
   * Click handler for the play button. The play button will reset the state and "start" the timer virtually.
   *
   * Step 1: Create new app data object.
   * Step 2: Send to firebase.
   * Step 3: Polling mechanism automatically picks up changes and re-renders the UI.
   */
  async function playButtonClicked() {
    const timerAmt = +$timerAmt.value;

    writeAppData({
      startTime: new Date().getTime(),
      timerAmt,
      isStarted: true,
    });
  }

  /**
   * Click handler for the stop button. The stop button will reset the state ensuring the UI is in an empty state.
   */
  async function stopButtonClicked() {
    return performReset(false, false);
  }

  // Alright, let's go.
  subscribeToAppData((appData) => renderAppState(appData));
})(globalThis);
