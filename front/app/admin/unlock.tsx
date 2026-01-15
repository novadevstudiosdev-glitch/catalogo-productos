// Pantalla de unlock para el admin
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUnlock() {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'omar123') {
      localStorage.setItem('admin_enabled', 'true');
      router.replace('/admin');
    } else {
      setError('Código incorrecto');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleUnlock} className="bg-card p-8 rounded-lg shadow-lg w-full max-w-xs flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Admin Panel</h1>
        <input type="password" placeholder="Passcode" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="input input-bordered w-full px-3 py-2 rounded border border-border bg-background text-foreground" />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button type="submit" className="btn btn-primary w-full mt-2">
          Desbloquear
        </button>
      </form>
    </div>
  );
}
