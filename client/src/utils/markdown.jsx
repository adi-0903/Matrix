import React from 'react'

export const formatContent = (content, postTitle = '') => {
    if (!content) return null

    // Simple markdown-like formatting
    const lines = content.split('\n')
    const elements = []
    let inList = false
    let listItems = []
    let isFirstH1 = true

    const parseInline = (text) => {
        let result = text
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
            // Strikethrough
            .replace(/~~(.*?)~~/g, '<del>$1</del>')
            // Underline
            .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
            // Inline code
            .replace(/`(.*?)`/g, '<code class="post-code-inline">$1</code>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="post-link">$1</a>')
        return result
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        
        // Handle blockquote
        if (line.startsWith('> ')) {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="post-list">{listItems}</ul>)
                listItems = []
                inList = false
            }
            elements.push(
                <blockquote key={i} className="post-blockquote" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />
            )
            continue
        }

        if (line.startsWith('# ')) {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="post-list">{listItems}</ul>)
                listItems = []
                inList = false
            }
            if (isFirstH1 && postTitle && line.substring(2).trim() === postTitle.trim()) {
                isFirstH1 = false
                continue
            }
            elements.push(<h1 key={i} className="post-title" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />)
        } else if (line.startsWith('## ')) {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="post-list">{listItems}</ul>)
                listItems = []
                inList = false
            }
            elements.push(<h2 key={i} className="post-subtitle" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(3)) }} />)
        } else if (line.startsWith('### ')) {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="post-list">{listItems}</ul>)
                listItems = []
                inList = false
            }
            elements.push(<h3 key={i} className="post-heading" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(4)) }} />)
        } else if (line.startsWith('- ')) {
            inList = true
            listItems.push(<li key={i} className="post-list-item" dangerouslySetInnerHTML={{ __html: parseInline(line.substring(2)) }} />)
        } else if (line.startsWith('---')) {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="post-list">{listItems}</ul>)
                listItems = []
                inList = false
            }
            elements.push(<hr key={i} className="post-divider" />)
        } else if (line.trim() === '') {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="post-list">{listItems}</ul>)
                listItems = []
                inList = false
            }
            elements.push(<br key={i} />)
        } else {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="post-list">{listItems}</ul>)
                listItems = []
                inList = false
            }
            elements.push(<p key={i} className="post-paragraph" dangerouslySetInnerHTML={{ __html: parseInline(line) }} />)
        }
    }

    if (inList) {
        elements.push(<ul key="list-final" className="post-list">{listItems}</ul>)
    }

    return elements
}
