"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addUser } from '../services/firebase/firebaseFirestore'

export default function Home() {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userID = await addUser({ name, vote: '' });
      router.push(`/vote?${userID}`);
    } catch (error) {
      console.error('Erro ao salvar nome de usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Qual é o seu nome?</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </main>
  );
}
