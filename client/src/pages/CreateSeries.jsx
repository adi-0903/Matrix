import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Plus, Minus } from '../icons'
import Footer from '../components/Footer'
import api from '../api'

const CreateSeries = () => {
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
        subtitle: '',
        summary: '',
        description: '',
        status: 'active',
        genre: '',
        current_season: 1,
        current_episode: 1
    })
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const statusOptions = [
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'hiatus', label: 'Hiatus' },
        { value: 'cancelled', label: 'Cancelled' }
    ]

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSeasonChange = (action) => {
        if (action === 'increment') {
            setFormData(prev => ({
                ...prev,
                current_season: prev.current_season + 1,
                current_episode: 1 // Reset episode to 1 when changing season
            }))
        } else if (action === 'decrement' && formData.current_season > 1) {
            setFormData(prev => ({
                ...prev,
                current_season: prev.current_season - 1,
                current_episode: 1 // Reset episode to 1 when changing season
            }))
        }
    }

    const handleEpisodeChange = (action) => {
        if (action === 'increment') {
            setFormData(prev => ({
                ...prev,
                current_episode: prev.current_episode + 1
            }))
        } else if (action === 'decrement' && formData.current_episode > 1) {
            setFormData(prev => ({
                ...prev,
                current_episode: prev.current_episode - 1
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await api.blog.createSeries({
                title: formData.title,
                subtitle: formData.subtitle,
                description: formData.description,
                summary: formData.summary,
                genre: formData.genre,
                status: formData.status,
                current_season: formData.current_season,
                current_episode: formData.current_episode
            })

            setSuccess('Series created successfully!')
            setTimeout(() => {
                navigate('/series')
            }, 2000)
        } catch (err) {
            setError(err.message || 'Failed to create series')
            console.error('Series creation error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/series')
    }

    return (
        <div className="new-series-page" style={{
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at top, rgba(200, 181, 255, 0.08), transparent 40%), radial-gradient(ellipse at bottom, rgba(255, 179, 71, 0.08), transparent 40%), radial-gradient(ellipse at center, rgba(106, 233, 193, 0.05), transparent 50%), #060608'
        }}>
            <div className="new-series-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <motion.div
                className="new-series-content"
                style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '60px 40px',
                    position: 'relative',
                    zIndex: 1
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="new-series-header" style={{
                    textAlign: 'center',
                    marginBottom: '60px',
                    position: 'relative'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, var(--lavender), var(--amber), var(--aqua))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: '0 0 20px 0',
                        letterSpacing: '-0.02em',
                        position: 'relative',
                        textShadow: '0 0 40px rgba(200, 181, 255, 0.3)'
                    }}>Create New Series</h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--muted)',
                        margin: 0,
                        fontWeight: 400
                    }}>Build your story universe with seasons and episodes</p>
                </div>

                {error && (
                    <div className="error-message" style={{
                        backgroundColor: 'rgba(255, 59, 48, 0.1)',
                        border: '1px solid rgba(255, 59, 48, 0.3)',
                        color: '#ff3b30',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontWeight: 500,
                        backdropFilter: 'blur(10px)'
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message" style={{
                        backgroundColor: 'rgba(52, 199, 89, 0.1)',
                        border: '1px solid rgba(52, 199, 89, 0.3)',
                        color: '#34c759',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontWeight: 500,
                        backdropFilter: 'blur(10px)'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="new-series-form" style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div className="form-row" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        marginBottom: '32px'
                    }}>
                        <div className="form-group">
                            <label htmlFor="title" className="form-label" style={{
                                display: 'block',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                color: '#e4e4ef',
                                marginBottom: '12px',
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase'
                            }}>
                                Title <span className="required" style={{ color: 'var(--amber)', marginLeft: '4px' }}>*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="form-input"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '16px 20px',
                                    fontSize: '1rem',
                                    color: '#e4e4ef',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backdropFilter: 'blur(10px)'
                                }}
                                placeholder="Enter series title..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subtitle" className="form-label" style={{
                                display: 'block',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                color: '#e4e4ef',
                                marginBottom: '12px',
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase'
                            }}>
                                Subtitle
                            </label>
                            <input
                                type="text"
                                id="subtitle"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                className="form-input"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '16px 20px',
                                    fontSize: '1rem',
                                    color: '#e4e4ef',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backdropFilter: 'blur(10px)'
                                }}
                                placeholder="Enter series subtitle..."
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label htmlFor="summary" className="form-label" style={{
                            display: 'block',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#e4e4ef',
                            marginBottom: '12px',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase'
                        }}>
                            Summary <span className="required" style={{ color: 'var(--amber)', marginLeft: '4px' }}>*</span>
                        </label>
                        <textarea
                            id="summary"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            className="form-textarea"
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                padding: '16px 20px',
                                fontSize: '1rem',
                                color: '#e4e4ef',
                                fontFamily: 'inherit',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                backdropFilter: 'blur(10px)',
                                resize: 'vertical'
                            }}
                            placeholder="A brief summary of your series..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label htmlFor="description" className="form-label" style={{
                            display: 'block',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#e4e4ef',
                            marginBottom: '12px',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase'
                        }}>
                            Description <span className="required" style={{ color: 'var(--amber)', marginLeft: '4px' }}>*</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-textarea large"
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '16px',
                                padding: '16px 20px',
                                fontSize: '1rem',
                                color: '#e4e4ef',
                                fontFamily: 'inherit',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                backdropFilter: 'blur(10px)',
                                resize: 'vertical',
                                minHeight: '200px'
                            }}
                            placeholder="Detailed description of your series concept, themes, and what makes it unique..."
                            rows={8}
                            required
                        />
                    </div>

                    <div className="form-row" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '24px',
                        marginBottom: '32px'
                    }}>
                        <div className="form-group">
                            <label htmlFor="genre" className="form-label" style={{
                                display: 'block',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                color: '#e4e4ef',
                                marginBottom: '12px',
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase'
                            }}>
                                Genre <span className="required" style={{ color: 'var(--amber)', marginLeft: '4px' }}>*</span>
                            </label>
                            <input
                                type="text"
                                id="genre"
                                name="genre"
                                value={formData.genre}
                                onChange={handleChange}
                                className="form-input"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '16px 20px',
                                    fontSize: '1rem',
                                    color: '#e4e4ef',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backdropFilter: 'blur(10px)'
                                }}
                                placeholder="Enter genre (e.g., Fantasy, Sci-Fi, Drama...)"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status" className="form-label" style={{
                                display: 'block',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                color: '#e4e4ef',
                                marginBottom: '12px',
                                letterSpacing: '0.02em',
                                textTransform: 'uppercase'
                            }}>
                                Status <span className="required" style={{ color: 'var(--amber)', marginLeft: '4px' }}>*</span>
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08))',
                                    border: '2px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '16px',
                                    padding: '16px 20px',
                                    fontSize: '1rem',
                                    color: '#e4e4ef',
                                    fontFamily: 'inherit',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    backdropFilter: 'blur(10px)',
                                    cursor: 'pointer',
                                    appearance: 'auto'
                                }}
                                required
                            >
                                <option value="active" style={{ backgroundColor: '#1a1a2e', color: '#e4e4ef' }}>Active</option>
                                <option value="completed" style={{ backgroundColor: '#1a1a2e', color: '#e4e4ef' }}>Completed</option>
                                <option value="hiatus" style={{ backgroundColor: '#1a1a2e', color: '#e4e4ef' }}>Hiatus</option>
                                <option value="cancelled" style={{ backgroundColor: '#1a1a2e', color: '#e4e4ef' }}>Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="season-episode-section" style={{
                    background: 'linear-gradient(135deg, rgba(200, 181, 255, 0.05), rgba(200, 181, 255, 0.02))',
                    border: '1px solid rgba(200, 181, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '32px',
                    margin: '32px 0',
                    position: 'relative'
                }}>
                        <h3 style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            color: '#e4e4ef',
                            margin: '0 0 24px 0',
                            background: 'linear-gradient(135deg, var(--lavender), var(--amber))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>Season & Episode Management</h3>
                        <div className="season-episode-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '32px',
                            marginBottom: '20px'
                        }}>
                            <div className="counter-group" style={{ textAlign: 'center' }}>
                                <label className="form-label" style={{
                                    display: 'block',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    color: '#e4e4ef',
                                    marginBottom: '16px',
                                    letterSpacing: '0.02em',
                                    textTransform: 'uppercase'
                                }}>Current Season</label>
                                <div className="counter-controls" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '16px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => handleSeasonChange('decrement')}
                                        className="counter-btn"
                                        disabled={formData.current_season <= 1}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, var(--lavender), var(--amber))',
                                            color: 'var(--bg)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 4px 12px rgba(200, 181, 255, 0.3)'
                                        }}
                                    >
                                        <Minus />
                                    </button>
                                    <div className="counter-value" style={{
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        color: '#e4e4ef',
                                        minWidth: '120px',
                                        background: 'linear-gradient(135deg, var(--aqua), var(--lavender))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        Season {formData.current_season}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleSeasonChange('increment')}
                                        className="counter-btn"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, var(--lavender), var(--amber))',
                                            color: 'var(--bg)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 4px 12px rgba(200, 181, 255, 0.3)'
                                        }}
                                    >
                                        <Plus />
                                    </button>
                                </div>
                            </div>

                            <div className="counter-group" style={{ textAlign: 'center' }}>
                                <label className="form-label" style={{
                                    display: 'block',
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    color: '#e4e4ef',
                                    marginBottom: '16px',
                                    letterSpacing: '0.02em',
                                    textTransform: 'uppercase'
                                }}>Current Episode</label>
                                <div className="counter-controls" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '16px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '2px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '16px',
                                    padding: '16px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => handleEpisodeChange('decrement')}
                                        className="counter-btn"
                                        disabled={formData.current_episode <= 1}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, var(--lavender), var(--amber))',
                                            color: 'var(--bg)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 4px 12px rgba(200, 181, 255, 0.3)'
                                        }}
                                    >
                                        <Minus />
                                    </button>
                                    <div className="counter-value" style={{
                                        fontSize: '1.2rem',
                                        fontWeight: '600',
                                        color: '#e4e4ef',
                                        minWidth: '120px',
                                        background: 'linear-gradient(135deg, var(--aqua), var(--lavender))',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        Episode {formData.current_episode}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleEpisodeChange('increment')}
                                        className="counter-btn"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            border: 'none',
                                            background: 'linear-gradient(135deg, var(--lavender), var(--amber))',
                                            color: 'var(--bg)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: '0 4px 12px rgba(200, 181, 255, 0.3)'
                                        }}
                                    >
                                        <Plus />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="counter-help" style={{
                            fontSize: '0.9rem',
                            color: 'var(--muted)',
                            textAlign: 'center',
                            margin: 0,
                            fontStyle: 'italic'
                        }}>
                            Episodes will auto-increment as you add content. You can manually adjust season and episode numbers here.
                        </p>
                    </div>

                    <div className="form-actions" style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'flex-end',
                        marginTop: '40px',
                        paddingTop: '32px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        position: 'relative'
                    }}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn-secondary"
                            disabled={loading}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '16px 32px',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
                                color: '#e4e4ef',
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '16px 32px',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                textDecoration: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, var(--amber), var(--aqua))',
                                color: 'var(--bg)',
                                boxShadow: '0 8px 24px rgba(255, 179, 71, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {loading ? 'Creating...' : 'Create Series'}
                            <ArrowRight />
                        </button>
                    </div>
                </form>
            </motion.div>

            <Footer />
        </div>
    )
}

export default CreateSeries
