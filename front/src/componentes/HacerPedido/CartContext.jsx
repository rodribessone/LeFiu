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
      // Para "POLLITO FRITO CON SALSAS", siempre agregamos un nuevo ítem
      if (product.categoria === "POLLITO FRITO CON SALSAS") {
        return [...prev, { ...product, quantity: 1 }];
      } else {
        // Para los demás productos, buscamos combinar si ya existe el mismo producto con el mismo tipo
        const existingItem = prev.find(
          (item) => item.id === product.id && item.tipoHamburguesa === product.tipoHamburguesa
        );
        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id && item.tipoHamburguesa === product.tipoHamburguesa
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
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

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook para usar el contexto
export const useCart = () => useContext(CartContext);