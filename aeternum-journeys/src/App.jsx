import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MapView from './pages/MapView';
import AddJourney from './pages/AddJourney';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Todo estará envuelto en nuestro Layout (La barra de navegación) */}
        <Route path="/" element={<Layout />}>
          {/* La ruta base '/' mostrará el MapView */}
          <Route index element={<MapView />} />
          <Route path="add" element={<AddJourney />} />
          
          {/* Aquí agregaremos las demás pantallas después */}
          <Route path="timeline" element={<div className="p-10 text-center font-serif text-2xl">Próximamente: Timeline</div>} />
          <Route path="gallery" element={<div className="p-10 text-center font-serif text-2xl">Próximamente: Galería</div>} />
          <Route path="journal" element={<div className="p-10 text-center font-serif text-2xl">Próximamente: Journal</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;