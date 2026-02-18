
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://paecqvqxlgdniaeztcof.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZWNxdnF4bGdkbmlhZXp0Y29mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MzI4MjAsImV4cCI6MjA4NjUwODgyMH0.EdhHg34dXNhZsQZ1N_Mb5FXPwBbGOds5ONW6e0dvSRg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkHospitals() {
    console.log('Checking hospitals table...');
    const { data, error } = await supabase
        .from('hospitals')
        .select('*');

    if (error) {
        console.error('Error fetching hospitals:', error);
    } else {
        console.log(`Found ${data?.length} hospitals.`);
        console.log(JSON.stringify(data, null, 2));
    }
}

checkHospitals();
