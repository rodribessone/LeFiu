import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from 'react';
import Nav from './componentes/nav/Nav';
import Main from './componentes/Main/Main';
import Footer from './componentes/Footer/Footer';
import NotFound from './componentes/NotFound/NotFound';
import './index.css';
import ReactGA from "react-ga4";

ReactGA.initialize("G-D99C2BQD85");

const Carta = lazy(() => import('./componentes/Carta/Carta'));
const Pedido = lazy(() => import('./componentes/HacerPedido/Pedido'));
const Usuario = lazy(() => import('./componentes/usuario/Usuario'));
const EditarProducto = lazy(() => import('./componentes/Productos/EditarProducto'));
const CrearProducto = lazy(() => import('./componentes/Productos/CrearProducto'));
const ConfirmarCompra = lazy(() => import('./componentes/HacerPedido/ConfirmarCompra'));

// URL de la foto de viandas — subila a /public con este nombre o cambiá la ruta
const VIANDAS_IMG = "/viandas.jpeg";

function App() {

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <link rel="preload" href="/Fondo.webp" as="image" />
      <div className="fixed inset-0 -z-10">
        <img
          src="/Fondo.webp"
          loading="eager"
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

      {/* Cartel flotante de viandas — responsivo */}
      <a
        href="https://wa.me/542392548014?text=Hola%2C%20estoy%20interesado%20en%20las%20viandas%20%F0%9F%8D%BD%EF%B8%8F"
        target="_blank"
        rel="noopener noreferrer"
        className="viandas-card"
      >
        <img
          src={VIANDAS_IMG}
          alt="Viandas Le Fiu"
          className="viandas-img"
        />
        <div className="viandas-overlay" />
        <div className="viandas-text">
          <p className="viandas-brand">Le Fiu</p>
          <p className="viandas-label">Viandas 🥡</p>
        </div>
        <div className="viandas-badge">¡Consultá!</div>

        <style>{`
          .viandas-card {
            position: fixed;
            bottom: clamp(28px, 5vw, 40px);
            left: clamp(8px, 2vw, 16px);
            width: clamp(80px, 22vw, 120px);
            z-index: 40;
            border-radius: clamp(10px, 2vw, 14px);
            overflow: hidden;
            box-shadow: 0 6px 24px rgba(0,0,0,0.45);
            display: block;
            text-decoration: none;
            animation: viandas-float 3s ease-in-out infinite;
          }
          .viandas-img {
            width: 100%;
            aspect-ratio: 1 / 1;
            object-fit: cover;
            display: block;
          }
          .viandas-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.82) 40%, rgba(0,0,0,0.1) 100%);
          }
          .viandas-text {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: clamp(4px, 1vw, 8px) clamp(4px, 1.5vw, 10px);
            text-align: center;
          }
          .viandas-brand {
            margin: 0;
            font-size: clamp(7px, 1.8vw, 9px);
            font-weight: 900;
            color: #FACC15;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }
          .viandas-label {
            margin: 0;
            font-size: clamp(9px, 2.5vw, 13px);
            font-weight: 800;
            color: white;
            line-height: 1.15;
          }
          .viandas-badge {
            position: absolute;
            top: clamp(4px, 1vw, 8px);
            right: clamp(4px, 1vw, 8px);
            background: #DC2626;
            color: white;
            font-size: clamp(6px, 1.5vw, 8px);
            font-weight: 900;
            padding: 2px clamp(4px, 1vw, 7px);
            border-radius: 20px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            white-space: nowrap;
          }
          @keyframes viandas-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-5px) scale(1.03); }
          }
          /* En pantallas muy chicas (< 360px) lo achicamos un poco más */
          @media (max-width: 360px) {
            .viandas-card { width: 72px; }
          }
          /* En tablets y desktop lo fijamos para que no crezca demasiado */
          @media (min-width: 640px) {
            .viandas-card { width: 110px; bottom: 36px; left: 14px; }
          }
        `}</style>
      </a>
    </div>
  );
}

export default App;