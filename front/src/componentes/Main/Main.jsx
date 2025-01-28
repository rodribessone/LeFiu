import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useState, useEffect } from "react";

export default function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const [mensajeCerrado, setMensajeCerrado] = useState(false); // Para mostrar el mensaje de negocio cerrado
  const navigate = useNavigate(); // Hook para redirigir

  useEffect(() => {
    // Obtén la fecha y hora actuales
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const currentTime = now.getHours() + now.getMinutes() / 60; // Hora en formato decimal

    // Define horarios de apertura
    const schedule = {
      1: { open: 20.5, close: 24 }, // Lunes: 20:30 - 23:30
      2: { open: 0, close: 23 }, // Martes: 20:30 - 23:30
      3: { open: 20.5, close: 23.5 }, // Miércoles: 20:30 - 23:30
      4: { open: 20.5, close: 23.5 }, // Jueves: 20:30 - 23:30
      5: { open: 20.5, close: 23.5 }, // Viernes: 20:30 - 23:30
      6: { open: 20.5, close: 23.5 }, // Sábado: 20:30 - 23:30
      0: { open: 20.5, close: 23.5 }, // Domingo: 20:30 - 23:30
    };

    // Verifica si está abierto
    if (schedule[currentDay]) {
      const { open, close } = schedule[currentDay];
      if (currentTime >= open && currentTime <= close) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } else {
      setIsOpen(false); // Cerrado si no está en el horario definido
    }
  }, []);

  const handleHacerPedidoClick = () => {
    if (isOpen) {
      navigate("/pedido"); // Redirige a la página de pedidos si está abierto
    } else {
      setMensajeCerrado(true); // Muestra el mensaje si el negocio está cerrado
    }
  };

  return (
    <div className='relative m-auto'>
      <div className='bg-white rounded flex flex-col justify-center items-center min-w-96 min-h-full'>
        <img src='Logo.jpg' className='rounded-full w-20 h-20 m-2' />
        <h1 className='text-2xl m-2 font-bold'>Le Fiu</h1>
        <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
          <span
            className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FFD580_0%,#FFA500_50%,#FF4500_100%)]"
          ></span>
          <div
            className={`px-4 py-1 ${isOpen ? "text-white rounded-full bg-green-500 backdrop-blur-3xl" : "bg-red-600 text-white rounded-full backdrop-blur-3xl"}`}
          >
            {isOpen ? "Abierto" : "Cerrado"}
          </div>
        </span>

        <p className='text-center p-2 '> ⏰ Miércoles a Domingo de 20:30 a 23:30 <br /></p>

        <div>
          <a href="https://www.instagram.com/lefiu.burgers/"
            target="_blank"
            rel="noopener noreferrer"><FontAwesomeIcon className="text-2xl hover:text-red-500" icon={faInstagram} /></a>
        </div>

        {/* Botón de "Hacer un pedido" */}
        <button 
          className='text-2xl bg-black rounded-lg w-4/5 text-white p-2 m-2 text-center'
          onClick={handleHacerPedidoClick}
        >
          Hacer un pedido
        </button>

        {/* Si el negocio está cerrado, mostrar el mensaje */}
        {mensajeCerrado && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded-lg shadow-lg text-center">
            <p>Lo sentimos, el negocio está cerrado en este momento.</p>
            <button
              className="mt-2 px-4 py-2 bg-white text-red-500 rounded-lg shadow hover:bg-gray-200"
              onClick={() => setMensajeCerrado(false)} // Cierra el mensaje
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Otros botones */}
        <Link to="/carta" className="text-2xl bg-black rounded-lg w-4/5 text-white p-2 m-2 text-center">Consulta la carta</Link>
        <a
          href="https://wa.me/542392486277?text=Hola,%20quisiera%20hacer%20una%20consulta%20sobre"
          rel="noopener noreferrer"
          className='text-2xl bg-black rounded-lg w-4/5 text-white p-2 m-2 text-center'
          target="_blank"
        >
          Chat por whatsapp
        </a>
      </div>
    </div>
  );
}