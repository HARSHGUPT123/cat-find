import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const API_KEY = "live_WjfrfYo3XHuG2sQp3KQc3dB8RRvIQ5ru1ZfvJptoVn8FdwIbTOcOBCXv8NACSTFD"; // Replace with your actual API key
const BASE_URL = "https://api.thecatapi.com/v1";

const App = () => {
  const [images, setImages] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchImages = async (breed = "", limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/images/search`, {
        headers: { "x-api-key": API_KEY },
        params: {
          breed_ids: breed,
          limit: limit,
        },
      });
      setImages((prev) => [...prev, ...response.data]);
    } catch (error) {
      console.error("Error fetching cat images:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBreeds = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/breeds`, {
        headers: { "x-api-key": API_KEY },
      });
      setBreeds(response.data);
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  useEffect(() => {
    fetchBreeds();
    fetchImages();
  }, []);

  const handleBreedChange = (e) => {
    setSelectedBreed(e.target.value);
    setImages([]); // Clear previous images
    fetchImages(e.target.value);
  };

  return (
    <div className="p-4 main-page">
      <h1 className="text-2xl font-bold mb-4">Random Cat Images Gallery</h1>
      <div className="mb-4 flex items-center">
        <select
          className="border p-2 mr-4"
          value={selectedBreed}
          onChange={handleBreedChange}
        >
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => fetchImages(selectedBreed)}
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cat-grid-layout">
        {images.map((image) => (
          <div key={image.id} className="rounded overflow-hidden shadow">
            <img
              src={image.url}
              alt="Cat"
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      <div className="mt-4 text-center">
        <button
          className="bg-green-500 text-white p-2 rounded"
          onClick={() => fetchImages(selectedBreed)}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default App;
