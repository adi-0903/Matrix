import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, PenNib, Waves } from '../icons'
import SectionHeading from './SectionHeading'

const Sidebar = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const toolItems = [
        {
            icon: <BookOpen />,
            title: 'Story seeds',
            description: 'Prompts that bend into essays.',
        },
        {
            icon: <PenNib />,
            title: 'Draft studio',
            description: 'Focus mode with ambient audio.',
        },
        {
            icon: <Waves />,
            title: 'Motion notes',
            description: 'Annotate with moving highlights.',
        },
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    }

    const iconVariants = {
        rest: { scale: 1, rotate: 0 },
        hover: { scale: 1.1, rotate: 5 },
    }

    const arrowVariants = {
        rest: { x: 0, opacity: 0.5 },
        hover: { x: 4, opacity: 1 },
    }

    return (
        <aside className="sidebar">
            <motion.div
                className="glass"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <SectionHeading label="Toolkit" title="Writer utilities" />
                <motion.ul
                    className="tool-list"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {toolItems.map((item, index) => (
                        <motion.li
                            key={index}
                            variants={itemVariants}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            animate={hoveredIndex === index ? 'hover' : 'rest'}
                        >
                            <motion.div
                                className="icon"
                                variants={iconVariants}
                            >
                                {item.icon}
                            </motion.div>
                            <div>
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </div>
                            <motion.div
                                variants={arrowVariants}
                                style={{ display: 'flex' }}
                            >
                                <ArrowRight />
                            </motion.div>
                        </motion.li>
                    ))}
                </motion.ul>

                {/* Decorative animated elements */}
                <motion.div
                    className="sidebar-decoration"
                    animate={{
                        y: [0, -8, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>
        </aside>
    )
}

export default Sidebar
