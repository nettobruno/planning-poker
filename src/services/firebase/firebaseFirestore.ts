import { db } from './firebaseConfig';
import { 
  collection, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData, 
  addDoc, 
  getDocs, 
  updateDoc,
  doc,
  getDoc
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

export const clearAllVotes = async (collectionName: string): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, collectionName));

  querySnapshot.forEach(async (doc) => {
    await updateDoc(doc.ref, {
      vote: '' 
    });
  });
};

export const getUserById = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    } else {
      console.log('Usuário não encontrado.');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};

export const updateUserVote = async (userId: string, newVote: string): Promise<void> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { vote: newVote });
    console.log('Voto atualizado com sucesso');
  } catch (error) {
    console.error('Erro ao atualizar voto:', error);
    throw error;
  }
};
