import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"
import UserMenu from "../usuario/UserMenu"

export default function Nav() {
  return (
    <div className='w-full bg-black text-white flex justify-between py-4 px-6 relative z-11'>
        <Link to="/" className="text-2xl"><FontAwesomeIcon icon={faBars} /></Link>
        
        <h1>Le Fiu</h1>
        
        <UserMenu/>
        
    </div>
  )
}
