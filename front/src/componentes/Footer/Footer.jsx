export default function Footer() {
    return (
        <footer className="flex p-1 w-full bg-black justify-center text-white text-center z-10">
            <div className="container w-full justify-center flex px-2 gap-1 text-xs">
                Desarrollado por
                <a
                    href="https://rodribessone.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                >
                    Rodri
                </a>
                <p className="inline-block">y</p>
                <a
                    href="https://juanmd14.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                >
                    Juan
                </a>
            </div>
        </footer>
    );
}