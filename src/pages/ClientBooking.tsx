import React, { useState, useEffect, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
  date: string;
  time: string;
  status: 'Pendiente' | 'Confirmada' | 'Cancelada';
}

// --- Componente de Calendario (Reutilizable) ---
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

// --- Componente de Horarios (Reutilizable) ---
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

// --- Función de Utilidad ---
const formatDate = (d: Date): string => d.toISOString().split('T')[0];

// --- Componente Principal (Solo Cliente) ---
const ClientBooking: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState('Primera Vez');
  const [clientMonth, setClientMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dailyCounts, setDailyCounts] = useState<Map<string, number>>(new Map());
  const todayStr = useMemo(() => formatDate(new Date()), []);

  // Cargar citas (solo necesitamos fecha, hora y estado para los conteos)
  const fetchAppointmentsForSlots = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('date, time, status'); // Solo pedimos lo necesario

    if (error) {
      console.error("Error fetching appointments:", error);
      setMessage({ type: 'error', text: 'No se pudieron cargar los horarios. Revisa tu política RLS de SELECT.' });
    } else if (data) {
      const activeAppointments = (data as Appointment[]).filter(app => app.status !== 'Cancelada');
      setAppointments(activeAppointments);
      
      const counts = new Map<string, number>();
      for (const app of activeAppointments) {
        counts.set(app.date, (counts.get(app.date) || 0) + 1);
      }
      setDailyCounts(counts);
    }
    setLoading(false);
  };

  // Cargar los slots al montar
  useEffect(() => {
    fetchAppointmentsForSlots();
  }, []);

  // Enviar el formulario
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !time || !type) {
      setMessage({ type: 'error', text: 'Por favor, completa nombre, tipo, y selecciona un día y hora.' });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from('appointments')
      .insert([{ name, date, time, type, status: 'Pendiente' }]);

    if (error) {
      console.error("Error adding document: ", error);
      setMessage({ type: 'error', text: 'Hubo un error al agendar tu cita. Intenta de nuevo.' });
    } else {
      setMessage({ type: 'success', text: '¡Cita agendada con éxito!' });
      setName(''); setDate(''); setTime(''); setType('Primera Vez');
      // Recargar los contadores
      fetchAppointmentsForSlots();
    }
    setLoading(false);
  };

  // Botón de Agendar
  const AppButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
    <button
      className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary)/0.9)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-background shadow-soft rounded-[var(--radius)] mt-10 text-foreground">
      {message && (
        <div
          className={`p-4 rounded-lg mb-6 text-center font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}
      <div>
        <h2 className="text-3xl font-bold text-center mb-6 text-[hsl(var(--primary))]">
          Agenda tu Cita
        </h2>
        <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-semibold text-[hsl(var(--foreground))]">Nombre Completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full p-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] focus:ring-2 focus:ring-[hsl(var(--ring))] focus:outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="type" className="mb-2 font-semibold text-[hsl(var(--foreground))]">Tipo de Cita</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--background))] focus:ring-2 focus:ring-[hsl(var(--ring))] focus:outline-none"
            >
              <option>Primera Vez</option>
              <option>Seguimiento</option>
              <option>Limpieza</option>
              <option>Ortodoncia</option>
              <option>Otro</option>
            </select>
          </div>
          <Calendar
            selectedDate={date}
            onDateSelect={(dateStr) => { setDate(dateStr); setTime(''); }}
            month={clientMonth}
            onMonthChange={(amount) => setClientMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + amount, 1))}
            dailyCounts={dailyCounts}
            todayStr={todayStr}
          />
          <TimeSlots
            selectedDate={date}
            selectedTime={time}
            onTimeSelect={setTime}
            appointments={appointments}
            todayStr={todayStr}
          />
          <div className="md:col-span-2">
            <AppButton type="submit" disabled={loading} className="w-full py-3 px-6 mt-4 text-lg">
              {loading ? 'Agendando...' : 'Agendar Cita'}
            </AppButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientBooking;