import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect } from "react";
import CopiarAlias from "./CopiarAlias";

export default function ConfirmarCompra() {
  const { cartItems } = useCart();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [medioPago, setMedioPago] = useState("");
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [tipoEntrega, setTipoEntrega] = useState("Delivery"); // Nuevo estado
  const [observaciones, setObservaciones] = useState("");
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
        alert("Hubo un error al obtener el precio del delivery. Por favor, intenta nuevamente.");
      });
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce(
      (accumulator, item) => accumulator + item.precio * item.quantity,
      0
    );
  };

  const calculateMontoTotal = () => {
    return tipoEntrega === "Delivery" ? calculateTotal() + delivery : calculateTotal();
  };

  const total = calculateTotal();
  const montoTotal = calculateMontoTotal();

  const businessNumber = "542392548014";

  const handleSubmit = (event) => {
    event.preventDefault();

    const productos = cartItems
      .map(
        (item) =>
          `   🔸 ${item.nombre} x${item.quantity} → $${(
            item.precio * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    // Mensaje base
    let mensaje = `✨NUEVO ENCARGO ✨\n\n`;

    mensaje += `🙋 Cliente:\n`;
    mensaje += `   - Nombre: ${nombre}\n`;
    mensaje += `   - Dirección: ${direccion}\n`;
    mensaje += `   - Entrega: ${tipoEntrega}\n`;
    mensaje += `   - Pago: ${medioPago}\n\n`;

    mensaje += `🥡 Pedido:\n${productos}\n\n`;

    if (observaciones) {
    mensaje += `📝 Observaciones:\n   - ${observaciones}\n\n`;
    }

    if (tipoEntrega === "Delivery") {
      mensaje += `🚚 Delivery: $${delivery.toFixed(2)}\n`;
    } else {
      mensaje += `🏃‍♂️ Take Away (sin cargo)\n`;
    }

    mensaje += `💲 Total a pagar: $${montoTotal.toFixed(2)}\n\n`;

    if (medioPago === "Efectivo") {
      mensaje += `💵 Pago con: $${montoEfectivo}\n\n`;
    } else {
      mensaje += `📎 Recuerda enviarnos tu comprobante de pago aquí mismo 🙌\n\n`;
    }

    mensaje += `🙏 ¡Gracias por tu pedido! Te lo preparamos pronto 🍔`;

    const encodedMessage = encodeURIComponent(mensaje);
    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  const isFormValid =
    nombre &&
    direccion &&
    medioPago &&
    (medioPago !== "Efectivo" || Number(montoEfectivo) >= montoTotal);

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

            <label className="block mb-2 font-bold">Observaciones (opcional):</label>
            <textarea
              className="w-full p-2 mb-4 border rounded"
              placeholder="Ej: Burger sin cebolla, papas sin sal, etc."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows="3"
            />

            <div className="mb-4">
              <label className="block mb-2 font-bold">Tipo de entrega:</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded border ${
                    tipoEntrega === "Delivery" ? "bg-green-500 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => setTipoEntrega("Delivery")}
                >
                  🚚 Delivery
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded border ${
                    tipoEntrega === "Take Away" ? "bg-green-500 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => setTipoEntrega("Take Away")}
                >
                  🏃‍♂️ Take Away
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-bold">Medio de pago:</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded border ${
                    medioPago === "Efectivo" ? "bg-green-500 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => setMedioPago("Efectivo")}
                >
                  💵 Efectivo
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded border ${
                    medioPago === "MercadoPago" ? "bg-green-500 text-white" : "bg-gray-100"
                  }`}
                  onClick={() => setMedioPago("MercadoPago")}
                >
                  📲 MercadoPago
                </button>
              </div>
            </div>

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
              <div className="text-sm mb-4">
                Alias MercadoPago:
                <div className="flex gap-2">
                  <p className="rounded border-2 border-[#899388] text-center w-3/5 text-xl">
                    Lefiu.feu
                  </p>
                  <CopiarAlias />
                </div>
              </div>
            )}

            <div className="flex justify-between mb-2">
              <span>El monto es:</span>
              <b>${total.toFixed(2)}</b>
            </div>

            {tipoEntrega === "Delivery" && (
              <div className="flex justify-between mb-2">
                <span>+ delivery:</span>
                <b>${delivery.toFixed(2)}</b>
              </div>
            )}

            <div className="flex justify-between mb-4 border-t pt-2">
              <span>Monto total:</span>
              <b>${montoTotal.toFixed(2)}</b>
            </div>

            <button
              type="submit"
              className={`w-full bg-green-500 text-white py-2 rounded ${
                !isFormValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-600"
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
