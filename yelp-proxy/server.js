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

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
