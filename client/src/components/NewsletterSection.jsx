import { useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api'

const NewsletterSection = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')

    const handleSubscribe = async (e) => {
        e.preventDefault()

        if (!email) {
            setMessage('Please enter a valid email')
            setMessageType('error')
            return
        }

        setLoading(true)
        setMessage('')

        try {
            const response = await api.newsletter.subscribe(email)
            
            setMessage('🎉 Thank you for subscribing! Check your email for details about your 24-day free trial.')
            setMessageType('success')
            setEmail('')
        } catch (error) {
            console.error('Subscribe error:', error)
            
            if (error.message && error.message.includes('already subscribed')) {
                setMessage('This email is already subscribed to our newsletter.')
            } else {
                setMessage('Failed to subscribe. Please try again later.')
            }
            setMessageType('error')
        } finally {
            setLoading(false)
        }

        setTimeout(() => {
            setMessage('')
        }, 5000)
    }

    return (
        <motion.div
            className="footer-newsletter-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
        >
            <div className="newsletter-container">
                <div className="newsletter-content">
                    <h3 className="newsletter-title">✨ Stay in the Loop</h3>
                    <p className="newsletter-description">
                        Get weekly updates with exclusive stories, writing tips, and behind-the-scenes notes. Join over 2.4k creative minds.
                    </p>
                </div>
                <form onSubmit={handleSubscribe} className="newsletter-form">
                    <motion.input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="newsletter-input"
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <motion.button
                        type="submit"
                        disabled={loading}
                        className="newsletter-button"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {loading ? 'Subscribing...' : 'Subscribe'}
                    </motion.button>
                </form>
            </div>

            {/* Message Display */}
            {message && (
                <motion.div
                    className={`newsletter-message ${messageType}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {message}
                </motion.div>
            )}
        </motion.div>
    )
}

export default NewsletterSection
