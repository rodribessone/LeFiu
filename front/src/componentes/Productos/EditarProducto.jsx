import { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'

export default function EditarProducto() {
    const { id } = useParams();
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        precio: '',
        descripcion: '',
        imagen: ''
    });

    useEffect(() => {
        fetch(`http://localhost:3008/productos/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setFormData({
                    nombre: data.nombre,
                    precio: data.precio,
                    descripcion: data.descripcion,
                    imagen: data.imagen
                });
            })
            .catch((error) => {
                console.error(error);
                setMessage('Error al cargar el producto.');
                setIsError(true);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'nombre' ? value.toUpperCase() : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3008/productos/${id}`, {
                method: 'PUT', // Método HTTP para actualizar
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage('Producto actualizado correctamente.');
                setIsError(false);
            } else {
                setMessage('Error al actualizar el producto.');
                console.log('ID enviado:', id);
                setIsError(true);
            }
        } catch (error) {
            console.error(error);
            setMessage('Error en la solicitud. Inténtalo nuevamente.');
            setIsError(true);
        }
    };

  return (
    <div className="relative mx-auto mt-10 w-2/5 bg-black text-white p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-5 text-center">Editar Producto</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 text-black bg-white shadow rounded flex flex-col">
                <label className="block mb-2 font-bold">Título:</label>
                <input
                    className="border w-full p-2 mb-4 rounded"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                />

                <label className="block mb-2 font-bold">Precio:</label>
                <input
                    className="border w-full p-2 mb-4 rounded"
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                />

                <label className="block mb-2 font-bold">Descripción:</label>
                <textarea
                    className="border w-full p-2 mb-4 rounded"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                ></textarea>




                <label className="block mb-2 font-bold">Imagen:</label>
                <input
                    className="border w-full p-2 mb-4 rounded"
                    type="text"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                />

            
                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Guardar cambios
                </button>
                </form>
                {message && (
                <div
                    className={`mt-4 p-4 rounded text-center ${
                        isError ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                    }`}
                >
                    {message}
                </div>
            )}
        </div>
  )
}
