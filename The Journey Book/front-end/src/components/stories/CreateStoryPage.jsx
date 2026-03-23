import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateStoryPage.css';

const CreateStoryPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        tags: '',
        location: ''
    });

    const BASE_URL = 'https://the-journey-book-backend.onrender.com';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Validate
        if (!formData.title.trim()) {
            setError('Please enter a title');
            setLoading(false);
            return;
        }
        if (!formData.content.trim()) {
            setError('Please share your story');
            setLoading(false);
            return;
        }
        if (formData.content.length < 50) {
            setError('Please write at least 50 characters');
            setLoading(false);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please login to share your story');
            setLoading(false);
            return;
        }

        // Process tags
        const tagsArray = formData.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);

        try {
            const response = await fetch(`${BASE_URL}/api/experiences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    imageUrl: formData.imageUrl,
                    tags: tagsArray,
                    location: formData.location
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Your story has been published!');
                setTimeout(() => {
                    navigate(`/story/${data.id}`);
                }, 2000);
            } else {
                setError(data.error || 'Failed to publish story');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-story-page">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="create-story-card">
                            <h1 className="create-story-title">Share Your Travel Story</h1>
                            <p className="create-story-subtitle">
                                Inspire others with your travel experiences, tips, and adventures
                            </p>

                            {error && (
                                <div className="alert alert-danger">
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    <i className="fas fa-check-circle me-2"></i>
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Story Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        className="form-control"
                                        placeholder="e.g., 10 Hidden Beaches in Thailand"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                    <small className="text-muted">
                                        Catchy title that describes your experience
                                    </small>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Your Story</label>
                                    <textarea
                                        name="content"
                                        className="form-control"
                                        rows="10"
                                        placeholder="Share your travel experience, tips, what you learned, and what made it special..."
                                        value={formData.content}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                    <small className="text-muted">
                                        Minimum 50 characters. Be detailed and inspiring!
                                    </small>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Image URL (Optional)</label>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        className="form-control"
                                        placeholder="https://example.com/your-image.jpg"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                    />
                                    <small className="text-muted">
                                        Paste a link to your travel photo
                                    </small>
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Tags (Optional)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        className="form-control"
                                        placeholder="beach, adventure, food, solo-travel"
                                        value={formData.tags}
                                        onChange={handleChange}
                                    />
                                    <small className="text-muted">
                                        Separate tags with commas (e.g., beach, hiking, food)
                                    </small>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label">Location (Optional)</label>
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-control"
                                        placeholder="Bali, Indonesia"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                    <small className="text-muted">
                                        Where was this travel experience?
                                    </small>
                                </div>

                                <div className="d-flex gap-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin me-2"></i>
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Publish Story
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-lg"
                                        onClick={() => navigate('/explore')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateStoryPage;