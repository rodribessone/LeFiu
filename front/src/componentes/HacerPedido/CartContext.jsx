import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Crea el contexto
const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems((prev) => {
      const precioBase = product.precio - (product.costoExtraSalsas || 0); // Restar el costo extra
      const existingItem = prev.find(
        (item) => 
          item.id === product.id && 
          item.tipoHamburguesa === product.tipoHamburguesa &&
          JSON.stringify(item.salsasSeleccionadas) === JSON.stringify(product.salsasSeleccionadas)
      );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id &&
          item.tipoHamburguesa === product.tipoHamburguesa &&
          JSON.stringify(item.salsasSeleccionadas) === JSON.stringify(product.salsasSeleccionadas)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es un nuevo producto o tiene un tipo diferente, agrégalo
        return [
          ...prev,
          { 
            ...product, 
            quantity: 1,
            precio: precioBase // Usar el precio base sin extras
          },
        ];
      }
    });
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (id, tipoHamburguesa) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === id && item.tipoHamburguesa === tipoHamburguesa))
    );
  };

  // Función para vaciar el carrito
  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Validación de tipos de prop
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook para usar el contexto
export const useCart = () => useContext(CartContext);