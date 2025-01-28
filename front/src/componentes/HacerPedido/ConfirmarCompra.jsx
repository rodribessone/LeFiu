import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect } from "react";

export default function ConfirmarCompra() {
  const { cartItems } = useCart(); // Obtener los productos del carrito
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [medioPago, setMedioPago] = useState("");
  const [delivery, setDelivery] = useState(0);
  const [montoPagar, setMontoPagar] = useState(""); // Añadir el estado para el monto a pagar
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${backendUrl}/delivery`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDelivery(data.deliveryPrice);
      })
      .catch((error) => console.error('Error al obtener el precio del delivery:', error));
  }, []);

  const total = cartItems.reduce(
    (accumulator, item) => accumulator + item.precio * item.quantity,
    0
  );

  const businessNumber = "542392486277"; // Número de WhatsApp

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const productos = cartItems.map(
      (item) => `${item.nombre} (Cantidad: ${item.quantity}, Precio: $${item.precio})`
    ).join(", ");
    
    const montoTotal = total + delivery;
  
    const mensaje = `¡Hola! Soy *${nombre}*\n\nTe encargo para la dirección *${direccion}* los siguientes productos:\n${productos}.\n\nVoy a pagar con *${medioPago}*.\n\nEl monto total a pagar es *$${montoTotal.toFixed(2)}*`;
  
    // Abre WhatsApp con el mensaje
    window.open(`https://wa.me/${businessNumber}?text=${encodeURIComponent(mensaje)}`, "_blank");
  

    alert("Compra confirmada. ¡Gracias por tu pedido!");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="relative w-full mt-16 p-6 max-w-md mx-auto bg-white border rounded shadow-lg mb-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Confirmar Compra</h2>
        <form onSubmit={handleSubmit} className="pt-20"> {/* Espacio para que no se superponga el navbar */}
          <label className="block mb-2 font-bold">Nombre:</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label className="block mb-2 font-bold">Dirección:</label>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded"
            placeholder="Tu dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />

          <label className="block mb-2 font-bold">Medio de pago:</label>
          <select
            className="w-full p-2 mb-4 border"
            value={medioPago}
            onChange={(e) => setMedioPago(e.target.value)}
            required
          >
            <option value="Efectivo">Efectivo</option>
            <option value="MercadoPago">MercadoPago</option>
          </select>

          <p className="block mb-2">El monto es: <b>${total.toFixed(2)}</b></p>
          <p className="block mb-2">+ delivery: <b>${delivery}</b></p>
          <p className="block mb-2">Monto total: <b>${(total + delivery).toFixed(2)}</b></p>

          <input
            type="number"
            className="w-full p-2 mb-4 border rounded"
            placeholder="Voy a pagar con... "
            value={montoPagar}
            onChange={(e) => setMontoPagar(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Confirmar Pedido
          </button>
        </form>
      </div>

      {/* Aquí podrías agregar tu footer si lo tienes */}
      <footer className="bg-gray-800 text-white py-4 mt-4 text-center">
        <p>Footer content goes here</p>
      </footer>
    </div>
  );
}
