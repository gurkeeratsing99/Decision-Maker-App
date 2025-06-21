import supabase from "../config/supabaseClient";

export async function signIn(email, password) {
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
       return { error: error.message };
    }

    const { user, session } = data;
    return { user, session };

}