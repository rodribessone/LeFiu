import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Crea el contexto
const CartContext = createContext();

// Función para "normalizar" las salsas: quita espacios y filtra cadenas vacías.
const normalizeSauces = (sauces) => {
  if (!sauces) return [];
  return sauces.map(s => s.trim()).filter(s => s !== "");
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCartItems((prev) => {
      if (product.categoria === "POLLITO FRITO CON SALSAS") {
        // Normalizamos el array de salsas del producto nuevo
        const saucesNew = normalizeSauces(product.salsasSeleccionadas);
        // Buscamos un item existente con el mismo id, mismo tipo y mismas salsas
        const existingItem = prev.find(item => {
          if (item.id === product.id && item.tipoHamburguesa === product.tipoHamburguesa) {
            const saucesExisting = normalizeSauces(item.salsasSeleccionadas);
            return JSON.stringify(saucesNew) === JSON.stringify(saucesExisting);
          }
          return false;
        });
        if (existingItem) {
          return prev.map(item =>
            item.id === product.id &&
            item.tipoHamburguesa === product.tipoHamburguesa &&
            JSON.stringify(normalizeSauces(item.salsasSeleccionadas)) === JSON.stringify(saucesNew)
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      } else {
        // Para otros productos se combinan si id y tipo coinciden
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

export const useCart = () => useContext(CartContext);