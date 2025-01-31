export default function Footer() {
    return (
        <footer className="w-full bg-black text-white h-6 fixed bottom-0 left-0 z-20">
            <div className="container mx-auto h-full flex items-center justify-center text-sm">
                Desarrollado por
                <a
                    href="https://rodribessone.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 mx-1"
                >
                    Rodri
                </a>
                y
                <a
                    href="https://juanmd14.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 mx-1"
                >
                    Juan
                </a>
            </div>
        </footer>
    );
}