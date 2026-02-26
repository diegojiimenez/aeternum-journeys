import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, MapPin } from 'lucide-react'; // Agregamos íconos para que se vea más pro

export default function AddJourney() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Nuevos estados para el buscador inteligente
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Ahora el formData incluye latitud y longitud desde el inicio
  const [formData, setFormData] = useState({
    destination: '',
    title: '',
    arrival_date: '',
    departure_date: '',
    story: '',
    latitude: null,
    longitude: null
  });

  // Función que busca lugares en Mapbox MIENTRAS escribes
  const handleSearch = async (text) => {
    setSearchQuery(text);
    
    // Solo buscamos si hay más de 2 letras para no gastar peticiones a lo tonto
    if (text.length > 2) {
      try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&types=place,country,region`);
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Error buscando lugar:", error);
      }
    } else {
      setSuggestions([]); // Limpiamos si borran el texto
    }
  };

  // Cuando haces clic en una sugerencia de la lista
  const handleSelectPlace = (place) => {
    setSearchQuery(place.place_name); // Mostramos el nombre bonito en el input
    setFormData({
      ...formData,
      destination: place.place_name,
      longitude: place.center[0], // Guardamos la longitud exacta
      latitude: place.center[1]   // Guardamos la latitud exacta
    });
    setSuggestions([]); // Escondemos la lista
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de seguridad: Asegurarnos de que eligieron un lugar de la lista
    if (!formData.latitude || !formData.longitude) {
      alert("Por favor, selecciona un destino de la lista desplegable.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Ya no buscamos coordenadas aquí, ¡ya las tenemos exactas!
      const { error } = await supabase.from('journeys').insert([{
        destination: formData.destination,
        title: formData.title,
        arrival_date: formData.arrival_date,
        departure_date: formData.departure_date,
        story: formData.story,
        latitude: formData.latitude,
        longitude: formData.longitude
      }]);

      if (error) throw error;
      navigate('/'); // Volvemos al mapa
      
    } catch (error) {
      console.error('Error guardando el viaje:', error);
      alert('Hubo un error al guardar el viaje.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-88px)] bg-roman-bg flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 border border-gray-100 relative">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-charcoal font-semibold mb-2">Chronicle a New Adventure</h2>
          <p className="text-gray-500 text-sm">Capture the essence of your journey together.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          
          {/* BUSCADOR INTELIGENTE */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <div className="relative">
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search for a city, landmark..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Lista Desplegable de Resultados */}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((place) => (
                  <li 
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className="px-4 py-3 hover:bg-roman-bg cursor-pointer flex items-center gap-2 text-sm text-gray-700 border-b border-gray-100 last:border-0"
                  >
                    <MapPin size={16} className="text-terracotta" />
                    {place.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze text-gray-600"
                value={formData.arrival_date}
                onChange={(e) => setFormData({...formData, arrival_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze text-gray-600"
                value={formData.departure_date}
                onChange={(e) => setFormData({...formData, departure_date: e.target.value})}
              />
            </div>
          </div>

          {/* Title & Story */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
            <input 
              type="text" 
              placeholder="e.g., Our Parisian Picnic at Sunset"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Journal Entry</label>
            <textarea 
              rows="3"
              placeholder="Write a small memory from this place..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bronze/50 focus:border-bronze"
              value={formData.story}
              onChange={(e) => setFormData({...formData, story: e.target.value})}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-bronze hover:bg-bronze-dark text-white font-medium py-3.5 rounded-lg transition-colors shadow-md mt-4 disabled:opacity-50 flex justify-center items-center"
          >
            {isSubmitting ? 'Sealing...' : 'Seal Our Memories'}
          </button>
        </form>

      </div>
    </div>
  );
}