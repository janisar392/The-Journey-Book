import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ExplorePage.css';
import StoryCard from './stories/StoryCard';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [animatedText, setAnimatedText] = useState(0);
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
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

  useEffect(() => {
    fetchStories();
  }, []);
  
  const fetchStories = async () => {
      try {
          const response = await fetch(`${BASE_URL}/api/experiences`);
          if (response.ok) {
              const data = await response.json();
              setStories(data);
          }
      } catch (err) {
          console.error('Error fetching stories:', err);
      } finally {
          setStoriesLoading(false);
      }
  };

  const handleSearchChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search data:', searchData);
    navigate('/search-results', { state: { searchData } });
  };

  const handleExploreDestination = (destinationName) => {
    const searchData = {
      destination: destinationName,
      date: '',
      travelers: ''
    };
    navigate('/search-results', { state: { searchData } });
  };

  // Navigate to create story page
  const handleCreateStory = () => {
    navigate('/create-story');
  };

  // Featured destinations data
  const destinations = [
    { id: 3, name: "Dubai, UAE", category: "desert", image: "/images/dubai.jpg", description: "Ultra-modern architecture and luxury shopping." },
    { id: 5, name: "New York, USA", category: "cities", image: "/images/newyork.jpg", description: "The concrete jungle where dreams are made." },
    { id: 8, name: "Tokyo, Japan", category: "cities", image: "/images/tokyo.jpg", description: "A blend of traditional culture and technological innovation." }
  ];
  
  // Experiences data
  const experiences = [
    { id: 1, name: "Sunset Cruise in Maldives", image: "/images/sunset-cruise.jpg", price: "$129", description: "Enjoy a romantic sunset cruise with dinner." },
    { id: 2, name: "Eiffel Tower Night Tour", image: "/images/eiffel-tower.jpg", price: "$89", description: "See Paris illuminated at night from the iconic tower." },
    { id: 3, name: "Camel Safari in Dubai", image: "/images/camel-safari.jpg", price: "$75", description: "Experience traditional desert transportation and culture." },
    { id: 4, name: "Jazz Night in New Orleans", image: "/images/jazz-night.jpg", price: "$45", description: "Immerse yourself in the birthplace of jazz music." }
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
                    <button 
                      className="explore-button"
                      onClick={() => handleExploreDestination(destination.name)}
                    >
                      Explore Destination
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
      
      {/* Travel Stories - Main content hub with Share button */}
      <section className="section stories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Travel Stories</h2>
              <p className="section-subtitle">Get inspired by our latest travel guides and tips</p>
            </div>
            <button className="create-story-btn" onClick={handleCreateStory}>
              <i className="fas fa-plus"></i> Share Your Story
            </button>
          </div>
          
          <div className="stories-grid">
            {storiesLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading stories...</span>
                    </div>
                </div>
            ) : stories.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                    <h4>No stories yet</h4>
                    <p>Be the first to share your travel experience!</p>
                    <button className="btn btn-primary" onClick={handleCreateStory}>
                        Share Your Story
                    </button>
                </div>
            ) : (
                stories.map(story => (
                    <StoryCard key={story.id} story={story} />
                ))
            )}
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