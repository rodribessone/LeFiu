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

      {/* Cartel flotante de viandas — foto + animación */}
      <a
        href="https://wa.me/542392548014?text=Hola%2C%20estoy%20interesado%20en%20las%20viandas%20%F0%9F%8D%BD%EF%B8%8F"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: 48,
          left: 28,
          width: 160,
          height: 120,
          zIndex: 40,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
          display: "block",
          textDecoration: "none",
          animation: "viandas-float 3s ease-in-out infinite",
        }}
      >
        <img
          src={VIANDAS_IMG}
          alt="Viandas Le Fiu"
          style={{
            width: "100%",
            height: 110,
            objectFit: "cover",
            display: "block",
          }}
        />
        {/* Overlay degradado oscuro */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.82) 25%, rgba(0,0,0,0.1) 100%)",
        }} />
        {/* Texto */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "6px 8px",
          textAlign: "center",
        }}>
          <p style={{ margin: 0, fontSize: 8, fontWeight: 900, color: "#FACC15", letterSpacing: "0.1em", textTransform: "uppercase" }}>Le Fiu</p>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: "white", lineHeight: 1.1 }}>Viandas 🥡</p>
        </div>
        {/* Badge */}
        <div style={{
          position: "absolute",
          top: 7,
          right: 7,
          background: "#DC2626",
          color: "white",
          fontSize: 8,
          fontWeight: 900,
          padding: "2px 6px",
          borderRadius: 20,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>
          ¡Consultá!
        </div>

        <style>{`
          @keyframes viandas-float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-6px) scale(1.03); }
          }
        `}</style>
      </a>
    </div>
  );
}

export default App;