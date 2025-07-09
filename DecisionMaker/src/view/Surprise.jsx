import { useEffect, useState } from 'react';
import NavBar from '../view/NavBar';
import { useAuth } from '../auth/AuthContext';

export default function Surprise() {
  const [restaurant, setRestaurant] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // ✅ get logged-in user or null

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => fetchRandomRestaurant()
      );
    } else {
      fetchRandomRestaurant();
    }
  }, []);

  useEffect(() => {
    if (userCoords) {
      fetchRandomRestaurant(userCoords);
    } else {
      const fallbackTimer = setTimeout(() => {
        if (!userCoords) fetchRandomRestaurant();
      }, 3000);
      return () => clearTimeout(fallbackTimer);
    }
  }, [userCoords]);

  const fetchRandomRestaurant = async (coords) => {
    setLoading(true);
    try {
      let url = 'http://localhost:4000/api/surprise';
      if (coords) url += `?lat=${coords.lat}&lng=${coords.lng}`;

      const res = await fetch(url);
      const data = await res.json();
      setRestaurant(data);

      if (data?.name) {
        // ✅ Log restaurant name to backend server
        await fetch('http://localhost:4000/api/log-surprise', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user?.id || 99999,
            restaurant_name: data.name,
          }),
        });
      }
    } catch (err) {
      console.error('Failed to fetch surprise restaurant', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => deg * (Math.PI / 180);
    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distanceText = () => {
    if (!userCoords || !restaurant?.coordinates) return '';
    const dist = calculateDistance(
      userCoords.lat,
      userCoords.lng,
      restaurant.coordinates.latitude,
      restaurant.coordinates.longitude
    );
    return `${(dist / 1000).toFixed(1)} km`;
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <h2 className="text-2xl font-bold text-center text-black mb-2">
            🎉 Your Surprise Pick
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Here's a randomly chosen restaurant just for you!
          </p>

          {loading && (
            <div className="text-center text-orange-600 font-medium">
              Loading surprise restaurant...
            </div>
          )}

          {restaurant && !loading && (
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
              {restaurant.image_url && (
                <div className="h-48 w-full">
                  <img
                    src={restaurant.image_url}
                    alt={restaurant.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-black">{restaurant.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  📍 {restaurant.location?.address1}, {restaurant.location?.city}
                </p>

                <div className="flex justify-around mt-6 text-sm text-black p-3">
                  <div>
                    <p className="font-semibold text-orange-600">{restaurant.review_count}</p>
                    <p className="text-gray-500">Reviews</p>
                  </div>
                  <div>
                    <p className="font-semibold text-orange-600">{restaurant.rating}</p>
                    <p className="text-gray-500">Rating</p>
                  </div>
                  {distanceText() && (
                    <div>
                      <p className="font-semibold text-orange-600">{distanceText()}</p>
                      <p className="text-gray-500">Away</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 mt-2 pt-4 text-center px-3">
                  <p className="text-sm text-gray-600 mb-3">
                    {restaurant.categories.map((c) => c.title).join(', ')}
                  </p>
                </div>

                <div className="flex border-t border-gray-200">
                  <a
                    href={`https://www.google.com/maps?q=${restaurant.coordinates.latitude},${restaurant.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 py-4 text-center text-sm text-orange-600 font-medium hover:bg-orange-50 border-r border-gray-200"
                  >
                    🗺️ View on Map
                  </a>
                  <a
                    href={restaurant.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-1/2 py-4 text-center text-sm text-orange-600 font-medium hover:bg-orange-50"
                  >
                    🔗 View on Yelp
                  </a>
                </div>
              </div>

              <button
                onClick={() => fetchRandomRestaurant(userCoords)}
                className="w-full py-3 text-center text-sm font-semibold text-orange-600 border-t hover:bg-orange-50"
              >
                🔄 Show Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
