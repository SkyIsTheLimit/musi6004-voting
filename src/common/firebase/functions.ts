/**
 * A list of helper functions to talk to the firebase backend.
 *
 * @author Sandeep Prasad (https://github.com/skyisthelimit)
 */

import { v4 as uuidv4 } from 'uuid';
import { Session, Vote } from './types';

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
export async function getRecentlyCompletedSessionResults(): Promise<
  Vote[] | null
> {
  return Promise.resolve(null);
}

/**
 * Function that returns the voting session that is in progress. This is the session that participants
 * are voting on. This is different from the session who's results are being used by the performers to play
 * the chosen score. That information can be obtained from the <code>getRecentlyCompletedSession</code> function.
 *
 * Returns null if no session is active.
 */
export async function getInProgressSession(): Promise<Session | null> {
  return Promise.resolve(null);
}

/**
 * Function that returns the votes for the currently active session.
 */
export async function getVotesForInProgressSession(): Promise<Vote[]> {
  return Promise.resolve([]);
}

/**
 * Function to send the vote of the current user for the session that is in progress. The server
 * might not accept this vote if it finds out this user has already voted.
 *
 * @returns Boolean if the vote was sent successfully or not.
 */
export async function sendVote(): Promise<Boolean> {
  return Promise.resolve(false);
}
