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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-background z-0" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* --- Texto principal --- */}
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Sonríe con <span className="text-primary">confianza</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Cuidamos tu salud dental.
            </p>

            {/* --- Botón principal + redes --- */}
            <div className="flex items-center gap-4 flex-wrap">
  {/* Botón WhatsApp */}
  <Button
    asChild
    size="lg"
    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium transition-all hover:scale-105 text-lg px-8 py-6"
  >
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3"
    >
      <MessageCircle className="w-5 h-5" />
      Agendar cita por WhatsApp
    </a>
  </Button>

  {/* Instagram */}
  <a
    href={instagramUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="p-3 bg-pink-500/10 rounded-full hover:bg-pink-500/20 transition-all"
  >
    <Instagram className="w-8 h-8 text-pink-500" />
  </a>

  {/* LinkedIn */}
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

          {/* --- Imagen lateral --- */}
          <div className="animate-fade-in relative">
            <div className="rounded-3xl overflow-hidden shadow-medium">
              <img
                src="/logo.jpg"
                alt="Consultorio dental moderno y profesional"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
