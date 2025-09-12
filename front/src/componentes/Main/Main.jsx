import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect } from "react";

export default function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const [mensajeCerrado, setMensajeCerrado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() + now.getMinutes() / 60;

    const schedule = {
      // 1: { open: 9.5, close: 24 },   //LUNES cambiar unicamente para desarrollo
      // 2: { open: 0, close: 24 },     //MARTES
      // 3: { open: 0, close: 23.5 },   //MIERCOLES
      4: { open: 20.5, close: 23.5 },   //JUEVES
      5: { open: 1.5, close: 23.5 },   //VIERNES
      6: { open: 20.5, close: 23.5 },   //SABADUKI
      0: { open: 0.5, close: 23.5 },   //DOMINGO
    };

    setIsOpen(schedule[currentDay]?.open <= currentTime && currentTime <= schedule[currentDay]?.close);
  }, []);

  const handleHacerPedidoClick = () => {
    isOpen ? navigate("/pedido") : setMensajeCerrado(true);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-6rem)] pt-12 pb-10 z-20 sm:pt-16 overflow-hidden">
      <div className="bg-white rounded-lg flex flex-col items-center p-6 w-full max-w-xs space-y-3 shadow-xl mx-4">
        {/* Encabezado */}
        <img src='Logo.jpg' className='rounded-full w-20 h-20 mb-3' alt="Logo Le Fiu" />
        <h1 className='text-2xl font-bold mb-2'>Le Fiu</h1>
        
        {/* Estado */}
        <div className="mb-4">
          <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFD580_0%,#FFA500_50%,#FF4500_100%)]"></span>
            <div className={`px-4 py-1 ${isOpen ? "bg-green-500" : "bg-red-600"} text-white rounded-full backdrop-blur-3xl`}>
              {isOpen ? "Abierto" : "Cerrado"}
            </div>
          </span>
        </div>

        {/* Horario */}
        <p className='text-center text-sm mb-4'>⏰ Miércoles a Domingo<br/>20:30 - 23:30</p>

        {/* Redes Sociales */}
        <div className="mb-6">
          <a href="https://www.instagram.com/lefiu.burgers/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="hover:scale-110 transition-transform">
            <FontAwesomeIcon className="text-2xl text-pink-600 hover:text-pink-700" icon={faInstagram} />
          </a>
        </div>

        {/* Botones compactos */}
        <div className="w-full grid grid-cols-1 gap-2">
          <button 
            className='bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition-colors text-lg text-center h-12 flex items-center justify-center'
            onClick={handleHacerPedidoClick}
          >
            Hacer Pedido
          </button>

          <Link 
            to="/carta" 
            className='bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition-colors text-lg text-center h-12 flex items-center justify-center'
          >
            Ver Carta
          </Link>

          <a
            href="https://wa.me/542392548014?text=Hola,%20quisiera%20hacer%20una%20consulta%20sobre"
            className='bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition-colors text-lg text-center h-12 flex items-center justify-center'
          >
            WhatsApp
          </a>
        </div>

        {/* Mensaje de cerrado */}
        {mensajeCerrado && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg text-center max-w-xs animate-pop-in">
              <p className="text-red-600 mb-4 font-medium">Lo sentimos, estamos cerrados</p>
              <button
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => setMensajeCerrado(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}