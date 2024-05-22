// src/services/firebase/firebaseFirestore.ts
import { db } from './firebaseConfig';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

export const listenToCollection = (
  collectionName: string,
  callback: (data: DocumentData[]) => void,
  errorCallback: (error: Error) => void
) => {
  const collectionRef = collection(db, collectionName);
  return onSnapshot(collectionRef, 
    (snapshot: QuerySnapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      callback(data);
    }, 
    (error) => {
      errorCallback(error);
    }
  );
};
