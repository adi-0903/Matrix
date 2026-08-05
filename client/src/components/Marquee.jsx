const Marquee = () => {
    const items = ['Analog love letters', 'Night shift musings', 'Sunrise essays', 'Soundtracked drafts', 'In-camera edits']
    return (
        <div className="marquee">
            <div className="marquee-track">
                {items.concat(items).map((text, idx) => (
                    <span key={`${text}-${idx}`}>{text}</span>
                ))}
            </div>
            <div className="marquee-fade left" />
            <div className="marquee-fade right" />
        </div>
    )
}

export default Marquee
