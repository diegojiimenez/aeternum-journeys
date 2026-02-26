import { Outlet, Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function Layout() {
  const location = useLocation();

  // Pequeña función para saber si estamos en la página actual y subrayarla
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-roman-bg flex flex-col font-sans text-charcoal">
      {/* Barra de Navegación Superior */}
      <nav className="flex items-center justify-between px-10 py-5 bg-roman-bg/80 backdrop-blur-md sticky top-0 z-50">
        
        {/* Logo y Título */}
        <Link to="/" className="flex items-center gap-3">
          {/* Un ícono provisional que simula tu logo dorado */}
          <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-bronze text-bronze font-serif font-bold italic">
            A
          </div>
          <span className="text-2xl font-serif font-semibold tracking-wide">
            Aeternum Journeys
          </span>
        </Link>

        {/* Links de navegación (Minimalistas) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link to="/" className={`hover:text-terracotta transition-colors ${isActive('/') ? 'text-terracotta border-b-2 border-terracotta pb-1' : ''}`}>Our Map</Link>
          <Link to="/timeline" className={`hover:text-terracotta transition-colors ${isActive('/timeline') ? 'text-terracotta border-b-2 border-terracotta pb-1' : ''}`}>Timeline</Link>
          <Link to="/gallery" className={`hover:text-terracotta transition-colors ${isActive('/gallery') ? 'text-terracotta border-b-2 border-terracotta pb-1' : ''}`}>Gallery</Link>
          <Link to="/journal" className={`hover:text-terracotta transition-colors ${isActive('/journal') ? 'text-terracotta border-b-2 border-terracotta pb-1' : ''}`}>Journal</Link>
        </div>

        {/* Botón de Añadir Viaje y Perfil */}
        <div className="flex items-center gap-4">
                  <Link to="/add" className="flex items-center gap-2 bg-bronze hover:bg-bronze-dark text-white px-5 py-2.5 rounded-full transition-colors shadow-sm text-sm font-medium">
                      <Plus size={18} />
                      <span>Add Journey</span>
                  </Link>
          {/* Círculo de perfil provisional */}
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
             <img src="https://ui-avatars.com/api/?name=D+N&background=C87B5D&color=fff" alt="Couple" />
          </div>
        </div>
      </nav>

      {/* Aquí adentro se renderizará el Mapa, la Galería, etc. */}
      <main className="flex-1 relative">
        <Outlet />
      </main>
    </div>
  );
}