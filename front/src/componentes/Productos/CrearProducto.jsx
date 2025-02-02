import {useState, useRef} from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebaseconfig'

export default function CrearProducto() {

    const [formData, setFormData] = useState({
            nombre: '',
            precio: '',
            descripcion: '',
            imagen: ''
        });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("Seleccionar archivo");
    const fileInputRef = useRef(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;  // Revisa si ya contiene un slash final

    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData({
          ...formData,
          [name]: name === 'nombre' ? value.toUpperCase() : value,
      })
  }
  const handleFileChange = (e) => {
    if (e.target.files[0]){
        setFile(e.target.files[0]) // 'setFile' es un estado para almacenar la imagen seleccionada
        setFileName(e.target.files[0].name);
    }
  }
  const uploadImage = async () => {
    const storageRef = ref(storage, `images/${file.name}`)
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef);
    return url;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // constantes para cargar la imagen
    const imageUrl = await uploadImage(); // Carga la imagen y obtiene la URL

    // ajusta el formato de los datos a enviar en numeros porque sino no funcionaba
    const formDataToSend = {
        ...formData,
        precio: Number(formData.precio),
        imagen: imageUrl // Incluye la URL en los datos del producto
    }

    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${backendUrl}/productos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Asegúrate de que el token se incluya aquí.
            },
            body: JSON.stringify(formDataToSend),
        })
        if (response.ok) {
            setMessage("Producto creado correctamente");
            setIsError(false);
            setFormData({
              nombre: '',
              precio: '',
              descripcion: '',
              imagen: ''
            });
            setFile(null);
            setFileName("Seleccionar archivo");
        } else {
            setMessage("Error al crear el producto. Inténtalo nuevamente.");
            setIsError(true);
        }
    } catch (error) {
        setMessage(error);
        setIsError(true);
    }
};
        
  return (
    <>
    <div className='relative w-3/5 m-auto mt-20 p-5 rounded border-2 border-black bg-gray-200'>
        <form onSubmit={handleSubmit} className='justify-items-center'>
            <div className='grid grid-cols-2 gap-y-4 mb-8'>

            <label className='font-bold'>Titulo: </label><input className='border rounded p-2' type='text' name='nombre' value={formData.nombre} onChange={handleChange} placeholder='Titulo del producto'/>

            <label className='font-bold'>Precio: </label> <input className='border rounded p-2' type='number' name='precio' value={formData.precio} onChange={handleChange} placeholder='Precio del producto'/>

            <label className='font-bold'>Descripción pequeña: </label><input className='border rounded p-2' type='text' name='descripcion' value={formData.descripcion} onChange={handleChange} placeholder='Escriba una pequeña descripción' />
 
  
            <label className='font-bold'>Categoria: </label><select className='border rounded p-2 text-center' name='categoria' value={formData.categoria} onChange={handleChange}> 
                                      <option value="">Selecciona una categoria</option>
                                      <option value="Hamburguesa">Hamburguesa</option>
                                      <option value="Pollo">Pollo</option>
                                      <option value="Papas">Papas</option>
                                      <option value="Bebidas">Bebidas</option>
                                      <option value="Salsas">Salsas</option>
                                      </select>
            <label className='font-bold'>Imagen: </label><input ref={fileInputRef} className='border rounded p-2 hidden' type='file' name='imagen' value={formData.imagen} onChange={handleFileChange} placeholder='Imagen del producto' />
            <button 
                type="button" 
                onClick={() => fileInputRef.current.click()} // Activa el input
                className="border rounded p-2 text-gray-700 bg-white cursor-pointer">{fileName}
            </button>
            </div>
            <button type='submit' className='border rounded py-2 px-16 bg-[#00aa4d] text-white'>Cargar producto</button>
        </form>
        {message && (
                <div className={`mt-4 text-center p-4 mb-4 rounded ${isError ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                {message}
                </div>)}
    </div>
    </>
  )
}
