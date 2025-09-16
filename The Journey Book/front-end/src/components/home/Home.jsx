import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [searchData, setSearchData] = useState({
        destination: '',
        date: '',
        travelers: ''
    });

    const handleSearchChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log('Search data:', searchData);
        // Add your search logic here
    };

    return (
        <div className="home-container">
            {/* Video Background */}
            <div className="video-background">
                <video autoPlay loop muted playsInline className="background-video">
                    <source src="/videos/background.mp4" type="video/mp4" />
                    <source src="/videos/background.webm" type="video/webm" />
                </video>
                <div className="video-overlay"></div>
            </div>

            {/* Hero Content */}
            <div className="hero-content">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 text-center">
                            {/* Headline */}
                            <h1 className="hero-title">
                                Discover Your Next Journey <span className="earth-emoji">🌍</span>
                            </h1>
                            
                            {/* Subtitle */}
                            <p className="hero-subtitle">
                                Plan, book, and explore the world with ease
                            </p>

                            {/* Search Bar */}
                            <form className="search-form" onSubmit={handleSearchSubmit}>
                                <div className="search-container">
                                    <div className="search-input-group">
                                        <i className="fas fa-map-marker-alt input-icon"></i>
                                        <input
                                            type="text"
                                            name="destination"
                                            placeholder="Where to?"
                                            value={searchData.destination}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                        />
                                    </div>
                                    
                                    <div className="search-input-group">
                                        <i className="fas fa-calendar input-icon"></i>
                                        <input
                                            type="date"
                                            name="date"
                                            value={searchData.date}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                        />
                                    </div>
                                    
                                    <div className="search-input-group">
                                        <i className="fas fa-users input-icon"></i>
                                        <select
                                            name="travelers"
                                            value={searchData.travelers}
                                            onChange={handleSearchChange}
                                            className="search-input"
                                        >
                                            <option value="">Travelers</option>
                                            <option value="1">1 Traveler</option>
                                            <option value="2">2 Travelers</option>
                                            <option value="3">3 Travelers</option>
                                            <option value="4">4 Travelers</option>
                                            <option value="5+">5+ Travelers</option>
                                        </select>
                                    </div>
                                    
                                    <button type="submit" className="search-button">
                                        <i className="fas fa-search"></i>
                                        Search
                                    </button>
                                </div>
                            </form>

                            {/* Popular Destinations Quick Links */}
                            <div className="popular-destinations">
                                <p className="popular-label">Popular: </p>
                                <div className="destination-tags">
                                    <span className="destination-tag">Paris</span>
                                    <span className="destination-tag">Bali</span>
                                    <span className="destination-tag">Tokyo</span>
                                    <span className="destination-tag">New York</span>
                                    <span className="destination-tag">Dubai</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section (Optional - can be removed or kept) */}
            <div className="content-section">
                <div className="container">
                    {/* Add additional content here if needed */}
                </div>
            </div>
        </div>
    );
};

export default Home;