import { useEffect, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'

export default function Pedido() {

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
<div className='relative flex flex-col bg-white w-2/3 h-2/3 m-auto p-4 border-2 border-black'>
      {productos.map((item) => {
          // Se desestructuran los valores del item}
          const { nombre, precio, imagen, descripcion, _id} = item
          return(
          <div key={_id} className=' flex flex-col w-4/5 m-auto border-2 border-black justify-center rounded-xl'>
            <div className="flex p-4">
                <div className="m-4 w-1/5">
                  <p>
                    <img src="Fondo.jpg" className="w-60 h-32 object-cover"/>
                    {imagen}
                  </p>
                </div>
                <div className="w-3/5">
                  <h1 className="text-xl font-bold">{nombre}</h1>
                  <p className="text-gray-700 font-bold">{precio}</p>
                  <p>{descripcion}</p>
                </div>
                <div className="flex justify-center w-1/5">
                  <button className="flex m-auto p-4 text-white bg-green-500 border-2 rounded border-black hover:bg-green-600"> 
                    <FontAwesomeIcon className="p-1" icon={faCirclePlus} /> 
                    <p>AGREGAR</p> 
                  </button>
                </div>
            </div>
          </div>
          )
        })}
</div>
  )
}



