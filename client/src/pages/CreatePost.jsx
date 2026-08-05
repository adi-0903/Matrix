import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from '../icons'
import Footer from '../components/Footer'
import api from '../api'
import MarkdownEditor from '../components/MarkdownEditor'

const CreatePost = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        icon: '📝',
        status: 'draft',
        readTime: 5,
        isFeatured: false,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [imagePreview, setImagePreview] = useState(null)

    // Load draft on mount
    useEffect(() => {
        const draft = localStorage.getItem('post_draft')
        if (draft) {
            try {
                const parsed = JSON.parse(draft)
                if (window.confirm('You have an unsaved draft. Would you like to restore it?')) {
                    setFormData(prev => ({ ...prev, ...parsed }))
                } else {
                    localStorage.removeItem('post_draft')
                }
            } catch (e) {}
        }
    }, [])

    // Auto-save
    useEffect(() => {
        const timer = setInterval(() => {
            if (formData.title || formData.excerpt || formData.content) {
                localStorage.setItem('post_draft', JSON.stringify(formData))
            }
        }, 10000)
        return () => clearInterval(timer)
    }, [formData])

    const [categories, setCategories] = useState([])
    const icons = ['📝', '✍️', '📖', '🎨', '💡', '🌟', '🚀', '💻', '📷', '🎭', '🎵', '🌍']

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.blog.getCategories()
                setCategories(res.results || res || [])
            } catch (err) {
                console.error('Failed to load categories', err)
            }
        }
        fetchCategories()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Prepare post data for API
            const postData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                category: parseInt(formData.category, 10),
                icon: formData.icon,
                status: formData.status,
                read_time: formData.readTime,
                is_featured: formData.isFeatured,
                post_type: 'blog',
            }

            // Create post via API
            const response = await api.blog.createPost(postData)
            
            // Handle featured image upload if present
            if (imagePreview) {
                // Note: You'll need to implement file upload in the backend
                // For now, we'll just create the post without the image
                console.log('Image upload to be implemented')
            }

            localStorage.removeItem('post_draft')

            // Show success message and redirect
            alert(`Post ${formData.status === 'draft' ? 'saved as draft' : 'published'} successfully!`)
            navigate('/journal') // Redirect to journal page
            
        } catch (err) {
            setError(err.message || 'Failed to create post. Please try again.')
            console.error('Create post error:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="create-post-page">
            <div className="create-post-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <motion.div
                className="create-post-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="create-post-header">
                    <div className="pill">
                        <Sparkles />
                        <span>Create Post</span>
                    </div>
                    <h1>Write your story</h1>
                    <p>Share your thoughts, ideas, and experiences with the world</p>
                </div>

                <form onSubmit={handleSubmit} className="post-form">
                    {error && (
                        <div className="error-message" style={{
                            backgroundColor: 'rgba(255, 59, 48, 0.1)',
                            border: '1px solid rgba(255, 59, 48, 0.3)',
                            color: '#ff3b30',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}
                    <div className="form-grid">
                        {/* Main Content Section */}
                        <div className="form-main">
                            {/* Title */}
                            <div className="form-group">
                                <label>
                                    <span className="label-text">Title</span>
                                    <span className="label-required">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter your post title..."
                                    className="input-large"
                                    required
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="form-group">
                                <label>
                                    <span className="label-text">Excerpt</span>
                                    <span className="label-required">*</span>
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    placeholder="A brief summary of your post (max 500 characters)..."
                                    className="textarea-medium"
                                    maxLength={500}
                                    rows={3}
                                    required
                                />
                                <span className="char-count">{formData.excerpt.length}/500</span>
                            </div>

                            {/* Content */}
                            <div className="form-group">
                                <label>
                                    <span className="label-text">Content</span>
                                    <span className="label-required">*</span>
                                </label>
                                <MarkdownEditor
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your story here... Use markdown for formatting."
                                    minHeight="400px"
                                />
                            </div>

                            {/* Featured Image */}
                            <div className="form-group">
                                <label>
                                    <span className="label-text">Featured Image</span>
                                </label>
                                <div className="image-upload-area">
                                    {imagePreview ? (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                            <button
                                                type="button"
                                                className="remove-image"
                                                onClick={() => setImagePreview(null)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="upload-placeholder">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                hidden
                                            />
                                            <div className="upload-icon">📷</div>
                                            <p>Click to upload image</p>
                                            <span>PNG, JPG up to 10MB</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Section */}
                        <div className="form-sidebar">
                            {/* Category */}
                            <div className="form-group">
                                <label>
                                    <span className="label-text">Category</span>
                                    <span className="label-required">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="select-input"
                                    required
                                >
                                    <option value="">Select category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Icon Picker */}
                            <div className="form-group">
                                <label>
                                    <span className="label-text">Icon</span>
                                </label>
                                <div className="icon-picker">
                                    {icons.map(icon => (
                                        <button
                                            key={icon}
                                            type="button"
                                            className={`icon-option ${formData.icon === icon ? 'active' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Read Time */}
                            <div className="form-group">
                                <label>
                                    <span className="label-text">Read Time (minutes)</span>
                                </label>
                                <input
                                    type="number"
                                    name="readTime"
                                    value={formData.readTime}
                                    onChange={handleChange}
                                    min="1"
                                    max="60"
                                    className="input-small"
                                />
                            </div>

                            {/* Featured Toggle */}
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                    />
                                    <span>Mark as featured</span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                                    disabled={loading}
                                >
                                    <span>{loading ? 'Publishing...' : 'Publish'}</span>
                                    {!loading && <ArrowRight />}
                                </button>
                                <button
                                    type="submit"
                                    className="btn-secondary"
                                    onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save as Draft'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-ghost"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </motion.div>

            <Footer />
        </div>
    )
}

export default CreatePost
