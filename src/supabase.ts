import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

let supabaseKey = supabaseServiceKey || supabasePublishableKey || "";

if (!supabaseUrl || !supabaseKey) {
    console.warn("FALTAN CREDENCIALES DE SUPABASE: revisa SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY o SUPABASE_PUBLISHABLE_KEY en tu .env");
} else if (!supabaseServiceKey && supabasePublishableKey) {
    console.warn("ADVERTENCIA: estás usando la clave publicable (anon/public). En backend es recomendable usar SUPABASE_SERVICE_ROLE_KEY para operaciones seguras.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);