// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rndynmztzeemdagndjgs.supabase.co";
const supabaseKey = process.env.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
