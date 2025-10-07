import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopDestinations = () => {
  const navigate = useNavigate();
  
  const destinations = [
    { id: 1, name: 'Paris, France', image: 'paris.jpg' },
    { id: 2, name: 'Tokyo, Japan', image: 'tokyo.jpg' },
    { id: 3, name: 'New York, USA', image: 'newyork.jpg' },
    { id: 4, name: 'Rome, Italy', image: 'rome.jpg' },
    { id: 5, name: 'Dubai, UAE', image: 'dubai.jpg' },
    { id: 6, name: 'Santorini, Greece', image: 'santorini.jpg' },
  ];

  const handleExplore = (destinationName) => {
    // Use the exact same structure as Home.jsx search
    const searchData = {
      destination: destinationName,
      date: '',
      travelers: ''
    };
    
    // Navigate exactly like Home.jsx does
    navigate('/search-results', { state: { searchData } });
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Top Destinations</h1>
          <div className="row">
            {destinations.map(destination => (
              <div key={destination.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img 
                    src={`/images/${destination.image}`} 
                    className="card-img-top destination-image" 
                    alt={destination.name} 
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{destination.name}</h5>
                    <p className="card-text flex-grow-1">Experience the beauty and culture of {destination.name.split(',')[0]} with our exclusive tours.</p>
                    <button 
                      className="btn btn-primary mt-auto"
                      onClick={() => handleExplore(destination.name)}
                    >
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .destination-image {
          height: 200px;
          object-fit: cover;
        }
        .card {
          transition: transform 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </div>
  );
};

export default TopDestinations;