import { db } from './firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData, 
  addDoc, 
  getDocs, 
  updateDoc
} from 'firebase/firestore';

interface User {
  name: string;
  vote: string;
}

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

export const addUser = async (user: User) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), user);
    console.log("User ID: ", docRef.id);
    return docRef.id as string;
  } catch (e) {
    console.error("Error adding user: ", e);
  }
};
