import supabase from '../../../yelp-proxy/supabaseClient';


export default async function getUserData() {
    
    const { data: { user }, userError } = await supabase.auth.getUser();

    if (userError) {
        console.error('Error fetching user:', error);
        return null;
    }

    const { data: users, error } = await supabase
    .from('users')
    .select('first_name, last_name, email ')
    .eq('id', user.id)
    .single();

    if (error) {
        console.error("Error in fetching user data: ", error);
        return null;
    }

    return users;
}

export async function updateUserData(updatedInfo) {
    const { first_name, last_name, email } = updatedInfo;

    const { data: { user }, userError } = await supabase.auth.getUser();

    if (userError) {
        console.error('Error fetching user:', error);
        return null;
    }

    const { data, error } = await supabase 
        .from('users')
        .update({ first_name, last_name, email })
        .eq('id', user.id);

        if (error) {
            console.error("Error in updating user data: ", error);
            return false;
        }

        return true;

}