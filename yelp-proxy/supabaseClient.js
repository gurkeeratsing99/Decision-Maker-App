// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rndynmztzeemdagndjgs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZHlubXp0emVlbWRhZ25kamdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTY5MDQ5OCwiZXhwIjoyMDY1MjY2NDk4fQ.dI4RE4pRMkKE9Uw79Ck2jP1rHt6AZClAzEMUE1RzoVk";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
