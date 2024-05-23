"use client"

import { useState, useEffect } from 'react';
import { listenToCollection, clearAllVotes } from '../services/firebase/firebaseFirestore'

export default function Vote() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const testClearAges = async () => {
    try {
      await clearAllVotes('users');
      console.log('Votos removidas com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar votos:', error);
    }
  }

  useEffect(() => {
    const getItemsFirebase = listenToCollection(
      'users',
      (dataFromFirestore) => {
        setData(dataFromFirestore);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao ouvir dados do Firestore:', error);
      }
    );

    return () => {
      getItemsFirebase();
    };
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <main>
      <h1>Página de Votos</h1>

      {data.map((item: any, index: any) => (
        <ul key={index}>
          <li>{item.name}</li>
          <li>{item.vote}</li>
        </ul>    
      ))}

      <button onClick={() => testClearAges()}>Limpar todos os votos</button>
    </main>
  );
}
