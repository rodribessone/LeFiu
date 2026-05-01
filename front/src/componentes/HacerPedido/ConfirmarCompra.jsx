import { useCart } from "../HacerPedido/CartContext";
import { useState, useEffect } from "react";
import CopiarAlias from "./CopiarAlias";

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
  const [loadingPago, setLoadingPago] = useState(false);
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

  const calculateMontoTotal = () => {
    const base = tipoEntrega === "Delivery" ? calculateTotal() + delivery : calculateTotal();
    return round100(base);
  };

  const total = calculateTotal();
  const montoTotal = calculateMontoTotal();

  const businessNumber = "542392548014";

  const handleWhatsApp = () => {
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
      mensaje += `🚚 Delivery: $${delivery}\n`;
    } else {
      mensaje += `🏃‍♂️ Take Away (sin cargo)\n`;
    }

    mensaje += `💲 Total a pagar: $${montoTotal}\n\n`;

    if (medioPago === "Efectivo") {
      mensaje += `💵 Pago con: $${montoEfectivo}\n\n`;
    } else {
      mensaje += `📎 Recuerda enviarnos tu comprobante de pago aquí mismo 🙌\n\n`;
    }

    mensaje += `🙏 ¡Gracias por tu pedido! Te lo preparamos pronto 🍔`;

    window.open(`https://wa.me/${businessNumber}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const handlePagoTarjeta = async () => {
    setLoadingPago(true);
    try {
      const response = await fetch(`${backendUrl}/crear-preferencia`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          nombre,
          direccion,
          tipoEntrega,
          observaciones,
          deliveryPrice: tipoEntrega === "Delivery" ? delivery : 0,
        }),
      });

      if (!response.ok) throw new Error("Error al crear el pago");

      const data = await response.json();
      window.location.href = data.init_point;
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al procesar el pago. Intentá de nuevo.");
    } finally {
      setLoadingPago(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (medioPago === "Tarjeta") {
      handlePagoTarjeta();
    } else {
      handleWhatsApp();
    }
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
                <button type="button"
                  className={`px-4 py-2 rounded border ${tipoEntrega === "Delivery" ? "bg-green-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setTipoEntrega("Delivery")}>
                  🚚 Delivery
                </button>
                <button type="button"
                  className={`px-4 py-2 rounded border ${tipoEntrega === "Take Away" ? "bg-green-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setTipoEntrega("Take Away")}>
                  🏃‍♂️ Take Away
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label className="block mb-2 font-bold">Medio de pago:</label>
              <div className="flex gap-3 mb-3 flex-wrap">
                <button type="button"
                  className={`px-4 py-2 rounded border ${medioPago === "Efectivo" ? "bg-green-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setMedioPago("Efectivo")}>
                  💵 Efectivo
                </button>
                <button type="button"
                  className={`px-4 py-2 rounded border ${medioPago === "MercadoPago" ? "bg-green-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setMedioPago("MercadoPago")}>
                  📲 MercadoPago
                </button>
                <button type="button"
                  className={`px-4 py-2 rounded border ${medioPago === "Tarjeta" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                  onClick={() => setMedioPago("Tarjeta")}>
                  💳 Tarjeta
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
                  <p className="rounded border-2 border-[#899388] text-center w-3/5 text-xl">Lefiu.feu</p>
                  <CopiarAlias />
                </div>
              </div>
            )}

            {medioPago === "Tarjeta" && (
              <div className="flex items-start gap-3 bg-blue-50 border-2 border-blue-300 rounded-xl px-4 py-3 mb-4">
                <span className="text-2xl">💳</span>
                <div>
                  <p className="font-bold text-blue-700 text-sm leading-tight">Pago seguro con Mercado Pago</p>
                  <p className="text-blue-600 text-xs mt-0.5">Visa, Mastercard y más. Al confirmar te redirigimos al checkout.</p>
                </div>
              </div>
            )}

            <div className="flex justify-between mb-2">
              <span>El monto es:</span>
              <b>${total}</b>
            </div>

            {tipoEntrega === "Delivery" && (
              <div className="flex justify-between mb-2">
                <span>+ delivery:</span>
                <b>${delivery}</b>
              </div>
            )}

            <div className="flex justify-between mb-4 border-t pt-2">
              <span className="font-bold">Monto total:</span>
              <b>${montoTotal}</b>
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loadingPago}
              className={`w-full py-2 rounded text-white font-bold transition-colors ${
                !isFormValid || loadingPago
                  ? "bg-gray-400 cursor-not-allowed"
                  : medioPago === "Tarjeta"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loadingPago
                ? "Procesando..."
                : medioPago === "Tarjeta"
                  ? "💳 Ir al pago"
                  : "Confirmar Pedido"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}