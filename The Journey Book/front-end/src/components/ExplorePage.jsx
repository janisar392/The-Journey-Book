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
  const BASE_URL = 'https://the-journey-book-backend.onrender.com';

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

  // Navigate to Place Details Page when clicking on an experience
  const handleExperienceClick = (experience) => {
    navigate(`/experience/${experience.id}`, { state: { experience } });
  };

  // Featured destinations data
  const destinations = [
    { id: 3, name: "Dubai, UAE", category: "desert", image: "/images/dubai.jpg", description: "Ultra-modern architecture and luxury shopping." },
    { id: 5, name: "New York, USA", category: "cities", image: "/images/newyork.jpg", description: "The concrete jungle where dreams are made." },
    { id: 8, name: "Tokyo, Japan", category: "cities", image: "/images/tokyo.jpg", description: "A blend of traditional culture and technological innovation." }
  ];
  
  // Experiences data
  const experiences = [
    { 
      id: 101,
      name: "Sunset Cruise in Maldives", 
      image: "https://oceangroup.mv/wp-content/uploads/2025/01/Dolphin-Cruise--scaled.jpg", 
      price: "129", 
      description: "Enjoy a romantic sunset cruise with dinner.", 
      location: "Maldives", 
      duration: "2 hours",
      rating: 4.8,
      fullDescription: "Experience the magic of a Maldivian sunset aboard a traditional dhoni. Cruise through crystal-clear waters, spot dolphins, and enjoy a delicious dinner under the stars. This romantic journey includes snorkeling stops, sunset photography opportunities, and a feast of local seafood delicacies.",
      highlights: [
        "Romantic sunset views over the Indian Ocean",
        "Traditional Maldivian dhoni cruise",
        "Delicious dinner with local seafood",
        "Dolphin watching opportunity",
        "Snorkeling equipment provided",
        "Professional photographer on board"
      ],
      included: [
        "Sunset cruise on traditional dhoni",
        "Welcome drink on arrival",
        "Buffet dinner with vegetarian options",
        "Snorkeling equipment",
        "Live acoustic music",
        "Return transfers from resort"
      ],
      importantInfo: [
        "Minimum 2 guests required",
        "Weather dependent activity",
        "Vegetarian options available",
        "Free cancellation 24 hours prior"
      ]
    },
    { 
      id: 102,
      name: "Eiffel Tower Night Tour", 
      image: "https://www.toureiffel.paris/sites/default/files/styles/1200x630/public/actualite/image_principale/IMG_0815.jpg", 
      price: "89", 
      description: "See Paris illuminated at night from the iconic tower.", 
      location: "Paris, France", 
      duration: "1.5 hours",
      rating: 4.9,
      fullDescription: "Experience the magic of the Eiffel Tower after dark. Skip the long lines and ascend to the second floor for breathtaking panoramic views of the City of Lights. Watch as the tower sparkles with thousands of twinkling lights, creating an unforgettable Parisian memory.",
      highlights: [
        "Skip-the-line access to Eiffel Tower",
        "Panoramic night views of Paris",
        "See the tower sparkle at night",
        "Expert local guide commentary",
        "Small group experience",
        "Perfect photo opportunities"
      ],
      included: [
        "Eiffel Tower second floor entrance ticket",
        "Professional English-speaking guide",
        "Small group tour (max 20 people)",
        "Fun facts and historical insights"
      ],
      importantInfo: [
        "Valid ID required for entry",
        "Elevator access included",
        "Not suitable for wheelchairs",
        "Free cancellation 24 hours prior"
      ]
    },
    { 
      id: 103,
      name: "Camel Safari in Dubai", 
      image: "https://amymarietta.com/wp-content/uploads/2019/10/IMG_8362.jpg", 
      price: "75", 
      description: "Experience traditional desert transportation and culture.", 
      location: "Dubai, UAE", 
      duration: "3 hours",
      rating: 4.7,
      fullDescription: "Embark on an authentic desert adventure with a traditional camel safari. Ride through golden sand dunes, visit a Bedouin camp, and experience the rich culture of the Arabian desert. Enjoy traditional entertainment, henna painting, and a delicious BBQ dinner under the stars.",
      highlights: [
        "30-minute camel ride across desert dunes",
        "Traditional Bedouin camp experience",
        "Sunset photography in the desert",
        "Live cultural performances (Tanoura dance)",
        "Henna painting for ladies",
        "Arabic coffee and dates tasting"
      ],
      included: [
        "Hotel pickup and drop-off",
        "Camel ride experience",
        "BBQ dinner with vegetarian options",
        "Unlimited soft drinks and water",
        "Shisha (traditional hookah)",
        "Entertainment shows"
      ],
      importantInfo: [
        "Comfortable clothing recommended",
        "Sunglasses and sunscreen advised",
        "Camel rides suitable for all ages",
        "Free cancellation 24 hours prior"
      ]
    },
    { 
      id: 104,
      name: "Jazz Night in New Orleans", 
      image: "https://www.tourhero.com/en/magazine/wp-content/uploads/2021/12/robson-hatsukami-morgan-sEoR_ea8KoE-unsplash.jpg", 
      price: "45", 
      description: "Immerse yourself in the birthplace of jazz music.", 
      location: "New Orleans, USA", 
      duration: "2 hours",
      rating: 4.6,
      fullDescription: "Step into the soulful world of jazz at one of New Orleans' most historic venues. Enjoy an evening of authentic live jazz performed by local legends. Sip on a classic cocktail and let the rhythm of the city transport you to the heart of the French Quarter's musical heritage.",
      highlights: [
        "Live jazz performance by local artists",
        "Historic French Quarter venue",
        "Authentic New Orleans atmosphere",
        "Signature cocktails available",
        "Intimate seating experience",
        "Rich musical history narration"
      ],
      included: [
        "Entry to historic jazz venue",
        "One complimentary drink",
        "Live jazz performance (2 hours)",
        "Professional sound system",
        "Seated table reservation"
      ],
      importantInfo: [
        "Must be 21+ with valid ID",
        "Smart casual dress code",
        "Arrive 15 minutes before show",
        "No refunds for late arrivals"
      ]
    }
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
              <div 
                key={experience.id} 
                className="experience-card"
                onClick={() => handleExperienceClick(experience)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="experience-image" 
                  style={{ backgroundImage: `url(${experience.image})` }}
                >
                  <div className="experience-price">{experience.price}</div>
                </div>
                <div className="experience-content">
                  <h3 className="experience-name">{experience.name}</h3>
                  <p className="experience-description">{experience.description}</p>
                  <button className="book-now-button">View Details</button>
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
                      <div className="text-center py-5" style={{ gridColumn: '1/-1' }}>
                          <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading stories...</span>
                          </div>
                      </div>
                  ) : stories.length === 0 ? (
                      <div className="text-center py-5" style={{ gridColumn: '1/-1' }}>
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