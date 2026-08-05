import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, Calendar } from '../icons'
import Footer from '../components/Footer'
import api from '../api'
import { formatContent } from '../utils/markdown'
const BlogPost = () => {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                setError('')
                const response = await api.blog.getPost(slug)
                const postData = response?.results || response
                setPost(postData)
            } catch (err) {
                setError(err.message || 'Failed to load blog post')
                console.error('Fetch blog post error:', err)
                setPost(null)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [slug])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formattedContent = formatContent(post.content, post.title)

    if (loading) {
        return (
            <div className="journal-post-page">
                <div className="journal-aurora">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading blog...</p>
                </div>
            </div>
        )
    }

    if (error && !post) {
        return (
            <div className="journal-post-page">
                <div className="journal-aurora">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
                <div className="error-container">
                    <h2>Blog not found</h2>
                    <p>{error}</p>
                    <Link to="/blogs" className="back-link">
                        <ArrowLeft />
                        Back to Blogs
                    </Link>
                </div>
            </div>
        )
    }

    if (!post) {
        return (
            <div className="journal-post-page">
                <div className="journal-aurora">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
                <div className="error-container">
                    <h2>Story not found</h2>
                    <p>The blog post you're looking for doesn't exist.</p>
                    <Link to="/blogs" className="back-link">
                        <ArrowLeft />
                        Back to Blogs
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="journal-post-page">
            <div className="journal-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <motion.article
                className="post-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <header className="post-header">
                    <Link to="/blogs" className="back-link">
                        <ArrowLeft />
                        Back to Blogs
                    </Link>
                    
                    <div className="post-meta">
                        <span className="post-icon">{post.icon}</span>
                        <span className="post-category">{post.category.name}</span>
                        <span className="separator">•</span>
                        <span className="post-read-time">
                            <Clock />
                            {post.read_time} min read
                        </span>
                    </div>
                    
                    <h1 className="post-title-main">{post.title}</h1>
                    
                    <div className="post-details">
                        <div className="author-info">
                            <User />
                            <span>{post.author.username}</span>
                        </div>
                        <div className="date-info">
                            <Calendar />
                            <span>{formatDate(post.published_at)}</span>
                        </div>
                    </div>
                </header>

                <div className="post-content">
                    {formattedContent}
                </div>
            </motion.article>

            <Footer />
        </div>
    )
}

export default BlogPost
