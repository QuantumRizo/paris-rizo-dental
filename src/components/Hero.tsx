import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

// Nota: El hook 'useNavigate' ya no se usa si solo usamos <Link>
// Si 'scrollToSection' se usa en otro lugar, deberás volver a importar 'useNavigate'
// import { useNavigate } from "react-router-dom"; 

const Hero = () => {
  // const whatsappNumber = "5531492408";
  // const whatsappUrl = `https://wa.me/52${whatsappNumber}?text=Hola,%20me%20gustaría%20agendar%20una%20cita`;
  const instagramUrl = "https://www.instagram.com/parisrizoconsultoriodental";
  const linkedinUrl = "https://www.linkedin.com/in/paris-rizo-3049b3365/";

  // Si esta función solo se usa en el Header, puedes borrarla de aquí
  /*
  const navigate = useNavigate(); 
  const scrollToSection = (sectionId: string) => {
    navigate('/'); 
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  */

  return (
    <section
      id="inicio"
      className="relative flex items-center justify-center overflow-hidden min-h-[70vh]"
    >
      {/* --- NUEVA Imagen de Fondo --- */}
      <img
        // IMPORTANTE: Cambia esta URL por la de tu imagen.
        // Puedes subir tu imagen a la carpeta 'public' y usar '/tu-imagen.jpg'
        src="/fondohero.jpg"
        alt="Consultorio dental moderno y profesional"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Overlay oscuro para legibilidad */}
      <div className="absolute inset-0 bg-black/60 z-1" />

      {/* Fondo suave (opcional, puede que ya no sea necesario) */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-background z-0" /> */}

      <div className="container mx-auto px-6 py-16 sm:py-24 relative z-10 flex flex-col items-center justify-center gap-12 lg:gap-20">

        {/* --- Contenido de Texto (Centrado) --- */}
        <div className="text-center w-full lg:w-3/4 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Sonríe con <span className="text-[hsl(var(--ring))]">confianza</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            Cuidamos tu salud dental.
          </p>

          {/* Botón y redes */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              // Cambiado a color 'primary' de tu tema
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.9)] text-[hsl(var(--primary-foreground))] shadow-medium transition-all hover:scale-105"
            >
              <a
                href={`https://wa.me/525531492408?text=Hola,%20me%20gustaría%20agendar%20una%20cita`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span className="sm:inline">Agendar cita</span>
              </a>
            </Button>

            {/* Redes */}
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                // Ajustado para fondo oscuro
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Instagram className="w-8 h-8 text-pink-400" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                // Ajustado para fondo oscuro
                className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Linkedin className="w-8 h-8 text-blue-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
