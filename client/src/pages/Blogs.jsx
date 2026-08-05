import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles } from '../icons'
import Footer from '../components/Footer'
import ReadingJournal from '../components/ReadingJournal'
import api from '../api'

const Blogs = () => {
    const [activeFilter, setActiveFilter] = useState('All')
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [currentUser, setCurrentUser] = useState(null)

    const filters = ['All', 'Culture', 'Travel', 'Design', 'Opinion', 'Personal', 'Technology']

    useEffect(() => {
        fetchCurrentUser()
        fetchPosts()
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

    const fetchPosts = async () => {
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

    const allUserPosts = currentUser 
        ? posts.filter(post => post.author?.id === currentUser.id)
        : posts

    const otherUsersPosts = currentUser 
        ? posts.filter(post => post.author?.id !== currentUser.id)
        : posts

    const filteredPosts = activeFilter === 'All' 
        ? allUserPosts 
        : allUserPosts.filter(post => post.category?.name === activeFilter)

    const featuredPosts = otherUsersPosts.filter(post => post.is_featured).slice(0, 4)

    // Add safety check for posts array
    if (!Array.isArray(posts)) {
        console.warn('Posts data is not an array:', posts)
        return <div>Error: Invalid data format</div>
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getGradient = (category) => {
        const gradients = {
            'Culture': 'linear-gradient(135deg, rgba(255, 177, 71, 0.2), rgba(255, 87, 34, 0.1))',
            'Travel': 'linear-gradient(135deg, rgba(99, 221, 190, 0.2), rgba(76, 175, 215, 0.1))',
            'Design': 'linear-gradient(135deg, rgba(181, 169, 255, 0.2), rgba(120, 88, 255, 0.1))',
            'Opinion': 'linear-gradient(135deg, rgba(255, 107, 129, 0.2), rgba(255, 64, 129, 0.1))',
            'Personal': 'linear-gradient(135deg, rgba(129, 236, 236, 0.2), rgba(102, 217, 239, 0.1))',
            'Technology': 'linear-gradient(135deg, rgba(163, 203, 255, 0.2), rgba(108, 156, 255, 0.1))',
        }
        return gradients[category] || gradients['Culture']
    }

    if (loading) {
        return (
            <div className="journal-page">
                <div className="journal-aurora">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading posts...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="journal-page">
                <div className="journal-aurora">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={fetchPosts} className="retry-button">Try Again</button>
                </div>
            </div>
        )
    }

    return (
        <div className="journal-page">
            <div className="journal-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

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
                <h1>Your Stories</h1>
                <p>Your blogs, journals, and series in one place</p>
                <div style={{ marginTop: '16px' }}>
                    <Link to="/blogs/new" className="primary link-button">
                        New Blogs
                    </Link>
                </div>
            </motion.div>

            {/* All Articles Section */}
            <section className="articles-section">
                <div className="section-header">
                    <h2>All articles</h2>
                    <div className="header-line" />
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    {filters.map((filter) => (
                        <motion.button
                            key={filter}
                            className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {filter}
                        </motion.button>
                    ))}
                </div>

                {/* Articles Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFilter}
                        className="articles-grid"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {filteredPosts.length === 0 ? (
                            <div className="no-posts">
                                <p>No posts found for "{activeFilter}" category.</p>
                            </div>
                        ) : (
                            filteredPosts.map((post, i) => (
                                <Link key={post.id} to={`/blogs/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <motion.article
                                        className="article-card"
                                        style={{ background: getGradient(post.category?.name || 'Culture') }}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: i * 0.05 }}
                                        whileHover={{ y: -6, scale: 1.02 }}
                                    >
                                        <div className="article-icon-small">{post.icon || '📝'}</div>
                                        <div className="article-header">
                                            <span className="article-category-small">{post.category?.name || 'Uncategorized'}</span>
                                            <span className="read-time-small">{post.read_time || 5} min</span>
                                        </div>
                                        <h4>{post.title}</h4>
                                        <p className="article-excerpt">{post.excerpt}</p>
                                        <div className="article-footer">
                                            <div className="author-info">
                                                <span>{post.author?.username || 'Anonymous'}</span>
                                                <span className="separator">•</span>
                                                <span>{formatDate(post.published_at || post.created_at)}</span>
                                            </div>
                                            <div className="article-actions">
                                                <ReadingJournal postId={post.id} postType="blog" />
                                                <ArrowRight className="arrow-icon" />
                                            </div>
                                        </div>
                                    </motion.article>
                                </Link>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>

                {filteredPosts.length === 0 && activeFilter !== 'All' && (
                    <motion.div
                        className="no-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p>No articles found in this category.</p>
                    </motion.div>
                )}
            </section>

            {/* Featured Section */}
            <section className="featured-section">
                <div className="section-header">
                    <h2>Community Stories</h2>
                    <div className="header-line" />
                    <Link to="/blogs/all" className="view-all-btn">
                        View All
                        <ArrowRight />
                    </Link>
                </div>

                <div className="featured-grid">
                    {featuredPosts.map((post, i) => (
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
                            <span className="article-category">{post.category?.name || 'Uncategorized'}</span>
                            <h3>{post.title}</h3>
                            <p>{post.excerpt}</p>
                            <div className="article-meta">
                                <div className="meta-left">
                                    <span className="author">{post.author?.username || 'Anonymous'}</span>
                                    <span className="separator">•</span>
                                    <span className="date">{formatDate(post.published_at || post.created_at)}</span>
                                </div>
                                <div className="meta-right">
                                    <ReadingJournal postId={post.id} postType="blog" />
                                    <span className="read-time">{post.read_time || 5} min read</span>
                                </div>
                            </div>
                            <Link to={`/blogs/${post.slug}`} className="read-more">
                                Read story
                                <ArrowRight />
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    )
}

export default Blogs
