import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../api'

const Footer = () => {
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [activeModal, setActiveModal] = useState(null) // 'newsletter' | 'press' | null
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

    const socialLinks = [
        { name: 'Instagram', url: 'https://instagram.com', icon: '📷' },
        { name: 'Threads', url: 'https://threads.net', icon: '🧵' },
        { name: 'RSS', url: '/rss', icon: '📡' },
        { name: 'Dribbble', url: 'https://dribbble.com', icon: '🎨' },
    ]

    const navigationLinks = [
        { name: 'Journal', url: '/journal' },
        { name: 'Blogs', url: '/blogs' },
        { name: 'Series', url: '/series' },
        { name: 'Events', url: '/events' },
        { name: 'About', url: '/about' },
    ]

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault()
        if (!newsletterEmail || !newsletterEmail.includes('@')) {
            alert('Please enter a valid email address.')
            return
        }
        setNewsletterSubscribed(true)
        try {
            const res = await api.newsletter.subscribe(newsletterEmail)
            alert(res.message || 'Successfully subscribed to Mind Matrix newsletter!')
            setNewsletterEmail('')
            setActiveModal(null)
        } catch (err) {
            alert(err.message || 'Failed to subscribe or email already registered.')
        } finally {
            setNewsletterSubscribed(false)
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    }

    return (
        <footer className="footer-premium">
            <motion.div
                className="footer-content"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="footer-grid-premium">
                    {/* Brand Section */}
                    <motion.div className="footer-section footer-brand" variants={itemVariants}>
                        <motion.div
                            className="brand-logo"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <span className="logo-symbol">✦</span>
                            <span className="logo-text">Mind Matrix</span>
                        </motion.div>
                        <p className="brand-tagline">Built for writers who choreograph feelings with every paragraph.</p>
                        <div className="brand-accent"></div>
                    </motion.div>

                    {/* Navigate Section */}
                    <motion.div className="footer-section" variants={itemVariants}>
                        <h4 className="footer-heading">Navigate</h4>
                        <ul className="footer-links">
                            {navigationLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.url} className="footer-link">
                                        <span className="link-text">{link.name}</span>
                                        <span className="link-icon">→</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Connect Section */}
                    <motion.div className="footer-section" variants={itemVariants}>
                        <h4 className="footer-heading">Connect</h4>
                        <ul className="footer-links">
                            <li>
                                <button type="button" onClick={() => setActiveModal('newsletter')} className="footer-link" style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                                    <span className="link-text">Newsletter</span>
                                    <span className="link-icon">→</span>
                                </button>
                            </li>
                            <li>
                                <Link to="/creators" className="footer-link">
                                    <span className="link-text">Community</span>
                                    <span className="link-icon">→</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/journal/new" className="footer-link">
                                    <span className="link-text">Submissions</span>
                                    <span className="link-icon">→</span>
                                </Link>
                            </li>
                            <li>
                                <button type="button" onClick={() => setActiveModal('press')} className="footer-link" style={{ background: 'none', border: 'none', padding: 0, width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                                    <span className="link-text">Press</span>
                                    <span className="link-icon">→</span>
                                </button>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Social Section */}
                    <motion.div className="footer-section" variants={itemVariants}>
                        <h4 className="footer-heading">Social</h4>
                        <ul className="footer-social">
                            {socialLinks.map((link) => (
                                <motion.li key={link.name} whileHover={{ scale: 1.1, y: -2 }}>
                                    <a
                                        href={link.url}
                                        className="social-link"
                                        target={link.url.startsWith('http') ? '_blank' : '_self'}
                                        rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
                                    >
                                        <span className="social-icon">{link.icon}</span>
                                        <span className="social-name">{link.name}</span>
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="footer-divider"></div>

                {/* Footer Bottom */}
                <motion.div className="footer-bottom-premium" variants={itemVariants}>
                    <div className="footer-credit">
                        <p>© 2025 Mind Matrix</p>
                        <div className="credit-divider">•</div>
                        <p>Crafted with motion & ink by <strong>Aditya Singhal</strong></p>
                    </div>
                    <motion.div
                        className="footer-accent-dot"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    ></motion.div>
                </motion.div>
            </motion.div>

            {/* Newsletter Modal */}
            {activeModal === 'newsletter' && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '20px'
                }}>
                    <div style={{
                        background: '#0d0d12', border: '1px solid rgba(106, 233, 193, 0.3)',
                        borderRadius: '24px', padding: '32px', maxWidth: '440px', width: '100%',
                        color: '#fff', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{ margin: '0 0 12px 0', fontSize: '1.6rem', color: 'var(--aqua)' }}>
                            📬 Subscribe to Newsletter
                        </h2>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                            Get weekly curated essays, motion presets, and top Mind Matrix posts delivered to your inbox.
                        </p>

                        <form onSubmit={handleNewsletterSubmit}>
                            <input 
                                type="email"
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                placeholder="Enter your email..."
                                required
                                style={{
                                    width: '100%', padding: '14px', borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: '#fff', fontSize: '1rem', outline: 'none', marginBottom: '16px'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="submit"
                                    disabled={newsletterSubscribed}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '12px',
                                        background: 'linear-gradient(135deg, var(--aqua), #128C7E)',
                                        border: 'none', color: '#000', fontWeight: 'bold',
                                        fontSize: '0.95rem', cursor: 'pointer'
                                    }}
                                >
                                    {newsletterSubscribed ? 'Subscribing...' : 'Subscribe Free'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveModal(null)}
                                    style={{
                                        padding: '12px 20px', borderRadius: '12px',
                                        background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)',
                                        color: 'var(--muted)', cursor: 'pointer', fontSize: '0.9rem'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Press & Media Kit Modal */}
            {activeModal === 'press' && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, padding: '20px'
                }}>
                    <div style={{
                        background: '#0d0d12', border: '1px solid rgba(200, 181, 255, 0.3)',
                        borderRadius: '24px', padding: '32px', maxWidth: '440px', width: '100%',
                        color: '#fff', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{ margin: '0 0 12px 0', fontSize: '1.6rem', color: '#c8b5ff' }}>
                            📰 Press & Media Kit
                        </h2>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                            For press inquiries, brand assets, or interview requests, please contact our team directly:
                        </p>

                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                            <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#fff' }}>
                                <strong>Press Email:</strong> singhaladitya611@gmail.com
                            </p>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>
                                <strong>Media Contact:</strong> +91 7009812679
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setActiveModal(null)}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '12px',
                                background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: 'var(--muted)', cursor: 'pointer', fontSize: '0.9rem'
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </footer>
    )
}

export default Footer
