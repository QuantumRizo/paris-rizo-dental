import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Header = () => {
  const whatsappNumber = "5531492408";
  const whatsappUrl = `https://wa.me/52${whatsappNumber}?text=Hola,%20me%20gustaría%20agendar%20una%20cita`;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo en lugar del texto */}
        <button onClick={() => scrollToSection("inicio")} className="flex items-center">
          <img
  src="/logo.jpg"
  alt="Logo Paris Rizo Consultorio Dental"
  className="h-[4rem] w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
/>

        </button>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("inicio")}
            className="text-foreground hover:text-primary transition-colors"
          >
            Inicio
          </button>
          <button
            onClick={() => scrollToSection("servicios")}
            className="text-foreground hover:text-primary transition-colors"
          >
            Servicios
          </button>
          <button
            onClick={() => scrollToSection("contacto")}
            className="text-foreground hover:text-primary transition-colors"
          >
            Contacto
          </button>
        </nav>

        {/* Botón WhatsApp */}
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium transition-all hover:scale-105"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Agendar cita</span>
          </a>
        </Button>
      </div>
    </header>
  );
};

export default Header;
