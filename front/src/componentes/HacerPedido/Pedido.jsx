import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from "../HacerPedido/CartContext";

export default function Pedido() {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);
  const [tipoHamburguesa, setTipoHamburguesa] = useState({});
  const [precioFinal, setPrecioFinal] = useState({});

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
    fetch('http://localhost:3008/productos')
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        // Set default type to "simple" for all products
        const defaultTipoHamburguesa = {};
        const defaultPrecioFinal = {};
        data.forEach((producto) => {
          defaultTipoHamburguesa[producto._id] = "simple";
          defaultPrecioFinal[producto._id] = 0;
        });
        setTipoHamburguesa(defaultTipoHamburguesa);
        setPrecioFinal(defaultPrecioFinal);
      })
      .catch((error) => console.error('Error fetching productos:', error));
  }, []);

  return (
    <div className="relative flex flex-col bg-white w-11/12 m-auto p-4 border-2 border-black rounded-xl md:w-4/5 lg:w-2/3">
      {productos.map((item) => {
        const { nombre, precio, imagen, descripcion, _id } = item;
        const precioTotal = precio + (precioFinal[_id] || 0);

        return (
          <div
            key={_id}
            className="flex flex-col sm:flex-row w-full mx-auto my-4 p-4 border-2 border-black rounded-xl justify-between"
          >
            <div className="m-4 sm:w-1/4">
              <img src={imagen} className="w-full h-32 object-cover rounded-lg" alt={nombre} />
            </div>
            <div className="flex flex-col justify-between w-full sm:w-2/3">
              <h1 className="text-black text-xl font-bold">{nombre}</h1>
              <p className="text-lg text-green-600 font-bold">${precioTotal}</p>
              <p className="text-black m-4 font-semibold text-sm sm:text-base">{descripcion}</p>
              <div className="mb-4">
                <p className="text-gray-700">Tipo de Hamburguesa:</p>
                <div className="flex gap-4">
                  <button
                    className={`p-2 rounded ${tipoHamburguesa[_id] === "simple" ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleTipoHamburguesaChange(_id, "simple")}
                  >
                    Simple
                  </button>
                  <button
                    className={`p-2 rounded ${tipoHamburguesa[_id] === "doble" ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleTipoHamburguesaChange(_id, "doble")}
                  >
                    Doble (+$800)
                  </button>
                  <button
                    className={`p-2 rounded ${tipoHamburguesa[_id] === "triple" ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handleTipoHamburguesaChange(_id, "triple")}
                  >
                    Triple (+$1900)
                  </button>
                </div>
              </div>
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