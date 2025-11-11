import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo pronto.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const whatsappNumber = "5531492408";

  return (
    <section id="contacto" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contáctanos
          </h2>
          <p className="text-xl text-muted-foreground">
            Estamos aquí para atenderte
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6 animate-fade-in">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <MapPin className="w-6 h-6 text-primary" />
                  Dirección
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Insurgentes Norte 1539, Esq. con Sirena 54<br />
                  Col. Industrial, Ciudad de México
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <Phone className="w-6 h-6 text-primary" />
                  WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a
                  href={`https://wa.me/52${whatsappNumber}`}
                  className="text-primary hover:underline text-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {whatsappNumber}
                </a>
              </CardContent>
            </Card>

            <div className="rounded-2xl overflow-hidden shadow-medium h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.1835!2d-99.1634!3d19.4736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI4JzI1LjAiTiA5OcKwMDknNDguMiJX!5e0!3m2!1ses!2smx!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del consultorio"
              />
            </div>
          </div>

          <Card className="bg-card border-border animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground text-2xl">
                <Mail className="w-6 h-6 text-primary" />
                Envíanos un mensaje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Tu correo electrónico"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-background border-border"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Tu mensaje"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="bg-background border-border"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium transition-all hover:scale-105"
                >
                  Enviar mensaje
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
