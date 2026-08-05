import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles } from '../icons'
import Footer from '../components/Footer'
import ReadingJournal from '../components/ReadingJournal'
import api from '../api'

const AllBlogs = () => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        fetchCurrentUser()
        fetchAllBlogs()
    }, [])

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('authToken')
            if (token) {
                const user = await api.auth.getUser()
                setCurrentUser(user)
            }
        } catch (err) {
            console.error('Failed to fetch user:', err)
        }
    }

    const fetchAllBlogs = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await api.blog.getPosts({ status: 'published', post_type: 'blog' })
            const data = response?.results || response
            setPosts(Array.isArray(data) ? data : [])
        } catch (err) {
            setError(err.message || 'Failed to load posts')
            console.error('Fetch posts error:', err)
            setPosts([])
        } finally {
            setLoading(false)
        }
    }

    const getGradient = (category) => {
        const gradients = {
            'Technology': 'linear-gradient(135deg, rgba(99, 221, 190, 0.3), rgba(76, 175, 215, 0.2))',
            'Travel': 'linear-gradient(135deg, rgba(255, 179, 71, 0.3), rgba(255, 138, 101, 0.2))',
            'Design': 'linear-gradient(135deg, rgba(181, 169, 255, 0.3), rgba(120, 88, 255, 0.2))',
            'Culture': 'linear-gradient(135deg, rgba(255, 138, 101, 0.3), rgba(255, 179, 71, 0.2))',
            'Opinion': 'linear-gradient(135deg, rgba(255, 179, 71, 0.3), rgba(255, 138, 101, 0.2))',
            'Personal': 'linear-gradient(135deg, rgba(99, 221, 190, 0.3), rgba(76, 175, 215, 0.2))',
        }
        return gradients[category] || gradients['Culture']
    }

    if (loading) {
        return (
            <div className="blogs-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading all blogs...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="blogs-page">
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={fetchAllBlogs} className="retry-button">Try Again</button>
                </div>
            </div>
        )
    }

    return (
        <div className="blogs-page">
            <motion.div
                className="journal-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="pill">
                    <Sparkles />
                    <span>Blogs</span>
                </div>
                <h1>All Community Blogs</h1>
                <p>Discover insights, stories, and perspectives from our community</p>
                <div style={{ marginTop: '16px' }}>
                    <Link to="/blogs" className="primary link-button">
                        Back to Your Blogs
                    </Link>
                </div>
            </motion.div>

            <div className="blogs-content">
                {posts.length === 0 ? (
                    <div className="no-posts">
                        <p>No blogs available at the moment.</p>
                    </div>
                ) : (
                    <div className="featured-grid">
                        {posts.map((post, i) => (
                            <motion.article
                                key={post.id}
                                className="featured-article"
                                style={{ background: getGradient(post.category?.name || 'Culture') }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                whileHover={{ y: -8, scale: 1.01 }}
                            >
                                <div className="article-icon">{post.icon || '📝'}</div>
                                <span className="article-category">{post.category?.name || 'Culture'}</span>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="article-meta">
                                    <div className="meta-left">
                                        <span className="author">{post.author?.username || 'Anonymous'}</span>
                                        <span className="separator">•</span>
                                        <span className="date">{post.read_time || 5} min read</span>
                                    </div>
                                    <div className="meta-right">
                                        <ReadingJournal postId={post.id} postType="blog" />
                                        <span className="read-time">{post.read_time || 5} min</span>
                                    </div>
                                </div>
                                <Link to={`/blogs/${post.slug}`} className="read-more">
                                    Read blog
                                    <ArrowRight />
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default AllBlogs
