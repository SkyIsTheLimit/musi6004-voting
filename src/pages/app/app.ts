import { send } from 'process';
import {
  getInProgressSession,
  getRecentlyCompletedSessionVotes,
  getUserId,
  sendVote,
} from '../../common/firebase';

getRecentlyCompletedSessionVotes().then((votes) =>
  console.log('Received votes', votes)
);

sendVote({
  color: 'red',
  sessionId: 'session-1',
  userId: 'user-1',
  when: new Date().getTime(),
});

function handleClick(colorValue: string) {
  getInProgressSession().then((session) => {
    const userId = getUserId();
    const sessionId = session.id;
    const color = colorValue;

    // Disable buttons.
    sendVote({
      color,
      userId,
      sessionId,
      when: new Date().getTime(),
    }).then(() => {}); // Enable buttons);
  });
}
