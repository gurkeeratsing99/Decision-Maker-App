// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rndynmztzeemdagndjgs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZHlubXp0emVlbWRhZ25kamdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2OTA0OTgsImV4cCI6MjA2NTI2NjQ5OH0.B3ain-4Aj66blyWyvuURAXB7pno1NBuja17nsVt-LEA";
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
