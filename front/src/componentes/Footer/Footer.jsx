export default function Footer() {
    return (
    <footer className="flex p-4 relative w-full bg-black text-white text-center">
        <div className="container w-full justify-center flex px-4 gap-2">
            Desarrollado por
            <a
            href="https://juanmd14.netlify.app/"
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
};