import supabase from "../config/supabaseClient";

export async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        console.error("Error during sign-up: ", error.message);
        return { error };
    }
    return {data};
}

export async function createAcc(userID, email, firstName, lastName) {
    const { data, error} = await supabase
    .from('users')
    .insert([{ 
        id: userID,
        email: email,
        first_name: firstName,
        last_name: lastName
    }]);

    if (error) {
        console.error("Error creating user record: ", error.message);
        return { error };
    }
    return { data };
}
