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
  const backendUrl = import.meta.env.VITE_BACKEND_URL;  // Revisa si ya contiene un slash final

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

  return (
    <div className="relative mt-16 flex flex-col bg-white w-11/12 m-auto p-6 border-2 border-black rounded-xl md:w-4/5 lg:w-2/3">
      {/* Filtros */}
      <div className="flex justify-around mb-4">
        <button
          className={`p-1 text-sm rounded ${categoriaSeleccionada === "Hamburguesa"  ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
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
          className={`p-1 text-smrounded ${categoriaSeleccionada === "Salsas" ? "bg-red-500 text-white" : "bg-gray-200"}`}
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

        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row w-full mx-auto my-4 p-4 border-2 border-black rounded-xl justify-between"
          >
            <div className="m-4 sm:w-1/4">
              <img src={imagen} className="w-full h-32 object-cover rounded-lg" alt={nombre} />
            </div>
            <div className="flex flex-col w-full sm:w-2/3">
              <h1 className="text-black text-xl font-bold">{nombre}</h1>
              <p className="text-lg text-green-600 font-bold">${precioTotal}</p>
              <p className="text-black font-semibold text-sm sm:text-base">{descripcion}</p>

              {/* Opciones de tipo para hamburguesas */}
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