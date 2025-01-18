import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { useCart } from "../HacerPedido/CartContext";

export default function Pedido() {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3008/productos')
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => console.error('Error fetching productos:', error));
  }, []);

  return (
    <div className="relative flex flex-col bg-white w-11/12 m-auto p-4 border-2 border-black rounded-xl md:w-4/5 lg:w-2/3">
      {productos.map((item) => {
        const { nombre, precio, imagen, descripcion, _id } = item;
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
              <p className="text-lg text-green-600 font-bold">${precio}</p>
              <p className="text-black m-4 font-semibold text-sm sm:text-base">{descripcion}</p>
            </div>
            <div className="flex items-center justify-center w-full sm:w-1/4 mt-4 sm:mt-0">
              <button
                className="flex max-h-16 items-center justify-center p-4 text-white bg-green-500 border-1 rounded border-black hover:bg-green-600 w-full sm:w-auto"
                onClick={() =>
                  addToCart({
                    _id,
                    nombre,
                    precio,
                    imagen,
                    descripcion,
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