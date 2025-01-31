import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from "@fortawesome/free-solid-svg-icons"
import UserMenu from "../usuario/UserMenu"
import Cart from "../HacerPedido/Cart"

export default function Nav() {
  return (
    <div className='w-full bg-black fixed h-16 top-0 text-white flex justify-between py-4 px-6 z-30'>
        <Link to="/" className="text-2xl"><FontAwesomeIcon icon={faHouse} /></Link>  { /* asdasd*/}
        
        <h1  className="text-2xl font-bold italic font-cursive">Le Fiu</h1>
        
        <div className="flex gap-6">
          <Cart/>
          <UserMenu/>
        </div>
    </div>
  )
}
