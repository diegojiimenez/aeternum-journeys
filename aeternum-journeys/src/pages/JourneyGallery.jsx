import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';

export default function JourneyGallery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJourney() {
      const { data, error } = await supabase
        .from('journeys')
        .select('*, media(media_url)')
        .eq('id', id)
        .single(); 

      if (!error) {
        setJourney(data);
      }
      setLoading(false);
    }
    fetchJourney();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-roman-bg flex items-center justify-center font-serif text-2xl text-terracotta">Loading memories...</div>;
  if (!journey) return <div className="min-h-screen bg-roman-bg flex items-center justify-center font-serif text-2xl">Journey not found</div>;

  return (
    // Aseguramos que el fondo ocupe toda la pantalla y evitamos scroll en la página principal si es posible
    <div className="h-[calc(100vh-88px)] bg-roman-bg p-4 md:p-8 flex flex-col items-center">
      
      <div className="w-full max-w-6xl mb-4">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-gray-500 hover:text-terracotta transition-colors font-medium w-fit"
        >
          <ArrowLeft size={20} />
          <span>Return to Map</span>
        </button>
      </div>

      {/* CONTENEDOR PRINCIPAL: Aquí está la magia. Le damos una altura fija (h-[80vh]) */}
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 h-[80vh]">
        
        {/* Lado Izquierdo: Foto Principal (Fija) */}
        {/* Usamos md:h-full y flex-shrink-0 para que no se estire más allá del contenedor */}
        <div className="w-full md:w-5/12 h-[35vh] md:h-full relative flex-shrink-0">
          {journey.media && journey.media.length > 0 ? (
            <img 
              src={journey.media[0].media_url} 
              className="w-full h-full object-cover" 
              alt="Cover" 
            />
          ) : (
            <div className="w-full h-full bg-[#E8DCC4] flex items-center justify-center text-terracotta font-serif">
              No Cover Photo
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 md:p-10 text-white">
            <div className="flex items-center gap-2 text-bronze text-sm font-medium tracking-widest uppercase mb-2 shadow-black">
              <MapPin size={16} /> Current Location
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold drop-shadow-lg">{journey.destination}</h2>
          </div>
        </div>

        {/* Lado Derecho: Diario y Cuadrícula (SCROLLABLE) */}
        {/* Usamos overflow-y-auto y h-full. Solo esta parte tendrá scroll */}
        <div className="w-full md:w-7/12 p-6 md:p-12 overflow-y-auto h-full custom-scrollbar">
          
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-serif text-charcoal font-semibold">
              {journey.title || 'A Beautiful Journey'}
            </h1>
            <div className="bg-roman-bg text-terracotta px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border border-bronze/20 flex-shrink-0">
              <Calendar size={14} />
              {new Date(journey.arrival_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 text-lg">
            "{journey.story}"
          </p>

          {/* Estadísticas estilo Viaggio d'Amore */}
          <div className="flex gap-8 border-y border-gray-100 py-4 mb-8">
            <div>
              <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mb-1">Photos</p>
              <p className="text-xl font-serif text-bronze font-bold">{journey.media ? journey.media.length : 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold tracking-widest uppercase mb-1">Status</p>
              <p className="text-xl font-serif text-bronze font-bold">Captured</p>
            </div>
          </div>

          <h3 className="text-xl font-serif text-charcoal mb-6">
            Captured Moments
          </h3>
          
          {/* Cuadrícula de fotos */}
          {journey.media && journey.media.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 pb-8">
              {journey.media.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={img.media_url} 
                    alt={`memory-${idx}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm italic bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-200">
              No additional photos uploaded yet.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}