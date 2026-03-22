import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const location = useLocation();
  const navigate = useNavigate();
  const searchData = location.state?.searchData || {};

  // Base URL configuration - Change this for production
  const BASE_URL = 'https://the-journey-book-backend.onrender.com'; // PRODUCTION
  // const BASE_URL = 'http://localhost:8080'; // LOCAL DEVELOPMENT

  // Filter results based on category
  const filteredResults = activeFilter === 'all' 
    ? searchResults 
    : searchResults.filter(place => place.category === activeFilter);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // REAL API CALL to your Spring Boot backend
        const response = await fetch(`${BASE_URL}/api/search`, {
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
        // Enhanced mock data with categories
        const mockData = [
          { 
            placeId: '1', 
            name: 'Tokyo Skytree', 
            imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', 
            address: 'Tokyo, Japan', 
            rating: 4.7,
            category: 'tours',
            price: 25,
            duration: '2-3 hours'
          },
          { 
            placeId: '2', 
            name: 'Senso-ji Temple', 
            imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', 
            address: 'Tokyo, Japan', 
            rating: 4.8,
            category: 'museums',
            price: 15,
            duration: '1-2 hours'
          },
          { 
            placeId: '3', 
            name: 'Shibuya Crossing', 
            imageUrl: 'https://images.unsplash.com/photo-1583407723467-9b2d22504831?w=400', 
            address: 'Tokyo, Japan', 
            rating: 4.6,
            category: 'entertainment',
            price: 0,
            duration: '30 mins'
          },
          { 
            placeId: '4', 
            name: 'Meiji Shrine', 
            imageUrl: 'https://images.unsplash.com/photo-1571679940117-0a32b3a4c3a8?w=400', 
            address: 'Tokyo, Japan', 
            rating: 4.5,
            category: 'nature',
            price: 0,
            duration: '1-2 hours'
          },
          { 
            placeId: '5', 
            name: 'Tokyo National Museum', 
            imageUrl: 'https://images.unsplash.com/photo-1552466852-eb5759325cb0?w=400', 
            address: 'Tokyo, Japan', 
            rating: 4.4,
            category: 'museums',
            price: 12,
            duration: '2-3 hours'
          },
          { 
            placeId: '6', 
            name: 'Ueno Park', 
            imageUrl: 'https://images.unsplash.com/photo-1566416800996-ec16e3d683a0?w=400', 
            address: 'Tokyo, Japan', 
            rating: 4.3,
            category: 'nature',
            price: 0,
            duration: '2-3 hours'
          }
        ];
        setSearchResults(mockData);
        setIsLoading(false);
      }
    };

    if (searchData.destination) {
      fetchResults();
    } else {
      setIsLoading(false);
    }
  }, [searchData, BASE_URL]);

  const handleViewDetails = (place) => {
    navigate(`/experience/${place.placeId}`, { 
      state: { experience: place } 
    });
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'tours': return '🏛️';
      case 'museums': return '🖼️';
      case 'nature': return '🌳';
      case 'entertainment': return '🎭';
      default: return '📍';
    }
  };

  const getDefaultPrice = (category) => {
    const prices = {
      'tours': 0,
      'museums': 15,
      'nature': 0,
      'entertainment': 20
    };
    return prices[category] || 0;
  };

  if (isLoading) {
    return <div className="loading">Searching for amazing destinations...</div>;
  }

  return (
    <div className="search-results-container">
      <div className="results-header">
        <h1>Showing Results for "{searchData.destination || 'your destination'} Attractions "</h1>
        <p className="results-count">{filteredResults.length} experiences found</p>
      </div>

      {/* Category Filters */}
      <div className="filters-section">
        <h3>Filter by Category:</h3>
        <div className="filter-buttons">
          <button 
            className={activeFilter === 'all' ? 'active' : ''}
            onClick={() => setActiveFilter('all')}
          >
            All Experiences
          </button>
          <button 
            className={activeFilter === 'tours' ? 'active' : ''}
            onClick={() => setActiveFilter('tours')}
          >
            🏛️ Tours & Sightseeing
          </button>
          <button 
            className={activeFilter === 'museums' ? 'active' : ''}
            onClick={() => setActiveFilter('museums')}
          >
            🖼️ Museums & Culture
          </button>
          <button 
            className={activeFilter === 'nature' ? 'active' : ''}
            onClick={() => setActiveFilter('nature')}
          >
            🌳 Nature & Outdoor
          </button>
          <button 
            className={activeFilter === 'entertainment' ? 'active' : ''}
            onClick={() => setActiveFilter('entertainment')}
          >
            🎭 Entertainment
          </button>
        </div>
      </div>

      <div className="results-grid">
        {filteredResults.map(place => (
          <div key={place.placeId} className="place-card">
            <div className="place-image-container">
              <img src={place.imageUrl} alt={place.name} />
              <div className="category-badge">
                {getCategoryIcon(place.category)}
              </div>
              {place.price === 0 && (
                <div className="free-badge">Free</div>
              )}
            </div>
            <div className="place-info">
              <h3>{place.name}</h3>
              <p className="place-address">{place.address}</p>
              <div className="place-meta">
                <span className="rating">⭐ {place.rating}</span>
                <span className="duration">⏱️ {place.duration}</span>
              </div>
              <div className="place-price">
                {place.price === 0 ? (
                  <span className="free">Free Entry</span>
                ) : (
                    <span className="price">From &#8377;{place.price ?? getDefaultPrice(place.category)}</span>
                )}
              </div>
              <button 
                className="view-details-btn"
                onClick={() => handleViewDetails(place)}
              >
                View Details & Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && !isLoading && (
        <div className="no-results">
          <h3>No experiences found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;