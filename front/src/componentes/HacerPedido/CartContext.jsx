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
      const existingItem = prev.find((item) => {
        // Si el producto es "POLLITO FRITO CON SALSAS", comparar también las salsas seleccionadas
        if (product.categoria === "POLLITO FRITO CON SALSAS") {
          return (
            item.id === product.id &&
            item.tipoHamburguesa === product.tipoHamburguesa &&
            JSON.stringify(item.salsasSeleccionadas) === JSON.stringify(product.salsasSeleccionadas)
          );
        } else {
          // Para los demás productos, comparar solo id y tipo
          return item.id === product.id && item.tipoHamburguesa === product.tipoHamburguesa;
        }
      });
  
      if (existingItem) {
        // Si ya existe el producto (con las mismas características), aumentamos la cantidad
        return prev.map((item) =>
          product.categoria === "POLLITO FRITO CON SALSAS"
            ? item.id === product.id &&
              item.tipoHamburguesa === product.tipoHamburguesa &&
              JSON.stringify(item.salsasSeleccionadas) === JSON.stringify(product.salsasSeleccionadas)
              ? { ...item, quantity: item.quantity + 1 }
              : item
            : item.id === product.id && item.tipoHamburguesa === product.tipoHamburguesa
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Si es un nuevo producto o tiene diferencias (por ejemplo, salsas distintas), lo agregamos
        return [
          ...prev,
          { ...product, quantity: 1 }, // Inicializa con cantidad 1
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