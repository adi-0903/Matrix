import { Sparkles } from '../icons'

const SectionHeading = ({ label, title }) => (
    <div className="section-heading">
        <div className="pill">
            <Sparkles />
            <span>{label}</span>
        </div>
        <div className="section-title">
            <h2>{title}</h2>
            <div className="line" />
        </div>
    </div>
)

export default SectionHeading
