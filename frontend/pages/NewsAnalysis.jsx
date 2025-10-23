import { useLocation, useNavigate } from "react-router-dom"
import SemiCircleMeter from "../components/GaugeChart";
import { useEffect } from "react";

function NewsAnalysis() {
    
    const location = useLocation();
    const navigate = useNavigate();
    const {text, link, data} = location.state || {};

    useEffect(() => {
        if (!data) {
            navigate("/");
        }
    }, [data, navigate]);
    
    return (
        <div className="w-full overflow-hidden bg-gray-50">
            <div className="w-screen flex-col items-center justify-center">
                <div className="w-screen bg-blue-600 flex items-center justify-between md:h-[3rem] px-10">
                    <h1 className="text-amber-50 text-xl md:text-2xl font-semibold hover:text-amber-200 transition-colors">News Analysis</h1>
                    <h1 onClick={() => navigate('/')} className="text-amber-50 cursor-pointer">Home</h1>
                </div>


                <div className="w-screen flex flex-col items-center justify-center p-6 gap-2 md:gap-4">
                    <div className="flex flex-col md:flex-row gap-8 w-full">

                        <div className="bg-white py-6 rounded-2xl md:flex-col shadow-lg flex items-center justify-center md:w-120 h-full transition-transform transform hover:scale-102 duration-300">
                            <h1 className="font-bold text-2xl md:text-3xl text-center mb-4">News Credibility</h1>

                            <div className="flex flex-col md:flex-row -ml-6 items-center justify-center gap-12 md:gap-16">
                                <SemiCircleMeter percentage={data.confidencePercent} />
                                <h1 className={`text-3xl font-bold ${data && data.aiResult === "real" ? "text-green-500" : "text-red-500"}`}>{data ? data.aiResult : "invalid"}</h1>
                            </div>

                            <div className="hidden md:flex flex-row items-center justify-center gap-16">
                                <div className="flex flex-col">
                                    <h1><strong>Result :</strong> {data ? data.aiResult : "invalid"}</h1>
                                    <p className="text-[10px] text-gray-500">result fetched from internet</p>
                                </div>

                                <div className="flex flex-col">
                                    <h1><strong>Model Result :</strong> {data ? data.modelResult : "invalid"}</h1>
                                    <p className="text-[10px] text-gray-500">ML model result can fetch wrong output</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-lg md:flex-col items-center justify-center md:w-full h-full transition-transform transform hover:scale-102 duration-300">
                            <h1 className="font-bold text-2xl md:text-3xl pb-4 text-center w-full">News Analysis</h1>
                            <p className="pt-2"><span className="font-bold">News Category:</span> {data?.category || 'N/A'}</p>
                            <p className="pt-2"><span className="font-bold">News Trend:</span> {data?.trend || 'N/A'}</p>
                            <p className="pt-2"><span className="font-bold">Source for analysis:</span> {data?.source || 'N/A'}</p>
                            <p className="pt-2"><span className="font-bold">More about the news:</span> {data?.context || 'N/A'}</p>
                            <p className="pt-2"><span className="font-bold">Analysis:</span> {data?.aiAnalysis || 'N/A'}</p>
                        </div>
                    </div>


                    <div className="bg-white h-full w-full p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-102 duration-300 mt-6">
                        <h1 className="text-2xl text-center font-bold pb-3">Related articles</h1>
                        <ul className="list-inside">
                            {data.similarArticle.map((url, i) => (
                                <li key={i}>
                                    <strong>{(i+1 )}.</strong>{" "}<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{url}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsAnalysis;