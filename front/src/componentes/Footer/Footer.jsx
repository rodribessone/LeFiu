export default function Footer() {
    return (
    <footer className=" flex justify-center p-4 relative w-full bg-black text-white text-center py-4">
        <div className="container mx-auto px-4">
            Desarrollado por
            <a
            href="https://juanmd14.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 ml-1"
            >
            Rodrigo Bessone
            </a>
        <p className="inline-block mx-1">y</p>
            <a
            href="https://juanmd14.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 ml-1"
            >
            Juan Manuel García
            </a>

        </div>
    </footer>
    );
};