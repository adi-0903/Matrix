import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from '../icons'
import Footer from '../components/Footer'
import api from '../api'
import MarkdownEditor from '../components/MarkdownEditor'

const CreateJournal = () => {
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
        topic: '',
        small_description: '',
        full_details: '',
        genre: '',
        read_time: 0
    })

    // Load draft on mount
    useEffect(() => {
        const draft = localStorage.getItem('journal_draft')
        if (draft) {
            try {
                const parsed = JSON.parse(draft)
                if (window.confirm('You have an unsaved draft. Would you like to restore it?')) {
                    setFormData(prev => ({ ...prev, ...parsed }))
                } else {
                    localStorage.removeItem('journal_draft')
                }
            } catch (e) {}
        }
    }, [])

    // Auto-save
    useEffect(() => {
        const timer = setInterval(() => {
            if (formData.topic || formData.small_description || formData.full_details) {
                localStorage.setItem('journal_draft', JSON.stringify(formData))
            }
        }, 10000)
        return () => clearInterval(timer)
    }, [formData])
    
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

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
        const { name, value } = e.target
        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: value
            }
            if (name === 'full_details') {
                updated.read_time = Math.ceil(value.length / 1000)
            }
            return updated
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const matchedCategory = categories.find(
                cat => cat.name.toLowerCase() === formData.genre.trim().toLowerCase()
            )
            
            if (!matchedCategory) {
                throw new Error(`Category "${formData.genre}" not found. Available categories: ${categories.map(c => c.name).join(', ')}`)
            }

            const response = await api.blog.createPost({
                title: formData.topic,
                excerpt: formData.small_description,
                content: formData.full_details,
                category: matchedCategory.id,
                status: 'draft',
                read_time: formData.read_time || Math.ceil(formData.full_details.length / 1000),
                isFeatured: false,
                post_type: 'journal'
            })

            localStorage.removeItem('journal_draft')
            setSuccess('Journal created successfully!')
            setTimeout(() => {
                navigate('/journal')
            }, 2000)
        } catch (err) {
            setError(err.message || 'Failed to create journal')
            console.error('Journal creation error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/journal')
    }

    return (
        <div className="create-journal-page">
            <div className="create-journal-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <motion.div
                className="create-journal-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="create-journal-header">
                    <h1>Create New Journal</h1>
                    <p>Share your thoughts and experiences</p>
                </div>

                {error && (
                    <div className="error-message" style={{
                        backgroundColor: 'rgba(255, 59, 48, 0.1)',
                        border: '1px solid rgba(255, 59, 48, 0.3)',
                        color: '#ff3b30',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <span>{error.replace('LIMIT_EXCEEDED: ', '')}</span>
                        {error.includes('LIMIT_EXCEEDED') && (
                            <button
                                type="button"
                                onClick={() => navigate('/pricing')}
                                style={{
                                    background: 'linear-gradient(135deg, var(--aqua), var(--lavender))',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 16px',
                                    color: '#060608',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Upgrade Plan
                            </button>
                        )}
                    </div>
                )}

                {success && (
                    <div className="success-message" style={{
                        backgroundColor: 'rgba(52, 199, 89, 0.1)',
                        border: '1px solid rgba(52, 199, 89, 0.3)',
                        color: '#34c759',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '20px'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="create-journal-form">
                    <div className="form-group">
                        <label htmlFor="topic" className="form-label">
                            Topic <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter your journal topic..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="small_description" className="form-label">
                            Breif Description <span className="required">*</span>
                        </label>
                        <textarea
                            id="small_description"
                            name="small_description"
                            value={formData.small_description}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="A brief summary of your journal..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="genre" className="form-label">
                            Genre <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="genre"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Enter genre (e.g., Fiction, Non-Fiction, Technology...)"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="full_details" className="form-label">
                            Full Details <span className="required">*</span>
                        </label>
                        <MarkdownEditor
                            value={formData.full_details}
                            onChange={handleChange}
                            placeholder="Write your complete journal entry here..."
                            minHeight="400px"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Journal'}
                            <ArrowRight />
                        </button>
                    </div>
                </form>
            </motion.div>

            <Footer />
        </div>
    )
}

export default CreateJournal
