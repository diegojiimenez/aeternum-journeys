import { useState, useEffect } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Importamos tu puente de conexión
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapView() {
  const [viewState, setViewState] = useState({
    longitude: 12.4964,
    latitude: 41.9028,
    zoom: 3
  });

  // 1. Nuevos estados para guardar los datos
  const [journeys, setJourneys] = useState([]); // Aquí se guardará la lista de viajes
  const [selectedJourney, setSelectedJourney] = useState(null); // El viaje al que le dimos clic

  // 2. Efecto mágico que busca los datos al abrir la página
  useEffect(() => {
    async function fetchJourneys() {
      // Pedimos todos los datos a la tabla 'journeys'
      const { data, error } = await supabase.from('journeys').select('*');
      
      if (error) {
        console.error('Error al cargar viajes:', error);
      } else {
        setJourneys(data || []); // Guardamos los viajes encontrados
      }
    }

    fetchJourneys();
  }, []);

  return (
    <div className="w-full h-[calc(100vh-88px)] relative bg-[#E8DCC4]">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        projection="globe"
      >
        
        {/* 3. DIBUJAMOS LOS PINES DINÁMICAMENTE */}
        {journeys.map((journey) => (
          <Marker 
            key={journey.id}
            longitude={journey.longitude} 
            latitude={journey.latitude} 
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation(); 
              setSelectedJourney(journey); // Abrimos la tarjeta de este viaje específico
            }}
          >
            <div className="cursor-pointer transition-transform hover:scale-110 drop-shadow-lg">
              <MapPin size={40} className="text-terracotta fill-terracotta stroke-[1.5px]" />
            </div>
          </Marker>
        ))}

        {/* 4. LA VENTANITA (Popup) DINÁMICA */}
        {selectedJourney && (
          <Popup
            longitude={selectedJourney.longitude}
            latitude={selectedJourney.latitude}
            anchor="top"
            onClose={() => setSelectedJourney(null)}
            closeOnClick={false}
            className="rounded-2xl overflow-hidden shadow-2xl"
            maxWidth="300px"
          >
            <div className="p-2 text-center font-sans">
              <h3 className="font-serif text-xl text-charcoal font-semibold mt-1">
                {selectedJourney.destination}
              </h3>
              
              {/* Aquí luego formatearemos bien la fecha */}
              <p className="text-xs text-terracotta font-medium mb-3 uppercase tracking-wider">
                {selectedJourney.arrival_date ? selectedJourney.arrival_date : 'Fecha inolvidable'}
              </p>
              
              {/* Foto provisional hasta que conectemos la tabla de fotos */}
              <img 
                src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=400&auto=format&fit=crop" 
                alt={selectedJourney.destination}
                className="w-full h-32 object-cover rounded-lg shadow-sm"
              />
              
              <p className="text-sm text-gray-600 mt-3 italic line-clamp-2">
                "{selectedJourney.story || selectedJourney.title}"
              </p>
              
              <button className="mt-4 mb-1 bg-bronze hover:bg-bronze-dark text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors w-full">
                Ver Galería Completa
              </button>
            </div>
          </Popup>
        )}

      </Map>
    </div>
  );
}