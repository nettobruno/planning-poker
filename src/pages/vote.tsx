"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { listenToCollection, clearAllVotes, getUserById, updateUserVote } from '../services/firebase/firebaseFirestore'

export default function Vote() {
  const router = useRouter();
  const { userId } = router.query;

  const [data, setData] = useState<any>([]);
  const [user, setUser] = useState<any>([]);
  const [vote, setVote] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const handleVoteUpdate = async () => {
    setLoading(true);

    try {
      await updateUserVote(userId as string, vote);
    } catch (error) {
      console.log('Erro ao atualizar voto. Por favor, tente novamente.');
    } finally {
      setLoading(false);
      setVote('');
    }
  };

  const testClearAges = async () => {
    try {
      await clearAllVotes('users');
      console.log('Votos removidas com sucesso!');
    } catch (error) {
      console.error('Erro ao limpar votos:', error);
    }
  }

  const fetchUser = async (userId: string) => {
    try {
      const userData = await getUserById(userId);
      if (userData) {
        setUser(userData);
      } else {
        console.log('Usuário não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (userId) {
      fetchUser(userId as string);
    }
  }, [userId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <main>
      <h1>Página de Votos</h1>

      {data.map((item: any, index: any) => (
        <ul key={index}>
          <li style={item.id === userId ? { color: 'red' } : {}}>{item.name}</li>
          <li>{item.vote}</li>
        </ul>    
      ))}

      <form onSubmit={handleVoteUpdate}>
        <input
          type="string"
          placeholder="Voto"
          id="vote"
          value={vote}
          onChange={(e) => setVote(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>

      <button onClick={() => testClearAges()}>Limpar todos os votos</button>
    </main>
  );
}
