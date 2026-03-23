import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StoryCard.css';

const StoryCard = ({ story }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/story/${story.id}`);
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get first 3 tags for display
    const displayTags = story.tags?.slice(0, 3) || [];

    return (
        <div className="story-card" onClick={handleClick}>
            <div className="story-card-image">
                {story.imageUrl ? (
                    <img src={story.imageUrl} alt={story.title} />
                ) : (
                    <div className="story-card-image-placeholder">
                        <i className="fas fa-image"></i>
                    </div>
                )}
                <div className="story-card-category">
                    {story.location || 'Travel Story'}
                </div>
            </div>
            <div className="story-card-content">
                <h3 className="story-card-title">{story.title}</h3>
                <p className="story-card-excerpt">
                    {story.content?.substring(0, 120)}
                    {story.content?.length > 120 ? '...' : ''}
                </p>
                <div className="story-card-tags">
                    {displayTags.map((tag, index) => (
                        <span key={index} className="story-card-tag">
                            #{tag}
                        </span>
                    ))}
                </div>
                <div className="story-card-meta">
                    <div className="story-card-author">
                        <i className="fas fa-user-circle"></i>
                        <span>{story.authorName || 'Traveler'}</span>
                    </div>
                    <div className="story-card-stats">
                        <span>
                            <i className="fas fa-heart"></i> {story.likes || 0}
                        </span>
                        <span>
                            <i className="fas fa-comment"></i> {story.comments?.length || 0}
                        </span>
                        <span>
                            <i className="far fa-calendar-alt"></i> {formatDate(story.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryCard;