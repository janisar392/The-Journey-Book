import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const searchData = location.state?.searchData || {};

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // REAL API CALL to your Spring Boot backend
        const response = await fetch('http://localhost:8080/api/search', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: searchData.destination,
            startDate: searchData.date,
            travelers: searchData.travelers
          })
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setSearchResults(data);
        setIsLoading(false);
        
      } catch (error) {
        console.error("Error fetching search results:", error);
        // Fallback to mock data if API call fails
        setSearchResults([
          { 
            placeId: '1', 
            name: 'Eiffel Tower', 
            imageUrl: 'https://cdn.pixabay.com/photo/2018/04/25/09/26/eiffel-tower-3349075_1280.jpg', 
            address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris, France', 
            rating: 4.7 
          },
          { 
            placeId: '2', 
            name: 'Louvre Museum', 
            imageUrl: 'https://cdn.pixabay.com/photo/2016/11/18/19/01/louvre-1836415_1280.jpg', 
            address: 'Rue de Rivoli, 75001 Paris, France', 
            rating: 4.8 
          },
          { 
            placeId: '3', 
            name: 'Notre-Dame Cathedral', 
            imageUrl: 'https://cdn.pixabay.com/photo/2017/04/18/14/53/notre-dame-2239909_1280.jpg', 
            address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France', 
            rating: 4.6 
          }
        ]);
        setIsLoading(false);
      }
    };

    if (searchData.destination) {
      fetchResults();
    } else {
      setIsLoading(false);
    }
  }, [searchData]);

  if (isLoading) {
    return <div className="loading">Searching for amazing destinations...</div>;
  }

  return (
    <div className="search-results-container">
      <h1>Search Results for "{searchData.destination || 'your destination'}"</h1>
      <div className="results-grid">
        {searchResults.map(place => (
          <div key={place.placeId} className="place-card">
            <img src={place.imageUrl} alt={place.name} />
            <div className="place-info">
              <h3>{place.name}</h3>
              <p>{place.address}</p>
              <p>⭐ {place.rating}</p>
              <button className="view-details-btn">View Details & Book</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;