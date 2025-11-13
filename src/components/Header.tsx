import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // <-- 1. Importar Link y useNavigate

const Header = () => {
  const navigate = useNavigate(); // <-- 2. Obtener la función de navegación

  const scrollToSection = (sectionId: string) => {
    // 3. Modificar la función
    navigate('/'); // <-- 4. Ir a la página de inicio
    
    // 5. Esperar a que la página cambie y LUEGO hacer scroll
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100); // 100ms es un pequeño retraso para asegurar que la navegación ocurrió
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary/70 backdrop-blur-sm border-b border-border shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <button onClick={() => scrollToSection("inicio")} className="flex items-center">
          <img
            src="/logo.png"
            alt="Logo Paris Rizo Consultorio Dental"
            className="h-[4rem] w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
          />
        </button>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Estos botones ahora te llevarán a la página principal y luego harán scroll */}
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

        {/* 6. CORRECCIÓN Botón Agendar Cita */}
        <Button
          asChild
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium transition-all hover:scale-105"
        >
          {/* 7. Usar <Link> en lugar de <a> para evitar recargar la página */}
          <Link
            to="/citas"
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Agendar cita</span>
          </Link>
        </Button>
      </div>
    </header>
  );
};

export default Header;