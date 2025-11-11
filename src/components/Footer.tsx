import { Facebook, Instagram } from "lucide-react";

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
              href="#"
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-primary" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-primary" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
