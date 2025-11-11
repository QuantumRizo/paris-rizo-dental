import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Shield } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Sparkles,
      title: "Limpieza dental profesional",
      description: "Eliminamos placa y sarro para mantener tu sonrisa sana y brillante.",
    },
    {
      icon: Shield,
      title: "Aplicación de flúor",
      description: "Fortalece el esmalte dental y previene caries de manera efectiva.",
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tratamientos profesionales para cuidar tu salud dental
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="bg-card hover:shadow-medium transition-all duration-300 hover:scale-105 border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
