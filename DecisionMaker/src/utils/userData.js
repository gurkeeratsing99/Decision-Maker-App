import supabase from '../../../yelp-proxy/supabaseClient';


export default async function getUserData() {
    
    const { data: { user }, userError } = await supabase.auth.getUser();

    if (userError) {
        console.error('Error fetching user:', userError);
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

export async function updateEmail(userId, newEmail) {
    try {
      const response = await fetch('http://localhost:4000/api/admin/update-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          new_email: newEmail,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update email');
      }
  
      return { success: true, data: result.updated_user };
    } catch (err) {
      console.error('Email update error:', err.message);
      return { success: false, error: err.message };
    }
  }