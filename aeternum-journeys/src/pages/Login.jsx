import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-roman-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Círculo decorativo de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-bronze/5 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white relative z-10 text-center">
        
        {/* Logo / Inicial */}
        <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full border-bronze text-bronze font-serif font-bold italic text-2xl">
          D&D
        </div>

        <h1 className="text-3xl font-serif text-charcoal font-semibold mb-2">Aeternum Journeys</h1>
        <p className="text-gray-500 text-sm mb-8">Nuestra historia, nuestro mundo.</p>

        <form onSubmit={handleLogin} className="space-y-5 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-bronze hover:bg-bronze-dark text-white font-medium py-3.5 rounded-xl transition-all shadow-md mt-4 disabled:opacity-50"
          >
            {loading ? 'Abriendo el mapa...' : 'Entrar'}
          </button>
        </form>
      </div>
      <div className="absolute bottom-6 text-center text-xl font-serif text-gray-700 z-10 flex items-center gap-1.5 opacity-80">
        Hecho con <span className="text-terracotta">❤️</span> por Dieguito para su Chelita
      </div>
    </div>
  );
}