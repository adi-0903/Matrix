import { motion } from 'framer-motion'
import { CheckCircle } from '../icons'

const Pricing = () => {
    const tiers = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Start crafting stories with our core toolkit.',
            features: ['3 public drafts', 'Basic themes', 'Community access', 'Weekly inspiration digest'],
            cta: 'Start free',
            popular: false,
        },
        {
            name: 'Creator',
            price: '$12',
            period: '/month',
            description: 'For writers who publish regularly and want more atmosphere.',
            features: ['Unlimited drafts', 'Premium themes', 'Advanced motion presets', 'Private drops', 'Priority support'],
            cta: 'Start trial',
            popular: true,
        },
        {
            name: 'Studio',
            price: '$28',
            period: '/month',
            description: 'Collaborative teams with cinematic editing and review lanes.',
            features: ['Everything in Creator', 'Team workspaces', 'Live review lanes', 'Custom audio beds', 'API access'],
            cta: 'Start trial',
            popular: false,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'Bespoke setups for large editorial teams and publications.',
            features: ['Everything in Studio', 'SSO & SAML', 'Dedicated infrastructure', 'Custom contracts', 'White‑label options'],
            cta: 'Contact sales',
            popular: false,
        },
    ]

    return (
        <div className="pricing-page">
            <div className="pricing-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>
            <motion.div
                className="pricing-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="pricing-header">
                    <div className="pill">Pricing</div>
                    <h1>Choose your flow</h1>
                    <p>Whether you're sketching ideas or running a full editorial studio, Mind Matrix scales with your craft.</p>
                </div>
                <div className="pricing-grid">
                    {tiers.map((tier, i) => (
                        <motion.div
                            key={tier.name}
                            className={`pricing-card ${tier.popular ? 'popular' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                        >
                            {tier.popular && <div className="popular-badge">Most popular</div>}
                            <div className="pricing-top">
                                <h3>{tier.name}</h3>
                                <div className="price">
                                    <span className="amount">{tier.price}</span>
                                    {tier.period && <span className="period">{tier.period}</span>}
                                </div>
                            </div>
                            <p className="pricing-desc">{tier.description}</p>
                            <ul className="pricing-features">
                                {tier.features.map((feat) => (
                                    <li key={feat}>
                                        <CheckCircle />
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className={`wide ${tier.popular ? 'primary' : 'ghost'}`}>
                                {tier.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
                <div className="pricing-footer">
                    <p>All plans include core Mind Matrix features. Cancel anytime.</p>
                    <div className="footer-links">
                        <span>Need help?</span>
                        <a href="#" className="link-strong">Browse docs</a>
                        <a href="#" className="link-strong">Chat support</a>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Pricing
