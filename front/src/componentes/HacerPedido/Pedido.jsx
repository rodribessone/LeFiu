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
  // Estado para las salsas gratuitas de "Pollito Frito con Salsas"
  // Guardamos un array de dos posiciones para cada producto, usando el _id como clave
  const [freeSauces, setFreeSauces] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL; // Asegúrate de que tenga la ruta correcta

  // Función para cambiar el tipo de hamburguesa y asignar precio extra
  const handleTipoHamburguesaChange = (productoId, tipo) => {
    setTipoHamburguesa((prev) => ({
      ...prev,
      [productoId]: tipo,
    }));

    let precioAdicional = 0;
    if (tipo === "doble") {
      precioAdicional = 800;
    } else if (tipo === "triple") {
      precioAdicional = 1900;
    }

    setPrecioFinal((prev) => ({
      ...prev,
      [productoId]: precioAdicional,
    }));
  };

  // Función para actualizar la selección de las 2 salsas gratuitas para "Pollito Frito con Salsas"
  // index: 1 para el primer select, 2 para el segundo.
  const handleFreeSauceChange = (productId, index, sauceName) => {
    setFreeSauces(prev => {
      // Si ya existen selecciones para este producto, clonamos el array; si no, iniciamos con ["", ""]
      const current = prev[productId] ? [...prev[productId]] : ["", ""];
      current[index - 1] = sauceName;
      return {
        ...prev,
        [productId]: current,
      };
    });
  };

  useEffect(() => {
    fetch(`${backendUrl}/productos`)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        const defaultTipoHamburguesa = {};
        const defaultPrecioFinal = {};
        data.forEach((producto) => {
          if (producto.categoria === "Hamburguesa") {
            defaultTipoHamburguesa[producto._id] = "simple";
            defaultPrecioFinal[producto._id] = 0;
          }
        });
        setTipoHamburguesa(defaultTipoHamburguesa);
        setPrecioFinal(defaultPrecioFinal);
      })
      .catch((error) => console.error("Error fetching productos:", error));
  }, [backendUrl]);

  // Filtrar productos según la categoría seleccionada
  const productosFiltrados = productos.filter(
    (item) =>
      item.categoria === categoriaSeleccionada && item.categoria !== "Bebida"
  );

  // Asumimos que tienes un array de salsas (productos con categoría "Salsas")
  const salsas = productos.filter(item => item.categoria === "Salsas");

  return (
    <div className="relative mt-16 flex flex-col bg-white w-11/12 m-auto p-6 border-2 border-black rounded-xl md:w-4/5 lg:w-2/3">
      {/* Filtros */}
      <div className="flex justify-around mb-4">
        <button
          className={`p-1 text-sm rounded ${categoriaSeleccionada === "Hamburguesa" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
          onClick={() => setCategoriaSeleccionada("Hamburguesa")}
        >
          <FontAwesomeIcon icon={faBurger} className="mr-2" />
          Hamburguesas
        </button>
        <button
          className={`p-1 text-sm rounded ${categoriaSeleccionada === "Pollo" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
          onClick={() => setCategoriaSeleccionada("Pollo")}
        >
          <FontAwesomeIcon icon={faDrumstickBite} className="mr-2" />
          Pollo
        </button>
        <button
          className={`p-1 text-sm rounded ${categoriaSeleccionada === "Salsas" ? "bg-red-500 text-white" : "bg-gray-200"}`}
          onClick={() => setCategoriaSeleccionada("Salsas")}
        >
          <FontAwesomeIcon icon={faPepperHot} className="mr-2" />
          Salsas
        </button>
      </div>

      <div className="flex justify-center items-center text-xs">
        <h3>
          Todas las porciones incluyen papas fritas
          <img src="/papas.png" alt="Papas" className="inline-block w-6 h-6 mx-auto" />
        </h3>
      </div>

      {/* Productos */}
      {productosFiltrados.map((item) => {
        const { nombre, precio, imagen, descripcion, _id, categoria } = item;
        const precioTotal = precio + (precioFinal[_id] || 0);
        const tipo = tipoHamburguesa[_id] || "simple";

        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row w-full mx-auto my-4 p-4 border-2 border-black rounded-xl justify-between"
          >
            <div className="m-4 sm:w-1/4">
              <img src={imagen} className="w-full h-32 object-cover rounded-lg" alt={nombre} />
            </div>
            <div className="flex flex-col w-full sm:w-2/3">
              {/* Para productos que no sean "Pollito Frito con Salsas", el nombre se modifica según el tipo */}
              <h1 className="text-black text-xl font-bold">
                {nombre === "POLLITO FRITO CON SALSAS"
                  ? nombre
                  : tipo !== "simple"
                  ? `${nombre} (${tipo.toUpperCase()})`
                  : nombre}
              </h1>
              <p className="text-lg text-green-600 font-bold">${precioTotal}</p>
              <p className="text-black font-semibold text-sm sm:text-base">{descripcion}</p>

              {/* Opciones de tipo para hamburguesas (solo para categoría "Hamburguesa") */}
              {categoria === "Hamburguesa" && (
                <div className="mb-4">
                  <p className="text-gray-700">Tipo de Hamburguesa:</p>
                  <div className="flex gap-4">
                    <button
                      className={`p-2 rounded mt-2 ${tipoHamburguesa[_id] === "simple" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                      onClick={() => handleTipoHamburguesaChange(_id, "simple")}
                    >
                      Simple
                    </button>
                    <button
                      className={`p-2 rounded mt-2 ${tipoHamburguesa[_id] === "doble" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                      onClick={() => handleTipoHamburguesaChange(_id, "doble")}
                    >
                      Doble (+$800)
                    </button>
                    <button
                      className={`p-2 rounded mt-2 ${tipoHamburguesa[_id] === "triple" ? "bg-green-500 text-white" : "bg-gray-200"}`}
                      onClick={() => handleTipoHamburguesaChange(_id, "triple")}
                    >
                      Triple (+$1900)
                    </button>
                  </div>
                </div>
              )}

              {/* Si el producto es "Pollito Frito con Salsas", mostrar dos selects para elegir 2 salsas gratis */}
              {nombre === "POLLITO FRITO CON SALSAS" && (
                <div className="mb-4">
                  <p className="text-gray-700">Selecciona 2 salsas gratis:</p>
                  <div className="flex flex-col gap-2">
                    {/* Primer select */}
                    <select
                      className="p-2 border rounded"
                      value={freeSauces[_id] ? freeSauces[_id][0] : ""}
                      onChange={(e) => handleFreeSauceChange(_id, 1, e.target.value)}
                    >
                      <option value="">Selecciona la primera salsa</option>
                      {salsas.map((salsa) => (
                        <option key={salsa._id} value={salsa.nombre}>
                          {salsa.nombre}
                        </option>
                      ))}
                    </select>
                    {/* Segundo select */}
                    <select
                      className="p-2 border rounded"
                      value={freeSauces[_id] ? freeSauces[_id][1] : ""}
                      onChange={(e) => handleFreeSauceChange(_id, 2, e.target.value)}
                    >
                      <option value="">Selecciona la segunda salsa</option>
                      {salsas.map((salsa) => (
                        <option key={salsa._id} value={salsa.nombre}>
                          {salsa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center w-full sm:w-1/4 mt-4 sm:mt-0">
            <button
                className="flex max-h-16 items-center justify-center p-4 text-white bg-green-500 border-1 rounded border-black hover:bg-green-600 w-full sm:w-auto"
                onClick={() => {
                  const tipoSeleccionado = tipoHamburguesa[_id] || "simple";
                  let nombreModificado = "";
                  if (nombre === "POLLITO FRITO CON SALSAS") {
                    // Obtenemos la selección actual de salsas
                    const sauceSelection = freeSauces[_id] ? [...freeSauces[_id]] : [];
                    const saucesStr = sauceSelection.filter(Boolean).join(", ");
                    nombreModificado = saucesStr ? `${nombre} (${saucesStr.toUpperCase()})` : nombre;
                  } else {
                    nombreModificado = tipoSeleccionado !== "simple"
                      ? `${nombre} (${tipoSeleccionado.toUpperCase()})`
                      : nombre;
                  }

                  const salsasSeleccionadas = nombre === "POLLITO FRITO CON SALSAS" ? freeSauces[_id] || [] : [];

                  addToCart({
                    // Genera un id único basado en el producto y las salsas seleccionadas
                    id: `${_id}-${salsasSeleccionadas.join('-')}`,
                    nombre: nombreModificado,
                    precio: precioTotal,
                    imagen,
                    descripcion,
                    categoria,
                    tipoHamburguesa: nombre === "POLLITO FRITO CON SALSAS" ? "simple" : tipoSeleccionado,
                    salsasSeleccionadas,
                  });

                  if (nombre === "POLLITO FRITO CON SALSAS") {
                    setFreeSauces((prev) => ({ ...prev, [_id]: ["", ""] }));
                  }
                }}
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