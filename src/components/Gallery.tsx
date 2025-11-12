import { motion } from "framer-motion";

const Gallery = () => {
  // Agrupamos tratamientos según el número de imágenes
  const sections = [
    // Grupo de dos imágenes
    [
      {
        title: "Limpieza Dental Profesional",
        images: ["/limpieza1.jpg", "/limpieza2.jpg"],
      },
      {
        title: "Aclaramiento Dental",
        images: ["/aclaramiento.jpg", "/trabajo3.jpg"],
      },
    ],
    // Grupo de una imagen
    [
      {
        title: "Aplicación de Flúor en Niños",
        images: ["/fluor.jpg"],
      },
      {
        title: "Endodoncia",
        images: ["/endodoncia.jpg"],
      },
    ],
    // Grupo de una imagen
    [
      {
        title: "Cirugía de Terceros Molares",
        images: ["/cirugia.jpg"],
      },
      {
        title: "Prótesis Removible",
        images: ["/protesis.jpg"],
      },
    ],
    // Grupo de tres imágenes (centrado solo)
    [
      {
        title: "Rehabilitación Dental (Antes y Después)",
        images: ["/trabajo1.jpg", "/trabajo2.jpg"],
      },
    ],
  ];

  return (
    <section id="galeria" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Galería de Tratamientos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Conoce algunos resultados y procedimientos realizados en el consultorio
          </p>
        </div>

        {/* Secciones agrupadas */}
        <div className="flex flex-col gap-20">
          {sections.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={`grid ${
                group.length === 1
                  ? "grid-cols-1 justify-items-center"
                  : "grid-cols-1 md:grid-cols-2 gap-16"
              }`}
            >
              {group.map((section, index) => (
                <motion.div
                  key={index}
                  className="animate-fade-in"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Título */}
                  <h3 className="text-2xl font-semibold text-primary mb-6 text-center">
                    {section.title}
                  </h3>

                  {/* Imágenes sin fondo */}
                  <div className="flex flex-wrap justify-center gap-6">
                    {section.images.map((img, i) => (
                      <div
                        key={i}
                        className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <img
                          src={img}
                          alt={section.title}
                          className="max-h-[450px] w-auto object-contain hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
