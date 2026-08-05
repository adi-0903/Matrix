import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from '../icons'
import api from '../api'

const Pricing = () => {
    const [selectedPlanModal, setSelectedPlanModal] = useState(null)
    const [currentPlan, setCurrentPlan] = useState('free')

    useEffect(() => {
        const fetchUserPlan = async () => {
            const token = localStorage.getItem('authToken')
            if (token) {
                try {
                    const user = await api.auth.getUser()
                    if (user?.subscription_plan) {
                        setCurrentPlan(user.subscription_plan.toLowerCase())
                    }
                } catch (e) {
                    console.error('Failed to fetch user plan:', e)
                }
            }
        }
        fetchUserPlan()
    }, [])

    const handleSelectPlan = (planName) => {
        const lowerName = planName.toLowerCase()
        if (lowerName === currentPlan) {
            alert(`You are currently on the ${planName} plan!`)
            return
        }
        if (lowerName === 'free') {
            alert('You are on the Free plan.')
            return
        }
        setSelectedPlanModal(planName)
    }

    const [enterpriseMonths, setEnterpriseMonths] = useState(1)

    const tiers = [
        {
            name: 'Free',
            price: '$0',
            period: 'forever',
            description: 'Start crafting stories with our core toolkit.',
            features: ['3 public drafts', 'Basic themes', 'Community access', 'Weekly inspiration digest'],
            cta: 'Get Started Free',
            popular: false,
        },
        {
            name: 'Creator',
            price: '$9',
            period: '/month',
            description: 'For independent writers & daily bloggers wanting more reach.',
            features: ['10 blogs per month', 'Unlimited drafts', 'Premium themes', 'Advanced motion presets', 'Private drops', 'Priority support'],
            cta: 'Activate Creator',
            popular: false,
        },
        {
            name: 'Studio',
            price: '$19',
            period: '/month',
            description: 'Collaborative teams with cinematic editing and high-volume limits.',
            features: ['Everything in Creator', '25 blogs per month', 'Team workspaces', 'Live review lanes', 'Custom audio beds', 'API access'],
            cta: 'Activate Studio',
            popular: true,
        },
        {
            name: 'Enterprise',
            price: '$39',
            period: '/month',
            description: 'Bespoke setups for large editorial teams and heavy publishers.',
            features: ['Everything in Studio', '30 blogs per month', 'Flexible multi-month duration', 'SSO & SAML', 'Dedicated infrastructure', 'Custom contracts'],
            cta: 'Activate Enterprise',
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
                            className={`pricing-card ${tier.popular ? 'popular' : ''} ${currentPlan === tier.name.toLowerCase() ? 'active-tier' : ''}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            whileHover={{ y: -6, scale: 1.02 }}
                            style={currentPlan === tier.name.toLowerCase() ? {
                                border: '2px solid var(--aqua)',
                                boxShadow: '0 0 30px rgba(106, 233, 193, 0.25)'
                            } : {}}
                        >
                            {currentPlan === tier.name.toLowerCase() ? (
                                <div className="popular-badge" style={{ background: 'linear-gradient(135deg, var(--aqua), #128C7E)', color: '#000', fontWeight: 'bold' }}>
                                    ✓ Active Plan
                                </div>
                            ) : (
                                tier.popular && <div className="popular-badge">Most popular</div>
                            )}

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
                            
                            {currentPlan === tier.name.toLowerCase() ? (
                                <button 
                                    className="wide primary"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(106, 233, 193, 0.2), rgba(106, 233, 193, 0.05))',
                                        border: '1px solid var(--aqua)',
                                        color: '#67e5d4',
                                        fontWeight: '700',
                                        cursor: 'default'
                                    }}
                                    disabled
                                >
                                    ✦ CURRENT PLAN
                                </button>
                            ) : (
                                <button 
                                    className={`wide ${tier.popular ? 'primary' : 'ghost'}`}
                                    onClick={() => handleSelectPlan(tier.name)}
                                >
                                    {tier.cta}
                                </button>
                            )}
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

            {/* Payment & Activation Contact Modal */}
            {selectedPlanModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#0d0d12',
                        border: '1px solid rgba(200, 181, 255, 0.3)',
                        borderRadius: '24px',
                        padding: '32px',
                        maxWidth: '480px',
                        width: '100%',
                        color: '#fff',
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{
                            margin: '0 0 12px 0',
                            fontSize: '1.8rem',
                            background: 'linear-gradient(135deg, var(--aqua), var(--lavender))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Activate {selectedPlanModal} Plan
                        </h2>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                            To complete your purchase and activate your <strong>{selectedPlanModal}</strong> subscription, please reach out to our admin team. After verifying payment, your account will be upgraded instantly from the admin dashboard!
                        </p>

                        {selectedPlanModal === 'Enterprise' && (
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', color: 'var(--lavender)', fontWeight: '600' }}>
                                    Select Subscription Duration:
                                </label>
                                <select 
                                    value={enterpriseMonths} 
                                    onChange={(e) => setEnterpriseMonths(Number(e.target.value))}
                                    style={{
                                        width: '100%',
                                        padding: '12px 14px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.08)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: '#fff',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        marginBottom: '12px'
                                    }}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                                        <option key={m} value={m} style={{ background: '#0d0d12', color: '#fff' }}>
                                            {m} {m === 1 ? 'Month' : 'Months'} ($39/mo)
                                        </option>
                                    ))}
                                </select>

                                {/* Calculated Price Box */}
                                <div style={{
                                    padding: '14px 18px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(111, 66, 193, 0.15), rgba(106, 233, 193, 0.15))',
                                    border: '1px solid rgba(200, 181, 255, 0.3)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block' }}>Total Investment</span>
                                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#67e5d4' }}>
                                            ${39 * enterpriseMonths}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', marginLeft: '6px' }}>
                                            for {enterpriseMonths} {enterpriseMonths === 1 ? 'month' : 'months'}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        background: 'rgba(106, 233, 193, 0.2)',
                                        color: '#34c759',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontWeight: '600'
                                    }}>
                                        30 Blogs / mo
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            <a 
                                href={`https://wa.me/917009812679?text=Hi!%20I%20want%20to%20activate%20the%20${selectedPlanModal}%20plan%20for%20${selectedPlanModal === 'Enterprise' ? enterpriseMonths + '%20months' : '1%20month'}%20for%20my%20account.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #25D366, #128C7E)',
                                    color: '#fff',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                💬 Contact via WhatsApp (+91 7009812679)
                            </a>
                            <a 
                                href={`mailto:singhaladitya611@gmail.com?subject=Subscription%20Activation%20Request%20(${selectedPlanModal}%20-${selectedPlanModal === 'Enterprise' ? enterpriseMonths + 'months' : '1month'})`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    padding: '14px',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    color: '#fff',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    fontSize: '1rem'
                                }}
                            >
                                ✉️ Email Admin (singhaladitya611@gmail.com)
                            </a>
                        </div>

                        <button
                            type="button"
                            onClick={() => setSelectedPlanModal(null)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '12px',
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                color: 'var(--muted)',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Close Window
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Pricing
