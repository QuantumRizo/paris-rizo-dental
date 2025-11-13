import React, { useState, useEffect, useMemo } from 'react';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

// --- Configuración de Supabase ---
// ¡IMPORTANTE! Reemplaza esto con tu URL y tu Clave Anónima (anon key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL 
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// --- Constantes de Horarios ---

const ALL_TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30'
];
const MAX_SLOTS_PER_DAY = ALL_TIME_SLOTS.length;

// --- Tipos de Datos ---
interface Appointment {
  id: number;
  name: string;
  date: string;
  time: string;
  type: string;
  status: 'Pendiente' | 'Confirmada' | 'Cancelada';
  created_at: string;
}

// --- Componentes Reutilizables (Copiados de la versión anterior) ---
const Calendar: React.FC<{
  selectedDate: string;
  onDateSelect: (dateStr: string) => void;
  month: Date;
  onMonthChange: (amount: number) => void;
  dailyCounts: Map<string, number>;
  todayStr: string;
}> = ({ selectedDate, onDateSelect, month, onMonthChange, dailyCounts, todayStr }) => {
  const year = month.getFullYear();
  const monthIdx = month.getMonth();
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const startOffset = (firstDay === 0) ? 6 : firstDay - 1;

  const days = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`blank-${i}`} className="p-2"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(new Date(year, monthIdx, day));
    const count = dailyCounts.get(dateStr) || 0;
    const isFull = count >= MAX_SLOTS_PER_DAY;
    const isPast = dateStr < todayStr;
    const isSelected = dateStr === selectedDate;

    let dayClass = 'cursor-pointer transition-colors duration-200';
    if (isPast) {
      dayClass = 'text-gray-400 bg-gray-50 cursor-not-allowed';
    } else if (isSelected) {
      dayClass += ' bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-bold';
    } else if (isFull) {
      dayClass += ' bg-orange-100 text-orange-600 hover:bg-orange-200';
    } else {
      dayClass += ' bg-green-100 text-green-800 hover:bg-green-200';
    }

    days.push(
      <div
        key={`day-${day}`}
        className={`flex items-center justify-center h-10 w-10 rounded-full text-sm ${dayClass}`}
        onClick={() => !isPast && onDateSelect(formatDate(new Date(year, monthIdx, day)))}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <button type="button" onClick={() => onMonthChange(-1)} className="px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded-lg hover:bg-[hsl(var(--accent))] transition-colors">&lt;</button>
        <h3 className="text-xl font-semibold text-center">
          {month.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h3>
        <button type="button" onClick={() => onMonthChange(1)} className="px-4 py-2 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] rounded-lg hover:bg-[hsl(var(--accent))] transition-colors">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-600 mb-2">
        <div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div><div>D</div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">{days}</div>
    </div>
  );
};

const TimeSlots: React.FC<{
  selectedDate: string;
  selectedTime: string;
  onTimeSelect: (slot: string) => void;
  appointments: Appointment[];
  todayStr: string;
}> = ({ selectedDate, selectedTime, onTimeSelect, appointments, todayStr }) => {
  if (!selectedDate) return null;

  const takenSlots = new Set(
    appointments
      .filter(app => app.date === selectedDate && app.status !== 'Cancelada')
      .map(app => app.time.substring(0, 5))
  );

  const isPast = selectedDate < todayStr;
  if (isPast) return null;

  return (
    <div className="md:col-span-2">
      <h4 className="mb-4 font-semibold text-gray-700 text-lg">Selecciona una Hora para el {selectedDate}</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {ALL_TIME_SLOTS.map(slot => {
          const isTaken = takenSlots.has(slot);
          const isSelected = selectedTime === slot;
          return (
            <button
              type="button"
              key={slot}
              disabled={isTaken}
              onClick={() => onTimeSelect(slot)}
              className={`w-full p-3 rounded-lg font-medium transition-all duration-200
                ${isTaken ? 'bg-gray-200 text-gray-400 cursor-not-allowed line-through' : ''}
                ${!isTaken && isSelected ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] ring-2 ring-[hsl(var(--ring))]' : ''}
                ${!isTaken && !isSelected ? 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]' : ''}
              `}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AppButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'destructive' | 'secondary' }> = ({ children, variant = 'primary', className = '', ...props }) => {
  let colors = '';
  switch (variant) {
    case 'primary':
      colors = 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)]'; break;
    case 'destructive':
      colors = 'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.9)]'; break;
    case 'secondary':
      colors = 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--secondary)/0.8)]'; break;
  }
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2 ${colors} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const formatDate = (d: Date): string => d.toISOString().split('T')[0];

// --- Componente del Panel (Contenido del Admin) ---
const AdminDashboard: React.FC<{ session: any }> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [reschedulingAppt, setReschedulingAppt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [adminMonth, setAdminMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dailyCounts, setDailyCounts] = useState<Map<string, number>>(new Map());
  const todayStr = useMemo(() => formatDate(new Date()), []);
  
  // --- NUEVO ESTADO PARA CONFIRMAR ELIMINACIÓN ---
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) {
      console.error("Error fetching appointments:", error);
      setMessage({ type: 'error', text: 'No se pudieron cargar las citas. Revisa las políticas RLS.' });
    } else if (data) {
      setAppointments(data as Appointment[]);
      const counts = new Map<string, number>();
      for (const app of data) {
        if (app.status !== 'Cancelada') {
          counts.set(app.date, (counts.get(app.date) || 0) + 1);
        }
      }
      setDailyCounts(counts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
    const channel = supabase
      .channel('public:appointments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchAppointments())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: 'Confirmada') => { // Modificado: ya no acepta 'Cancelada'
    const { error } = await supabase.from('appointments').update({ status: newStatus }).eq('id', id);
    if (error) setMessage({ type: 'error', text: 'No se pudo actualizar el estado.' });
  };

  // --- NUEVA FUNCIÓN PARA ELIMINAR ---
  const handleDeleteAppointment = async (id: number) => {
    // NOTA: Para producción, aquí podrías poner un modal de confirmación
    // en lugar de un `window.confirm`.
    // Por ahora, lo eliminamos directamente.
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) {
      setMessage({ type: 'error', text: 'No se pudo eliminar la cita. Revisa la política RLS de DELETE.' });
    }
  };

  const startReschedule = (app: Appointment) => {
    setReschedulingAppt(app);
    setNewDate(app.date);
    setNewTime(app.time);
    setAdminMonth(new Date(app.date + 'T00:00:00'));
  };

  const handleRescheduleSubmit = async () => {
    if (!reschedulingAppt || !newDate || !newTime) return;
    setLoading(true);
    const { error } = await supabase
      .from('appointments')
      .update({ date: newDate, time: newTime, status: 'Pendiente' })
      .eq('id', reschedulingAppt.id);

    if (error) {
      setMessage({ type: 'error', text: 'No se pudo reagendar la cita.' });
    } else {
      setMessage({ type: 'success', text: '¡Cita reagendada con éxito!' });
      setReschedulingAppt(null);
      setNewDate('');
      setNewTime('');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {reschedulingAppt ? 'Reagendar Cita' : 'Panel de Admin'}
        </h2>
        <AppButton variant="secondary" onClick={handleLogout}>Cerrar Sesión</AppButton>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      {/* --- VISTA ADMIN: Lista de Citas --- */}
      {!reschedulingAppt && (
        <div>
          {loading && <div className="text-center text-gray-600">Cargando citas...</div>}
          {!loading && appointments.length === 0 && (
            <div className="text-center text-gray-500 p-6 bg-[hsl(var(--muted))] rounded-lg">No hay citas pendientes.</div>
          )}
          {!loading && appointments.length > 0 && (
            <div className="space-y-4">
              {appointments.map((app) => (
                <div key={app.id} className="p-5 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-soft flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <p className="font-bold text-lg text-[hsl(var(--card-foreground))]">{app.name}</p>
                    <p className="text-[hsl(var(--muted-foreground))]">Tipo: {app.type}</p>
                    <p className="text-[hsl(var(--muted-foreground))]">
                      Fecha: <span className="font-medium text-[hsl(var(--card-foreground))]">{app.date}</span> a las <span className="font-medium text-[hsl(var(--card-foreground))]">{app.time}</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${app.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : app.status === 'Confirmada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {confirmingDeleteId === app.id ? (
                      // --- VISTA DE CONFIRMACIÓN DE BORRADO ---
                      <>
                        <AppButton
                          variant="destructive"
                          onClick={() => {
                            handleDeleteAppointment(app.id);
                            setConfirmingDeleteId(null); // Ocultar botones
                          }}
                          className="text-sm"
                        >
                          Confirmar Eliminación
                        </AppButton>
                        <AppButton
                          variant="secondary"
                          onClick={() => setConfirmingDeleteId(null)} // Cancelar
                          className="text-sm"
                        >
                          Volver
                        </AppButton>
                      </>
                    ) : (
                      // --- VISTA DE BOTONES NORMALES ---
                      <>
                        {app.status === 'Pendiente' && (
                          <>
                            <AppButton variant="primary" onClick={() => handleUpdateStatus(app.id, 'Confirmada')} className="text-sm">Confirmar</AppButton>
                            {/* CAMBIADO: Ahora solo muestra la confirmación */}
                            <AppButton variant="destructive" onClick={() => setConfirmingDeleteId(app.id)} className="text-sm">Eliminar</AppButton>
                          </>
                        )}
                        {app.status === 'Confirmada' && (
                          // CAMBIADO: Ahora solo muestra la confirmación
                          <AppButton variant="destructive" onClick={() => setConfirmingDeleteId(app.id)} className="text-sm">Eliminar</AppButton>
                        )}
                        {app.status === 'Cancelada' && (
                          // AÑADIDO: Permitir eliminar permanentemente citas ya canceladas
                          <AppButton variant="destructive" onClick={() => setConfirmingDeleteId(app.id)} className="text-sm">Eliminar (Permanente)</AppButton>
                        )}
                        <AppButton variant="secondary" onClick={() => startReschedule(app)} className="text-sm">Reagendar</AppButton>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- VISTA ADMIN: Reagendando Cita Específica --- */}
      {reschedulingAppt && (
        <div>
          <p className="text-center text-lg text-[hsl(var(--muted-foreground))] mb-6">
            Para: <span className="font-semibold text-[hsl(var(--primary))]">{reschedulingAppt.name}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-[hsl(var(--border))] rounded-xl bg-[hsl(var(--background))]">
            <Calendar
              selectedDate={newDate}
              onDateSelect={(dateStr) => { setNewDate(dateStr); setNewTime(''); }}
              month={adminMonth}
              onMonthChange={(amount) => setAdminMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1))}
              dailyCounts={dailyCounts}
              todayStr={todayStr}
            />
            <TimeSlots
              selectedDate={newDate}
              selectedTime={newTime}
              onTimeSelect={setNewTime}
              appointments={appointments.filter(a => a.id !== reschedulingAppt.id)}
              todayStr={todayStr}
            />
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-4">
              <AppButton onClick={handleRescheduleSubmit} disabled={loading || !newDate || !newTime} className="w-full py-3">
                {loading ? 'Guardando...' : 'Confirmar Reagendado'}
              </AppButton>
              <AppButton variant="secondary" onClick={() => setReschedulingAppt(null)} className="w-full py-3">
                Cancelar
              </AppButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- Componente Principal (con Lógica de Login) ---
const AdminPanel: React.FC = () => {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Verificar sesión existente
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center p-10">Cargando...</div>;
  }

  // Si NO hay sesión, mostrar formulario de Login
  if (!session) {
    return (
      <div className="max-w-md mx-auto p-8 bg-background shadow-soft rounded-[var(--radius)] mt-20 text-foreground">
        <h2 className="text-3xl font-bold text-center mb-6 text-[hsl(var(--primary))]">
          Iniciar Sesión (Admin)
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-[hsl(var(--foreground))]">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] focus:ring-2 focus:ring-[hsl(var(--ring))] focus:outline-none"
              placeholder="admin@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-semibold text-[hsl(var(--foreground))]">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] focus:ring-2 focus:ring-[hsl(var(--ring))] focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-100 text-red-800 rounded-lg text-center">
              {error}
            </div>
          )}
          <AppButton type="submit" disabled={loading} className="w-full py-3 text-lg">
            {loading ? 'Cargando...' : 'Entrar'}
          </AppButton>
        </form>
      </div>
    );
  }

  // Si SÍ hay sesión, mostrar el panel de admin
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-background shadow-soft rounded-[var(--radius)] mt-10 text-foreground">
      <AdminDashboard session={session} />
    </div>
  );
};

export default AdminPanel;