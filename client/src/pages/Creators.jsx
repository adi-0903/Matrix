import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import api from '../api'

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const UserCheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
)

const UserPlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="17" y1="11" x2="23" y2="11" />
  </svg>
)

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

const Creators = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [followLoading, setFollowLoading] = useState({})
    const [currentUser, setCurrentUser] = useState(null)

    // Fetch logged-in user info
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('authToken')
            if (token) {
                try {
                    const u = await api.auth.getUser()
                    setCurrentUser(u)
                } catch (e) {}
            }
        }
        fetchCurrentUser()
    }, [])

    // Fetch users with search
    const fetchUsers = useCallback(async (query = '') => {
        setLoading(true)
        try {
            const params = {}
            if (query.trim()) {
                params.search = query.trim()
            }
            const res = await api.auth.getUsers(params)
            const list = res.results || res || []
            setUsers(Array.isArray(list) ? list : [])
        } catch (err) {
            console.error('Failed to search users:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(searchQuery)
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery, fetchUsers])

    const handleFollowToggle = async (targetUser) => {
        const token = localStorage.getItem('authToken')
        if (!token) {
            alert('Please sign in to follow creators.')
            navigate('/signin')
            return
        }

        if (currentUser && currentUser.username === targetUser.username) {
            alert('You cannot follow yourself!')
            return
        }

        setFollowLoading(prev => ({ ...prev, [targetUser.username]: true }))

        try {
            const res = await api.auth.followUser(targetUser.username)
            setUsers(prevUsers =>
                prevUsers.map(u => {
                    if (u.username === targetUser.username) {
                        return {
                            ...u,
                            is_following: res.is_following,
                            followers_count: res.is_following ? u.followers_count + 1 : Math.max(0, u.followers_count - 1)
                        }
                    }
                    return u
                })
            )
        } catch (err) {
            alert(err.message || 'Failed to toggle follow status.')
        } finally {
            setFollowLoading(prev => ({ ...prev, [targetUser.username]: false }))
        }
    }

    return (
        <div className="creators-page" style={{ minHeight: '100vh', background: '#060608', color: '#fff', paddingTop: '100px' }}>
            {/* Background Orbs */}
            <div className="pricing-aurora" style={{ pointerEvents: 'none' }}>
                <div className="orb orb-1" />
                <div className="orb orb-2" />
            </div>

            <motion.div
                className="creators-container"
                style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 80px 24px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div className="pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(106, 233, 193, 0.1)', color: 'var(--aqua)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '16px' }}>
                        ✦ Network & Connect
                    </div>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: '800', margin: '0 0 16px 0', background: 'linear-gradient(135deg, #fff 30%, var(--lavender))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Discover Mind Matrix Creators
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 36px auto', lineHeight: '1.6' }}>
                        Search for writers, developers, and thinkers across the network. Follow your favorite creators to stay updated.
                    </p>

                    {/* Search Bar */}
                    <div style={{ position: 'relative', maxWidth: '560px', margin: '0 auto' }}>
                        <div style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search creators by UID (e.g. MM-XXXXXX), name, or handle..."
                            style={{
                                width: '100%',
                                padding: '16px 20px 16px 52px',
                                borderRadius: '16px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: '#fff',
                                fontSize: '1rem',
                                backdropFilter: 'blur(12px)',
                                outline: 'none',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div className="premium-spinner" style={{ margin: '0 auto 16px auto' }} />
                        <p style={{ color: 'var(--muted)' }}>Searching creators matrix...</p>
                    </div>
                )}

                {/* Creators Grid */}
                {!loading && users.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px'
                    }}>
                        <AnimatePresence mode="popLayout">
                            {users.map((u) => {
                                const avatar = getAvatarUrl(u.avatar)
                                const isSelf = currentUser && currentUser.username === u.username

                                return (
                                    <motion.div
                                        key={u.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        whileHover={{ y: -6 }}
                                        style={{
                                            background: 'rgba(15, 15, 22, 0.7)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '20px',
                                            padding: '24px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            backdropFilter: 'blur(10px)',
                                            position: 'relative'
                                        }}
                                    >
                                        <div>
                                            {/* Card Header: Avatar & Info */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--aqua), var(--lavender))', padding: '2px', flexShrink: 0 }}>
                                                    {avatar ? (
                                                        <img src={avatar} alt={u.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#181824', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: '#fff' }}>
                                                            {getInitials(u)}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ overflow: 'hidden' }}>
                                                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {u.full_name || u.username}
                                                    </h3>
                                                    <p style={{ margin: '0 0 4px 0', color: 'var(--muted)', fontSize: '0.88rem' }}>
                                                        @{u.username}
                                                    </p>
                                                    
                                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginTop: '6px' }}>
                                                        {u.uid && (
                                                            <span 
                                                                title="Click to copy UID"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(u.uid)
                                                                    alert(`Copied UID: ${u.uid}`)
                                                                }}
                                                                style={{ 
                                                                    display: 'inline-flex', 
                                                                    alignItems: 'center', 
                                                                    gap: '4px',
                                                                    padding: '2px 8px', 
                                                                    borderRadius: '6px', 
                                                                    background: 'rgba(106, 233, 193, 0.12)', 
                                                                    color: 'var(--aqua)', 
                                                                    fontSize: '0.75rem', 
                                                                    fontWeight: '700',
                                                                    cursor: 'pointer',
                                                                    border: '1px solid rgba(106, 233, 193, 0.25)'
                                                                }}
                                                            >
                                                                🆔 {u.uid}
                                                            </span>
                                                        )}

                                                        {u.subscription_plan && u.subscription_plan !== 'free' && (
                                                            <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '6px', background: 'rgba(200, 181, 255, 0.15)', color: '#c8b5ff', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                                                                {u.subscription_plan === 'creator' && '⚡ Creator'}
                                                                {u.subscription_plan === 'studio' && '🚀 Studio'}
                                                                {u.subscription_plan === 'enterprise' && '👑 Enterprise'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bio */}
                                            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 20px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.7em' }}>
                                                {u.bio || 'No transmission recorded yet.'}
                                            </p>
                                        </div>

                                        {/* Card Footer */}
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '16px' }}>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                                                    <strong style={{ color: '#fff', fontSize: '1rem' }}>{u.followers_count || 0}</strong> Followers
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                                                    <strong style={{ color: '#fff', fontSize: '1rem' }}>{u.following_count || 0}</strong> Following
                                                </div>
                                            </div>

                                            {!isSelf ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleFollowToggle(u)}
                                                    disabled={followLoading[u.username]}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 16px',
                                                        borderRadius: '12px',
                                                        border: u.is_following ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                                                        background: u.is_following 
                                                            ? 'rgba(255, 255, 255, 0.06)' 
                                                            : 'linear-gradient(135deg, var(--aqua), var(--lavender))',
                                                        color: u.is_following ? '#fff' : '#000',
                                                        fontWeight: '600',
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px',
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                >
                                                    {u.is_following ? (
                                                        <>
                                                            <UserCheckIcon />
                                                            <span>Following</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserPlusIcon />
                                                            <span>Follow</span>
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => navigate('/profile')}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 16px',
                                                        borderRadius: '12px',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        background: 'transparent',
                                                        color: 'var(--muted)',
                                                        fontWeight: '600',
                                                        fontSize: '0.9rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Your Profile
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty State */}
                {!loading && users.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>No Creators Found</h3>
                        <p style={{ color: 'var(--muted)', margin: 0 }}>
                            No creators matched "{searchQuery}". Try searching for another name or handle.
                        </p>
                    </div>
                )}
            </motion.div>

            <Footer />
        </div>
    )
}

export default Creators
