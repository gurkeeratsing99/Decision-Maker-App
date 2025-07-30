import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import supabase from './supabaseClient.js';


const app = express(); // ✅ app should be defined first

app.use(cors());
app.use(express.json()); // ✅ enable JSON parsing middleware

const YELP_API_KEY = process.env.YELP_API_KEY;
const YELP_URL = 'https://api.yelp.com/v3/businesses/search';

// ✅ Log Surprise History
app.post('/api/log-surprise', async (req, res) => {
  const { user_id, restaurant_name } = req.body;

  if (!restaurant_name) {
    return res.status(400).json({ error: 'Missing restaurant name' });
  }

  const { error } = await supabase
    .from('surprise_history')
    .insert([{
      user_id: user_id || 99999,
      restaurant_name,
      viewed_at: new Date()
    }]);

  if (error) {
    console.error('Supabase insert error (surprise):', error.message);
    return res.status(500).json({ error: 'Failed to log surprise history' });
  }

  res.json({ success: true });
});

// ✅ Log Search History
app.post('/api/log-search', async (req, res) => {
  const {
    user_id,
    query = '',
    location = '',
    price = '',
    radius = '',
    open_now = false,
  } = req.body;

  const { error } = await supabase
    .from('search_history')
    .insert([{
      user_id: user_id || 99999,
      query,
      location,
      price,
      radius,
      open_now,
      searched_at: new Date()
    }]);

  if (error) {
    console.error('Supabase insert error (search):', error.message);
    return res.status(500).json({ error: 'Failed to log search history' });
  }

  res.json({ success: true });
});

app.get("/api/history/search", async (req, res) => {
  const { user_id } = req.query;
  const { data, error } = await supabase
    .from("search_history")
    .select("*")
    .eq("user_id", user_id)
    .order("searched_at", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.get("/api/history/surprise", async (req, res) => {
  const { user_id } = req.query;
  const { data, error } = await supabase
    .from("surprise_history")
    .select("*")
    .eq("user_id", user_id)
    .order("viewed_at", { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});


// ✅ Yelp Search API
app.get('/api/search', async (req, res) => {
  const {
    query = '',
    location = '',
    price,
    radius,
    open_now
  } = req.query;

  console.log('Received search request with params:', {
    query,
    location,
    price,
    radius,
    open_now
  });

  try {
    const response = await axios.get(YELP_URL, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`
      },
      params: {
        term: query,
        location: location || 'Vancouver',
        price,
        radius,
        open_now
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Yelp API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Yelp data' });
  }
});

// ✅ Surprise Restaurant API
app.get('/api/surprise', async (req, res) => {
  const { lat, lng } = req.query;

  console.log('Received surprise request with params:', { lat, lng });

  const searchRadius = 40000;

  try {
    let params = { limit: 50 };

    if (lat && lng) {
      params.latitude = lat;
      params.longitude = lng;
      params.radius = searchRadius;
    } else {
      params.location = 'Vancouver';
    }

    const response = await axios.get(YELP_URL, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      },
      params,
    });

    const businesses = response.data.businesses || [];
    if (businesses.length === 0) {
      return res.status(404).json({ error: 'No restaurants found.' });
    }

    const randomRestaurant = businesses[Math.floor(Math.random() * businesses.length)];
    res.json(randomRestaurant);
  } catch (error) {
    console.error('Surprise API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch random restaurant' });
  }
});


// Route to add a restaurant to loves
app.post('/api/love', async (req, res) => {
  const {
    user_id,
    restaurant_id,
    restaurant_name,
    image_url,
    address,
    rating,
    price
  } = req.body;

  console.log("❤️ Received love:", req.body); // 🔍 add this

  const { error } = await supabase
    .from('loved_restaurants')
    .insert([{
      user_id,
      restaurant_id,
      restaurant_name,
      image_url,
      address,
      rating,
      price,
      loved_at: new Date()
    }]);

  if (error) {
    console.error("❌ Insert error:", error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
});

// Route to get all loves for a user
app.get('/api/loves', async (req, res) => {
  const { user_id } = req.query;

  const { data, error } = await supabase
    .from('loved_restaurants')
    .select('*')
    .eq('user_id', user_id)
    .order('loved_at', { ascending: false });

  if (error) return res.status(500).json({ error });
  res.json(data);
});



app.delete('/api/unlove', async (req, res) => {
  const { user_id, restaurant_id } = req.body;

  const { error } = await supabase
    .from('loved_restaurants')
    .delete()
    .eq('user_id', user_id)
    .eq('restaurant_id', restaurant_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

//update email
app.post('/api/admin/update-email', async (req, res) => {
  const { user_id, new_email } = req.body;
  console.log('➡️ Incoming request to update email:', { user_id, new_email });

  if (!user_id || !new_email) {
    return res.status(400).json({ error: 'Missing user_id or new_email' });
  }

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(user_id, {
      email: new_email
    });

    if (error) {
      console.error('Failed to update email:', error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log('Email updated:', data);
    res.json({ success: true, updated_user: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

