import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect } from "react";
import CopiarAlias from "./CopiarAlias";

// Redondea al múltiplo de 100 más cercano
const round100 = (n) => Math.round(n / 100) * 100;

export default function ConfirmarCompra() {
  const { cartItems } = useCart();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [medioPago, setMedioPago] = useState("");
  const [montoEfectivo, setMontoEfectivo] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [tipoEntrega, setTipoEntrega] = useState("Delivery");
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
        if (!res.ok) throw new Error("Error al obtener el precio del delivery");
        return res.json();
      })
      .then((data) => setDelivery(data.deliveryPrice))
      .catch((error) => {
        console.error("Error:", error);
        alert("Hubo un error al obtener el precio del delivery. Por favor, intenta nuevamente.");
      });
  }, []);

  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  // Con o sin descuento, siempre redondeado a 100
  const calculateMontoTotal = () => {
    const base = tipoEntrega === "Delivery" ? calculateTotal() + delivery : calculateTotal();
    const conDescuento = medioPago === "Efectivo" ? base * 0.9 : base;
    return round100(conDescuento);
  };

  const total = calculateTotal();
  const montoTotal = calculateMontoTotal();

  // Desglose redondeado para mostrar en pantalla cuando aplica efectivo
  const subtotalConDescuento = medioPago === "Efectivo" ? round100(total * 0.9) : total;
  const deliveryConDescuento = medioPago === "Efectivo" ? round100(delivery * 0.9) : delivery;

  const businessNumber = "542392548014";

  const handleSubmit = (event) => {
    event.preventDefault();

    const productos = cartItems
      .map((item) => `   🔸 ${item.nombre} x${item.quantity} → $${(item.precio * item.quantity).toFixed(0)}`)
      .join("\n");

    let mensaje = `✨NUEVO ENCARGO ✨\n\n`;
    mensaje += `🙋 Cliente:\n`;
    mensaje += `   - Nombre: ${nombre}\n`;
    mensaje += `   - Dirección: ${direccion}\n`;
    mensaje += `   - Entrega: ${tipoEntrega}\n`;
    mensaje += `   - Pago: ${medioPago}\n\n`;
    mensaje += `🥡 Pedido:\n${productos}\n\n`;

    if (observaciones) mensaje += `📝 Observaciones:\n   - ${observaciones}\n\n`;

    if (tipoEntrega === "Delivery") {
      mensaje += `🚚 Delivery: $${deliveryConDescuento}\n`;
    } else {
      mensaje += `🏃‍♂️ Take Away (sin cargo)\n`;
    }

    if (medioPago === "Efectivo") {
      mensaje += `💵 Descuento 10% efectivo aplicado\n`;
    }

    mensaje += `💲 Total a pagar: $${montoTotal}\n\n`;

    if (medioPago === "Efectivo") {
      mensaje += `💵 Pago con: $${montoEfectivo}\n\n`;
    } else {
      mensaje += `📎 Recuerda enviarnos tu comprobante de pago aquí mismo 🙌\n\n`;
    }

    mensaje += `🙏 ¡Gracias por tu pedido! Te lo preparamos pronto 🍔`;

    const encodedMessage = encodeURIComponent(mensaje);
    window.open(`https://wa.me/${businessNumber}?text=${encodedMessage}`, "_blank");
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
                  className={`px-4 py-2 rounded border ${tipoEntrega === "Delivery" ? "bg-green-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setTipoEntrega("Delivery")}
                >
                  🚚 Delivery
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded border ${tipoEntrega === "Take Away" ? "bg-green-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setTipoEntrega("Take Away")}
                >
                  🏃‍♂️ Take Away
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="block mb-2 font-bold">Medio de pago:</label>
              <div className="flex gap-4 mb-3">
                <button
                  type="button"
                  className={`px-4 py-2 rounded border ${medioPago === "Efectivo" ? "bg-green-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setMedioPago("Efectivo")}
                >
                  💵 Efectivo
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded border ${medioPago === "MercadoPago" ? "bg-green-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setMedioPago("MercadoPago")}
                >
                  📲 MercadoPago
                </button>
              </div>

              {/* Banner descuento — siempre visible bajo Medio de Pago */}
              <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border-2 transition-all duration-300 ${medioPago === "Efectivo"
                  ? "bg-green-50 border-green-400 shadow-md"
                  : "bg-gray-50 border-gray-200"
                }`}>
                <span className="text-2xl">💵</span>
                <div className="flex-1">
                  <p className={`font-bold text-sm leading-tight ${medioPago === "Efectivo" ? "text-green-700" : "text-gray-500"}`}>
                    ¡10% de descuento pagando en efectivo!
                  </p>
                  {medioPago === "Efectivo" ? (
                    <p className="text-green-600 text-xs mt-0.5">✅ Descuento aplicado al total</p>
                  ) : (
                    <p className="text-gray-400 text-xs mt-0.5">Seleccioná efectivo para activarlo</p>
                  )}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap transition-colors ${medioPago === "Efectivo" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
                  }`}>
                  -10%
                </span>
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

            {/* Desglose de precios con descuento y redondeo en vivo */}
            <div className="flex justify-between mb-2">
              <span>El monto es:</span>
              <div className="text-right">
                {medioPago === "Efectivo" ? (
                  <>
                    <span className="line-through text-gray-400 text-sm mr-2">${total}</span>
                    <b className="text-green-600">${subtotalConDescuento}</b>
                  </>
                ) : (
                  <b>${total}</b>
                )}
              </div>
            </div>

            {tipoEntrega === "Delivery" && (
              <div className="flex justify-between mb-2">
                <span>+ delivery:</span>
                <div className="text-right">
                  {medioPago === "Efectivo" ? (
                    <>
                      <span className="line-through text-gray-400 text-sm mr-2">${delivery}</span>
                      <b className="text-green-600">${deliveryConDescuento}</b>
                    </>
                  ) : (
                    <b>${delivery}</b>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mb-4 border-t pt-2">
              <span className="font-bold">Monto total:</span>
              <b className={medioPago === "Efectivo" ? "text-green-600 text-lg" : ""}>
                ${montoTotal}
              </b>
            </div>

            <button
              type="submit"
              className={`w-full bg-green-500 text-white py-2 rounded ${!isFormValid ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
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