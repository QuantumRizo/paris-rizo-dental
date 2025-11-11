import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "María González",
      text: "Excelente servicio, muy profesionales y el consultorio está impecable. Mi familia y yo estamos muy contentos.",
      rating: 5,
    },
    {
      name: "Carlos Ramírez",
      text: "La limpieza fue muy completa y sin dolor. El doctor es muy amable y explica todo con claridad.",
      rating: 5,
    },
    {
      name: "Ana López",
      text: "Recomiendo ampliamente este consultorio. Atención de primera y precios justos.",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lo que dicen nuestros pacientes
          </h2>
          <p className="text-xl text-muted-foreground">
            Testimonios reales de personas satisfechas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-card border-border hover:shadow-medium transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-foreground">- {testimonial.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
