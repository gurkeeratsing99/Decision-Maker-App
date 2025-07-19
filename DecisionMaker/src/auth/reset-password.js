import supabase from '../../../yelp-proxy/supabaseClient';

export default async function(newPassword) {
    try {
        let { data, error } = await supabase.auth.updateUser({password: newPassword});

        if (error) {
            console.error("Failed to change password: ", error);
            return { success: false, error: error.message};
        }

        console.log("Password has been successfully changed: ", data);
        return { sucess: true, data};
    
    } catch (err) {
        console.error("Unexpected error: ", err);
        return { sucess: false, error: err};
    }
    
}