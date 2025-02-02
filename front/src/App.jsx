import { Routes, Route} from "react-router-dom";
import { lazy, Suspense } from 'react';
import Nav from './componentes/nav/Nav';
import Main from './componentes/Main/Main';
import Footer from './componentes/Footer/Footer';
import NotFound from './componentes/NotFound/NotFound';
import './index.css';

// Lazy load de componentes
const Carta = lazy(() => import('./componentes/Carta/Carta')
  .then(module => ({ default: module.Carta })));
const Pedido = lazy(() => import('./componentes/HacerPedido/Pedido'));
const Usuario = lazy(() => import('./componentes/usuario/Usuario'));
const EditarProducto = lazy(() => import('./componentes/Productos/EditarProducto'));
const CrearProducto = lazy(() => import('./componentes/Productos/CrearProducto'));
const ConfirmarCompra = lazy(() => import('./componentes/HacerPedido/ConfirmarCompra'));

function App() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Imagen optimizada con preload */}
      <link rel="preload" href="/Fondo.webp" as="image" />
      <div className="fixed inset-0 -z-10">
        <img 
          src="/Fondo.webp"
          loading="eager"  // Cambiado a eager para carga prioritaria
          decoding="sync"
          className="object-cover w-full h-full"
          alt="Fondo decorativo de Le Fiu Burgers"
        />
      </div>
      
      <Nav />
      
      <main className="flex-1 pb-20">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando experiencia culinaria...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/carta" element={<Carta />} />
              <Route path="/pedido" element={<Pedido />} />
              <Route path="/usuario" element={<Usuario />} />
              <Route path="/editarProducto/:id" element={<EditarProducto />} />
              <Route path="/crearProducto" element={<CrearProducto />} />
              <Route path="/confirmarCompra" element={<ConfirmarCompra />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
      </main>

      <Footer className="mt-auto" />
    </div>
  );
}

export default App;