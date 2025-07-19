import supabase from '../../../yelp-proxy/supabaseClient';

export default async function getFirstName(userId) {
    const { data: users, error } = await supabase
        .from('users')
        .select('first_name')
        .eq('id', userId)
        .single(); // Fetch only one user record (this is a better approach if only one user is logged in)

    if (error) {
        console.error('Error with fetching first name', error);
        return null;
    }

    return users.first_name;  // Return the updated name
}
