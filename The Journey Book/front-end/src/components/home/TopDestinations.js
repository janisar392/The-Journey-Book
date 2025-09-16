import React from 'react';

const TopDestinations = () => {
  const destinations = [
    { id: 1, name: 'Paris, France', image: 'https://via.placeholder.com/300x200?text=Paris' },
    { id: 2, name: 'Tokyo, Japan', image: 'https://via.placeholder.com/300x200?text=Tokyo' },
    { id: 3, name: 'New York, USA', image: 'https://via.placeholder.com/300x200?text=New+York' },
    { id: 4, name: 'Rome, Italy', image: 'https://via.placeholder.com/300x200?text=Rome' },
    { id: 5, name: 'Sydney, Australia', image: 'https://via.placeholder.com/300x200?text=Sydney' },
    { id: 6, name: 'Bali, Indonesia', image: 'https://via.placeholder.com/300x200?text=Bali' },
  ];

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4">Top Destinations</h1>
          <div className="row">
            {destinations.map(destination => (
              <div key={destination.id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img src={destination.image} className="card-img-top" alt={destination.name} />
                  <div className="card-body">
                    <h5 className="card-title">{destination.name}</h5>
                    <p className="card-text">Experience the beauty and culture of {destination.name} with our exclusive tours.</p>
                    <button className="btn btn-primary">Explore</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDestinations;