import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Plus, Sparkles } from '../icons'
import Footer from '../components/Footer'
import api from '../api'

const SeriesDetail = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [series, setSeries] = useState(null)
    const [seasons, setSeasons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showAddSeason, setShowAddSeason] = useState(false)
    const [newSeasonForm, setNewSeasonForm] = useState({
        title: '',
        description: '',
        season_number: 1,
    })

    useEffect(() => {
        if (slug) {
            fetchSeriesDetail()
            fetchSeasons()
        }
    }, [slug])

    const fetchSeriesDetail = async () => {
        try {
            const response = await api.blog.getSeriesDetail(slug)
            setSeries(response?.results || response)
        } catch (err) {
            setError('Failed to load series')
            console.error('Fetch series detail error:', err)
        }
    }

    const fetchSeasons = async () => {
        try {
            setLoading(true)
            const response = await api.blog.getSeries()
            const allSeries = response.results || response
            const currentSeries = allSeries.find(s => s.slug === slug)
            if (currentSeries) {
                const seasonsResponse = await api.blog.getSeasons(currentSeries.id)
                setSeasons(seasonsResponse.results || seasonsResponse)
            }
        } catch (err) {
            setError('Failed to load seasons')
            console.error('Fetch seasons error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateSeason = async (e) => {
        e.preventDefault()
        try {
            const payload = {
                ...newSeasonForm,
                series: series.id,
            }
            await api.blog.createSeason(payload)
            setShowAddSeason(false)
            setNewSeasonForm({ title: '', description: '', season_number: 1 })
            fetchSeasons()
        } catch (err) {
            setError(err.message || 'Failed to create season')
        }
    }

    const getGradient = (status) => {
        return status === 'active'
            ? 'linear-gradient(135deg, rgba(99, 221, 190, 0.3), rgba(76, 175, 215, 0.2))'
            : 'linear-gradient(135deg, rgba(181, 169, 255, 0.3), rgba(120, 88, 255, 0.2))'
    }

    if (loading && !series) {
        return (
            <div className="series-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading series...</p>
                </div>
            </div>
        )
    }

    if (error && !series) {
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
                    <span>Series</span>
                </div>
                <h1>{series?.title}</h1>
                <p>{series?.subtitle}</p>
                <p>{series?.description}</p>
                <div style={{ marginTop: '16px' }}>
                    <button
                        onClick={() => setShowAddSeason(!showAddSeason)}
                        className="primary link-button"
                    >
                        <Plus />
                        Add Season
                    </button>
                </div>
            </motion.div>

            {showAddSeason && (
                <motion.div
                    className="create-season-form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                >
                    <form onSubmit={handleCreateSeason} className="post-form" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                        <h3>Add New Season</h3>
                        <div className="form-group">
                            <label>
                                <span className="label-text">Season Title</span>
                                <span className="label-required">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newSeasonForm.title}
                                onChange={(e) => setNewSeasonForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. Season 1"
                                className="input-large"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                name="description"
                                value={newSeasonForm.description}
                                onChange={(e) => setNewSeasonForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Season description..."
                                className="textarea-medium"
                                rows={3}
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <span className="label-text">Season Number</span>
                                <span className="label-required">*</span>
                            </label>
                            <input
                                type="number"
                                name="season_number"
                                value={newSeasonForm.season_number}
                                onChange={(e) => setNewSeasonForm(prev => ({ ...prev, season_number: parseInt(e.target.value) }))}
                                min="1"
                                className="input-small"
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary">
                                Create Season
                            </button>
                            <button type="button" className="btn-ghost" onClick={() => setShowAddSeason(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            <div className="series-content">
                <div className="seasons-section">
                    <h2>Seasons</h2>
                    {seasons.length === 0 ? (
                        <div className="no-seasons">
                            <p>No seasons yet. Add the first season to get started.</p>
                        </div>
                    ) : (
                        <div className="seasons-grid">
                            {seasons.map((season, i) => (
                                <motion.div
                                    key={season.id}
                                    className="season-card"
                                    style={{ background: getGradient(season.series?.status) }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                >
                                    <div className="season-header">
                                        <h3>{season.title}</h3>
                                        <span className="season-number">S{season.season_number}</span>
                                    </div>
                                    <p className="season-description">{season.description}</p>
                                    <div className="season-meta">
                                        <span className="episodes-count">
                                            {season.episodes_count === 1 ? '1 episode' : `${season.episodes_count || 0} episodes`}
                                        </span>
                                        <Link to={`/series/${slug}/season/${season.slug}`} className="view-episodes-btn">
                                            View Episodes
                                            <ArrowRight />
                                        </Link>
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

export default SeriesDetail
