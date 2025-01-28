import './index.css'
import { Routes, Route } from "react-router-dom"
import Nav from './componentes/nav/Nav'
import Main from './componentes/Main/Main'
import Carta from './componentes/Carta/Carta';
import Pedido from './componentes/HacerPedido/Pedido'
import Usuario from './componentes/usuario/Usuario'
import EditarProducto from './componentes/Productos/EditarProducto'
import CrearProducto from './componentes/Productos/CrearProducto'
import Footer from './componentes/Footer/Footer'
import ConfirmarCompra from './componentes/HacerPedido/ConfirmarCompra'

function App() {
  return (
      <>
          <div className="min-h-screen flex flex-col">
              <img
                  src="/Fondo.jpg"
                  className="fixed z-1 object-cover w-full h-full"
              />
              {/* Contenedor principal */}
              <div className="flex-grow flex flex-col relative z-10">
                  <Nav />
                  <Routes>
                      <Route path="/" element={<Main />} />
                      <Route path="/carta" element={<Carta />} />
                      <Route path="/pedido" element={<Pedido />} />
                      <Route path="/usuario" element={<Usuario />} />
                      <Route path="/editarProducto/:id" element={<EditarProducto />} />
                      <Route path="/crearProducto" element={<CrearProducto />} />
                      <Route path="/confirmarCompra" element={<ConfirmarCompra />} />
                  </Routes>
              </div>
              <Footer />
          </div>
      </>
  );
}
export default App
