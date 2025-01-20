import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function Usuario() {
  const [productos, setProductos] = useState([]);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const handleEliminarClick = (id) => {
    setProductoAEliminar(id);
  };

  useEffect(() => {
    fetch('http://localhost:3008/productos')
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => console.error('Error fetching productos:', error));
  }, []);

  const eliminarProducto = async () => {
    const token = localStorage.getItem('token');
    if (!productoAEliminar) return;

    try {
      const response = await fetch(`http://localhost:3008/productos/${productoAEliminar}`, {
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

  return (
    <div className="relative bg-white w-full md:w-4/5 m-auto p-4">
      <div className="text-center p-4 flex flex-col">
        <p className="m-2">Bienvenido <b>Joaco</b></p>
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