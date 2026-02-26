import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Páginas
import MapView from './pages/MapView';
import AddJourney from './pages/AddJourney';
import JourneyGallery from './pages/JourneyGallery';
import Login from './pages/Login';

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Revisamos si ya hay una sesión activa al abrir la página
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuchamos los cambios (si inicia sesión o cierra sesión)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-roman-bg flex items-center justify-center font-serif text-2xl text-terracotta">Cargando Aeternum...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Si ya inició sesión, lo manda al mapa. Si no, al Login */}
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/" />} />
        
        {/* Rutas Privadas: Si no hay sesión, los patea de vuelta al login */}
        <Route path="/" element={session ? <MapView /> : <Navigate to="/login" />} />
        <Route path="/add" element={session ? <AddJourney /> : <Navigate to="/login" />} />
        <Route path="/journey/:id" element={session ? <JourneyGallery /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}