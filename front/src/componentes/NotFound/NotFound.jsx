import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-9xl font-bold text-amber-500 mb-4">404</h1>
      <p className="text-xl mb-8 text-center">¡Ups! Esta página parece estar en el horno</p>
      <Link 
        to="/" 
        className="bg-amber-500 text-black px-8 py-3 rounded-full hover:bg-amber-400 transition-colors font-bold"
      >
        Volver al Menú Principal
      </Link>
    </div>
  );
}