import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect } from "react";
import CopiarAlias from "./CopiarAlias";

export default function ConfirmarCompra() {
  const { cartItems } = useCart();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [medioPago, setMedioPago] = useState("");
  const [montoEfectivo, setMontoEfectivo] = useState(0); // Nuevo estado para el monto en efectivo
  const [delivery, setDelivery] = useState(0);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${backendUrl}/delivery`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al obtener el precio del delivery");
        }
        return res.json();
      })
      .then((data) => {
        setDelivery(data.deliveryPrice);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "Hubo un error al obtener el precio del delivery. Por favor, intenta nuevamente."
        );
      });
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce(
      (accumulator, item) => accumulator + item.precio * item.quantity,
      0
    );
  };

  const calculateMontoTotal = () => {
    return calculateTotal() + delivery;
  };

  const total = calculateTotal();
  const montoTotal = calculateMontoTotal();

  const businessNumber = "542392486277";

  const handleSubmit = (event) => {
    event.preventDefault();

    const productos = cartItems
      .map(
        (item) =>
          `${item.nombre} (Cantidad: ${item.quantity}, Precio: $${item.precio})`
      )
      .join(", ");

    // Mensaje base
    let mensaje = `¡Hola! Soy *${nombre}*.\n\nTe encargo los siguientes productos para la dirección *${direccion}*:\n${productos}.\n\nVoy a pagar con *${medioPago}*.\n\nEl monto total a pagar es *$${montoTotal.toFixed(
      2
    )}*.`;

    // Agregar el monto con el que pagará en efectivo si es el caso
    if (medioPago === "Efectivo") {
      mensaje += `\n\nVoy a pagar con *$${montoEfectivo}* en efectivo.`;
    }

    // Agregar el mensaje de comprobante solo si no es pago en efectivo
    if (medioPago !== "Efectivo") {
      mensaje += `\n\n*Por favor, recuerda enviar el comprobante de pago en esta conversación.*`;
    }

    mensaje += `\n\n¡Gracias!`;

    window.open(`https://wa.me/${businessNumber}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const isFormValid = nombre && direccion && medioPago;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="relative w-full mt-20 p-6 max-w-md mx-auto bg-white border rounded shadow-lg mb-16">
          <h2 className="text-2xl font-bold mb-4 text-center">Confirmar Compra</h2>
          <form onSubmit={handleSubmit} className="pt-4">
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
              <option value="">Selecciona un medio de pago</option>
              <option value="Efectivo">Efectivo</option>
              <option value="MercadoPago">MercadoPago</option>
            </select>

            {medioPago === "Efectivo" && (
              <input
                type="number"
                className="w-full p-2 mb-4 border rounded"
                placeholder="Monto con el que pagarás..."
                value={montoEfectivo}
                onChange={(e) => setMontoEfectivo(e.target.value)}
                required
              />
            )}

            {medioPago === "MercadoPago" && (
              <p className="text-sm mb-4">
                Alias MercadoPago: <CopiarAlias />
              </p>
            )}

            <p className="block mb-2">El monto es: <b>${total.toFixed(2)}</b></p>
            <p className="block mb-2">+ delivery: <b>${delivery}</b></p>
            <p className="block mb-2">Monto total: <b>${montoTotal.toFixed(2)}</b></p>

            <button
              type="submit"
              className={`w-full bg-green-500 text-white py-2 rounded ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
              }`}
              disabled={!isFormValid}
            >
              Confirmar Pedido
            </button>
          </form> 
        </div>
      </div>
    </div>
  );
}