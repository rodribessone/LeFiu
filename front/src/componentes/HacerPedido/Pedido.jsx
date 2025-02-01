import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faBurger, faDrumstickBite, faPepperHot } from '@fortawesome/free-solid-svg-icons';
import { useCart } from "../HacerPedido/CartContext";

export default function Pedido() {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [tipoHamburguesa, setTipoHamburguesa] = useState({});
  const [precioFinal, setPrecioFinal] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Hamburguesa");
  const [selectedSalsas, setSelectedSalsas] = useState({}); // Nuevo estado para salsas seleccionadas
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Obtener todas las salsas disponibles
  const salsas = productos.filter(item => item.categoria === "Salsas");

  // Manejar selección de salsas
  const handleSalsaSelection = (productId, salsaId) => {
    setSelectedSalsas(prev => {
      const currentSalsas = prev[productId] || [];
      if (currentSalsas.includes(salsaId)) {
        return {
          ...prev,
          [productId]: currentSalsas.filter(id => id !== salsaId)
        };
      }
      return {
        ...prev,
        [productId]: [...currentSalsas, salsaId]
      };
    });
  };

  // Resto del código anterior...

  return (
    <div className="relative mt-16 flex flex-col bg-white w-11/12 m-auto p-6 border-2 border-black rounded-xl md:w-4/5 lg:w-2/3">
      {/* Filtros (igual que antes) */}

      {/* Productos */}
      {productosFiltrados.map((item) => {
        const { nombre, precio, imagen, descripcion, _id, categoria } = item;
        const isPolloConSalsas = nombre === "Pollito Frito con Salsas";
        
        // Calcular precio total con salsas adicionales
        const selectedSalsasCount = selectedSalsas[_id]?.length || 0;
        const extraSalsasCost = isPolloConSalsas ? Math.max(selectedSalsasCount - 2, 0) * 800 : 0;
        const precioTotal = precio + (precioFinal[_id] || 0) + extraSalsasCost;

        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row w-full mx-auto my-4 p-4 border-2 border-black rounded-xl justify-between"
          >
            {/* Sección de imagen y detalles (igual que antes) */}

            <div className="flex flex-col w-full sm:w-2/3">
              {/* ... */}

              {/* Sección de selección de salsas para pollito */}
              {isPolloConSalsas && (
                <div className="mb-4">
                  <p className="text-gray-700">Selecciona 2 salsas gratis:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {salsas.map(salsa => (
                      <button
                        key={salsa._id}
                        className={`p-2 rounded ${
                          selectedSalsas[_id]?.includes(salsa._id)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => handleSalsaSelection(_id, salsa._id)}
                      >
                        {salsa.nombre}
                      </button>
                    ))}
                  </div>
                  {selectedSalsasCount > 2 && (
                    <p className="text-red-500 text-sm mt-2">
                      Salsas adicionales: +${(selectedSalsasCount - 2) * 800}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center w-full sm:w-1/4 mt-4 sm:mt-0">
              <button
                className="flex max-h-16 items-center justify-center p-4 text-white bg-green-500 border-1 rounded border-black hover:bg-green-600 w-full sm:w-auto"
                onClick={() =>
                  addToCart({
                    id: _id,
                    nombre,
                    precio: precioTotal,
                    imagen,
                    descripcion,
                    categoria,
                    tipoHamburguesa: tipoHamburguesa[_id] || "simple",
                    salsasSeleccionadas: selectedSalsas[_id] || [], // Agregar salsas al carrito
                    costoExtraSalsas: extraSalsasCost // Agregar costo adicional
                  })
                }
              >
                <FontAwesomeIcon className="p-1" icon={faCirclePlus} />
                <p className="ml-2">AGREGAR</p>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}