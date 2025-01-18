import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect } from "react";

export default function ConfirmarCompra() {
  const { cartItems } = useCart(); // Obtener los productos del carrito
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [medioPago, setMedioPago] = useState("");
  const [delivery, setDelivery] = useState(0);

  const token = localStorage.getItem('token');

useEffect(() => {
  // Obtener el precio del delivery desde el backend
  fetch('http://localhost:3008/delivery', {
    method: 'GET', // Aquí estás utilizando DELETE, asegúrate de que este sea el método correcto
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Asegúrate de que el token se incluya aquí
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setDelivery(data.deliveryPrice); // Actualizar el precio de delivery
    })
    .catch((error) => console.error('Error al obtener el precio del delivery:', error));
}, []);

  // Cálculo del total a pagar
  const total = cartItems.reduce(
    (accumulator, item) => accumulator + item.precio * item.quantity,
    0
  );

  const businessNumber = "542392486277"; // Número de WhatsApp

  const handleSubmit = (event) => {
    event.preventDefault();

    // Generar el mensaje para WhatsApp
    const productos = cartItems.map(
      (item) => `${item.nombre} (Cantidad: ${item.quantity}, Precio: $${item.precio})`
    ).join(", ");
    
    const montoTotal = total + delivery;

    const mensaje = `¡Hola! Soy ${nombre}, te encargo para la dirección ${direccion} los siguientes productos: ${productos}. Voy a pagar con ${medioPago}. El monto total a pagar es $${montoTotal.toFixed(2)}.`; // Mensaje con el precio total

    // Redirigir a WhatsApp
    window.open(`https://wa.me/${businessNumber}?text=${encodeURIComponent(mensaje)}`, "_blank");

    alert("Compra confirmada. ¡Gracias por tu pedido!");
  };

  return (
    <div className="relative w-full my-auto max-w-md mx-auto mt-10 p-6 bg-white border rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Confirmar Compra</h2>
      <form onSubmit={handleSubmit}>
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
          type="text"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Monto"
          value={medioPago}
          onChange={(e) => setMedioPago(e.target.value)}
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
  );
}