import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Plus, Play, Sparkles } from '../icons'
import Footer from '../components/Footer'
import api from '../api'

const SeasonDetail = () => {
    const { slug: seriesSlug, seasonSlug } = useParams()
    const navigate = useNavigate()
    const [season, setSeason] = useState(null)
    const [series, setSeries] = useState(null)
    const [episodes, setEpisodes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showAddEpisode, setShowAddEpisode] = useState(false)
    const [newEpisodeForm, setNewEpisodeForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        episode_number: 1,
        category: '',
        read_time: 5,
    })
    const [categories, setCategories] = useState([])

    useEffect(() => {
        if (seriesSlug && seasonSlug) {
            fetchSeasonDetail()
            fetchEpisodes()
            fetchCategories()
        }
    }, [seriesSlug, seasonSlug])

    const fetchSeasonDetail = async () => {
        try {
            const response = await api.blog.getSeasonDetail(seasonSlug)
            setSeason(response)
            setSeries(response.series)
        } catch (err) {
            setError('Failed to load season')
            console.error('Fetch season detail error:', err)
        }
    }

    const fetchEpisodes = async () => {
        try {
            setLoading(true)
            const response = await api.blog.getSeasonEpisodes(seasonSlug)
            setEpisodes(response.results || response)
        } catch (err) {
            setError('Failed to load episodes')
            console.error('Fetch episodes error:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        try {
            const res = await api.blog.getCategories()
            setCategories(res.results || res || [])
        } catch (err) {
            console.error('Failed to load categories', err)
        }
    }

    const handleCreateEpisode = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...newEpisodeForm,
                series: series.id,
                season: season.id,
                status: 'published',
                is_featured: false,
                icon: '📝',
                gradient: '',
            }
            await api.blog.createPost(payload)
            setShowAddEpisode(false)
            setNewEpisodeForm({
                title: '',
                excerpt: '',
                content: '',
                episode_number: episodes.length + 1,
                category: '',
                read_time: 5,
            })
            fetchEpisodes()
        } catch (err) {
            setError(err.message || 'Failed to create episode')
        }
    }

    const getGradient = (status) => {
        return status === 'active'
            ? 'linear-gradient(135deg, rgba(99, 221, 190, 0.3), rgba(76, 175, 215, 0.2))'
            : 'linear-gradient(135deg, rgba(181, 169, 255, 0.3), rgba(120, 88, 255, 0.2))'
    }

    if (loading && !season) {
        return (
            <div className="series-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading season...</p>
                </div>
            </div>
        )
    }

    if (error && !season) {
        return (
            <div className="series-page">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={() => navigate(-1)} className="retry-button">Go Back</button>
                </div>
            </div>
        )
    }

    return (
        <div className="series-page">
            <div className="series-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <motion.div
                className="series-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="pill">
                    <BookOpen />
                    <span>Season {season?.season_number}</span>
                </div>
                <h1>{season?.title}</h1>
                <p>{season?.description}</p>
                <div className="season-series-info">
                    <Link to={`/series/${series?.slug}`} className="series-link">
                        ← Back to {series?.title}
                    </Link>
                </div>
                <div style={{ marginTop: '16px' }}>
                    <button
                        onClick={() => setShowAddEpisode(!showAddEpisode)}
                        className="primary link-button"
                    >
                        <Plus />
                        Add Episode
                    </button>
                </div>
            </motion.div>

            {showAddEpisode && (
                <motion.div
                    className="create-episode-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <form onSubmit={handleCreateEpisode} className="post-form" style={{ maxWidth: '800px', margin: '0 auto 2rem' }}>
                        <h3>Add New Episode</h3>
                        {error && <div className="error-message">{error}</div>}
                        <div className="form-grid">
                            <div className="form-main">
                                <div className="form-group">
                                    <label>
                                        <span className="label-text">Episode Title</span>
                                        <span className="label-required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newEpisodeForm.title}
                                        onChange={(e) => setNewEpisodeForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Episode title..."
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
                                        value={newEpisodeForm.excerpt}
                                        onChange={(e) => setNewEpisodeForm(prev => ({ ...prev, excerpt: e.target.value }))}
                                        placeholder="Brief summary..."
                                        className="textarea-medium"
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
                                        value={newEpisodeForm.content}
                                        onChange={(e) => setNewEpisodeForm(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="Episode content..."
                                        className="textarea-large"
                                        rows={10}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-sidebar">
                                <div className="form-group">
                                    <label>
                                        <span className="label-text">Episode Number</span>
                                        <span className="label-required">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="episode_number"
                                        value={newEpisodeForm.episode_number}
                                        onChange={(e) => setNewEpisodeForm(prev => ({ ...prev, episode_number: parseInt(e.target.value) }))}
                                        min="1"
                                        className="input-small"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>
                                        <span className="label-text">Category</span>
                                        <span className="label-required">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={newEpisodeForm.category}
                                        onChange={(e) => setNewEpisodeForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="select-input"
                                        required
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id || cat.slug || cat.name} value={cat.id || cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>
                                        <span className="label-text">Read Time (minutes)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="read_time"
                                        value={newEpisodeForm.read_time}
                                        onChange={(e) => setNewEpisodeForm(prev => ({ ...prev, read_time: parseInt(e.target.value) }))}
                                        min="1"
                                        max="60"
                                        className="input-small"
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        Create Episode
                                    </button>
                                    <button type="button" className="btn-ghost" onClick={() => setShowAddEpisode(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="series-content">
                <div className="episodes-section">
                    <h2>Episodes</h2>
                    {episodes.length === 0 ? (
                        <div className="no-episodes">
                            <p>No episodes yet. Add the first episode to get started.</p>
                        </div>
                    ) : (
                        <div className="episodes-grid">
                            {episodes.map((episode, i) => (
                                <motion.div
                                    key={episode.id}
                                    className="episode-card"
                                    style={{ background: getGradient(series?.status) }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                >
                                    <div className="episode-header">
                                        <div className="episode-number">
                                            S{season?.season_number}E{episode.episode_number}
                                        </div>
                                        <Play className="episode-play-icon" />
                                    </div>
                                    <h3>{episode.title}</h3>
                                    <p className="episode-excerpt">{episode.excerpt}</p>
                                    <div className="episode-meta">
                                        <span className="read-time">{episode.read_time} min read</span>
                                        <span className="category">{episode.category_name}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default SeasonDetail
