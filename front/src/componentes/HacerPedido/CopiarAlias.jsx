import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

const CopiarAlias = () => {
  const alias = "alias.lefiu";

  const copiarAlPortapapeles = () => {
    navigator.clipboard.writeText(alias).then(() => {
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
        Copiar email
      </div>
    </div>
  );
};

export default CopiarAlias;