import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faBurger, faPizzaSlice, faUtensils, faDrumstickBite, faPepperHot } from '@fortawesome/free-solid-svg-icons';
import { useCart } from "../HacerPedido/CartContext";

export default function Pedido() {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [tipoHamburguesa, setTipoHamburguesa] = useState({});
  const [precioFinal, setPrecioFinal] = useState({});
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Hamburguesa");
  const [freeSauces, setFreeSauces] = useState({});
  const [extraPrices, setExtraPrices] = useState({});
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const iconosCategoria = {
  Hamburguesa: faBurger,
  Pollo: faDrumstickBite,
  Salsas: faPepperHot,
  Pizzas: faPizzaSlice,
  Empanadas: faUtensils, // elegí el que quieras si no hay uno específico
  };

  const handleTipoHamburguesaChange = (productoId, tipo) => {
    setTipoHamburguesa((prev) => ({
      ...prev,
      [productoId]: tipo,
    }));
  
    // Obtener el precio adicional directamente de extraPrices
    const precioAdicional = extraPrices[tipo.toLowerCase()] || 0;
  
    setPrecioFinal((prev) => ({
      ...prev,
      [productoId]: precioAdicional,
    }));
  };

// Manejar selección de salsas gratis para "POLLITO FRITO CON SALSAS"
const handleFreeSauceChange = (productId, index, sauceName) => {
  setFreeSauces(prev => {
    const current = prev[productId] ? [...prev[productId]] : ["", ""];
    current[index - 1] = sauceName;
    return { ...prev, [productId]: current };
  });
};

      useEffect(() => {
        fetch(`${backendUrl}/productos`)
          .then((res) => res.json())
          .then((data) => {
            setProductos(data);
            const defaultTipo = {};
            const defaultPrecio = {};
            data.forEach((producto) => {
              if (producto.categoria === "Hamburguesa") {
                defaultTipo[producto._id] = "simple";
                defaultPrecio[producto._id] = 0;
              }
            });
            setTipoHamburguesa(defaultTipo);
            setPrecioFinal(defaultPrecio);
          })
          .catch((error) => console.error("Error fetching productos:", error));
      }, [backendUrl]);

  // Fetch de los precios extra para hamburguesa (doble y striple)
  useEffect(() => {
    fetch(`${backendUrl}/hamburguesa`)
      .then((res) => res.json())
      .then((data) => {
        const price = {};
        data.forEach(item => {
          price[item.nombre.toLowerCase()] = item.precio; // Aquí aseguramos que la clave sea el nombre en minúsculas
        });
        setExtraPrices(price); // Actualizamos el estado con los precios obtenidos
      })
      .catch((error) => console.error("Error fetching extra prices:", error));
  }, [backendUrl]);
  

  const productosFiltrados = productos.filter(
    (item) => item.categoria === categoriaSeleccionada && item.categoria !== "Bebida"
  );

   const salsas = productos.filter(item => item.categoria === "Salsas");

  return (
    <div className="relative mt-16 flex flex-col bg-white w-11/12 max-w-full m-auto p-6 border-2 border-black rounded-xl md:w-4/5 lg:w-2/3">
      {/* Filtros */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:justify-center gap-2 mb-4">
          {["Hamburguesa", "Pollo", "Salsas", "Pizzas", "Empanadas"].map((categoria) => (
            <button
              key={categoria}
              className={`p-1 text-sm rounded ${
                categoriaSeleccionada === categoria
                  ? categoria === "Salsas"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                  : "bg-gray-200"
              } text-white`}
              onClick={() => setCategoriaSeleccionada(categoria)}
            >
              <FontAwesomeIcon icon={iconosCategoria[categoria]} className="mr-2" />
              {categoria}
            </button>
          ))}
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
        const esPollito = nombre === "POLLITO FRITO CON SALSAS"; // Asegurate que coincide con la forma en que lo guardás

        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row w-full mx-auto my-4 p-4 border-2 border-black rounded-xl justify-between"
          >
            <div className="m-4 sm:w-1/4">
              <img src={imagen} className="w-full h-32 object-cover rounded-lg" alt={nombre} />
            </div>
            <div className="flex flex-col w-full sm:w-2/3">
              <h1 className="text-black text-xl font-bold">
                {esPollito 
                  ? nombre 
                  : tipo !== "simple" ? `${nombre} (${tipo.toUpperCase()})` : nombre}
              </h1>
              <p className="text-lg text-green-600 font-bold">${precioTotal}</p>
              <p className="text-black font-semibold text-sm sm:text-base">{descripcion}</p>

              {categoria === "Hamburguesa" && !esPollito && (
                <div className="mb-4">
                  <p className="text-gray-700">Tipo de Hamburguesa:</p>
                  <div className="flex gap-4">
                    {["simple", "doble", "triple"].map((tipoBtn) => (
                      <button
                        key={tipoBtn}
                        className={`p-2 rounded mt-2 ${tipo === tipoBtn ? "bg-green-500 text-white" : "bg-gray-200"}`}
                        onClick={() => handleTipoHamburguesaChange(_id, tipoBtn)}
                      >
                        {tipoBtn.charAt(0).toUpperCase() + tipoBtn.slice(1)}
                        {/* {tipoBtn !== "simple" && ` (+$${tipoBtn === "doble" ? extraPrices.doble || 0 : extraPrices.triple || 0})`} ACA DICE EL PRECIO DE LAS BURGUERS ENTRE PARENTESIS*/} 
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {esPollito && (
                <div className="mb-4">
                  <p className="text-gray-700">Selecciona 2 salsas gratis:</p>
                  <div className="flex flex-col gap-2">
                    {[1, 2].map((index) => (
                      <select
                        key={index}
                        className="p-2 border rounded"
                        value={freeSauces[_id]?.[index - 1] || ""}
                        onChange={(e) => handleFreeSauceChange(_id, index, e.target.value)}
                      >
                        <option value="">Selecciona la {index === 1 ? "primera" : "segunda"} salsa</option>
                        {salsas.map((salsa) => (
                          <option key={salsa._id} value={salsa.nombre}>
                            {salsa.nombre}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center w-full sm:w-1/4 mt-4 sm:mt-0">
              <button
                className="flex max-h-16 items-center justify-center p-4 text-white bg-green-500 border-1 rounded border-black hover:bg-green-600 w-full sm:w-auto"
                onClick={() => {
                  const tipoSeleccionado = tipoHamburguesa[_id] || "simple";
                  const salsasSeleccionadas = esPollito ? freeSauces[_id] || [] : [];
                  
                  const nombreModificado = esPollito
                    ? salsasSeleccionadas.filter(Boolean).length > 0
                      ? `${nombre} (${salsasSeleccionadas.filter(Boolean).join(", ").toUpperCase()})`
                      : nombre
                    : tipoSeleccionado !== "simple"
                      ? `${nombre} (${tipoSeleccionado.toUpperCase()})`
                      : nombre;
                  
                  addToCart({
                    // Para "POLLITO FRITO CON SALSAS", agregamos un identificador único que incluya las salsas seleccionadas
                    id: esPollito ? `${_id}-${salsasSeleccionadas.join('-')}` : `${_id}-${tipoSeleccionado}`,
                    nombre: nombreModificado,
                    precio: precioTotal,
                    imagen,
                    descripcion,
                    categoria,
                    tipoHamburguesa: esPollito ? "simple" : tipoSeleccionado,
                    salsasSeleccionadas,
                  });
                  
                  if (esPollito) {
                    setFreeSauces(prev => ({ ...prev, [_id]: ["", ""] }));
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