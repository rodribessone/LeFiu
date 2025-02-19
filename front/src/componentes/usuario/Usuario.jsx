import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function Usuario() {
  const [productos, setProductos] = useState([]);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [deliveryPrice, setDeliveryPrice] = useState(0); // Estado para el precio de delivery
  const [newDeliveryPrice, setNewDeliveryPrice] = useState(""); // Estado para el nuevo precio de delivery
  const backendUrl = import.meta.env.VITE_BACKEND_URL;  // Revisa si ya contiene un slash final
    // Fragmento en usuarios.jsx
  const [precioDoble, setPrecioDoble] = useState(0);
  const [precioTriple, setPrecioTriple] = useState(0);
  

  const handleEliminarClick = (id) => {
    setProductoAEliminar(id);
  };

  useEffect(() => {
    // Obtener productos
    fetch(`${backendUrl}/productos`)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => console.error('Error fetching productos:', error.message));
  
    // Obtener precio de delivery
    fetch(`${backendUrl}/delivery`)
      .then((res) => res.json())
      .then((data) => {
        setDeliveryPrice(data.deliveryPrice);
      })
      .catch((error) => console.error('Error fetching delivery price:', error.message));
  }, []);

  // Función para actualizar los precios
  const handleUpdateHamburguesaPrices = async () => {
    const token = localStorage.getItem('token');
    const precioDobleNum = parseFloat(precioDoble);
    const precioTripleNum = parseFloat(precioTriple);
  
    if (isNaN(precioDobleNum) || isNaN(precioTripleNum)) {
      alert("Por favor, ingresa precios válidos para doble y triple.");
      return;
    }
  
    try {
      const response = await fetch(`${backendUrl}/hamburguesa`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          doble: precioDobleNum,
          triple: precioTripleNum
        })
      });
  
      if (response.ok) {
        alert("Precios actualizados correctamente.");
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar precios: ${errorData.message || "Desconocido"}`);
      }
    } catch (error) {
      console.error("Error updating hamburguesa prices:", error);
    }
  };
  

  const eliminarProducto = async () => {
    const token = localStorage.getItem('token');
    if (!productoAEliminar) return;

    try {
      const response = await fetch(`${backendUrl}/productos/${productoAEliminar}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Asegúrate de que el token se incluya aquí.
        },
      });

      if (response.ok) {
        // Actualizar la lista de productos eliminando el producto correspondiente
        setProductos(productos.filter((producto) => producto._id !== productoAEliminar));
        setProductoAEliminar(null); // Cerrar el menú
      } else {
        console.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const cancelarEliminar = () => {
    setProductoAEliminar(null);
  };

  const handleUpdateDeliveryPrice = async () => {
    const token = localStorage.getItem('token');
    const priceNum = parseFloat(newDeliveryPrice);
  
    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Por favor, introduce un precio válido.');
      return;
    }
  
    try {
      const response = await fetch(`${backendUrl}/delivery`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: priceNum }),
      });
      const responseData = await response.json();
      console.log("Backend response:", responseData);
  
      if (response.ok) {
        setDeliveryPrice(responseData.deliveryPrice);
        setNewDeliveryPrice("");
        alert('Precio de delivery actualizado correctamente');
      } else {
        alert(`Error al actualizar el delivery: ${responseData.message || "Desconocido"}`);
      }
    } catch (error) {
      console.error('Error al actualizar el precio del delivery:', error);
    }
  };
  
  

  return (
    <div className="relative bg-white w-full md:w-4/5 m-auto p-4">
      <div className="text-center p-4 flex flex-col">
        <p className="m-2">Bienvenido <b>Joaco</b></p>

       {/* Sección para gestionar el precio del delivery */}
<div className="w-full md:w-3/4 lg:w-2/5 mx-auto bg-gray-100 p-4 rounded-lg shadow-md my-6">
  <h2 className="text-xl font-bold mb-4 text-gray-800">Configurar Precio de Delivery</h2>
  <p className="mb-4 text-gray-600">Precio actual: <span className="font-bold text-gray-800">${deliveryPrice}</span></p>
  <div className="flex flex-col md:flex-row items-center gap-4">
    <input
      type="number"
      className="p-2 border rounded-lg w-full md:w-3/4 lg:w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Nuevo precio"
      value={newDeliveryPrice}
      onChange={(e) => setNewDeliveryPrice(e.target.value)}
    />
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full md:w-auto"
      onClick={handleUpdateDeliveryPrice}
    >
      Actualizar
    </button>
  </div>
</div>

    {/* Sección para gestionar el precio de las hamburguesas */}
<div className="w-full p-4 bg-gray-100 rounded-lg shadow-md my-6">
  <h2 className="text-xl font-bold mb-4">Configurar Precio Extra para Hamburguesas</h2>
  <div className="flex flex-col md:flex-row items-center gap-4">
  <input
      type="number"
      className="p-2 border rounded-lg w-full md:w-1/2"
      placeholder="Precio extra Doble"
      value={precioDoble}
      onChange={(e) => setPrecioDoble(parseFloat(e.target.value) || 0)} // Parsear el valor a número
    />
    <input
      type="number"
      className="p-2 border rounded-lg w-full md:w-1/2"
      placeholder="Precio extra Triple"
      value={precioTriple}
      onChange={(e) => setPrecioTriple(parseFloat(e.target.value) || 0)} // Parsear el valor a número
    />
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      onClick={handleUpdateHamburguesaPrices}
    >
      Actualizar Precios
    </button>
  </div>
</div>

        <Link to='/crearProducto' className="mx-auto p-4 text-white bg-green-500 border-2 rounded border-black hover:bg-green-600">
          Crear nuevo producto
        </Link>
      </div>

      <div className='relative flex flex-col bg-white w-11/12 mx-auto p-4'>
        {productos.map((item) => {
          const { nombre, precio, imagen, descripcion, _id } = item;
          return (
            <div key={_id} className='flex flex-col sm:flex-row w-full mx-auto my-4 p-4 border-2 border-black rounded-xl justify-between'>
              <div className="flex flex-col sm:flex-row p-4 w-full">
                <div className="m-4 w-full sm:w-1/4">
                  <img src={imagen} className="w-full h-32 object-cover rounded-lg" alt={nombre} />
                </div>
                <div className="w-full sm:w-2/4">
                  <h1 className="text-black text-xl font-bold">{nombre}</h1>
                  <p className="text-gray-700 font-bold">${precio}</p>
                  <p>{descripcion}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 justify-center w-full sm:w-1/4 mt-4 sm:mt-0">
                  <Link className="flex max-h-16 items-center justify-center p-4 text-white bg-orange-500 border-1 rounded border-black hover:bg-orange-600 w-full sm:w-auto" to={`/editarProducto/${_id}`}>
                    <FontAwesomeIcon className="p-1" icon={faPenToSquare} />
                    <p>EDITAR</p>
                  </Link>
                  <button
                    className="flex max-h-16 items-center justify-center p-4 text-white bg-red-500 border-1 rounded border-black hover:bg-red-600 w-full sm:w-auto"
                    onClick={() => handleEliminarClick(_id)}
                  >
                    <FontAwesomeIcon className="p-1" icon={faCirclePlus} />
                    <p>ELIMINAR</p>
                  </button>
                </div>
              </div>
              {productoAEliminar && (
                <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded shadow-lg">
                    <p>¿Estás seguro de que deseas eliminar este producto?</p>
                    <div className="flex justify-around mt-4">
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={eliminarProducto}
                      >
                        Sí
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={cancelarEliminar}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}