import { useEffect, useState } from "react";

export default function Carta() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);  // Verifica el valor
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '')}/productos`);

        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="relative flex flex-col bg-white w-11/12 m-auto p-4 border-2 border-black rounded-xl md:w-4/5 lg:w-2/3">
      <h1 className="text-2xl font-bold text-center mb-6">Nuestra Carta</h1>

      {productos.length === 0 ? (
        <p className="text-center text-gray-600">
          {productos.length === 0 ? "Cargando productos..." : "No hay productos disponibles"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map(({ nombre, precio, imagen, descripcion, _id }) => (
            <div
              key={_id}
              className="p-4 border-2 border-gray-300 rounded-lg flex flex-col items-center text-center shadow-md"
              style={{ border: "1px solid red" }} // Agregado para depurar el borde del contenedor
            >
              {/* Imagen */}
              <img
                src={imagen || "https://via.placeholder.com/150"}
                alt={nombre}
                className="w-full h-32 object-cover rounded-md mb-4"
                style={{ background: "gray" }} // Fondo gris en caso de que no se cargue la imagen
              />
              {/* Nombre */}
              <h2 className="font-bold text-lg">{nombre}</h2>
              {/* Precio */}
              <p className="text-green-600 font-bold">${precio}</p>
              {/* Descripción */}
              <p className="text-gray-600 text-sm">{descripcion}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
