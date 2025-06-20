import { useEffect, useState } from "react";

export default function Carta() {
  const [productos, setProductos] = useState([]);
  const [extraPrices, setExtraPrices] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/productos`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, [backendUrl]);

  useEffect(() => {
    fetch(`${backendUrl}/hamburguesa`)
      .then((res) => res.json())
      .then((data) => {
        const prices = {};
        data.forEach(item => {
          prices[item.nombre.toLowerCase()] = item.precio;
        });
        setExtraPrices(prices);
      })
      .catch((error) => console.error("Error al obtener precios extra:", error));
  }, [backendUrl]);

  return (
    <div className="relative z-10 mt-16 flex flex-col bg-white w-11/12 m-auto p-4 border-2 border-black rounded-xl md:w-4/5 lg:w-2/3">
      <h1 className="text-2xl font-bold text-center mb-6">Nuestra Carta</h1>

      {productos.length === 0 ? (
        <p className="text-center text-gray-600">
          Cargando productos...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map(({ nombre, precio, imagen, descripcion, _id, categoria }) => {
            const esHamburguesa = categoria === "Hamburguesa";
            return (
              <div
                key={_id}
                className="p-4 border-2 border-gray-300 rounded-lg flex flex-col items-center text-center shadow-md"
                style={{ border: "1px solid red" }}
              >
                <img
                  src={imagen || "https://via.placeholder.com/150"}
                  alt={nombre}
                  className="w-full h-32 object-cover rounded-md mb-4"
                  style={{ background: "gray" }}
                />
                <h2 className="font-bold text-lg">{nombre}</h2>
                <p className="text-green-600 font-bold">Simple: ${precio}</p>
                {esHamburguesa && (
                  <div className="text-sm text-gray-700">
                    <p className="text-green-600 font-bold">Doble: ${precio + (extraPrices.doble || 0)}</p>
                    <p className="text-green-600 font-bold">Triple: ${precio + (extraPrices.triple || 0)}</p>
                  </div>
                )}
                <p className="text-gray-600 text-sm mt-2">{descripcion}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
