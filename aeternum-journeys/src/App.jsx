import { Map, Plane, Plus } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-8 p-10 font-sans">
      
      {/* Título con fuente Serif romana */}
      <h1 className="text-5xl font-serif text-charcoal font-semibold">
        Aeternum Journeys
      </h1>
      
      <p className="text-lg text-gray-600 max-w-md text-center">
        Nuestra historia por el mundo, un destino a la vez.
      </p>

      {/* Botón con tu color Bronce y un ícono de Lucide */}
      <button className="flex items-center gap-2 bg-bronze hover:bg-bronze-dark text-white px-6 py-3 rounded-full transition-colors shadow-lg">
        <Plus size={20} />
        <span className="font-medium">Add New Journey</span>
      </button>

      {/* Íconos decorativos en Terracota */}
      <div className="flex gap-6 mt-10 text-terracotta">
        <Map size={40} strokeWidth={1.5} />
        <Plane size={40} strokeWidth={1.5} />
      </div>

    </div>
  )
}

export default App;