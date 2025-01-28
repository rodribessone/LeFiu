import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect } from "react";

export default function ConfirmarCompra() {
  const { cartItems } = useCart(); // Obtener los productos del carrito
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [medioPago, setMedioPago] = useState("");
  const [delivery, setDelivery] = useState(0);
  const [montoPagar, setMontoPagar] = useState(""); // Añadir el estado para el monto a pagar
  const [comprobante, setComprobante] = useState(null); // Estado para el archivo de comprobante
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

  // Manejar el cambio del archivo comprobante
  const handleComprobanteChange = (e) => {
    setComprobante(e.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validación para el comprobante si el medio de pago es MercadoPago
    if (medioPago === "MercadoPago" && !comprobante) {
      alert("Por favor, sube el comprobante de pago.");
      return;
    }

    // Aquí solo mostramos si el archivo fue adjuntado, sin enviar datos al backend
    if (comprobante) {
      alert(`Se ha adjuntado el archivo: ${comprobante.name}`);
    } else {
      alert("No se ha adjuntado ningún archivo.");
    }

    // Crear mensaje de WhatsApp para confirmar el pedido
    const productos = cartItems
      .map(
        (item) => `${item.nombre} (Cantidad: ${item.quantity}, Precio: $${item.precio})`
      )
      .join(", ");
    const montoTotal = total + delivery;

    const mensaje = `¡Hola! Soy *${nombre}*\n\nTe encargo para la dirección *${direccion}* los siguientes productos:\n${productos}.\n\nVoy a pagar con *${medioPago}*.\n\nEl monto total a pagar es *$${montoTotal.toFixed(2)}*`;

    window.open(`https://wa.me/${businessNumber}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="relative w-full mt-20 p-6 max-w-md mx-auto bg-white border rounded shadow-lg mb-16">
          <h2 className="text-2xl font-bold mb-4 text-center">Confirmar Compra</h2>
          <form onSubmit={handleSubmit} className="pt-4"> {/* Espacio para que no se superponga el navbar */}
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

            {/* Cargar monto a pagar si es necesario */}
            {medioPago !== "MercadoPago" && (
            <input
              type="number"
              className="w-full p-2 mb-4 border rounded"
              placeholder="Voy a pagar con... "
              value={montoPagar}
              onChange={(e) => setMontoPagar(e.target.value)}
              required
              />
            )}
            {/* Si el medio de pago es MercadoPago, mostrar alias y comprobante */}
            {medioPago === "MercadoPago" && (
              <div className="mb-4">
                <p className="text-sm mb-2">Alias MercadoPago: <b>lefiu.burgers</b></p>
                <label className="block mb-2 font-bold">Subir comprobante:</label>
                <input
                  type="file"
                  className="w-full p-2 mb-4 border rounded"
                  onChange={handleComprobanteChange}
                  accept="image/*,application/pdf"
                />
                {comprobante && comprobante.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(comprobante)}
                    alt="Vista previa del comprobante"
                    className="w-full h-auto mt-2"
                  />
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Confirmar Pedido
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
