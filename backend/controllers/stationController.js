const axios = require('axios');
const asyncHandler = require('express-async-handler');

// @desc    Get nearby police stations
// @route   POST /api/stations/nearby
// @access  Public
const getNearbyStations = asyncHandler(async (req, res) => {
  const { lat, lon } = req.body;

  if (!lat || !lon) {
    res.status(400);
    throw new Error('Latitude and Longitude are required');
  }

  // Use Overpass API to find police stations within user defined radius or default 15km (15000m)
  const radius = req.body.radius || 15000;
  
  // Updated query to include nodes, ways (buildings), and relations
  // 'out center;' ensures ways/relations are returned with centroid coordinates
  const query = `
    [out:json];
    (
      node["amenity"="police"](around:${radius}, ${lat}, ${lon});
      way["amenity"="police"](around:${radius}, ${lat}, ${lon});
      relation["amenity"="police"](around:${radius}, ${lat}, ${lon});
    );
    out center;
  `;

  try {
    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } } // Overpass expects raw query body
    );

    // Normalize data: ensure all elements have direct lat/lon properties
    const elements = response.data.elements.map(el => {
      if (el.type === 'node') {
        return el;
      } else if (el.center) {
        // For ways and relations, 'out center' puts coords in a 'center' object
        return {
          ...el,
          lat: el.center.lat,
          lon: el.center.lon
        };
      }
      return el;
    }).filter(el => el.lat && el.lon); // Filter out any anomalies

    res.json(elements);
  } catch (error) {
    console.error('Overpass API Error:', error.message);
    res.status(502);
    throw new Error('Failed to fetch data from Overpass API');
  }
});

module.exports = {
  getNearbyStations
};
