import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from '../icons'
import SectionHeading from '../components/SectionHeading'
import Footer from '../components/Footer'
import api from '../api'

const Events = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const response = await api.blog.getEvents()
            setEvents(response.results || response)
        } catch (err) {
            setError(err.message || 'Failed to load events')
            console.error('Fetch events error:', err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatTime = (timeString) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const getGradient = (eventType) => {
        const gradients = {
            'workshop': 'linear-gradient(135deg, rgba(255, 177, 71, 0.2), rgba(255, 87, 34, 0.1))',
            'masterclass': 'linear-gradient(135deg, rgba(99, 221, 190, 0.2), rgba(76, 175, 215, 0.1))',
            'meetup': 'linear-gradient(135deg, rgba(181, 169, 255, 0.2), rgba(120, 88, 255, 0.1))',
            'webinar': 'linear-gradient(135deg, rgba(255, 107, 129, 0.2), rgba(255, 64, 129, 0.1))',
        }
        return gradients[eventType] || gradients['workshop']
    }

    const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date)
        const today = new Date()
        return eventDate >= today
    })

    const pastEvents = events.filter(event => {
        const eventDate = new Date(event.date)
        const today = new Date()
        return eventDate < today
    })

    if (loading) {
        return (
            <div className="events-page">
                <div className="events-aurora">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading events...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="events-page">
                <div className="events-aurora">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                </div>
                <div className="error-container">
                    <p className="error-message">{error}</p>
                    <button onClick={fetchEvents} className="retry-button">Try Again</button>
                </div>
            </div>
        )
    }

    return (
        <div className="events-page">
            <div className="events-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <motion.div
                className="events-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="pill">
                    <Sparkles />
                    <span>Events</span>
                </div>
                <h1>Workshops & Meetups</h1>
                <p>Join our community events, workshops, and creative gatherings</p>
            </motion.div>

            <div className="events-content">
                {/* Upcoming Events */}
                <section className="upcoming-events">
                    <h2>Upcoming Events</h2>
                    {upcomingEvents.length === 0 ? (
                        <p>No upcoming events at the moment.</p>
                    ) : (
                        <div className="events-grid">
                            {upcomingEvents.map((event, i) => (
                                <motion.article
                                    key={event.id}
                                    className="event-card"
                                    style={{ background: getGradient(event.event_type) }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                >
                                    <div className="event-header">
                                        <span className="event-type">{event.event_type}</span>
                                        <span className="event-date">{formatDate(event.date)}</span>
                                    </div>
                                    <h3>{event.title}</h3>
                                    <p className="event-description">{event.description}</p>
                                    <div className="event-details">
                                        <span className="event-time">
                                            {formatTime(event.time)}{event.end_time ? ` - ${formatTime(event.end_time)}` : ''}
                                        </span>
                                        <span className="event-location">
                                            {event.is_virtual ? 'Virtual' : event.location}
                                        </span>
                                    </div>
                                    <div className="event-footer">
                                        <span className="event-price">
                                            {event.is_free ? 'Free' : `$${event.price}`}
                                        </span>
                                        {event.spots_left !== null && (
                                            <span className="event-spots">
                                                {event.spots_left} spots left
                                            </span>
                                        )}
                                        <button className="event-action">
                                            Register
                                            <ArrowRight />
                                        </button>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </section>

                {/* Past Events */}
                {pastEvents.length > 0 && (
                    <section className="past-events">
                        <h2>Past Events</h2>
                        <div className="events-grid">
                            {pastEvents.map((event, i) => (
                                <motion.article
                                    key={event.id}
                                    className="event-card past"
                                    style={{ background: 'rgba(128, 128, 128, 0.1)' }}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                >
                                    <div className="event-header">
                                        <span className="event-type">{event.event_type}</span>
                                        <span className="event-date">{formatDate(event.date)}</span>
                                    </div>
                                    <h3>{event.title}</h3>
                                    <p className="event-description">{event.description}</p>
                                    <div className="event-footer">
                                        <span className="event-attendees">
                                            {event.attendees_count || 0} attendees
                                        </span>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default Events
