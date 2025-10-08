import { useLocation } from "react-router-dom"

function NewsAnalysis() {

    const location = useLocation();
    const {text, link, data} = location.state;
    
    return (
        <div>NewsAnalysis</div>
    )
}

export default NewsAnalysis