import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Image } from '../icons'
import Footer from '../components/Footer'
import api from '../api'
import MarkdownEditor from '../components/MarkdownEditor'

const CreateBlogs = () => {
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
        image: null,
        image_preview: ''
    })

    // Load draft on mount
    useEffect(() => {
        const draft = localStorage.getItem('blog_draft')
        if (draft) {
            try {
                const parsed = JSON.parse(draft)
                if (window.confirm('You have an unsaved draft. Would you like to restore it?')) {
                    setFormData(prev => ({
                        ...prev,
                        title: parsed.title || '',
                        excerpt: parsed.excerpt || '',
                        content: parsed.content || ''
                    }))
                } else {
                    localStorage.removeItem('blog_draft')
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, [])

    // Auto-save every 10 seconds if there's content
    useEffect(() => {
        const timer = setInterval(() => {
            if (formData.title || formData.excerpt || formData.content) {
                localStorage.setItem('blog_draft', JSON.stringify({
                    title: formData.title,
                    excerpt: formData.excerpt,
                    content: formData.content
                }))
            }
        }, 10000)
        return () => clearInterval(timer)
    }, [formData.title, formData.excerpt, formData.content])
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB')
                return
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file')
                return
            }

            setFormData(prev => ({
                ...prev,
                image: file,
                image_preview: URL.createObjectURL(file)
            }))
            setError('')
        }
    }

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null,
            image_preview: ''
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('title', formData.title)
            formDataToSend.append('excerpt', formData.excerpt)
            formDataToSend.append('content', formData.content)
            formDataToSend.append('post_type', 'blog')
            if (formData.image) {
                formDataToSend.append('image', formData.image)
            }

            const response = await api.blog.createPost(formDataToSend)

            localStorage.removeItem('blog_draft')
            setSuccess('Blog post created successfully!')
            setTimeout(() => {
                navigate('/blogs')
            }, 2000)
        } catch (err) {
            setError(err.message || 'Failed to create blog post')
            console.error('Blog creation error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        navigate('/blogs')
    }

    return (
        <div className="create-blogs-page" style={{
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at top, rgba(106, 233, 193, 0.08), transparent 40%), radial-gradient(ellipse at bottom, rgba(200, 181, 255, 0.08), transparent 40%), radial-gradient(ellipse at center, rgba(255, 179, 71, 0.05), transparent 50%), #060608'
        }}>
            <div className="create-blogs-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <motion.div
                className="create-blogs-content"
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
                <div className="create-blogs-header" style={{
                    textAlign: 'center',
                    marginBottom: '60px',
                    position: 'relative'
                }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, var(--aqua), var(--lavender), var(--amber))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: '0 0 20px 0',
                        letterSpacing: '-0.02em',
                        position: 'relative',
                        textShadow: '0 0 40px rgba(106, 233, 193, 0.3)'
                    }}>Create New Blog</h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--muted)',
                        margin: 0,
                        fontWeight: 400
                    }}>Share your thoughts with the world through compelling stories</p>
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
                        backdropFilter: 'blur(10px)',
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
                        padding: '16px 20px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontWeight: 500,
                        backdropFilter: 'blur(10px)'
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="create-blogs-form" style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div className="form-group" style={{ marginBottom: '32px' }}>
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
                            placeholder="Enter blog title..."
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label htmlFor="excerpt" className="form-label" style={{
                            display: 'block',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#e4e4ef',
                            marginBottom: '12px',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase'
                        }}>
                            Excerpt <span className="required" style={{ color: 'var(--amber)', marginLeft: '4px' }}>*</span>
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            value={formData.excerpt}
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
                            placeholder="A brief summary of your blog post..."
                            rows={3}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label htmlFor="content" className="form-label" style={{
                            display: 'block',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#e4e4ef',
                            marginBottom: '12px',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase'
                        }}>
                            Content <span className="required" style={{ color: 'var(--amber)', marginLeft: '4px' }}>*</span>
                        </label>
                        <MarkdownEditor
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your full blog content here..."
                            minHeight="400px"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '32px' }}>
                        <label htmlFor="image" className="form-label" style={{
                            display: 'block',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#e4e4ef',
                            marginBottom: '12px',
                            letterSpacing: '0.02em',
                            textTransform: 'uppercase'
                        }}>
                            Featured Image
                        </label>
                        
                        {formData.image_preview ? (
                            <div className="image-preview" style={{
                                position: 'relative',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '2px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <img 
                                    src={formData.image_preview} 
                                    alt="Preview" 
                                    style={{
                                        width: '100%',
                                        height: '300px',
                                        objectFit: 'cover',
                                        display: 'block'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        background: 'rgba(255, 59, 48, 0.9)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div className="image-upload-area" style={{
                                border: '2px dashed rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                                padding: '40px',
                                textAlign: 'center',
                                background: 'rgba(255, 255, 255, 0.02)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <div style={{ color: 'var(--muted)', marginBottom: '16px' }}>
                                    <Image style={{ fontSize: '48px', marginBottom: '16px' }} />
                                </div>
                                <p style={{ color: '#e4e4ef', marginBottom: '8px', fontSize: '1.1rem' }}>
                                    Click to upload image
                                </p>
                                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        )}
                        
                        {!formData.image_preview && (
                            <label htmlFor="image" style={{ cursor: 'pointer' }}>
                                <div 
                                    onClick={() => document.getElementById('image').click()}
                                    style={{
                                        marginTop: '16px',
                                        padding: '12px 24px',
                                        background: 'linear-gradient(135deg, rgba(106, 233, 193, 0.2), rgba(106, 233, 193, 0.1))',
                                        border: '1px solid rgba(106, 233, 193, 0.3)',
                                        borderRadius: '8px',
                                        color: '#67e5d4',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'inline-block'
                                    }}
                                >
                                    Choose Image
                                </div>
                            </label>
                        )}
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
                                border: '2px solid rgba(255, 255, 255, 0.1)',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                overflow: 'hidden',
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
                                color: '#e4e4ef',
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
                                background: 'linear-gradient(135deg, var(--aqua), var(--lavender))',
                                color: 'var(--bg)',
                                boxShadow: '0 8px 24px rgba(106, 233, 193, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            {loading ? 'Creating...' : 'Publish Blog'}
                            <ArrowRight />
                        </button>
                    </div>
                </form>
            </motion.div>

            <Footer />
        </div>
    )
}

export default CreateBlogs
