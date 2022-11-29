/**
 * A list of helper functions to talk to the firebase backend.
 *
 * @author Sandeep Prasad (https://github.com/skyisthelimit)
 */

import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { AppData, VoteColor } from './types';
import { app, db } from './connection';

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
 * Function to send the color specified to the backend to be either counted as a vote or substracted
 * from the current votes. The shouldSubtract value indicates if the vote should be added (false) or
 * substracted (true).
 *
 * @param color The color vote to be sent to the db.
 * @param shouldSubtract Should this vote be subtracted. Default = false
 */
export async function sendVote(
  color: VoteColor,
  //shouldSubtract: Boolean = false
) {
  const dataRef = await doc(db, 'app', 'data');
  const data = await getDoc(dataRef).then(
    (response) => response.data() as AppData
  );

  data.colors[color] += 1;
  //* (shouldSubtract ? -1 : +1);

  return await updateDoc(dataRef, { ...data });
}

export async function getAppData() {
  const dataRef = await doc(db, 'app', 'data');
  const data = await getDoc(dataRef).then(
    (response) => response.data() as AppData
  );

  return data;
}

export async function writeAppData(appData: Partial<AppData>) {
  const dataRef = await doc(db, 'app', 'data');

  return await updateDoc(dataRef, { ...appData });
}

export async function subscribeToAppData(callback: (appData: AppData) => void) {
  const dataRef = await doc(db, 'app', 'data');

  onSnapshot(dataRef, (response) => callback(response.data() as AppData));
}
