"use client"

import { useState, useEffect } from 'react';
import { listenToCollection } from '../services/firebase/firebaseFirestore'

export default function Home() {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      <h1>Hello World</h1>

      {data.map((item: any, index: any) => (
        <ul key={index}>
          <li>{item.name}</li>
          <li>{item.lastname}</li>
          <li>{item.age}</li>
        </ul>    
      ))}
    </main>
  );
}
