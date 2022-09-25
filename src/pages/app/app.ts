import { db } from '../../common/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function load() {
  const snapshot = await getDocs(collection(db, 'votes'));

  snapshot.forEach((doc) => {
    console.log('Doc', doc.data());
  });
}

load();
