import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { useNavigate } from 'react-router-dom';
import { MapPin, X, Plus, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapView() {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState({
    longitude: 12.4964,
    latitude: 41.9028,
    zoom: 2.5
  });

  const [journeys, setJourneys] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);

  useEffect(() => {
    async function fetchJourneys() {
      const { data, error } = await supabase
        .from('journeys')
        .select('*, media(media_url)');
      
      if (error) {
        console.error('Error al cargar viajes:', error);
      } else {
        setJourneys(data || []);
      }
    }

    fetchJourneys();
  }, []);

  const formatTravelDate = (dateString) => {
    if (!dateString) return 'Fecha inolvidable';
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="w-full h-screen relative bg-[#E8DCC4]">
      
      {/* BOTONES FLOTANTES (Añadir viaje y Cerrar Sesión) */}
      <div className="absolute top-6 right-6 z-10 flex gap-4">
        <button 
          onClick={() => navigate('/add')}
          className="flex items-center gap-2 bg-bronze hover:bg-bronze-dark text-white px-5 py-3 rounded-full shadow-lg transition-all font-medium"
        >
          <Plus size={18} />
          <span className="hidden md:inline">Agregar Viajesito</span>
        </button>
        
        <button 
          onClick={() => supabase.auth.signOut()}
          className="flex items-center justify-center w-12 h-12 bg-white hover:bg-gray-50 text-terracotta rounded-full shadow-lg transition-all"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-sm border border-white/50 text-xl md:text-sm font-serif text-charcoal flex items-center gap-1.5">
          Hecho con <span className="text-terracotta text-base leading-none">❤️</span> por Dieguito para su Chelita
        </div>
      </div>

      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        projection="globe"
      >
        
        {/* DIBUJAMOS LOS PINES */}
        {journeys.map((journey) => (
          <Marker 
            key={journey.id}
            longitude={journey.longitude} 
            latitude={journey.latitude} 
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation(); 
              setSelectedJourney(journey);
            }}
          >
            <div className="cursor-pointer transition-transform hover:scale-110 drop-shadow-lg">
              <MapPin size={40} className="text-terracotta fill-terracotta stroke-[1.5px]" />
            </div>
          </Marker>
        ))}

        {/* LA VENTANITA (Popup) DINÁMICA */}
        {selectedJourney && (
          <Popup
            longitude={selectedJourney.longitude}
            latitude={selectedJourney.latitude}
            anchor="top"
            onClose={() => setSelectedJourney(null)}
            closeOnClick={false}
            closeButton={false} 
            className="rounded-2xl overflow-hidden shadow-2xl"
            maxWidth="300px"
          >
            {/* NUESTRA "X" PERSONALIZADA Y ELEGANTE */}
            <button 
              onClick={() => setSelectedJourney(null)}
              className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-500 p-1.5 rounded-full transition-colors"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            <div className="p-3 pt-5 text-center font-sans">
              <h3 className="font-serif text-xl text-charcoal font-semibold mt-1">
                {selectedJourney.destination}
              </h3>
              
              <p className="text-xs text-terracotta font-medium mb-3 uppercase tracking-wider">
                {formatTravelDate(selectedJourney.arrival_date)}
              </p>
              
              {selectedJourney.media && selectedJourney.media.length > 0 ? (
                <img 
                  src={selectedJourney.media[0].media_url} 
                  alt={selectedJourney.destination}
                  className="w-full h-32 object-cover rounded-lg shadow-sm"
                />
              ) : (
                <div className="w-full h-32 bg-roman-bg rounded-lg border border-bronze/20 flex items-center justify-center text-gray-400 text-sm italic">
                  No photos yet
                </div>
              )}
              
              <p className="text-sm text-gray-600 mt-3 italic line-clamp-2">
                "{selectedJourney.story || selectedJourney.title}"
              </p>
              
              <button 
                onClick={() => navigate(`/journey/${selectedJourney.id}`)}
                className="mt-4 mb-1 bg-bronze hover:bg-bronze-dark text-white px-4 py-2 rounded-full text-sm font-medium transition-colors w-full shadow-sm"
              >
                View Full Gallery
              </button>
            </div>
          </Popup>
        )}

      </Map>
    </div>
  );
}