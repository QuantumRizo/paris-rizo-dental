import { Sparkles, Shield, Stethoscope, Baby, Scissors, FileBadge } from "lucide-react";

const Services = () => {
  const services = [
    { icon: Sparkles, title: "Limpieza dental" },
    { icon: Shield, title: "Aplicación de flúor" },
    { icon: Stethoscope, title: "Operatoria dental" },
    { icon: FileBadge, title: "Prótesis dental" },
    { icon: Scissors, title: "Endodoncia" },
    { icon: Baby, title: "Odontopediatría" },
    { icon: Scissors, title: "Cirugías dentales" },
  ];

  return (
    <section id="servicios" className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Servicios Dentales
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Conoce los tratamientos que ofrecemos
          </p>
        </div>

        {/* Grid compacto */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <service.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
