import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from '../icons'
import Footer from '../components/Footer'
import api from '../api'

const NewJournal = () => {
    const navigate = useNavigate()
    
    // Check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            navigate('/signin')
            return
        }
    }, [navigate])
    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        icon: '📝',
        readTime: 5,
        series: '',
        season: '',
        episode_number: '',
    })
    const [categories, setCategories] = useState([])
    const [series, setSeries] = useState([])
    const [seasons, setSeasons] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, seriesRes] = await Promise.all([
                    api.blog.getCategories(),
                    api.blog.getSeries()
                ])
                setCategories(categoriesRes.results || categoriesRes || [])
                setSeries(seriesRes.results || seriesRes || [])
            } catch (err) {
                console.error('Failed to load data', err)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (formData.series) {
            fetchSeasons(formData.series)
        } else {
            setSeasons([])
            setFormData(prev => ({ ...prev, season: '', episode_number: '' }))
        }
    }, [formData.series])

    const fetchSeasons = async (seriesId) => {
        try {
            const seasonsRes = await api.blog.getSeasons(seriesId)
            setSeasons(seasonsRes.results || seasonsRes || [])
        } catch (err) {
            console.error('Failed to load seasons', err)
            setSeasons([])
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const payload = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
                category: formData.category,
                icon: formData.icon,
                read_time: formData.readTime,
                series: formData.series || null,
                season: formData.season || null,
                episode_number: formData.episode_number || null,
                status: 'published',
                is_featured: false,
            }
            await api.blog.createPost(payload)
            navigate('/journal')
        } catch (err) {
            setError(err.message || 'Failed to publish journal')
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
                        <span>New Journal Entry</span>
                    </div>
                    <h1>Write a story</h1>
                    <p>Share your thoughts, ideas, and experiences with the community.</p>
                </div>

                <form onSubmit={handleSubmit} className="post-form">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <div className="form-grid">
                        <div className="form-main">
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
                                    placeholder="Enter your journal title..."
                                    className="input-large"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <span className="label-text">Excerpt</span>
                                    <span className="label-required">*</span>
                                </label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    placeholder="A brief summary of your story (max 300 chars)..."
                                    className="textarea-medium"
                                    maxLength={300}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    <span className="label-text">Content</span>
                                    <span className="label-required">*</span>
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your story here..."
                                    className="textarea-large"
                                    rows={12}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-sidebar">
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
                                        <option key={cat.id || cat.slug || cat.name} value={cat.id || cat.slug || cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    <span className="label-text">Series (Optional)</span>
                                </label>
                                <select
                                    name="series"
                                    value={formData.series}
                                    onChange={handleChange}
                                    className="select-input"
                                >
                                    <option value="">No series</option>
                                    {series.map(s => (
                                        <option key={s.id || s.slug || s.title} value={s.id || s.slug || s.title}>
                                            {s.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.series && (
                                <div className="form-group">
                                    <label>
                                        <span className="label-text">Season (Optional)</span>
                                    </label>
                                    <select
                                        name="season"
                                        value={formData.season}
                                        onChange={handleChange}
                                        className="select-input"
                                    >
                                        <option value="">No season</option>
                                        {seasons.map(season => (
                                            <option key={season.id || season.slug || season.title} value={season.id || season.slug || season.title}>
                                                {season.title} (S{season.season_number})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {formData.season && (
                                <div className="form-group">
                                    <label>
                                        <span className="label-text">Episode Number</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="episode_number"
                                        value={formData.episode_number}
                                        onChange={handleChange}
                                        placeholder="1"
                                        min="1"
                                        className="input-small"
                                    />
                                </div>
                            )}

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

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    <span>{loading ? 'Publishing...' : 'Publish journal'}</span>
                                    {!loading && <ArrowRight />}
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

export default NewJournal
