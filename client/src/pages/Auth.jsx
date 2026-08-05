import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { User, Mail, Lock } from '../icons'
import api from '../api'

const Auth = ({ mode, setIsAuthenticated }) => {
    const isSignIn = mode === 'signin'
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        first_name: '',
        last_name: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showTermsModal, setShowTermsModal] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const processSubmit = async () => {
        setLoading(true)
        setError('')

        try {
            if (isSignIn) {
                // Sign in
                const response = await api.auth.login({
                    email: formData.email,
                    password: formData.password
                })
                
                // Store tokens
                localStorage.setItem('authToken', response.access)
                localStorage.setItem('refreshToken', response.refresh)
                
                if (setIsAuthenticated) setIsAuthenticated(true)
                
                // Redirect to home page
                navigate('/')
            } else {
                // Sign up
                const response = await api.auth.register({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    password_confirm: formData.password_confirm,
                    first_name: formData.first_name,
                    last_name: formData.last_name
                })
                
                // After successful registration, sign in to get tokens
                const loginResponse = await api.auth.login({
                    email: formData.email,
                    password: formData.password
                })
                
                // Store tokens
                localStorage.setItem('authToken', loginResponse.access)
                localStorage.setItem('refreshToken', loginResponse.refresh)
                
                if (setIsAuthenticated) setIsAuthenticated(true)
                
                // Redirect to home page
                navigate('/')
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please try again.')
            console.error('Auth error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (isSignIn) {
            processSubmit()
        } else {
            if (formData.password !== formData.password_confirm) {
                setError('Passwords do not match.')
                return
            }
            if (!termsAccepted) {
                setShowTermsModal(true)
            } else {
                processSubmit()
            }
        }
    }

    const handleAcceptTerms = () => {
        setTermsAccepted(true)
        setShowTermsModal(false)
        processSubmit()
    }

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true)
        setError('')
        try {
            const response = await api.auth.googleLogin(credentialResponse.credential)
            localStorage.setItem('authToken', response.access)
            localStorage.setItem('refreshToken', response.refresh)
            if (setIsAuthenticated) setIsAuthenticated(true)
            navigate('/')
        } catch (err) {
            setError(err.message || 'Google authentication failed. Please try again.')
            console.error('Google Auth error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleError = () => {
        setError('Google authentication was unsuccessful.')
    }

    return (
        <div className="auth-page">
            <div className="auth-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="auth-top">
                    <h2>{isSignIn ? 'Welcome back' : 'Join Mind Matrix'}</h2>
                    <p>{isSignIn ? 'Sign in to continue' : 'Create your account to start writing'}</p>
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message" style={{
                            backgroundColor: 'rgba(255, 59, 48, 0.1)',
                            border: '1px solid rgba(255, 59, 48, 0.3)',
                            color: '#ff3b30',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}
                    {!isSignIn && (
                        <>
                            <label className="field">
                                <span>
                                    <User />
                                    Username
                                </span>
                                <input 
                                    type="text" 
                                    name="username"
                                    placeholder="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <label className="field" style={{ flex: 1 }}>
                                    <span>
                                        <User />
                                        First Name
                                    </span>
                                    <input 
                                        type="text" 
                                        name="first_name"
                                        placeholder="First"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                                <label className="field" style={{ flex: 1 }}>
                                    <span>
                                        <User />
                                        Last Name
                                    </span>
                                    <input 
                                        type="text" 
                                        name="last_name"
                                        placeholder="Last"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </label>
                            </div>
                        </>
                    )}
                    <label className="field">
                        <span>
                            <Mail />
                            Email
                        </span>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label className="field">
                        <span>
                            <Lock />
                            Password
                        </span>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="•••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    {!isSignIn && (
                        <label className="field">
                            <span>
                                <Lock />
                                Confirm Password
                            </span>
                            <input 
                                type="password" 
                                name="password_confirm"
                                placeholder="•••••••••"
                                value={formData.password_confirm}
                                onChange={handleChange}
                                required
                            />
                        </label>
                    )}
                    {isSignIn && (
                        <div className="form-row">
                            <label className="checkbox">
                                <input type="checkbox" /> <span>Remember me</span>
                            </label>
                            <button 
                                type="button" 
                                className="forgot-password-btn"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}
                    {!isSignIn && (
                        <label className="checkbox" style={{ userSelect: 'none' }}>
                            <input 
                                type="checkbox" 
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            /> 
                            <span>
                                I agree to the{' '}
                                <button 
                                    type="button"
                                    className="terms-link-btn" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowTermsModal(true);
                                    }}
                                >
                                    Terms and Conditions
                                </button>
                            </span>
                        </label>
                    )}
                    <button 
                        type="submit" 
                        className="primary wide"
                        disabled={loading}
                    >
                        {loading ? (isSignIn ? 'Signing in...' : 'Creating account...') : (isSignIn ? 'Sign in' : 'Create account')}
                    </button>
                    <div className="splitter">
                        <span />
                        <p>or</p>
                        <span />
                    </div>
                    <div className="social-row" style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="outline"
                            size="large"
                            text={isSignIn ? "signin_with" : "signup_with"}
                            shape="rectangular"
                        />
                    </div>
                </form>

                <div className="auth-footer">
                    {isSignIn ? (
                        <>
                            <span>No account?</span>
                            <Link to="/signup" className="link-strong">
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            <span>Already have an account?</span>
                            <Link to="/signin" className="link-strong">
                                Sign in
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {showTermsModal && (
                    <div className="modal-overlay">
                        <motion.div 
                            className="modal-card"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="modal-header">
                                <h3>Terms & Conditions</h3>
                                <button type="button" className="modal-close-btn" onClick={() => setShowTermsModal(false)}>×</button>
                            </div>
                            <div className="modal-body">
                                <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>Last updated: June 14, 2026</p>
                                <p>Welcome to Mind Matrix. By creating an account or using our platform, you agree to be bound by these Terms of Service. Please read them carefully.</p>
                                
                                <h4>1. Acceptance of Terms</h4>
                                <p>By accessing or using Mind Matrix, you agree to comply with and be bound by these Terms. If you do not agree, you may not access or use the platform.</p>
                                
                                <h4>2. User Accounts & Security</h4>
                                <ul>
                                    <li>You must provide accurate, current, and complete information during registration.</li>
                                    <li>You are solely responsible for maintaining the confidentiality of your account credentials.</li>
                                    <li>You agree to notify us immediately of any unauthorized use of your account.</li>
                                </ul>
                                
                                <h4>3. Content Creation & Intellectual Property</h4>
                                <ul>
                                    <li>You retain ownership of any content (articles, journals, comments) you publish on Mind Matrix.</li>
                                    <li>By publishing content, you grant Mind Matrix a non-exclusive, worldwide, royalty-free license to host, display, and distribute your content.</li>
                                    <li>You represent that you own or have the necessary rights to all content you publish, and that it does not violate any third-party rights.</li>
                                </ul>
                                
                                <h4>4. User Conduct</h4>
                                <p>You agree not to publish any content or engage in behavior that is defamatory, abusive, harassing, threatening, infringing on intellectual property, or violating any local, national, or international laws.</p>
                                
                                <h4>5. Subscription & Payment</h4>
                                <p>Certain features of Mind Matrix require a premium subscription. All payments are non-refundable unless specified otherwise. We reserve the right to change our pricing upon notice.</p>
                                
                                <h4>6. Limitation of Liability</h4>
                                <p>Mind Matrix is provided "as is" without warranty of any kind. In no event shall we be liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
                                
                                <h4>7. Termination</h4>
                                <p>We reserve the right to suspend or terminate your account at our sole discretion, without notice, if we believe you have breached these Terms.</p>
                            </div>
                            <div className="modal-footer">
                                <label className="modal-checkbox">
                                    <input 
                                        type="checkbox" 
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                    />
                                    <span>I have read, understood and agree to the Terms and Conditions.</span>
                                </label>
                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="ghost" 
                                        onClick={() => setShowTermsModal(false)}
                                    >
                                        Decline
                                    </button>
                                    <button 
                                        type="button" 
                                        className="primary" 
                                        disabled={!termsAccepted}
                                        onClick={handleAcceptTerms}
                                    >
                                        Accept & Continue
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Auth


