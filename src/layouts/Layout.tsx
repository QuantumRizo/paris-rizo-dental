import React from 'react';
import { Outlet } from 'react-router-dom';

// Asumiré las rutas a tu Header y Footer basándome en tu estructura.
// ¡Ajusta estas rutas si es necesario!
import Header from '@/components/Header';
import Footer from '@/components/Footer';

/**
 * Layout.tsx
 * * Este componente envuelve todas las páginas públicas de tu sitio.
 * Incluye el Header (barra de navegación) y el Footer.
 * El componente <Outlet /> de react-router-dom se encarga de
 * renderizar la página específica (ej. Inicio, Citas, etc.) en el medio.
 */
const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* El Header se importa una sola vez, aquí */}
      <Header />

      {/* Contenido principal de la página */}
      <main className="flex-grow pt-16">
        {/* Añadimos 'pt-16' (padding-top: 4rem) porque tu Header
          es 'fixed' y tiene una altura de 'h-16'.
          Esto evita que el contenido de tu página se oculte
          debajo de la barra de navegación.
        */}
        <Outlet />
      </main>

      {/* El Footer se importa una sola vez, aquí */}
      <Footer />
    </div>
  );
};

export default Layout;