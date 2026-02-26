import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, MapPin, ImagePlus, X } from 'lucide-react';

export default function AddJourney() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  
  // Nuevo estado para guardar las fotos seleccionadas
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const [formData, setFormData] = useState({
    destination: '',
    title: '',
    arrival_date: '',
    departure_date: '',
    story: '',
    latitude: null,
    longitude: null
  });

  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      try {
        const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}&types=place,country,region`);
        const data = await res.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Error buscando lugar:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectPlace = (place) => {
    setSearchQuery(place.place_name);
    setFormData({
      ...formData,
      destination: place.place_name,
      longitude: place.center[0],
      latitude: place.center[1]
    });
    setSuggestions([]);
  };

  // Función para manejar cuando eligen fotos
  const handlePhotoSelect = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedPhotos((prev) => [...prev, ...filesArray]);
    }
  };

  // Función para quitar una foto de la vista previa
  const removePhoto = (indexToRemove) => {
    setSelectedPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      alert("Por favor, selecciona un destino de la lista.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Guardamos el Viaje y pedimos que nos devuelva el ID creado (.select())
      const { data: journeyData, error: journeyError } = await supabase
        .from('journeys')
        .insert([{
          destination: formData.destination,
          title: formData.title,
          arrival_date: formData.arrival_date,
          departure_date: formData.departure_date,
          story: formData.story,
          latitude: formData.latitude,
          longitude: formData.longitude
        }])
        .select(); // IMPORTANTE: Esto nos devuelve el viaje recién creado

      if (journeyError) throw journeyError;
      
      const newJourneyId = journeyData[0].id;

      // 2. Subimos las fotos al Storage y las guardamos en la tabla 'media'
      if (selectedPhotos.length > 0) {
        for (const photo of selectedPhotos) {
          // Creamos un nombre único para la foto
          const fileExt = photo.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${newJourneyId}/${fileName}`; // Las guardamos en una carpeta con el ID del viaje

          // Subimos al bucket 'memories' (Asegúrate de que tu bucket se llame así)
          const { error: uploadError } = await supabase.storage
            .from('memories')
            .upload(filePath, photo);

          if (uploadError) throw uploadError;

          // Obtenemos el link público de la foto
          const { data: publicUrlData } = supabase.storage
            .from('memories')
            .getPublicUrl(filePath);

          // Guardamos el link en tu tabla 'media'
          await supabase.from('media').insert([{
            journey_id: newJourneyId,
            media_url: publicUrlData.publicUrl,
            media_type: 'image'
          }]);
        }
      }

      navigate('/'); // Volvemos al mapa
      
    } catch (error) {
      console.error('Error guardando:', error);
      alert('Hubo un error al guardar el viaje o las fotos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-88px)] bg-roman-bg flex items-center justify-center p-6 my-8">
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

          {/* ZONA DE SUBIDA DE FOTOS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Memories</label>
            
            {/* Caja punteada */}
            <div className="border-2 border-dashed border-bronze/40 rounded-xl p-8 text-center hover:bg-roman-bg/50 transition-colors relative cursor-pointer">
              {/* Input invisible flotando sobre la caja */}
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handlePhotoSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <ImagePlus className="mx-auto text-bronze mb-2" size={32} />
              <p className="text-sm font-medium text-charcoal">Drag & drop photos here</p>
              <p className="text-xs text-gray-500 mt-1">or click to browse from device</p>
            </div>

            {/* Vista previa de las fotos seleccionadas */}
            {selectedPhotos.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {selectedPhotos.map((photo, index) => (
                  <div key={index} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img 
                      src={URL.createObjectURL(photo)} 
                      alt="preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black text-white rounded-full p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-bronze hover:bg-bronze-dark text-white font-medium py-3.5 rounded-lg transition-colors shadow-md mt-4 disabled:opacity-50 flex justify-center items-center"
          >
            {isSubmitting ? 'Sealing Memories...' : 'Seal Our Memories'}
          </button>
        </form>

      </div>
    </div>
  );
}