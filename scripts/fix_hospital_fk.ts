
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://paecqvqxlgdniaeztcof.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZWNxdnF4bGdkbmlhZXp0Y29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzI4MjAsImV4cCI6MjA4NjUwODgyMH0.EdhHg34dXNhZsQZ1N_Mb5FXPwBbGOds5ONW6e0dvSRg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixHospital() {
    console.log('Inserting "consultorio-paris-rizo" into hospitals table...');

    const { data, error } = await supabase
        .from('hospitals')
        .insert([
            {
                id: 'consultorio-paris-rizo',
                name: 'Consultorio Paris Rizo',
                address: 'Dirección del Consultorio', // User can update this later
                image: 'https://placehold.co/600x400',
                allowed_days: ["1", "2", "3", "4", "5", "6"] // Mon-Sat
            }
        ])
        .select();

    if (error) {
        if (error.code === '23505') {
            console.log('Hospital already exists (Duplicate Key). This is good!');
        } else {
            console.error('Error inserting hospital:', error);
        }
    } else {
        console.log('Success! Hospital inserted:', data);
    }
}

fixHospital();
