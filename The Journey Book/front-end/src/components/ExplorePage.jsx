import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExplorePage.css';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [animatedText, setAnimatedText] = useState(0);
  const [searchData, setSearchData] = useState({
    destination: '',
    date: '',
    travelers: ''
  });
  
  const textOptions = ["Beaches", "Mountains", "Cities", "Safaris"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedText((prev) => (prev + 1) % textOptions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search data:', searchData);
    // Navigate to search results with the search data
    navigate('/search-results', { state: { searchData } });
  };

  // Featured destinations data
  const destinations = [
    { id: 1, name: "Bali, Indonesia", category: "beaches", image: "/images/bali2.jpg", description: "Tropical paradise with beaches, culture & adventure." },
    { id: 2, name: "Paris, France", category: "cities", image: "/images/paris.jpg", description: "The city of lights, art, and romance." },
    { id: 3, name: "Dubai, UAE", category: "desert", image: "/images/dubai.jpg", description: "Ultra-modern architecture and luxury shopping." },
    { id: 4, name: "Maldives", category: "beaches", image: "/images/maldives.jpg", description: "Crystal clear waters and overwater bungalows." },
    { id: 5, name: "New York, USA", category: "cities", image: "/images/newyork.jpg", description: "The concrete jungle where dreams are made." },
    { id: 6, name: "Swiss Alps", category: "mountains", image: "/images/alps.jpg", description: "Breathtaking mountain views and skiing." },
    { id: 7, name: "Santorini, Greece", category: "beaches", image: "/images/santorini.jpg", description: "White buildings with blue domes and stunning sunsets." },
    { id: 8, name: "Tokyo, Japan", category: "cities", image: "/images/tokyo.jpg", description: "A blend of traditional culture and technological innovation." }
  ];
  
  // Experiences data
  const experiences = [
    { id: 1, name: "Sunset Cruise in Maldives", image: "/images/sunset-cruise.jpg", price: "$129", description: "Enjoy a romantic sunset cruise with dinner." },
    { id: 2, name: "Eiffel Tower Night Tour", image: "/images/eiffel-tower.jpg", price: "$89", description: "See Paris illuminated at night from the iconic tower." },
    { id: 3, name: "Camel Safari in Dubai", image: "/images/camel-safari.jpg", price: "$75", description: "Experience traditional desert transportation and culture." },
    { id: 4, name: "Jazz Night in New Orleans", image: "/images/jazz-night.jpg", price: "$45", description: "Immerse yourself in the birthplace of jazz music." }
  ];
  
  // Travel stories data
  const stories = [
    { id: 1, title: "10 Hidden Beaches in Asia", image: "/images/beaches-asia.jpg", excerpt: "Discover secluded paradise beaches away from the crowds." },
    { id: 2, title: "Best Food Markets Around the World", image: "/images/food-markets.jpg", excerpt: "A culinary journey through the world's most vibrant markets." },
    { id: 3, title: "Top Winter Wonderland Destinations", image: "/images/winter-destinations.jpg", excerpt: "Experience the magic of winter in these stunning locations." }
  ];
  
  // Filter destinations by category
  const filteredDestinations = activeCategory === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.category === activeCategory);

  return (
    <div className="explore-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="video-background">
          <video autoPlay loop muted playsInline className="background-video">
            <source src="/videos/background1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">Explore the World Your Way</h1>
          <p className="hero-subtitle">
            Discover Hidden Gems, Iconic Landmarks, and Unforgettable Journeys
          </p>
          
          <div className="animated-text-container">
            <span className="animated-text-prefix">Discover </span>
            <span className="animated-text">{textOptions[animatedText]}</span>
          </div>
          
          <form className="search-container" onSubmit={handleSearchSubmit}>
            <div className="search-input-group">
              <i className="fas fa-map-marker-alt"></i>
              <input 
                type="text" 
                name="destination"
                placeholder="Where to?" 
                value={searchData.destination}
                onChange={handleSearchChange}
                required
              />
            </div>
            <div className="search-input-group">
              <i className="fas fa-calendar"></i>
              <input 
                type="date" 
                name="date"
                value={searchData.date}
                onChange={handleSearchChange}
                required
              />
            </div>
            <div className="search-input-group">
              <i className="fas fa-users"></i>
              <select 
                name="travelers"
                value={searchData.travelers}
                onChange={handleSearchChange}
                required
              >
                <option value="">Travelers</option>
                <option value="1">1 Traveler</option>
                <option value="2">2 Travelers</option>
                <option value="3">3 Travelers</option>
                <option value="4">4+ Travelers</option>
              </select>
            </div>
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i> Search
            </button>
          </form>
        </div>
      </section>
      
      {/* Featured Destinations */}
      <section className="section destinations-section">
        <div className="container">
          <h2 className="section-title">Featured Destinations</h2>
          <p className="section-subtitle">Explore our most popular travel destinations around the world</p>
          
          <div className="destinations-grid">
            {filteredDestinations.map(destination => (
              <div key={destination.id} className="destination-card">
                <div 
                  className="destination-image" 
                  style={{ backgroundImage: `url(${destination.image})` }}
                >
                  <div className="destination-overlay">
                    <h3 className="destination-name">{destination.name}</h3>
                    <p className="destination-description">{destination.description}</p>
                    <button className="explore-button">Explore Destination</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Choose Your Style of Travel</h2>
          <p className="section-subtitle">Find the perfect experience that matches your travel preferences</p>
          
          <div className="categories-grid">
            <div className="category-card" onClick={() => setActiveCategory('beaches')}>
              <div className="category-icon">🏖️</div>
              <h3>Beaches</h3>
            </div>
            <div className="category-card" onClick={() => setActiveCategory('mountains')}>
              <div className="category-icon">🏔️</div>
              <h3>Adventure</h3>
            </div>
            <div className="category-card" onClick={() => setActiveCategory('cities')}>
              <div className="category-icon">🏙️</div>
              <h3>City Life</h3>
            </div>
            <div className="category-card" onClick={() => setActiveCategory('desert')}>
              <div className="category-icon">🏜️</div>
              <h3>Desert Safaris</h3>
            </div>
            <div className="category-card" onClick={() => setActiveCategory('nature')}>
              <div className="category-icon">🌲</div>
              <h3>Nature Retreats</h3>
            </div>
            <div className="category-card" onClick={() => setActiveCategory('cultural')}>
              <div className="category-icon">🏛️</div>
              <h3>Historical & Cultural</h3>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Experiences */}
      <section className="section experiences-section">
        <div className="container">
          <h2 className="section-title">Popular Experiences</h2>
          <p className="section-subtitle">Unique activities and tours for unforgettable memories</p>
          
          <div className="experiences-grid">
            {experiences.map(experience => (
              <div key={experience.id} className="experience-card">
                <div 
                  className="experience-image" 
                  style={{ backgroundImage: `url(${experience.image})` }}
                >
                  <div className="experience-price">{experience.price}</div>
                </div>
                <div className="experience-content">
                  <h3 className="experience-name">{experience.name}</h3>
                  <p className="experience-description">{experience.description}</p>
                  <button className="book-now-button">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Inspiration Section */}
      <section className="section inspiration-section">
        <div className="container">
          <h2 className="section-title">Find Inspiration</h2>
          <p className="section-subtitle">Discover trips based on your travel mood</p>
          
          <div className="inspiration-carousel">
            <div className="mood-card">
              <div className="mood-icon">💕</div>
              <h3>Romantic Escapes</h3>
            </div>
            <div className="mood-card">
              <div className="mood-icon">⚡</div>
              <h3>Adventure Thrills</h3>
            </div>
            <div className="mood-card">
              <div className="mood-icon">✨</div>
              <h3>Luxury Vacations</h3>
            </div>
            <div className="mood-card">
              <div className="mood-icon">💰</div>
              <h3>Budget Friendly</h3>
            </div>
            <div className="mood-card">
              <div className="mood-icon">👨‍👩‍👧‍👦</div>
              <h3>Family Getaways</h3>
            </div>
          </div>
        </div>
      </section>
      
      {/* Travel Stories */}
      <section className="section stories-section">
        <div className="container">
          <h2 className="section-title">Travel Stories</h2>
          <p className="section-subtitle">Get inspired by our latest travel guides and tips</p>
          
          <div className="stories-grid">
            {stories.map(story => (
              <div key={story.id} className="story-card">
                <div 
                  className="story-image" 
                  style={{ backgroundImage: `url(${story.image})` }}
                ></div>
                <div className="story-content">
                  <h3 className="story-title">{story.title}</h3>
                  <p className="story-excerpt">{story.excerpt}</p>
                  <a href="#" className="read-more">Read More →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-overlay"></div>
        </div>
        
        <div className="cta-content">
          <h2 className="cta-title">Your Journey Begins Here</h2>
          <p className="cta-subtitle">Start Planning Today 🚀</p>
          <button className="cta-button">Plan My Trip</button>
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;