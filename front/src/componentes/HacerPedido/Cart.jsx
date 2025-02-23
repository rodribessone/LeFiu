import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce(
    (accumulator, item) => accumulator + item.precio * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (accumulator, item) => accumulator + item.quantity,
    0
  );

  const handleConfirmarCompra = () => {
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
          className="absolute p-6 -right-16 mt-6 w-80 text-black bg-white border rounded shadow-lg z-50 flex flex-col"
          style={{ 
            maxHeight: '70vh',
            overflow: 'hidden'
          }}
        >
          <h2 className="text-xl font-bold mb-4">Tu Carrito</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-600">Tu carrito está vacío.</p>
          ) : (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div 
                className="pr-2 overflow-y-auto flex-1" 
                style={{ maxHeight: 'calc(70vh - 180px)' }}
              >
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between pb-4 border-b"
                  >
                    <div>
                      <h3 className="font-bold">{item.nombre}</h3>
                      <p className="text-sm text-gray-600">
                        Cantidad: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Precio unitario: ${item.precio}
                      </p>
                      <p className="text-sm text-gray-600">
                        Subtotal: ${(item.precio * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 bg-white border-t">
                <div className="text-lg font-bold">
                  Total: ${total.toFixed(2)}
                </div>

                <Link to="/confirmarCompra">
                  <button
                    onClick={handleConfirmarCompra}
                    className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600"
                  >
                    Confirmar Compra
                  </button>
                </Link>

                <button
                  onClick={clearCart}
                  className="w-full bg-red-500 text-white py-2 rounded mt-4 hover:bg-red-600"
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}