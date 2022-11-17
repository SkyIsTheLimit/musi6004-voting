import { AppData, subscribeToAppData } from '../../common/firebase';
import qrcode from 'qrcode';
import './app.scss';

(async function (global) {
  // Please dont run on nodejs.
  if (!global.document) throw 'Please run in browser environment';

  const canvas = document.getElementById('qrcode');
  qrcode.toCanvas(canvas, `${location.origin}/app`, {
    scale: 3,
  });

  // JQuery style $ object.
  const $ = document.querySelector.bind(document);
  const $currentColor = $('#currentColor');
  const $timeRemaining = $('#time-remaining');

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

    $currentColor.style.backgroundColor = `${appData.currentColor}`;

    Object.keys(appData.colors).forEach((color) => {
      const votes = appData.colors[color];

      $(`#${color}Count`).innerText = votes;
    });

    if (appData.isStarted) {
      timer = setInterval(() => {
        const remaining =
          appData.timerAmt -
          (Math.floor((new Date().getTime() - appData.startTime) / 1000) %
            appData.timerAmt);

        $timeRemaining.style.display = 'inline-block';
        $timeRemaining.innerText = `${remaining} s`;
      }, 250);
    } else {
      if (timer) {
        clearInterval(timer);
      }

      $timeRemaining.innerText = 'NOT RUNNING';
    }
  }

  // Alright, let's go.
  subscribeToAppData((appData) => renderAppState(appData));
})(globalThis);
