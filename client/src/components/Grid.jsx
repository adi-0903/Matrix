import { motion } from 'framer-motion'
import { ArrowRight } from '../icons'
import SectionHeading from './SectionHeading'

const posts = [
    {
        title: 'Sculpting stories with negative space',
        tag: 'Design',
        excerpt: 'How to let silence do the heavy lifting in your visual narratives.',
        date: 'Jan 03',
    },
    {
        title: 'Night markets & neon poems',
        tag: 'Travel',
        excerpt: 'Fragments from a 2am notebook somewhere in Taipei.',
        date: 'Dec 29',
    },
    {
        title: 'The shape of listening',
        tag: 'Culture',
        excerpt: 'On conversations that feel like jazz improvisations.',
        date: 'Dec 21',
    },
    {
        title: 'Windproof ideas for stormy days',
        tag: 'Opinion',
        excerpt: 'Keeping your creative flame alive when the weather disagrees.',
        date: 'Dec 15',
    },
]

const Grid = () => (
    <section className="grid">
        <SectionHeading label="Latest" title="Fresh from the journal" />
        <div className="post-grid">
            {posts.map((post, i) => (
                <motion.article
                    key={post.title}
                    className="post-card"
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    viewport={{ once: true, margin: '-80px' }}
                >
                    <div className="pill small">{post.tag}</div>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="meta">
                        <span>{post.date}</span>
                        <ArrowRight />
                    </div>
                </motion.article>
            ))}
        </div>
    </section>
)

export default Grid
