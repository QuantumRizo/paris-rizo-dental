import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-primary mb-2">
              Paris Rizo Consultorio Dental
            </h3>
            <p className="text-muted-foreground">
              © 2025 Todos los derechos reservados
            </p>
          </div>

          <div className="flex gap-4">

            <a
              href="https://www.instagram.com/paris8606/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition"
              aria-label="Instagram"
            >
              <FaInstagram className="w-10 h-10 text-[#E4405F]" /> {/* Rosa Instagram */}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
