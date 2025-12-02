import React, { useState, useEffect, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Sparkles, 
  Shield, 
  Stethoscope, 
  FileBadge, 
  Scissors, 
  Baby, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  User,
  FileText
} from 'lucide-react';

// --- Configuración de Supabase ---
// Asegúrate de tener VITE_SUPABASE_URL y VITE_SUPABASE_KEY en tu archivo .env local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || "";
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// --- Configuración de Servicios y Duración ---
// slots: Cantidad de bloques de 30 min que ocupa
const SERVICES = [
  { id: 'primera-vez', title: "Primera Vez", slots: 2, icon: CalendarIcon }, // Ej: 1 hora
  { id: 'seguimiento', title: "Seguimiento", slots: 2, icon: CheckCircle2 },
  { id: 'limpieza', title: "Limpieza dental", slots: 2, icon: Sparkles },
  { id: 'fluor', title: "Aplicación de flúor", slots: 2, icon: Shield },
  { id: 'operatoria', title: "Operatoria dental", slots: 2, icon: Stethoscope },
  { id: 'protesis', title: "Prótesis dental", slots: 3, icon: FileBadge }, // Ej: 1.5 horas
  { id: 'endodoncia', title: "Endodoncia", slots: 3, icon: Scissors },
  { id: 'odontopediatria', title: "Odontopediatría", slots: 2, icon: Baby },
  { id: 'cirugia', title: "Cirugías dentales", slots: 4, icon: Scissors }, // Ej: 2 horas
];

// --- Constantes de Horarios (10:00 AM a 8:00 PM) ---
const ALL_TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
  '20:00'
];

// --- Tipos de Datos ---
interface Appointment {
  id: number;
  date: string;
  time: string; // Hora de inicio
  type: string; // Nombre del servicio
  status: 'Pendiente' | 'Confirmada' | 'Cancelada';
  notes?: string;
}

// Helper para saber cuántos slots ocupa un servicio basado en su nombre
const getSlotsByServiceName = (serviceName: string): number => {
  const service = SERVICES.find(s => s.title === serviceName);
  return service ? service.slots : 1;
};

// --- Componente de Calendario ---
const Calendar: React.FC<{
  selectedDate: string;
  onDateSelect: (dateStr: string) => void;
  month: Date;
  onMonthChange: (amount: number) => void;
  appointments: Appointment[];
  todayStr: string;
}> = ({ selectedDate, onDateSelect, month, onMonthChange, appointments, todayStr }) => {
  const year = month.getFullYear();
  const monthIdx = month.getMonth();
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const startOffset = (firstDay === 0) ? 6 : firstDay - 1;

  // Calcular qué tan lleno está cada día
  const getDayStatus = (dateStr: string) => {
    const dayApps = appointments.filter(a => a.date === dateStr && a.status !== 'Cancelada');
    let occupiedSlots = 0;
    dayApps.forEach(app => {
      occupiedSlots += getSlotsByServiceName(app.type);
    });
    
    const totalSlots = ALL_TIME_SLOTS.length;
    if (occupiedSlots >= totalSlots) return 'full';
    if (occupiedSlots >= totalSlots * 0.7) return 'busy';
    return 'free';
  };

  const days = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`blank-${i}`} className="p-2"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, monthIdx, day);
    const dateStr = dateObj.toISOString().split('T')[0];
    const isPast = dateStr < todayStr;
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === todayStr;
    const status = getDayStatus(dateStr);

    let dayClass = 'h-10 w-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 relative ';
    
    if (isPast) {
      dayClass += 'text-gray-300 cursor-not-allowed';
    } else {
      dayClass += 'cursor-pointer hover:scale-110 ';
      if (isSelected) {
        dayClass += 'bg-blue-600 text-white shadow-lg font-bold scale-110';
      } else if (status === 'full') {
        dayClass += 'bg-red-100 text-red-400 line-through decoration-red-400';
      } else if (status === 'busy') {
        dayClass += 'bg-orange-100 text-orange-700 hover:bg-orange-200';
      } else {
        dayClass += 'bg-green-50 text-green-700 hover:bg-green-100 font-medium';
      }
      
      if (isToday && !isSelected) dayClass += ' border-2 border-blue-400';
    }

    days.push(
      <button
        key={`day-${day}`}
        type="button"
        disabled={isPast || (status === 'full' && !isSelected)}
        className={dayClass}
        onClick={() => onDateSelect(dateStr)}
      >
        {day}
      </button>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <button type="button" onClick={() => onMonthChange(-1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ChevronLeft size={20} /></button>
        <h3 className="text-lg font-bold text-gray-800 capitalize">
          {month.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
        </h3>
        <button type="button" onClick={() => onMonthChange(1)} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ChevronRight size={20} /></button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        <div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div><div>Do</div>
      </div>
      <div className="grid grid-cols-7 gap-2 place-items-center">{days}</div>
    </div>
  );
};

// --- Componente de Horarios Inteligente ---
const TimeSlots: React.FC<{
  selectedDate: string;
  selectedTime: string;
  selectedServiceSlots: number;
  onTimeSelect: (slot: string) => void;
  appointments: Appointment[];
  todayStr: string;
}> = ({ selectedDate, selectedTime, selectedServiceSlots, onTimeSelect, appointments, todayStr }) => {
  if (!selectedDate) return (
    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-xl">
      <CalendarIcon size={48} className="mb-2 opacity-20" />
      <p>Selecciona una fecha primero</p>
    </div>
  );

  // 1. Calcular qué slots individuales de 30 min están ocupados ese día
  const occupiedIndices = new Set<number>();
  
  appointments
    .filter(app => app.date === selectedDate && app.status !== 'Cancelada')
    .forEach(app => {
      const startIndex = ALL_TIME_SLOTS.indexOf(app.time);
      if (startIndex !== -1) {
        const slotsNeeded = getSlotsByServiceName(app.type);
        for (let i = 0; i < slotsNeeded; i++) {
          if (startIndex + i < ALL_TIME_SLOTS.length) {
            occupiedIndices.add(startIndex + i);
          }
        }
      }
    });

  const isPastDate = selectedDate < todayStr;
  
  // Lógica para determinar qué botones mostrar
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h4 className="mb-4 font-bold text-gray-800 flex items-center gap-2">
        <Clock size={18} className="text-blue-500" />
        Horarios Disponibles
        <span className="text-xs font-normal text-gray-500 ml-auto bg-gray-100 px-2 py-1 rounded-full">
          Requiere {selectedServiceSlots * 30} min
        </span>
      </h4>
      
      {isPastDate ? (
        <p className="text-red-500 text-center py-4">Esta fecha ya pasó.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {ALL_TIME_SLOTS.map((slot, index) => {
            // Verificar si este slot y los necesarios consecutivos están libres
            let isAvailable = true;
            
            // Checar límites del día
            if (index + selectedServiceSlots > ALL_TIME_SLOTS.length) {
              isAvailable = false;
            } else {
              // Checar colisión con citas existentes
              for (let i = 0; i < selectedServiceSlots; i++) {
                if (occupiedIndices.has(index + i)) {
                  isAvailable = false;
                  break;
                }
              }
            }

            const isSelected = selectedTime === slot;

            return (
              <button
                type="button"
                key={slot}
                disabled={!isAvailable}
                onClick={() => onTimeSelect(slot)}
                className={`
                  py-2 px-1 rounded-lg text-sm font-medium transition-all duration-200
                  ${!isAvailable 
                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                    : isSelected 
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                  }
                `}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}
      
      {/* Leyenda visual */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-gray-300 rounded"></div> Libre</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div> Seleccionado</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 rounded"></div> Ocupado</div>
      </div>
    </div>
  );
};

// --- Componente Principal ---
const ClientBooking: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [notes, setNotes] = useState('');
  
  // Data State
  const [clientMonth, setClientMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Cargar citas (Lógica Supabase)
  const fetchAppointments = async () => {
    setLoadingData(true);
    // Ajusta el SELECT según tus políticas RLS en Supabase
    const { data, error } = await supabase
      .from('appointments')
      .select('*'); 

    if (error) {
      console.error("Error fetching appointments:", error);
      setMessage({ type: 'error', text: 'Error cargando disponibilidad.' });
    } else if (data) {
      setAppointments(data as Appointment[]);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !time) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos obligatorios.' });
      return;
    }

    setLoading(true);
    
    const { error } = await supabase
      .from('appointments')
      .insert([{ 
        name, 
        date, 
        time, 
        type: selectedService.title, 
        status: 'Pendiente',
        notes: notes 
      }]);

    if (error) {
      console.error("Error booking:", error);
      setMessage({ type: 'error', text: 'Error al agendar. Intenta de nuevo.' });
    } else {
      setMessage({ type: 'success', text: '¡Cita agendada con éxito! Te esperamos.' });
      // Reset form
      setName(''); setDate(''); setTime(''); setNotes('');
      // Recargar para bloquear los slots ocupados
      fetchAppointments();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 pb-32 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Agenda tu Consulta Dental
          </h1>
          <p className="text-gray-500">Selecciona el servicio y encuentra el horario perfecto para ti.</p>
        </div>

        {/* Mensajes de estado */}
        {message && (
          <div className={`max-w-2xl mx-auto mb-6 p-4 rounded-lg flex items-center gap-3 shadow-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
            <p className="font-medium">{message.text}</p>
            <button onClick={() => setMessage(null)} className="ml-auto text-sm opacity-70 hover:opacity-100">X</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna Izquierda: Selección de Servicio y Datos */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Servicios */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="text-blue-500" size={20} />
                1. Selecciona el Servicio
              </h2>
              <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => { setSelectedService(service); setTime(''); }} // Reset time on service change
                    className={`flex items-center p-3 rounded-xl border transition-all duration-200 text-left group
                      ${selectedService.id === service.id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${selectedService.id === service.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white'}`}>
                      <service.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${selectedService.id === service.id ? 'text-blue-900' : 'text-gray-700'}`}>
                        {service.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        Duración aprox: {service.slots * 30} min
                      </p>
                    </div>
                    {selectedService.id === service.id && <CheckCircle2 size={18} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Datos del Paciente */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="text-blue-500" size={20} />
                3. Tus Datos
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                    ¿Algo que debamos saber? 
                    <span className="text-xs text-gray-400 font-normal">(Opcional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute top-3 left-3 text-gray-400" size={18} />
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej. Tengo sensibilidad dental, prefiero anestesia..."
                      rows={3}
                      className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          
          </div>

          {/* Columna Derecha: Calendario y Confirmación */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 2. Selección de Fecha y Hora */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CalendarIcon className="text-blue-500" size={20} />
                2. Fecha y Hora
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 flex-1">
                <Calendar
                  selectedDate={date}
                  onDateSelect={(d) => { setDate(d); setTime(''); }}
                  month={clientMonth}
                  onMonthChange={(val) => setClientMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + val, 1))}
                  appointments={appointments}
                  todayStr={todayStr}
                />
                
                <TimeSlots
                  selectedDate={date}
                  selectedTime={time}
                  selectedServiceSlots={selectedService.slots}
                  onTimeSelect={setTime}
                  appointments={appointments}
                  todayStr={todayStr}
                />
              </div>
            </div>

            {/* Botón de Acción */}
            <button
              onClick={handleSubmitBooking}
              disabled={loading || !date || !time || !name}
              className={`
                w-full py-4 px-6 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 flex items-center justify-center gap-2
                ${loading || !date || !time || !name
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200 hover:-translate-y-0.5'
                }
              `}
            >
              {loading ? (
                <span className="animate-pulse">Procesando...</span>
              ) : (
                <>
                  Confirmar Cita
                  {date && time && <span className="text-sm font-normal opacity-80 ml-1">({date} a las {time})</span>}
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientBooking;
