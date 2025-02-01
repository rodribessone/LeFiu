import { Routes, Route } from "react-router-dom"
import { lazy, Suspense } from 'react';
import Nav from './componentes/nav/Nav'
import Main from './componentes/Main/Main'
import Footer from './componentes/Footer/Footer'
import NotFound from './componentes/NotFound/NotFound' // ✅ Añade esta importación
import './index.css'

// Lazy load de todos los componentes de rut
const Carta = lazy(() => import('./componentes/Carta/Carta'));
const Pedido = lazy(() => import('./componentes/HacerPedido/Pedido'));
const Usuario = lazy(() => import('./componentes/usuario/Usuario'));
const EditarProducto = lazy(() => import('./componentes/Productos/EditarProducto'));
const CrearProducto = lazy(() => import('./componentes/Productos/CrearProducto'));
const ConfirmarCompra = lazy(() => import('./componentes/HacerPedido/ConfirmarCompra'));

function App() {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Fondo optimizado */}
      <div className="fixed inset-0 -z-10">
        <img 
          src='/Fondo.webp' 
          loading="lazy"
          decoding="async"
          className="object-cover w-full h-full"
          alt="Fondo decorativo"
        />
      </div>
      
      <Nav />
      
      <main className="flex-1 pb-20"> {/* Añadido padding-bottom para el footer */}
        <Suspense fallback={
          <div className="text-center py-20">
            <span className="loading loading-infinity loading-lg text-primary"></span>
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
            <Route path="" element={<NotFound />} /> {/ ✅ Ahora funcionará con la importación */}
          </Routes>
        </Suspense>
      </main>

      <Footer className="mt-auto" /> {/* Añadido mt-auto2 */}
    </div>
  )
}

export default App