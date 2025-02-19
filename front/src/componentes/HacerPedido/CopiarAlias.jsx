import { useState } from "react";  // Agregar esta importación
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

const CopiarAlias = () => {
  const alias = "Lefiu.feu";
  const [mensajeExito, setMensajeExito] = useState(""); // Estado para el mensaje de éxito

  const copiarAlPortapapeles = (e) => {
    e.stopPropagation(); // Evitar que se propague el evento
    navigator.clipboard.writeText(alias).then(() => {
      setMensajeExito("Alias copiado con éxito!"); // Cambiar el mensaje de éxito
      setTimeout(() => setMensajeExito(""), 3000); // Borrar el mensaje después de 3 segundos
    }).catch(() => {
      setMensajeExito("Hubo un error al copiar el alias.");
    });
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={copiarAlPortapapeles}
        className="px-4 py-2 bg-[#899388] text-white rounded flex items-center gap-2 hover:bg-[#abb7aa] focus:outline-none"
        onMouseEnter={(e) =>
          e.currentTarget.nextSibling.classList.remove("opacity-0")
        }
        onMouseLeave={(e) =>
          e.currentTarget.nextSibling.classList.add("opacity-0")
        }
      >
        <FontAwesomeIcon icon={faCopy} />
      </button>
      {/* Tooltip */}
      <div
        className="absolute bottom-full mb-2 px-2 py-1 text-sm text-white bg-gray-700 rounded opacity-0 transition-opacity duration-200"
        style={{ whiteSpace: "nowrap" }}
      >
        Copiar alias
      </div>

      {/* Mensaje de éxito */}
      {mensajeExito && (
        <div className="absolute top-0 left-0 mt-2 px-2 py-1 bg-green-500 text-white rounded text-sm">
          {mensajeExito}
        </div>
      )}
    </div>
  );
};

export default CopiarAlias;
