import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Grid from '../components/Grid'
import Sidebar from '../components/Sidebar'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'
import api from '../api'

const Home = () => {
    const [featuredPosts, setFeaturedPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFeaturedPosts()
    }, [])

    const fetchFeaturedPosts = async () => {
        try {
            const response = await api.blog.getPosts({ is_featured: true, status: 'published' })
            setFeaturedPosts(response.results || response)
        } catch (err) {
            console.error('Failed to fetch featured posts:', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Hero />
            <Marquee />

            <section className="layout">
                <div className="main-column">
                    <Grid featuredPosts={featuredPosts} loading={loading} />
                </div>
                <Sidebar featuredPosts={featuredPosts} loading={loading} />
            </section>

            <NewsletterSection />
            <Footer />
        </>
    )
}

export default Home
