import { useState, useRef, useEffect } from 'react'
import { Sparkles } from '../icons'
import { formatContent } from '../utils/markdown'
import api from '../api'

const MarkdownEditor = ({ value, onChange, placeholder, minHeight = '300px' }) => {
    const textareaRef = useRef(null)
    const [view, setView] = useState('split') // 'write', 'preview', 'split'
    const [isAILoading, setIsAILoading] = useState(false)
    const [aiError, setAiError] = useState('')

    // Word count and reading time
    const words = value.trim() ? value.trim().split(/\s+/).length : 0
    const readTime = Math.ceil(words / 200)

    const insertText = (before, after = '') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = value.substring(start, end)
        
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)
        
        // Call the parent's onChange with a synthetic event
        onChange({ target: { name: 'content', value: newText } })

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + before.length, end + before.length)
        }, 0)
    }

    const handleAIEnhance = async () => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = value.substring(start, end)

        if (!selectedText) {
            setAiError('Please select some text to enhance')
            setTimeout(() => setAiError(''), 3000)
            return
        }

        setIsAILoading(true)
        setAiError('')

        try {
            const response = await api.blog.aiAssist({
                prompt: 'Improve and enhance the following text for a blog post. Make it more engaging and professional while keeping the original meaning. Only output the enhanced text.',
                text: selectedText
            })

            const enhancedText = response.result || response
            
            const newText = value.substring(0, start) + enhancedText + value.substring(end)
            onChange({ target: { name: 'content', value: newText } })
            
            setTimeout(() => {
                textarea.focus()
                textarea.setSelectionRange(start, start + enhancedText.length)
            }, 0)

        } catch (error) {
            setAiError(error.message || 'AI Enhancement failed')
            setTimeout(() => setAiError(''), 4000)
        } finally {
            setIsAILoading(false)
        }
    }

    return (
        <div className="markdown-editor" style={{
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.02)',
        }}>
            {/* Toolbar */}
            <div className="editor-toolbar" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.04)',
                gap: '16px',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => insertText('**', '**')} title="Bold" style={{ ...toolbarBtnStyle, fontWeight: 'bold' }}>B</button>
                    <button type="button" onClick={() => insertText('*', '*')} title="Italic" style={{ ...toolbarBtnStyle, fontStyle: 'italic' }}>I</button>
                    <button type="button" onClick={() => insertText('<u>', '</u>')} title="Underline" style={{ ...toolbarBtnStyle, textDecoration: 'underline' }}>U</button>
                    <button type="button" onClick={() => insertText('~~', '~~')} title="Strikethrough" style={{ ...toolbarBtnStyle, textDecoration: 'line-through' }}>S</button>
                    
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
                    <button type="button" onClick={() => insertText('# ')} title="Heading 1" style={toolbarBtnStyle}>H1</button>
                    <button type="button" onClick={() => insertText('## ')} title="Heading 2" style={toolbarBtnStyle}>H2</button>
                    <button type="button" onClick={() => insertText('### ')} title="Heading 3" style={toolbarBtnStyle}>H3</button>
                    
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
                    <button type="button" onClick={() => insertText('- ')} title="Bullet List" style={toolbarBtnStyle}>• List</button>
                    <button type="button" onClick={() => insertText('> ')} title="Blockquote" style={toolbarBtnStyle}>" Quote</button>
                    <button type="button" onClick={() => insertText('\n---\n')} title="Divider" style={toolbarBtnStyle}>---</button>

                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
                    <button type="button" onClick={() => insertText('[', '](https://)')} title="Link" style={toolbarBtnStyle}>Link</button>
                    <button type="button" onClick={() => insertText('`', '`')} title="Code" style={toolbarBtnStyle}>{'<>'}</button>
                    
                    <button 
                        type="button" 
                        onClick={handleAIEnhance} 
                        disabled={isAILoading}
                        className="ai-enhance-btn"
                        style={{
                            ...toolbarBtnStyle,
                            background: 'linear-gradient(135deg, rgba(106, 233, 193, 0.15), rgba(200, 181, 255, 0.15))',
                            color: '#c8b5ff',
                            border: '1px solid rgba(200, 181, 255, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginLeft: '8px'
                        }}
                    >
                        <Sparkles />
                        {isAILoading ? 'Enhancing...' : 'AI Enhance'}
                    </button>
                </div>
                
                {/* View Toggles */}
                <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
                    <button type="button" onClick={() => setView('write')} style={viewBtnStyle(view === 'write')}>Write</button>
                    <button type="button" onClick={() => setView('preview')} style={viewBtnStyle(view === 'preview')}>Preview</button>
                    <button type="button" onClick={() => setView('split')} style={{...viewBtnStyle(view === 'split'), display: window.innerWidth > 768 ? 'block' : 'none'}}>Split</button>
                </div>
            </div>

            {aiError && (
                <div style={{ padding: '8px 16px', background: 'rgba(255, 59, 48, 0.1)', color: '#ff3b30', fontSize: '0.9rem', borderBottom: '1px solid rgba(255,59,48,0.2)' }}>
                    {aiError}
                </div>
            )}

            {/* Main Area */}
            <div className="editor-main" style={{
                display: 'flex',
                minHeight: minHeight,
                flexDirection: view === 'split' ? 'row' : 'column'
            }}>
                {/* Write Pane */}
                {(view === 'write' || view === 'split') && (
                    <div style={{
                        flex: 1,
                        borderRight: view === 'split' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                        position: 'relative'
                    }}>
                        <textarea
                            ref={textareaRef}
                            name="content"
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            style={{
                                width: '100%',
                                height: '100%',
                                minHeight: minHeight,
                                background: 'transparent',
                                border: 'none',
                                padding: '24px',
                                color: '#e4e4ef',
                                fontSize: '1.05rem',
                                lineHeight: '1.6',
                                resize: 'vertical',
                                outline: 'none',
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
                            }}
                        />
                    </div>
                )}

                {/* Preview Pane */}
                {(view === 'preview' || view === 'split') && (
                    <div className="post-content" style={{
                        flex: 1,
                        padding: '24px',
                        overflowY: 'auto',
                        background: 'rgba(0, 0, 0, 0.2)',
                        maxHeight: view === 'split' ? '600px' : 'none'
                    }}>
                        {value ? formatContent(value) : <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Preview will appear here...</p>}
                    </div>
                )}
            </div>

            {/* Bottom Status Bar */}
            <div className="editor-status" style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.2)',
                fontSize: '0.85rem',
                color: 'var(--muted)'
            }}>
                <div>Markdown is supported</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <span>{words} words</span>
                    <span>~{readTime} min read</span>
                </div>
            </div>
        </div>
    )
}

const toolbarBtnStyle = {
    background: 'transparent',
    border: 'none',
    color: '#e4e4ef',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s'
}

const viewBtnStyle = (isActive) => ({
    background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    border: 'none',
    color: isActive ? '#fff' : 'var(--muted)',
    padding: '4px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: isActive ? '600' : '400',
    transition: 'all 0.2s'
})

export default MarkdownEditor
