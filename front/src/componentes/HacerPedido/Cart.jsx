import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

export default function Cart() {

  const [isOpen, setIsOpen] = useState(false); // Controla la visibilidad del menú
  const menuRef = useRef(null); // Referencia para el contenedor del menú

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

  const { cartItems, removeFromCart, clearCart } = useCart();

  return (
    <div className="relative">

        <button onClick={toggleMenu} className="text-2xl text-white">
            <FontAwesomeIcon icon={faCartShopping} />
        </button>

        {isOpen && (
        <div
          ref={menuRef}
          className="absolute p-6 -right-16 mt-6 w-80 text-black bg-white border rounded shadow-lg z-50"
        >
            
            <h2 className="text-xl font-bold mb-4">Tu Carrito</h2>

            {cartItems.length === 0 ? (
                <p className="text-gray-600">Tu carrito está vacío.</p>
            ) : (
                    <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold">{item.nombre}</h3>
                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                            <p className="text-sm text-gray-600">Precio: ${item.precio}</p>
                        </div>
                        <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Eliminar
                        </button>
                        </div>
                    ))}
                            <button
                                onClick={clearCart}
                                className="w-full bg-red-500 text-white py-2 rounded mt-4 hover:bg-red-600"
                            >
                                Vaciar Carrito
                            </button>
                    </div>
            )}
      </div> )}
    </div>
  );
}