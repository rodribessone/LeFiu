import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'

export default function Main() {
  return (
    <div className='relative h-[90vh] flex justify-center items-center'>
        <div className='bg-white rounded w-1/3 h-4/5 flex flex-col justify-center items-center min-w-96'>
            <img src='Logo.jpg' className='rounded-full w-20 h-20 m-2' />
            <h1 className='text-2xl font-bold'>Le Fiu</h1>
            <div className="border-2 border-black rounded-lg bg-green-600">Abierto</div>
            <p className='text-center p-4 '> ⏰ Miercoles a Domingo de 20:30 a 23:30 <br/>
            <div>
              <a href="https://www.instagram.com/lefiu.burgers/"
                  target="_blank"
                  rel="noopener noreferrer"><FontAwesomeIcon className="text-xl hover:text-red-500" icon={faInstagram} /></a>
            </div>
            </p>
            <Link to="/pedido" className='text-2xl bg-black rounded-lg w-4/5 text-white p-2 m-2 text-center'>Hacer un pedido</Link>
            <Link to="/carta" className="text-2xl bg-black rounded-lg w-4/5 text-white p-2 m-2 text-center">Consulta la carta</Link>
            <button className='text-2xl bg-black rounded-lg w-4/5 text-white p-2 m-2'>Chat por wpp</button>
        </div>
    </div>
  )
}
