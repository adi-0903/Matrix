import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/Footer'
import api from '../api'

// Custom high-fidelity inline SVG icons
const LocationIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l1.83-1.83a4 4 0 0 0-5.66-5.66l-.88.88" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-1.83 1.83a4 4 0 0 0 5.66 5.66l.88-.88" />
  </svg>
)

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
)

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
)

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" x2="9" y1="12" y2="12" />
  </svg>
)

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
)

const BookOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
)

const WavesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.6 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </svg>
)

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

// Pure helper function relocated outside the component scope
const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
        return avatarPath
    }
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
    const backendRoot = apiBase.replace('/api', '')
    return `${backendRoot}${avatarPath}`
}

const getInitials = (user) => {
    if (!user) return '?'
    if (user.first_name || user.last_name) {
        return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
    }
    return user.username?.substring(0, 2).toUpperCase() || '?'
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const Profile = ({ onProfileUpdate }) => {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [saveLoading, setSaveLoading] = useState(false)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('articles')
    const [isEditing, setIsEditing] = useState(false)
    
    // File upload state
    const [selectedFile, setSelectedFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)

    const [editForm, setEditForm] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        location: '',
        website: '',
        twitter: '',
        github: ''
    })

    const fetchUserPosts = useCallback(async (userId) => {
        try {
            const response = await api.blog.getPosts({ author: userId })
            const data = response?.results || response
            setPosts(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('Failed to fetch user posts:', err)
        }
    }, [])

    const fetchUserProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('authToken')
            if (!token) {
                navigate('/signin')
                return
            }

            const response = await api.auth.getUser()
            setUser(response)
            setEditForm({
                first_name: response.first_name || '',
                last_name: response.last_name || '',
                bio: response.bio || '',
                location: response.location || '',
                website: response.website || '',
                twitter: response.twitter || '',
                github: response.github || ''
            })
            
            if (response?.id) {
                fetchUserPosts(response.id)
            }
        } catch (err) {
            setError('Failed to load profile settings.')
            console.error('Profile fetch error:', err)
        } finally {
            setLoading(false)
        }
    }, [navigate, fetchUserPosts])

    useEffect(() => {
        fetchUserProfile()
    }, [fetchUserProfile])

    const handleEditToggle = () => {
        setIsEditing(!isEditing)
        setSelectedFile(null)
        setAvatarPreview(null)
        if (user) {
            setEditForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                bio: user.bio || '',
                location: user.location || '',
                website: user.website || '',
                twitter: user.twitter || '',
                github: user.github || ''
            })
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setSaveLoading(true)
        setError('')

        try {
            let data
            if (selectedFile) {
                data = new FormData()
                data.append('first_name', editForm.first_name)
                data.append('last_name', editForm.last_name)
                data.append('bio', editForm.bio)
                data.append('location', editForm.location)
                data.append('website', editForm.website)
                data.append('twitter', editForm.twitter)
                data.append('github', editForm.github)
                data.append('avatar', selectedFile)
            } else {
                data = editForm
            }

            const response = await api.auth.updateUser(data)
            setUser(response)
            onProfileUpdate?.(response)
            setIsEditing(false)
            setSelectedFile(null)
            setAvatarPreview(null)
        } catch (err) {
            setError('Failed to update profile. Please verify your fields.')
            console.error('Profile update error:', err)
        } finally {
            setSaveLoading(false)
        }
    }

    const handleSignOut = () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        navigate('/')
        window.location.reload()
    }

    if (loading && !user) {
        return (
            <div className="profile-page">
                <div className="profile-loading-wrapper">
                    <div className="premium-spinner"></div>
                    <p className="loading-text">Synchronizing Mind Matrix Profile...</p>
                </div>
            </div>
        )
    }

    const blogs = posts.filter(p => p.post_type === 'blog')
    const journals = posts.filter(p => p.post_type === 'journal')

    const profileAvatar = avatarPreview || getAvatarUrl(user?.avatar)

    return (
        <div className="profile-page">
            {/* Elegant Background Blobs */}
            <div className="profile-aurora">
                <div className="orb orb-1" />
                <div className="orb orb-2" />
                <div className="orb orb-3" />
            </div>

            <motion.div
                className="profile-container-premium"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Premium Abstract Cover Banner */}
                <div className="profile-cover-banner">
                    <div className="cover-mesh" />
                    <div className="cover-badge">
                        <span className="pulse-dot" /> Creative Core Active
                    </div>
                </div>

                {/* Main Profile Info Card */}
                <div className="profile-info-card-premium">
                    <div className="profile-header-main">
                        {/* Avatar Column */}
                        <div className="avatar-column">
                            {isEditing ? (
                                <button 
                                    type="button"
                                    className="avatar-container-glowing editable-mode"
                                    onClick={triggerFileInput}
                                    aria-label="Change profile avatar"
                                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    {profileAvatar ? (
                                        <img src={profileAvatar} alt="Avatar" className="avatar-img-premium" />
                                    ) : (
                                        <div className="avatar-fallback-initials">
                                            {getInitials(user)}
                                        </div>
                                    )}
                                    <div className="avatar-upload-overlay">
                                        <UploadIcon />
                                        <span>Change Avatar</span>
                                    </div>
                                </button>
                            ) : (
                                <div className="avatar-container-glowing">
                                    {profileAvatar ? (
                                        <img src={profileAvatar} alt="Avatar" className="avatar-img-premium" />
                                    ) : (
                                        <div className="avatar-fallback-initials">
                                            {getInitials(user)}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Hidden file input */}
                            <input 
                                type="file" 
                                id="avatar-file-input"
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                                onChange={handleFileChange}
                                aria-label="Upload profile avatar"
                            />
                        </div>

                        {/* Name and Meta Column */}
                        <div className="meta-details-column">
                            <div className="name-title-row">
                                <h1 className="display-name">{user?.full_name || user?.username}</h1>
                                <span className="verified-badge" title="Verified Creator">✦</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                                <p className="username-handle" style={{ margin: 0 }}>@{user?.username}</p>
                                {user?.uid && (
                                    <button
                                        type="button"
                                        title="Click to copy your unique UID"
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.uid)
                                            alert(`Copied your unique UID: ${user.uid}`)
                                        }}
                                        style={{
                                            background: 'rgba(106, 233, 193, 0.15)',
                                            border: '1px solid rgba(106, 233, 193, 0.3)',
                                            borderRadius: '8px',
                                            padding: '2px 10px',
                                            color: 'var(--aqua)',
                                            fontSize: '0.8rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        🆔 UID: {user.uid} 📋
                                    </button>
                                )}
                            </div>

                            {/* Subscription Plan Badge & Expiration Info */}
                            <div style={{
                                margin: '12px 0 16px 0',
                                padding: '10px 16px',
                                borderRadius: '12px',
                                background: user?.subscription_plan && user.subscription_plan !== 'free'
                                    ? 'linear-gradient(135deg, rgba(106, 233, 193, 0.12), rgba(200, 181, 255, 0.12))'
                                    : 'rgba(255, 255, 255, 0.04)',
                                border: user?.subscription_plan && user.subscription_plan !== 'free'
                                    ? '1px solid rgba(200, 181, 255, 0.3)'
                                    : '1px solid rgba(255, 255, 255, 0.1)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '1.1rem' }}>
                                        {user?.subscription_plan === 'creator' && '⚡'}
                                        {user?.subscription_plan === 'studio' && '🚀'}
                                        {user?.subscription_plan === 'enterprise' && '👑'}
                                        {(user?.subscription_plan === 'free' || !user?.subscription_plan) && '🌱'}
                                    </span>
                                    <span style={{
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        fontSize: '0.85rem',
                                        letterSpacing: '0.05em',
                                        color: user?.subscription_plan && user.subscription_plan !== 'free' ? '#c8b5ff' : 'var(--muted)'
                                    }}>
                                        {(user?.subscription_plan || 'free')} Plan
                                    </span>
                                </div>

                                {user?.subscription_start_date && user?.subscription_end_date && user.subscription_plan !== 'free' ? (
                                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                                        <span>• Start: {formatDate(user.subscription_start_date)}</span>
                                        <span>• Expires: <strong style={{ color: '#67e5d4' }}>{formatDate(user.subscription_end_date)}</strong></span>
                                    </div>
                                ) : (
                                    <Link to="/pricing" style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--aqua)',
                                        fontWeight: '600',
                                        textDecoration: 'none',
                                        marginLeft: '4px'
                                    }}>
                                        Upgrade Plan →
                                    </Link>
                                )}
                            </div>
                            
                            <p className="bio-description-text">
                                {user?.bio || 'No transmission recorded yet. Write a bio in Settings.'}
                            </p>

                            {/* Clean Social Grid */}
                            <div className="social-links-capsule-row">
                                {user?.website && (
                                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="social-capsule-btn" title="Personal Website">
                                        <LinkIcon />
                                        <span>Website</span>
                                    </a>
                                )}
                                {user?.twitter && (
                                    <a href={`https://twitter.com/${user.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="social-capsule-btn" title="Twitter Profile">
                                        <TwitterIcon />
                                        <span>Twitter</span>
                                    </a>
                                )}
                                {user?.github && (
                                    <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="social-capsule-btn" title="GitHub Profile">
                                        <GithubIcon />
                                        <span>GitHub</span>
                                    </a>
                                )}
                                <a href={`mailto:${user?.email}`} className="social-capsule-btn" title="Direct Email">
                                    <MailIcon />
                                    <span>Contact</span>
                                </a>
                            </div>
                        </div>

                        {/* Stats Dashboard Grid */}
                        <div className="stats-dashboard-column">
                            <div className="stats-grid-dashboard">
                                <motion.div 
                                    className="stat-card-dashboard"
                                    whileHover={{ y: -4, borderColor: 'rgba(200, 181, 255, 0.3)' }}
                                >
                                    <BookOpenIcon />
                                    <span className="dashboard-stat-val">{blogs.length}</span>
                                    <span className="dashboard-stat-lbl">Blogs</span>
                                </motion.div>
                                
                                <motion.div 
                                    className="stat-card-dashboard"
                                    whileHover={{ y: -4, borderColor: 'rgba(106, 233, 193, 0.3)' }}
                                >
                                    <WavesIcon />
                                    <span className="dashboard-stat-val">{journals.length}</span>
                                    <span className="dashboard-stat-lbl">Journals</span>
                                </motion.div>

                                <motion.div 
                                    className="stat-card-dashboard"
                                    whileHover={{ y: -4, borderColor: 'rgba(255, 179, 71, 0.3)' }}
                                >
                                    <UsersIcon />
                                    <span className="dashboard-stat-val">{user?.followers_count || 0}</span>
                                    <span className="dashboard-stat-lbl">Followers</span>
                                </motion.div>

                                <motion.div 
                                    className="stat-card-dashboard"
                                    whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.2)' }}
                                >
                                    <UsersIcon />
                                    <span className="dashboard-stat-val">{user?.following_count || 0}</span>
                                    <span className="dashboard-stat-lbl">Following</span>
                                </motion.div>
                            </div>

                            {/* Header Buttons */}
                            <div className="profile-actions-wrapper">
                                <button type="button" onClick={handleEditToggle} className="premium-btn-primary" aria-label={isEditing ? 'Cancel Edit' : 'Edit Profile'}>
                                    <EditIcon />
                                    <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                                </button>
                                <button type="button" onClick={handleSignOut} className="premium-btn-ghost" aria-label="Sign Out">
                                    <LogOutIcon />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <motion.div 
                        className="profile-error-alert"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <span>⚠️ {error}</span>
                    </motion.div>
                )}

                {/* Editing Form Panel */}
                {isEditing ? (
                    <motion.div 
                        className="settings-form-panel"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="panel-header">
                            <h2>Profile Configurations</h2>
                            <p>Customize your identity inside the Mind Matrix</p>
                        </div>
                        
                        <form onSubmit={handleSaveProfile} className="settings-form-element">
                            <div className="form-double-col">
                                <div className="form-group-premium">
                                    <label htmlFor="first_name">First Name</label>
                                    <div className="input-wrapper-glass">
                                        <input 
                                            type="text" 
                                            id="first_name"
                                            name="first_name" 
                                            value={editForm.first_name} 
                                            onChange={handleInputChange}
                                            placeholder="Enter first name"
                                            aria-label="First Name"
                                        />
                                    </div>
                                </div>
                                <div className="form-group-premium">
                                    <label htmlFor="last_name">Last Name</label>
                                    <div className="input-wrapper-glass">
                                        <input 
                                            type="text" 
                                            id="last_name"
                                            name="last_name" 
                                            value={editForm.last_name} 
                                            onChange={handleInputChange}
                                            placeholder="Enter last name"
                                            aria-label="Last Name"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group-premium">
                                <label htmlFor="bio">Bio & Transmission</label>
                                <div className="input-wrapper-glass">
                                    <textarea 
                                        id="bio"
                                        name="bio" 
                                        value={editForm.bio} 
                                        onChange={handleInputChange}
                                        placeholder="Write something about your creative journey..."
                                        rows={4}
                                        aria-label="Bio & Transmission"
                                    />
                                </div>
                            </div>

                            <div className="form-double-col">
                                <div className="form-group-premium">
                                    <label htmlFor="location">Location</label>
                                    <div className="input-wrapper-glass">
                                        <input 
                                            type="text" 
                                            id="location"
                                            name="location" 
                                            value={editForm.location} 
                                            onChange={handleInputChange}
                                            placeholder="e.g. Neo-Tokyo, Japan"
                                            aria-label="Location"
                                        />
                                    </div>
                                </div>
                                <div className="form-group-premium">
                                    <label htmlFor="website">Website URL</label>
                                    <div className="input-wrapper-glass">
                                        <input 
                                            type="url" 
                                            id="website"
                                            name="website" 
                                            value={editForm.website} 
                                            onChange={handleInputChange}
                                            placeholder="https://yourdomain.com"
                                            aria-label="Website URL"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-double-col">
                                <div className="form-group-premium">
                                    <label htmlFor="twitter">Twitter Handle (without @)</label>
                                    <div className="input-wrapper-glass">
                                        <input 
                                            type="text" 
                                            id="twitter"
                                            name="twitter" 
                                            value={editForm.twitter} 
                                            onChange={handleInputChange}
                                            placeholder="twitter_username"
                                            aria-label="Twitter Handle"
                                        />
                                    </div>
                                </div>
                                <div className="form-group-premium">
                                    <label htmlFor="github">GitHub Username</label>
                                    <div className="input-wrapper-glass">
                                        <input 
                                            type="text" 
                                            id="github"
                                            name="github" 
                                            value={editForm.github} 
                                            onChange={handleInputChange}
                                            placeholder="github_username"
                                            aria-label="GitHub Username"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Avatar specific helper message */}
                            {selectedFile && (
                                <div className="upload-status-pill">
                                    <span>✓ Avatar Selected: <strong>{selectedFile.name}</strong></span>
                                </div>
                            )}

                            <div className="form-actions-premium">
                                <button type="submit" className="premium-btn-primary" disabled={saveLoading} aria-label="Save Settings">
                                    <span>{saveLoading ? 'Uploading...' : 'Save Settings'}</span>
                                </button>
                                <button type="button" onClick={handleEditToggle} className="premium-btn-ghost" aria-label="Cancel editing">
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <>
                        {/* Custom Tab Navigation Bar */}
                        <div className="profile-tabs-capsule-nav">
                            <button 
                                type="button"
                                className={`profile-capsule-tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
                                onClick={() => setActiveTab('articles')}
                            >
                                <span className="tab-icon">📝</span>
                                <span>My Blogs ({blogs.length})</span>
                            </button>
                            <button 
                                type="button"
                                className={`profile-capsule-tab-btn ${activeTab === 'journals' ? 'active' : ''}`}
                                onClick={() => setActiveTab('journals')}
                            >
                                <span className="tab-icon">📓</span>
                                <span>My Journals ({journals.length})</span>
                            </button>
                            <button 
                                type="button"
                                className={`profile-capsule-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                                onClick={() => setActiveTab('about')}
                            >
                                <span className="tab-icon">⚙️</span>
                                <span>About & Details</span>
                            </button>
                        </div>

                        {/* Tab Contents */}
                        <div className="tab-content-container-premium">
                            <AnimatePresence mode="wait">
                                {activeTab === 'articles' && (
                                    <motion.div 
                                        key="articles"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                        className="profile-posts-tab"
                                    >
                                        {blogs.length === 0 ? (
                                            <div className="premium-empty-state">
                                                <div className="empty-state-icon">📝</div>
                                                <p>You haven't broadcasts any blogs into the matrix yet.</p>
                                                <Link to="/blogs/new" className="premium-btn-primary mt-16" style={{ textDecoration: 'none' }}>
                                                    Publish A Blog
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="profile-posts-grid-premium">
                                                {blogs.map(post => (
                                                    <motion.div 
                                                        key={post.id} 
                                                        className="profile-post-card-premium"
                                                        whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}
                                                    >
                                                        <div className="card-top-category-row">
                                                            <span className="post-category-tag">{post.category?.name || 'Technology'}</span>
                                                            <span className={`post-badge-status ${post.status === 'published' ? 'published' : 'draft'}`}>
                                                                {post.status}
                                                            </span>
                                                        </div>

                                                        <h4 className="post-card-title">{post.title}</h4>
                                                        <p className="post-card-excerpt">{post.excerpt || 'No excerpt available for this post.'}</p>
                                                        
                                                        <div className="post-card-footer-meta">
                                                            <div className="meta-time">
                                                                <CalendarIcon />
                                                                <span>{formatDate(post.published_at || post.created_at)}</span>
                                                            </div>
                                                            <Link to={`/blogs/${post.slug}`} className="card-explore-btn">
                                                                Read →
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'journals' && (
                                    <motion.div 
                                        key="journals"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                        className="profile-posts-tab"
                                    >
                                        {journals.length === 0 ? (
                                            <div className="premium-empty-state">
                                                <div className="empty-state-icon">📓</div>
                                                <p>No journal transmissions recorded in this sector.</p>
                                                <Link to="/journal/new" className="premium-btn-primary mt-16" style={{ textDecoration: 'none' }}>
                                                    Write A Journal Entry
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="profile-posts-grid-premium">
                                                {journals.map(post => (
                                                    <motion.div 
                                                        key={post.id} 
                                                        className="profile-post-card-premium journal-style"
                                                        whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.5)' }}
                                                    >
                                                        <div className="card-top-category-row">
                                                            <span className="post-category-tag">{post.category?.name || 'Personal'}</span>
                                                            <span className={`post-badge-status ${post.status === 'published' ? 'published' : 'draft'}`}>
                                                                {post.status}
                                                            </span>
                                                        </div>

                                                        <h4 className="post-card-title">{post.title}</h4>
                                                        <p className="post-card-excerpt">{post.excerpt || 'No excerpt recorded.'}</p>
                                                        
                                                        <div className="post-card-footer-meta">
                                                            <div className="meta-time">
                                                                <CalendarIcon />
                                                                <span>{formatDate(post.published_at || post.created_at)}</span>
                                                            </div>
                                                            <Link to={`/journal/${post.slug}`} className="card-explore-btn">
                                                                Read →
                                                            </Link>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {activeTab === 'about' && (
                                    <motion.div 
                                        key="about"
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -15 }}
                                        transition={{ duration: 0.3 }}
                                        className="profile-about-tab-premium"
                                    >
                                        <div className="about-details-grid-premium">
                                            <div className="about-info-item-card">
                                                <div className="info-item-icon">
                                                    <MailIcon />
                                                </div>
                                                <div className="info-item-texts">
                                                    <span className="info-lbl">Email Address</span>
                                                    <span className="info-val">{user?.email}</span>
                                                </div>
                                            </div>

                                            <div className="about-info-item-card">
                                                <div className="info-item-icon">
                                                    <LocationIcon />
                                                </div>
                                                <div className="info-item-texts">
                                                    <span className="info-lbl">Location Coordinates</span>
                                                    <span className="info-val">{user?.location || 'Not Configured'}</span>
                                                </div>
                                            </div>

                                            <div className="about-info-item-card">
                                                <div className="info-item-icon">
                                                    <CalendarIcon />
                                                </div>
                                                <div className="info-item-texts">
                                                    <span className="info-lbl">Matrix Enlistment</span>
                                                    <span className="info-val">{user?.created_at ? formatDate(user.created_at) : 'Unknown'}</span>
                                                </div>
                                            </div>

                                            <div className="about-info-item-card">
                                                <div className="info-item-icon">
                                                    <LinkIcon />
                                                </div>
                                                <div className="info-item-texts">
                                                    <span className="info-lbl">Website Link</span>
                                                    {user?.website ? (
                                                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="info-val-link">
                                                            {user.website}
                                                        </a>
                                                    ) : (
                                                        <span className="info-val">None Provided</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                )}
            </motion.div>

            <Footer />
        </div>
    )
}

export default Profile
