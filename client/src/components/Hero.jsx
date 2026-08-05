import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, PenNib, Link2 } from '../icons'

const featured = [
    {
        title: 'Weaving light through urban nights',
        tag: 'Cityscapes',
        excerpt: 'A kinetic journey through neon reflections, silent rooftops, and the rhythm of people chasing dawn.',
        readTime: '6 min',
        accent: 'var(--amber)',
    },
    {
        title: 'The quiet geometry of seaside towns',
        tag: 'Travel',
        excerpt: 'Salt on skin, café ink on napkins, and the shapes of waves teaching us about patience.',
        readTime: '4 min',
        accent: 'var(--aqua)',
    },
    {
        title: 'Analog rituals in a digital week',
        tag: 'Culture',
        excerpt: 'Why winding film, brewing slow coffee, and writing by hand still matter in 2025.',
        readTime: '5 min',
        accent: 'var(--lavender)',
    },
]

const gradients = [
    'linear-gradient(135deg, rgba(255, 177, 71, 0.5), rgba(255, 87, 34, 0.35))',
    'linear-gradient(135deg, rgba(99, 221, 190, 0.5), rgba(76, 175, 215, 0.35))',
    'linear-gradient(135deg, rgba(181, 169, 255, 0.5), rgba(120, 88, 255, 0.35))',
]

const Hero = () => {
    const gradient = useMemo(() => gradients[Math.floor(Math.random() * gradients.length)], [])

    return (
        <section className="hero">
            <motion.div
                className="hero-bg"
                style={{ backgroundImage: gradient }}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <div className="hero-grid">
                <div className="hero-text">
                    <div className="floating-badge">
                        <PenNib />
                        <span>Editorial Lab</span>
                    </div>
                    <h1>
                        Stories that feel
                        <span className="gradient-word">alive</span>
                    </h1>
                    <p>
                        Mind Matrix is a kinetic storytelling canvas for writers who want atmosphere. Compose with rhythm,
                        highlight with motion, and let each post feel cinematic.
                    </p>
                    <div className="hero-actions">
                        <Link to="/create-post" className="primary link-button">Start writing</Link>
                        <Link to="/journal" className="ghost link-button">
                            Explore journal
                            <ArrowRight />
                        </Link>
                    </div>
                    <div className="hero-meta">
                        <div>
                            <h4>2.4k</h4>
                            <p>Monthly readers</p>
                        </div>
                        <div>
                            <h4>180</h4>
                            <p>Issues curated</p>
                        </div>
                        <div>
                            <h4>32</h4>
                            <p>Guest authors</p>
                        </div>
                    </div>
                </div>
                <div className="hero-stack">
                    <AnimatePresence>
                        {featured.map((item, i) => (
                            <motion.div
                                key={item.title}
                                className="feature-card"
                                style={{ '--accent': item.accent }}
                                initial={{ x: 40, opacity: 0, rotate: 2 }}
                                animate={{ x: 0, opacity: 1, rotate: 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.1 }}
                                whileHover={{ y: -6, scale: 1.01 }}
                            >
                                <div className="feature-top">
                                    <span className="tag">{item.tag}</span>
                                    <Link2 />
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.excerpt}</p>
                                <div className="meta">
                                    <span>Read · {item.readTime}</span>
                                    <ArrowRight />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default Hero
