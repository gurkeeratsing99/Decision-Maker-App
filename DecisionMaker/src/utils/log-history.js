import supabase from "../config/supabaseClient";


export async function logSearchHistory(userId, searchParams) {
  const fallbackUserId = userId || 99999;

  const { data, error } = await supabase.from("search_history").insert([
    {
      user_id: fallbackUserId,
      query: searchParams.query || '',
      location: searchParams.location || '',
      price: searchParams.price || '',
      radius: searchParams.radius || '',
      open_now: searchParams.openNow || false,
      searched_at: new Date().toISOString(),
    },
  ]);

  if (error) console.error("❌ Error logging search:", error.message);
  else console.log("✅ Search logged:", data);
}

// Log a surprise result
export async function logSurpriseHistory(userId, restaurantName) {
  const fallbackUserId = userId || 99999;

  const { data, error } = await supabase.from("surprise_history").insert([
    {
      user_id: fallbackUserId,
      restaurant_name: restaurantName,
      viewed_at: new Date().toISOString(),
    },
  ]);

  if (error) console.error("❌ Error logging surprise:", error.message);
  else console.log("✅ Surprise logged:", data);
}
