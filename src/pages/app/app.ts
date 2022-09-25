import {
  getRecentlyCompletedSessionVotes,
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
