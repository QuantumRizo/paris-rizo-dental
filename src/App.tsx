import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- Importamos el nuevo Layout ---
// Asegúrate de que la ruta a 'Layout' sea correcta.
// Si `@/layouts/Layout` no funciona, prueba con `../layouts/Layout`
import Layout from '@/layouts/Layout';

// Páginas de tu sitio
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

import Admin from "@/pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* --- RUTA DE ADMIN (SIN LAYOUT) --- */}
          {/* Dejamos el AdminPanel fuera del layout público
              porque tiene su propia interfaz de login y panel. */}
          <Route path="/admin" element={<Admin />} />

          {/* --- RUTAS PÚBLICAS (CON LAYOUT) --- */}
          {/* Creamos una "ruta padre" que usa el componente Layout.
              Todas las rutas anidadas dentro se renderizarán
              donde pusimos el <Outlet /> en Layout.tsx */}
          <Route path="/" element={<Layout />}>
            {/* La ruta 'index' es la que se muestra en '/' */}
            <Route index element={<Index />} />

            {/* Otras rutas públicas */}


            {/* El comodín "*" (NotFound) también va dentro del layout
                para que muestre el Header y Footer. */}
            <Route path="*" element={<NotFound />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;