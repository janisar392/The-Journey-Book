import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StoryDetailPage.css';

const StoryDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [liking, setLiking] = useState(false);

    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    useEffect(() => {
        fetchStory();
    }, [id]);

    const fetchStory = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/experiences/${id}`);
            if (response.ok) {
                const data = await response.json();
                setStory(data);
            } else {
                setError('Story not found');
            }
        } catch (err) {
            setError('Failed to load story');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLiking(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/experiences/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const updatedStory = await response.json();
                setStory(updatedStory);
            }
        } catch (err) {
            console.error('Error liking story:', err);
        } finally {
            setLiking(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }

        if (!commentText.trim()) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/experiences/${id}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: commentText })
            });

            if (response.ok) {
                const updatedStory = await response.json();
                setStory(updatedStory);
                setCommentText('');
            }
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this story?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/api/experiences/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                navigate('/explore');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete story');
            }
        } catch (err) {
            console.error('Error deleting story:', err);
            alert('Network error. Please try again.');
        }
    };

    const handleEdit = () => {
        navigate(`/edit-story/${id}`);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="story-detail-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading story...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="story-detail-error">
                <i className="fas fa-exclamation-circle fa-3x mb-3"></i>
                <h2>{error}</h2>
                <button className="btn btn-primary" onClick={() => navigate('/explore')}>
                    Back to Explore
                </button>
            </div>
        );
    }

    const isAuthor = user && story && story.userId === user.id;

    return (
        <div className="story-detail-page">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Story Header */}
                        <div className="story-detail-header">
                            {story.imageUrl && (
                                <div className="story-detail-image">
                                    <img src={story.imageUrl} alt={story.title} />
                                </div>
                            )}
                            <div className="story-detail-meta">
                                <div className="story-detail-category">
                                    {story.location || 'Travel Story'}
                                </div>
                                <h1 className="story-detail-title">{story.title}</h1>
                                <div className="story-detail-author-info">
                                    <div className="author-avatar">
                                        <i className="fas fa-user-circle"></i>
                                    </div>
                                    <div className="author-details">
                                        <span className="author-name">{story.authorName || 'Traveler'}</span>
                                        <span className="story-date">{formatDate(story.createdAt)}</span>
                                    </div>
                                    {isAuthor && (
                                        <div className="story-actions">
                                            <button onClick={handleEdit} className="btn-edit">
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                            <button onClick={handleDelete} className="btn-delete">
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        {story.tags && story.tags.length > 0 && (
                            <div className="story-detail-tags">
                                {story.tags.map((tag, index) => (
                                    <span key={index} className="story-detail-tag">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Story Content */}
                        <div className="story-detail-content">
                            <p>{story.content}</p>
                        </div>

                        {/* Like Button */}
                        <div className="story-detail-like">
                            <button 
                                className={`btn-like ${liking ? 'disabled' : ''}`}
                                onClick={handleLike}
                                disabled={liking}
                            >
                                <i className={`fas fa-heart ${story.likes > 0 ? 'liked' : ''}`}></i>
                                <span>{story.likes || 0} Likes</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div className="story-detail-comments">
                            <h3 className="comments-title">
                                <i className="fas fa-comments"></i> Comments ({story.comments?.length || 0})
                            </h3>

                            {/* Add Comment Form */}
                            {user ? (
                                <form onSubmit={handleAddComment} className="comment-form">
                                    <textarea
                                        placeholder="Share your thoughts..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        rows="3"
                                        required
                                    ></textarea>
                                    <button type="submit" disabled={submitting}>
                                        {submitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </form>
                            ) : (
                                <div className="login-to-comment">
                                    <p>Please <a href="/login">login</a> to leave a comment</p>
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="comments-list">
                                {story.comments && story.comments.length > 0 ? (
                                    story.comments.map((comment, index) => (
                                        <div key={index} className="comment-item">
                                            <div className="comment-avatar">
                                                <i className="fas fa-user-circle"></i>
                                            </div>
                                            <div className="comment-content">
                                                <div className="comment-header">
                                                    <span className="comment-author">{comment.userName}</span>
                                                    <span className="comment-date">
                                                        {formatDate(comment.createdAt)}
                                                    </span>
                                                </div>
                                                <p className="comment-text">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-comments">
                                        <p>No comments yet. Be the first to share your thoughts!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Back Button */}
                        <div className="story-detail-back">
                            <button onClick={() => navigate('/explore')} className="btn-back">
                                <i className="fas fa-arrow-left"></i> Back to Explore
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryDetailPage;