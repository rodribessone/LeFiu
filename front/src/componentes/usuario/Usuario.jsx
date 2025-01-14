import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'


export default function Usuario() {

    const [productos, setProductos] = useState([])

    useEffect(() => {
        fetch('http://localhost:3008/productos')
        .then((res) => res.json())
        .then((data) => {
        setProductos(data)
        })
        .catch((error) => console.error('Error fetching productos:', error))
    }, [])

  return (
    <div className="relative bg-white w-4/5 m-auto p-4 ">
        <div className="text-center p-4 flex flex-col">
            <p className="m-2">Bienvenido <b>Joaco</b></p>
            <Link to='/crearProducto' className="mx-auto p-4 text-white bg-green-500 border-2 rounded border-black hover:bg-green-600">
            Crear nuevo producto
        </Link>
        </div>

        <div className='relative flex flex-col bg-white w-11/12 mx-auto p-4'>
      {productos.map((item) => {
          // Se desestructuran los valores del item}
          const { nombre, precio, imagen, descripcion, _id} = item
          return(
          <div key={_id} className=' flex flex-col mx-auto my-2 border-2 border-black justify-center rounded-xl'>
            <div className="flex p-4">
                <div className="m-4 w-1/6">
                  <p>
                    <img src="Fondo.jpg" className="w-60 h-32 object-cover"/>
                    {imagen}
                  </p>
                </div>
                <div className="w-3/6">
                  <h1 className="text-xl font-bold">{nombre}</h1>
                  <p className="text-gray-700 font-bold">{precio}</p>
                  <p>{descripcion}</p>
                </div>
                <div className="flex justify-center w-2/6 gap-2">

                 <Link className="flex m-auto p-4 text-white bg-orange-500 border-2 rounded border-black hover:bg-orange-600" to={`/editarProducto/${_id}`}>
                    <FontAwesomeIcon className="p-1" icon={faPenToSquare} />
                    <p>EDITAR</p> 
                  </Link>

                  <button className="flex m-auto p-4 text-white bg-red-500 border-2 rounded border-black hover:bg-red-600"> 
                    <FontAwesomeIcon className="p-1" icon={faCirclePlus} /> 
                    <p>ELIMINAR</p> 
                  </button>
                  
                </div>
            </div>
          </div>
          )
        })}
</div>
  
    </div>
  )
}
