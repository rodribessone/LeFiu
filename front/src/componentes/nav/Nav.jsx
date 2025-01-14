import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBars } from "@fortawesome/free-solid-svg-icons"

export default function Nav() {
  return (
    <div className='w-full bg-black text-white flex justify-between p-4 relative z-11'>
        <Link to="/" className="text-2xl"><FontAwesomeIcon icon={faBars} /></Link>
        
        <h1>Le Fiu</h1>
        
        <Link to="/usuario" className="text-2xl"><FontAwesomeIcon icon={faUser} /></Link>
        
    </div>
  )
}
