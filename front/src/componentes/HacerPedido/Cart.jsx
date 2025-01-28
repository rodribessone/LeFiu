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

  const { cartItems, removeFromCart } = useCart();

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
                <div
                  key={item._id} // Usa _id como clave única
                  className="flex items-center justify-between mb-4"
                >
                  <div>
                    <h3 className="font-bold">{item.nombre}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    <p className="text-sm text-gray-600">Precio unitario: ${item.precio}</p>
                    <p className="text-sm text-gray-600">Subtotal: ${item.precio * item.quantity}</p>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
