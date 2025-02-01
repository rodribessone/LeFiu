import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { cartItems, removeFromCart, clearCart } = useCart(); // Asegúrate de que `clearCart` esté disponible

  // Calcula el total del carrito
  const total = cartItems.reduce(
    (accumulator, item) => accumulator + item.precio * item.quantity,
    0
  );

  // Calcula la cantidad total de productos en el carrito
  const totalItems = cartItems.reduce(
    (accumulator, item) => accumulator + item.quantity,
    0
  );

  const handleConfirmarCompra = () => {
    // Cierra el carrito cuando se confirma la compra
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu} className="text-2xl text-white relative">
        <FontAwesomeIcon icon={faCartShopping} />
        {totalItems > 0 && (
          <span className="absolute top-0 left-5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {totalItems}
          </span>
        )}
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
  <div key={item.id} className="mb-4">
    <div className="flex justify-between">
      <div>
        <h3 className="font-bold">{item.nombre}</h3>
        <p className="text-sm text-gray-600">
          Precio base: ${item.precioBase?.toFixed(2) || item.precio.toFixed(2)}
        </p>
        
        {/* Mostrar salsas seleccionadas */}
        {item.salsasSeleccionadas?.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-semibold">Salsas incluidas:</p>
            <ul className="list-disc pl-4">
              {item.salsasSeleccionadas.map((salsa, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {salsa} {index < 2 ? "(Gratis)" : `(+$800)`}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Mostrar extras */}
        {item.costoExtraSalsas > 0 && (
          <p className="text-sm text-red-500 mt-1">
            Salsas adicionales: +${item.costoExtraSalsas.toFixed(2)}
          </p>
        )}
      </div>
      
      <div className="text-right">
        <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
        <p className="text-sm text-gray-600">
          Total: ${(item.precio * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <div className="text-lg font-bold mt-4">
                Total: ${total.toFixed(2)}
              </div>
              <button
                onClick={handleConfirmarCompra} // Minimiza el carrito
                className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600"
              >
                <Link to="/confirmarCompra">Confirmar Compra</Link>
              </button>

              {/* Agregado del botón para vaciar el carrito */}
              <button
                onClick={clearCart}
                className="w-full bg-red-500 text-white py-2 rounded mt-4 hover:bg-red-600"
              >
                Vaciar Carrito
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
