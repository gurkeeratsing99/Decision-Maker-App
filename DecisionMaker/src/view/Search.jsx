import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NavBar from '../view/NavBar';
import '../css/Search.css';
import { useAuth } from '../auth/AuthContext';

export default function Search() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const initialQuery = params.get('query') || '';
  const initialLocation = params.get('location') || '';

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [locationInput, setLocationInput] = useState(initialLocation);

  const [query, setQuery] = useState(initialQuery);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [results, setResults] = useState([]);
  const [userCoords, setUserCoords] = useState(null);

  const [cuisine, setCuisine] = useState('');
  const [price, setPrice] = useState('');
  const [radius, setRadius] = useState('');
  const [openNow, setOpenNow] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const payload = {
        user_id: user?.id || 99999,
        query: query || cuisine,
        location: selectedLocation || 'Vancouver',
        cuisine,
        price,
        radius,
        open_now: openNow,
      };

      // ✅ Log search to backend
      try {
        await fetch('http://localhost:4000/api/log-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (logErr) {
        console.warn('Failed to log search history', logErr);
      }

      const searchParams = new URLSearchParams();
      searchParams.append('query', query || cuisine);
      searchParams.append('location', selectedLocation || 'Vancouver');
      if (price) searchParams.append('price', price);
      if (radius) searchParams.append('radius', radius);
      if (openNow) searchParams.append('open_now', 'true');

      try {
        const res = await fetch(`http://localhost:4000/api/search?${searchParams.toString()}`);
        const data = await res.json();
        setResults(data.businesses || []);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
      }
    };

    if (query || selectedLocation || cuisine) {
      fetchRestaurants();
    }
  }, [query, selectedLocation, cuisine, price, radius, openNow]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(queryInput);
    setSelectedLocation(locationInput);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = deg => deg * (Math.PI / 180);
    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) ** 2 +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="search-page">
      <NavBar />
      <div className="search-wrapper">
        <form
          onSubmit={handleSearch}
          className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md space-y-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 text-center">🔍 Find Your Next Meal</h2>

          {/* Search by Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Restaurant Name</label>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="e.g. Sushi Garden"
              className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Search by Location */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="e.g. Vancouver"
              className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center items-end gap-3.5">
            {/* Price Filter */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">💲 Price</label>
              <select
                onChange={(e) => setPrice(e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">Select Price</option>
                <option value="1">$</option>
                <option value="2">$$</option>
                <option value="3">$$$</option>
                <option value="4">$$$$</option>
              </select>
            </div>

            {/* Distance Filter */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">🚶 Distance</label>
              <select
                onChange={(e) => setRadius(e.target.value)}
                className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">Select Radius</option>
                <option value="1000">Within 1 km</option>
                <option value="5000">Within 5 km</option>
                <option value="10000">Within 10 km</option>
              </select>
            </div>

            {/* Open Now Checkbox */}
            <div className="flex items-center pt-5">
              <label htmlFor="openNow" className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input
                  id="openNow"
                  type="checkbox"
                  checked={openNow}
                  onChange={() => setOpenNow(!openNow)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="ml-2">🕒 Open Now</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-white hover:btn2 hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-50 mt-5"
          >
            🔍 Search
          </button>
        </form>
      </div>

      <div className="px-6">
        <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4 px-4">
          {results.map((res) => {
            const distance = userCoords && res.coordinates
              ? calculateDistance(
                  userCoords.lat,
                  userCoords.lng,
                  res.coordinates.latitude,
                  res.coordinates.longitude
                )
              : null;

            const mapsUrl = `https://www.google.com/maps?q=${res.coordinates.latitude},${res.coordinates.longitude}`;

            return (
              <div
                key={res.id}
                className="relative bg-white shadow-xl rounded-xl overflow-hidden"
              >
                <div className="h-auto">
                  <div className="flex justify-center mt">
                    <img
                      src={res.image_url}
                      alt={res.name}
                      className="h-40 w-full object-cover"
                    />
                  </div>

                  <div className="text-center mt-6">
                    <h3 className="text-xl font-bold text-black">{res.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {res.location?.address1}, {res.location?.city}
                    </p>
                  </div>

                  <div className="flex justify-around mt-6 text-center text-sm text-black p-3">
                    <div>
                      <p className="font-semibold text-orange-600">{res.review_count}</p>
                      <p className="text-gray-500">Reviews</p>
                    </div>
                    <div>
                      <p className="font-semibold text-orange-600">{res.rating}</p>
                      <p className="text-gray-500">Rating</p>
                    </div>
                    {distance && (
                      <div>
                        <p className="font-semibold text-orange-600">{(distance / 1000).toFixed(1)} km</p>
                        <p className="text-gray-500">Away</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between h-full">
                    <div className="border-t border-gray-200 mt-2 pt-4 text-center px-3">
                      <p className="text-sm text-gray-600 mb-3">
                        {res.categories.map((c) => c.title).join(', ')}
                      </p>
                    </div>

                    <div className="flex justify-center items-end">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-1/2 py-4 text-center text-sm text-orange-600 font-medium hover:bg-orange-50 border-r border-gray-200"
                      >
                        🗺️ View on Map
                      </a>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-1/2 py-4 text-center text-sm text-orange-600 font-medium hover:bg-orange-50"
                      >
                        🔗 View Website
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
