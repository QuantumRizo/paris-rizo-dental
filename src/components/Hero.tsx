import { Button } from "@/components/ui/button";
import { MessageCircle, Instagram, Linkedin } from "lucide-react";

const Hero = () => {
  const whatsappNumber = "5531492408";
  const whatsappUrl = `https://wa.me/52${whatsappNumber}?text=Hola,%20me%20gustaría%20agendar%20una%20cita`;
  const instagramUrl = "https://www.instagram.com/paris8606";
  const linkedinUrl = "https://www.linkedin.com/in/paris-rizo-3049b3365/";

  return (
    <section
      id="inicio"
      className="relative flex items-center justify-center overflow-hidden min-h-screen"
    >
      {/* Fondo suave */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-background z-0" />

      <div className="container mx-auto px-6 py-16 sm:py-24 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
        {/* --- Imagen izquierda --- */}
        <div className="flex justify-center lg:justify-start w-full lg:w-1/2 animate-fade-in">
          <div className="flex justify-center lg:justify-start w-full lg:w-1/2 animate-fade-in">
  <img
    src="/logo.png"
    alt="Consultorio dental moderno y profesional"
    className="w-4/5 sm:w-2/3 lg:w-[90%] max-w-2xl h-auto object-contain"
  />
</div>
        </div>

        {/* --- Texto derecha --- */}
        <div className="text-center lg:text-left w-full lg:w-1/2 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Sonríe con <span className="text-primary">confianza</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Cuidamos tu salud dental.
          </p>

          {/* Botón y redes */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            {/* WhatsApp */}
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium transition-all hover:scale-105 text-lg px-8 py-6 w-full sm:w-auto"
            >
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3"
              >
                <MessageCircle className="w-5 h-5" />
                Agendar cita por WhatsApp
              </a>
            </Button>

            {/* Redes */}
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-pink-500/10 rounded-full hover:bg-pink-500/20 transition-all"
              >
                <Instagram className="w-8 h-8 text-pink-500" />
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-blue-600/10 rounded-full hover:bg-blue-600/20 transition-all"
              >
                <Linkedin className="w-8 h-8 text-blue-600" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
