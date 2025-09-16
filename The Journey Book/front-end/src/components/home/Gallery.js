// Gallery.js
import React, { useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: 1, src: "/images/mountain.jpg", caption: "Mountain Adventure", category: "Adventure" },
    { id: 2, src: "/images/beach.jpg", caption: "Beach Paradise", category: "Relaxation" },
    { id: 3, src: "/images/city.jpg", caption: "City Exploration", category: "Urban" },
    { id: 4, src: "/images/culture.jpg", caption: "Cultural Experience", category: "Cultural" },
    { id: 5, src: "/images/wildlife.jpg", caption: "Wildlife Safari", category: "Wildlife" },
    { id: 6, src: "/images/history.jpg", caption: "Historical Sites", category: "Historical" },
    { id: 7, src: "/images/local.jpg", caption: "Local Cuisine", category: "Food" },
    { id: 8, src: "/images/sunset.jpg", caption: "Breathtaking Sunsets", category: "Nature" },
    { id: 9, src: "/images/sports.jpg", caption: "Extreme Sports", category: "Adventure" },
  ];

  const categories = [
    "All",
    "Adventure",
    "Relaxation",
    "Urban",
    "Cultural",
    "Wildlife",
    "Historical",
    "Food",
    "Nature",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((image) => image.category === activeCategory);

  const openModal = (image) => setSelectedImage(image);
  const closeModal = () => setSelectedImage(null);

  return (
    <div className="gallery-isolated-container">
      {/* Hero Section with Video Background */}
      <div className="gallery-isolated-hero">
        <video autoPlay loop muted playsInline className="gallery-isolated-video">
          <source src="/videos/gallery.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="gallery-isolated-overlay" />
        <div className="gallery-isolated-content">
          <h1>Explore Our Gallery</h1>
          <div className="gallery-isolated-points">
            <p>Discover breathtaking moments from around the world</p>
            <p>"Every trip begins with a story."</p>
            <p>"Your adventures, one book away."</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="gallery-isolated-filters-container">
        <div className="gallery-isolated-category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`gallery-isolated-filter-btn ${
                activeCategory === category ? "gallery-isolated-active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-isolated-grid-container">
        {filteredImages.length > 0 ? (
          <div className="gallery-isolated-grid">
            {filteredImages.map((image) => (
              <div key={image.id} className="gallery-isolated-item">
                <div
                  className="gallery-isolated-card"
                  onClick={() => openModal(image)}
                >
                  <div className="gallery-isolated-image-container">
                    <img src={image.src} alt={image.caption} />
                    <div className="gallery-isolated-image-overlay">
                      <div className="gallery-isolated-overlay-content">
                        <h5>{image.caption}</h5>
                        <span className="gallery-isolated-badge">{image.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="gallery-isolated-no-images">
            <h3>No images found in this category</h3>
            <p>Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="gallery-isolated-modal-overlay" onClick={closeModal}>
          <div
            className="gallery-isolated-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="gallery-isolated-close-btn" onClick={closeModal}>
              ×
            </button>
            <img src={selectedImage.src} alt={selectedImage.caption} />
            <div className="gallery-isolated-modal-caption">
              <h3>{selectedImage.caption}</h3>
              <p>{selectedImage.category} Experience</p>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="gallery-isolated-cta">
        <div className="gallery-isolated-cta-content">
          <h2>Ready to Create Your Own Memories?</h2>
          <p>
            Book your next adventure with us and experience these amazing
            destinations firsthand
          </p>
          <button className="gallery-isolated-cta-button">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;