import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false); // Controla la visibilidad del menú
  const [view, setView] = useState('login'); // Alterna entre 'login' y 'register'
  const [formData, setFormData] = useState({ username: '', email: '', password: '' }); // Datos del formulario
  const [errorMessage, setErrorMessage] = useState(''); // Mensajes de error
  const [user, setUser] = useState(null); // Almacena los datos del usuario
  const menuRef = useRef(null); // Referencia para el contenedor del menú
  const backendUrl = import.meta.env.VITE_BACKEND_URL;  // Revisa si ya contiene un slash final

  // Alterna la visibilidad del menú
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Detecta clics fuera del menú para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  

  // Maneja cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpiar los mensajes de error previos
  
    const url = view === 'login' ? `${backendUrl}/login` : `${backendUrl}/register`;
    const body = JSON.stringify(formData);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Si la respuesta no es ok, lanzamos un error con el mensaje del backend
        throw new Error(data.message || 'Ocurrió un error inesperado');
      }
  
      if (view === 'login') {
        // Guardar token en localStorage al iniciar sesión
        localStorage.setItem('token', data.token);
        setUser(data.user); // Guardar datos del usuario
        alert('Inicio de sesión exitoso');
        setIsOpen(false);
      } else {
        // Cambiar al formulario de inicio de sesión después de registrarse
        alert('Registro exitoso');
        setView('login');
      }
    } catch (error) {
      // Mostrar el mensaje de error recibido del backend
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="text-2xl">
        <FontAwesomeIcon icon={faUser} />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-6 w-64 text-black bg-white border rounded shadow-lg z-50"
        >



          <div className="p-4">
            {user ? (
              <div>
                <h2 className="text-lg text-center font-semibold mb-2">
                  Hola, {user.username}
                </h2>

                {user.role === 'admin' && (
                    <div className="mb-4">
                    <Link to="/usuario" className="flex justify-center bg-blue-500 text-white py-2 rounded mb-2">Modificar productos</Link>
                    
                    {/* lo del button siguiente y el div de abajo es lo de los cupones, por ahora no se agrega */}
                    <button
                        className="w-full bg-green-500 text-white py-2 rounded hidden"
                    >
                        Generar cupones
                    </button>
                    </div>
                )}

                <div className='hidden'>
                <h3 className="text-md font-semibold">Tus cupones:</h3>
                {user.coupons ? (
                    <p className="text-sm font-semibold">{user.coupons}</p>
                ) : (
                    <p className="text-sm text-gray-500">No tienes cupones disponibles</p>
                )}
                </div>

                <button
                  onClick={() => {
                    setUser(null); // Cerrar sesión
                    localStorage.removeItem('token');
                    alert('Cerraste sesión');
                  }}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <>
                {view === 'login' ? (
                  <>
                    <h2 className="text-lg text-center font-semibold mb-2">Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        name="username"
                        placeholder="Usuario"
                        className="w-full p-2 mb-2 border rounded"
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        className="w-full p-2 mb-4 border rounded"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button className="w-full bg-blue-500 text-white py-2 rounded">
                        Entrar
                      </button>
                      {errorMessage && (
                        <p className="text-red-500 text-center mt-2">{errorMessage}</p>
                      )}
                    </form>
                    <button
                      className="text-blue-500 mt-2 underline"
                      onClick={() => setView('register')}
                    >
                      ¿No tienes cuenta? Regístrate
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg text-center font-semibold mb-2">Registrarse</h2>
                    <form onSubmit={handleSubmit}>
                      <input
                        type="text"
                        name="username"
                        placeholder="Usuario"
                        className="w-full p-2 mb-2 border rounded"
                        value={formData.username}
                        onChange={handleInputChange}
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-2 mb-4 border rounded"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        className="w-full p-2 mb-4 border rounded"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                      <button className="w-full bg-green-500 text-white py-2 rounded">
                        Registrarse
                      </button>
                      {errorMessage && (
                        <p className="text-red-500 text-center mt-2">{errorMessage}</p>
                      )}
                    </form>
                    <button
                      className="text-blue-500 mt-2 underline"
                      onClick={() => setView('login')}
                    >
                      ¿Ya tienes cuenta? Inicia sesión
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}