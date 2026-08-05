import { motion } from 'framer-motion'

const Footer = () => {
    const socialLinks = [
        { name: 'Instagram', url: 'https://instagram.com', icon: '📷' },
        { name: 'Threads', url: 'https://threads.net', icon: '🧵' },
        { name: 'RSS', url: '/rss', icon: '📡' },
        { name: 'Dribbble', url: 'https://dribbble.com', icon: '🎨' },
    ]

    const navigationLinks = [
        { name: 'Journal', url: '/journal' },
        { name: 'Series', url: '/series' },
        { name: 'Events', url: '/events' },
        { name: 'About', url: '/about' },
    ]

    const connectLinks = [
        { name: 'Newsletter', url: '#newsletter' },
        { name: 'Community', url: '#community' },
        { name: 'Submissions', url: '#submissions' },
        { name: 'Press', url: '#press' },
    ]

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
                                    <a href={link.url} className="footer-link">
                                        <span className="link-text">{link.name}</span>
                                        <span className="link-icon">→</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Connect Section */}
                    <motion.div className="footer-section" variants={itemVariants}>
                        <h4 className="footer-heading">Connect</h4>
                        <ul className="footer-links">
                            {connectLinks.map((link) => (
                                <li key={link.name}>
                                    <a href={link.url} className="footer-link">
                                        <span className="link-text">{link.name}</span>
                                        <span className="link-icon">→</span>
                                    </a>
                                </li>
                            ))}
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
        </footer>
    )
}

export default Footer
