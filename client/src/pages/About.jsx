import { motion } from 'framer-motion'

const About = () => {
    return (
        <div className="about-page">
            <div className="about-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>
            <motion.div
                className="about-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="about-header">
                    <div className="pill">About</div>
                    <h1>Mind Matrix</h1>
                    <p>A kinetic storytelling platform for writers who want atmosphere</p>
                </div>

                <div className="about-grid">
                    <div className="about-main">
                        <div className="about-card">
                            <h2>Our Story</h2>
                            <p className="bio">
                                Mind Matrix was born from a simple belief: that writing deserves a canvas as dynamic and
                                expressive as the stories it tells. We're building a platform where words dance with
                                motion, where every post feels like an experience, and where writers have the tools
                                to craft truly cinematic narratives.
                            </p>
                            <p className="bio">
                                Whether you're a seasoned author, an emerging voice, or someone who simply loves to
                                share stories, Mind Matrix provides the atmosphere and tools to make your words come alive.
                            </p>
                        </div>

                        <div className="about-card">
                            <h2>Our Mission</h2>
                            <p className="bio">
                                To empower writers with a platform that celebrates the art of storytelling through
                                beautiful design, thoughtful features, and a community that values craft over clicks.
                            </p>

                            <div className="mission-points">
                                <div className="mission-item">
                                    <span className="mission-icon">✍️</span>
                                    <div>
                                        <h4>Craft-First</h4>
                                        <p>Tools designed for writers who care about every word, every rhythm, every detail.</p>
                                    </div>
                                </div>
                                <div className="mission-item">
                                    <span className="mission-icon">🎨</span>
                                    <div>
                                        <h4>Beautiful by Default</h4>
                                        <p>Your stories deserve to look as good as they read. No design skills required.</p>
                                    </div>
                                </div>
                                <div className="mission-item">
                                    <span className="mission-icon">🌟</span>
                                    <div>
                                        <h4>Community Driven</h4>
                                        <p>A space for writers to connect, collaborate, and inspire each other.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about-sidebar">
                        <div className="about-card">
                            <h3>Platform Stats</h3>
                            <div className="stats-grid">
                                <div className="stat">
                                    <span className="stat-number">2.4k+</span>
                                    <span className="stat-label">Active Writers</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">180+</span>
                                    <span className="stat-label">Stories Published</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">32+</span>
                                    <span className="stat-label">Countries</span>
                                </div>
                            </div>
                        </div>

                        <div className="about-card">
                            <h3>Get in Touch</h3>
                            <p className="bio">
                                Have questions or want to collaborate? We'd love to hear from you.
                            </p>
                            <div className="contact-links">
                                <a href="mailto:hello@mindmatrix.app" className="contact-link">
                                    <span>📧</span>
                                    <span>hello@mindmatrix.app</span>
                                </a>
                                <a href="#" className="contact-link">
                                    <span>🐦</span>
                                    <span>@mindmatrix</span>
                                </a>
                                <a href="#" className="contact-link">
                                    <span>💬</span>
                                    <span>Join our Discord</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default About
