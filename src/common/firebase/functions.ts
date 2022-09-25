/**
 * A list of helper functions to talk to the firebase backend.
 *
 * @author Sandeep Prasad (https://github.com/skyisthelimit)
 */

import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Session, Vote, VotingOption } from './types';
import { db } from './connection';

/**
 * Function to return a unique ID for the current user.
 *
 * @returns A unique identifier that ties the current user to their device.
 */
export const getUserId = () => {
  let userId = sessionStorage.getItem('uid'); // Using session storage in order to survive browser refreshes.

  if (!userId) {
    userId = uuidv4();
    sessionStorage.setItem('uid', userId); // Save a new user ID after generating a uuid.
  }

  return userId;
};

/**
 * Function that returns the votes about the most recent session that got closed for voting. These votes can be
 * used to extract the chosen color (score) by the audience.
 *
 * Returns null if no session available.
 */
export async function getRecentlyCompletedSessionVotes(): Promise<Vote[]> {
  const recentlyCompletedSessionDocRef = doc(
    db,
    'sessions',
    'recently-completed'
  );
  const recentlyCompletedSession = await getDoc(
    recentlyCompletedSessionDocRef
  ).then((doc) => doc.data() as { id: string });

  const votesDocRef = collection(
    db,
    'sessions',
    recentlyCompletedSession.id,
    'votes'
  );
  const votes = await getDocs(votesDocRef).then((data) => {
    const votes: Vote[] = [];

    data.forEach((doc) => votes.push(doc.data() as Vote));

    return votes;
  });

  if (!votes) {
    return Promise.reject('No recently completed session found.');
  }

  return Promise.resolve(votes);
}

/**
 * Function that returns the voting session that is in progress. This is the session that participants
 * are voting on. This is different from the session who's results are being used by the performers to play
 * the chosen score. That information can be obtained from the <code>getRecentlyCompletedSession</code> function.
 *
 */
export async function getInProgressSession(): Promise<Session> {
  const inProgressSessionDocRef = doc(db, 'sessions', 'in-progress');
  const inProgressSession = await getDoc(inProgressSessionDocRef).then(
    (doc) => doc.data() as { id: string }
  );

  const sessionDocRef = doc(db, 'sessions', inProgressSession.id);
  const session = await getDoc(sessionDocRef).then(
    (doc) => doc.data() as Session
  );

  if (!session) {
    return Promise.reject('No in progress session currently.');
  }

  return Promise.resolve({
    ...session,
    id: inProgressSession.id,
  });
}

/**
 * Function that returns the votes for the currently active session.
 */
export async function getVotesForInProgressSession(): Promise<Vote[]> {
  return getInProgressSession()
    .then((session) =>
      getDocs(collection(db, 'votes')).then((docs) => ({
        docs,
        session,
      }))
    )
    .then(({ docs, session }) => {
      const votes: Vote[] = [];
      docs.forEach((doc) => votes.push(doc.data() as Vote));

      return votes.filter((vote) => vote.sessionId === session?.id);
    });
}

/**
 * Function to send the vote of the current user for the session that is in progress. The server
 * might not accept this vote if it finds out this user has already voted.
 *
 * @returns Boolean if the vote was sent successfully or not.
 */
export async function sendVote(vote: Vote): Promise<Boolean> {
  const session = await getInProgressSession();

  if (!session) {
    return Promise.reject('No in progress session found!');
  }

  const sessionRef = await addDoc(
    collection(db, 'sessions', session.id, 'votes'),
    vote
  );

  if (sessionRef) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
}
