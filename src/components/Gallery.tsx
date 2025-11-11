import React from "react";

const Gallery = () => {
  return (
    <section id="galeria" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Galería de Trabajos
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Conoce algunos resultados y momentos del consultorio
        </p>

        {/* Galería: 3 imágenes + video */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Imagen 1 */}
          <div className="relative w-full aspect-[9/16] overflow-hidden rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
            <img
              src="/trabajo1.jpg"
              alt="Trabajo dental 1"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Imagen 2 */}
          <div className="relative w-full aspect-[9/16] overflow-hidden rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
            <img
              src="/trabajo2.jpg"
              alt="Trabajo dental 2"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Imagen 3 */}
          <div className="relative w-full aspect-[9/16] overflow-hidden rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
            <img
              src="/trabajo3.jpg"
              alt="Trabajo dental 3"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Video */}
          <div className="relative w-full aspect-[9/16] overflow-hidden rounded-2xl shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300">
            <video
              src="/videotrabajo.mp4"
              controls
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
