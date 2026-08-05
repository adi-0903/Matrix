import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../api'

const STORAGE_KEY = 'readingJournalFallback'

const ReadingJournal = ({ postId, postType = 'blog' }) => {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [notes, setNotes] = useState('')
    const [showNotesModal, setShowNotesModal] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (postId) {
            fetchReadingData()
        }
    }, [postId])

    const getLocalData = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : {}
        } catch (err) {
            console.warn('Failed to read local fallback:', err)
            return {}
        }
    }

    const setLocalData = (data) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        } catch (err) {
            console.warn('Failed to write local fallback:', err)
        }
    }

    const fetchReadingData = async () => {
        try {
            setLoading(true)
            
            // Get bookmarks
            try {
                const bookmarks = await api.readingJournal.getBookmarks()
                const bookmarked = bookmarks.some(b => b.post_id === postId && b.post_type === postType)
                setIsBookmarked(bookmarked)
            } catch (err) {
                const local = getLocalData()
                const key = `${postType}:${postId}`
                setIsBookmarked(Boolean(local[key]?.bookmarked))
            }

            // Get notes
            try {
                const progress = await api.readingJournal.getProgress(postId)
                setNotes(progress.notes || '')
            } catch (err) {
                const local = getLocalData()
                const key = `${postType}:${postId}`
                setNotes(local[key]?.notes || '')
            }
        } catch (err) {
            console.error('Failed to fetch reading data:', err)
        } finally {
            setLoading(false)
        }
    }

    const toggleBookmark = async () => {
        try {
            if (isBookmarked) {
                await api.readingJournal.removeBookmark(postId)
                setIsBookmarked(false)
            } else {
                await api.readingJournal.addBookmark({
                    post_id: postId,
                    post_type: postType
                })
                setIsBookmarked(true)
            }
        } catch (err) {
            console.error('Failed to toggle bookmark:', err)
            // Fallback: store locally so UI still works
            const local = getLocalData()
            const key = `${postType}:${postId}`
            const updated = { ...local[key], bookmarked: !isBookmarked, notes }
            setLocalData({ ...local, [key]: updated })
            setIsBookmarked(!isBookmarked)
        }
    }

    const saveNotes = async () => {
        try {
            await api.readingJournal.updateProgress(postId, {
                progress_percentage: 0,
                notes: notes
            })
            setShowNotesModal(false)
        } catch (err) {
            console.error('Failed to save notes:', err)
            // Fallback: save locally so notes persist client-side
            const local = getLocalData()
            const key = `${postType}:${postId}`
            const updated = { ...local[key], notes, bookmarked: isBookmarked }
            setLocalData({ ...local, [key]: updated })
            setShowNotesModal(false)
        }
    }

    if (loading) {
        return <div className="reading-journal-loading">Loading...</div>
    }

    return (
        <div className="reading-journal">
            <div className="reading-journal-actions">
                {/* Bookmark Button */}
                <motion.button
                    className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                    onClick={toggleBookmark}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                    </svg>
                </motion.button>

                {/* Notes Button */}
                <motion.button
                    className={`notes-btn ${notes ? 'has-notes' : ''}`}
                    onClick={() => setShowNotesModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={notes ? 'View notes' : 'Add notes'}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </motion.button>
            </div>


            {/* Notes Modal */}
            {showNotesModal && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowNotesModal(false)}
                >
                    <motion.div
                        className="modal-content notes-modal"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Reading Notes</h3>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add your thoughts, quotes, or reflections about this article..."
                            className="notes-textarea"
                            rows="6"
                        />
                        <div className="modal-actions">
                            <button
                                className="secondary-btn"
                                onClick={() => setShowNotesModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="primary-btn"
                                onClick={saveNotes}
                            >
                                Save Notes
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <style jsx>{`
                .reading-journal {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .reading-journal-actions {
                    display: flex;
                    gap: 8px;
                }

                .bookmark-btn,
                .progress-btn,
                .notes-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #666;
                }

                .bookmark-btn.bookmarked,
                .notes-btn.has-notes {
                    background: rgba(255, 255, 255, 0.2);
                    color: #00d2d3;
                }

                .bookmark-btn:hover,
                .progress-btn:hover,
                .notes-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    transform: translateY(-1px);
                }

                .progress-indicator {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .progress-text {
                    position: absolute;
                    font-size: 8px;
                    font-weight: 600;
                    color: #fff;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: #1a1a1a;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 400px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                }

                .modal-content h3 {
                    margin: 0 0 16px 0;
                    color: #fff;
                    font-size: 18px;
                    font-weight: 600;
                }

                .progress-controls {
                    margin-bottom: 24px;
                }

                .progress-slider {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .slider {
                    flex: 1;
                    height: 6px;
                    border-radius: 3px;
                    background: rgba(255, 255, 255, 0.1);
                    outline: none;
                    -webkit-appearance: none;
                }

                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #00d2d3;
                    cursor: pointer;
                }

                .slider::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #00d2d3;
                    cursor: pointer;
                    border: none;
                }

                .progress-value {
                    min-width: 40px;
                    text-align: right;
                    color: #fff;
                    font-weight: 600;
                }

                .progress-label {
                    text-align: center;
                    color: #999;
                    font-size: 14px;
                }

                .notes-textarea {
                    width: 100%;
                    min-height: 120px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 12px;
                    color: #fff;
                    font-family: inherit;
                    font-size: 14px;
                    resize: vertical;
                    margin-bottom: 24px;
                }

                .notes-textarea:focus {
                    outline: none;
                    border-color: #00d2d3;
                    background: rgba(255, 255, 255, 0.08);
                }

                .notes-textarea::placeholder {
                    color: #666;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }

                .primary-btn,
                .secondary-btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .primary-btn {
                    background: #00d2d3;
                    color: #000;
                }

                .primary-btn:hover {
                    background: #00b8b9;
                }

                .secondary-btn {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                }

                .secondary-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .reading-journal-loading {
                    color: #666;
                    font-size: 12px;
                }
            `}</style>
        </div>
    )
}

export default ReadingJournal
