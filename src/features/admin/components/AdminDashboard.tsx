import { useState } from 'react'; // Re-saving to clear IDE error cache
import { AdminOverview } from './AdminOverview';
import { AdminCalendar } from './AdminCalendar';
import { PatientDirectory } from './PatientDirectory';
import { AddPatientDialog } from './AddPatientDialog';
import { AdminAppointmentDialog } from './AppointmentDialog';
import { BookingSelectionDialog } from './BookingSelectionDialog';
import { GlobalSearch } from './GlobalSearch';
import { useAppointments } from '../../appointments/hooks/useAppointments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Menu, LogOut, LayoutDashboard, Calendar as CalendarIcon, Users, UserPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const AdminDashboard = () => {
    const { hospitals, saveAppointment, addPatient } = useAppointments();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Dialog States
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
    const [isBookingTypeOpen, setIsBookingTypeOpen] = useState(false);

    // Selection States for Flows

    const [selectedPatientForBooking, setSelectedPatientForBooking] = useState<any>(null); // Use a proper type if possible, or any for flexibility

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            window.location.href = '/';
        }
    };

    const handleNewAppointmentClick = () => {
        setSelectedPatientForBooking(null); // Reset
        setIsBookingTypeOpen(true);
    };



    const startBookingForPatient = (patientData: any) => {
        setSelectedPatientForBooking(patientData);
        setIsBookingTypeOpen(false);
        setIsBookingOpen(true);
    };

    return (
        <div className="space-y-8 bg-gray-50/30 min-h-screen pb-20">
            {/* Header with Mobile Menu Toggle and Global Search */}
            <div className="bg-[#1c334a] text-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                                    <Menu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="bg-[#1c334a] text-white border-r-gray-700 w-[240px] p-0">
                                <div className="flex flex-col h-full py-6">
                                    <div className="px-6 mb-8">
                                        <h2 className="text-xl font-bold">Menú Admin</h2>
                                    </div>
                                    <nav className="flex-1 px-4 space-y-2">
                                        <Button variant="ghost" className="w-full justify-start hover:bg-white/10 text-white" onClick={() => setIsMobileMenuOpen(false)}>
                                            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start hover:bg-white/10 text-white" onClick={() => setIsMobileMenuOpen(false)}>
                                            <CalendarIcon className="mr-2 h-4 w-4" /> Calendario
                                        </Button>
                                        <Button variant="ghost" className="w-full justify-start hover:bg-white/10 text-white" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Users className="mr-2 h-4 w-4" /> Pacientes
                                        </Button>
                                    </nav>
                                    <div className="p-4 border-t border-gray-700">
                                        <Button variant="ghost" className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-900/20" onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <h1 className="text-xl font-bold hidden md:block">Panel Administrativo</h1>
                        <span className="md:hidden font-bold">Admin</span>
                    </div>

                    {/* Global Search Bar */}
                    <div className="flex-1 max-w-md mx-4 hidden md:block">
                        <GlobalSearch
                            className="w-full"
                            onSelectPatient={(patient) => {
                                // When selecting from global search, maybe open their record or book?
                                // For now, let's open booking for them
                                startBookingForPatient({
                                    id: patient.id,
                                    name: patient.name,
                                    email: patient.email,
                                    phone: patient.phone
                                });
                            }}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => setIsAddPatientOpen(true)}
                            className="bg-[#1c334a] hover:bg-[#2a4560] text-white shadow-md border border-white/10 transition-all hover:scale-105 active:scale-95 hidden md:flex"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Nuevo Paciente
                        </Button>
                        <Button
                            onClick={handleNewAppointmentClick}
                            className="bg-[#1c334a] hover:bg-[#2a4560] text-white shadow-md border border-white/10 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus className="w-4 h-4 md:mr-2" />
                            <span className="hidden md:inline">Nueva Cita</span>
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                            className="hidden md:flex bg-slate-700 hover:bg-slate-600 text-white border-slate-600 shadow-sm"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content with Tabs */}
            <div className="container mx-auto px-4">
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white p-1 rounded-lg border shadow-sm w-full md:w-auto overflow-x-auto flex justify-start md:justify-center">
                        <TabsTrigger value="overview" className="flex-1 md:flex-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Tablero
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="flex-1 md:flex-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Calendario
                        </TabsTrigger>
                        <TabsTrigger value="patients" className="flex-1 md:flex-none data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            <Users className="w-4 h-4 mr-2" />
                            Pacientes
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="focus-visible:outline-none">
                        <AdminOverview />
                    </TabsContent>

                    <TabsContent value="calendar" className="focus-visible:outline-none">
                        <AdminCalendar />
                    </TabsContent>

                    <TabsContent value="patients" className="focus-visible:outline-none">
                        <PatientDirectory
                            onBookAppointment={(patientData) => startBookingForPatient(patientData)}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialogs */}

            {/* 1. Booking Type Selection (New or Existing) */}
            <BookingSelectionDialog
                open={isBookingTypeOpen}
                onOpenChange={setIsBookingTypeOpen}
                onNewPatient={() => {
                    setIsBookingTypeOpen(false);
                    setIsAddPatientOpen(true);
                }}
                onExistingPatient={(patientData) => {
                    startBookingForPatient(patientData);
                }}
            />

            {/* 2. Add Patient Dialog */}
            <AddPatientDialog
                open={isAddPatientOpen}
                onOpenChange={setIsAddPatientOpen}
                onSave={addPatient}
                onBookAppointment={(newPatientData) => {
                    // After adding, go straight to booking
                    startBookingForPatient(newPatientData);
                }}
            />

            {/* 3. Book Appointment Dialog */}
            <AdminAppointmentDialog
                open={isBookingOpen}
                onOpenChange={setIsBookingOpen}
                hospitals={hospitals}
                initialPatientData={selectedPatientForBooking} // Pass selected patient
                onSave={async (appointmentData, patientData) => {
                    try {
                        await saveAppointment(appointmentData, patientData);
                        toast.success("Cita agendada correctamente");
                        setIsBookingOpen(false);
                    } catch (error) {
                        console.error(error);
                        toast.error("Error al guardar la cita");
                    }
                }}
            />

        </div>
    );
};
