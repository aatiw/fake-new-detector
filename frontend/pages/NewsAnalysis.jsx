import { useLocation, useNavigate } from "react-router-dom"
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import SemiCircleMeter from "../components/GaugeChart";
import { useEffect } from "react";
import { useState } from "react";
import axios from 'axios';

function NewsAnalysis() {
    
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const {text, newsSource} = location.state || {};

    useEffect(() => {
        if (!data) {
            const fetchData = async () => {
                try {
                    const res = await axios.post('http://localhost:5000/api/news/classify', {text, newsSource});
                    setData(res.data)
                } catch (error) {
                    console.log(error)
                }
            };
            fetchData()
        }
    }, [data, text, newsSource]);
    
    return (
        <div className="w-full min-h-screen overflow-hidden bg-gray-100">
            <div className="w-screen flex-col items-center justify-center">
                <div className="group w-screen bg-gray-100 flex items-center shadow-lg justify-between h-12 md:h-16 md:px-10 transition-all hover:px-30  hover:shadow-2xl duration-500">
                    <h1 className="text-black text-2lg md:text-2xl hover:text-gray-600 font-semibold transition-colors">News Analysis</h1>
                    <h1 onClick={() => navigate('/')} className="text-black text-sm md:text-base hover:text-gray-600 cursor-pointer">Home</h1>
                </div>


                <div className="w-screen flex flex-col items-center justify-center p-4 md:p-6 gap-2 md:gap-4">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-8 w-full">

                        <div className="bg-gray-100 border-2 border-gray-300 py-6 rounded-2xl shadow-lg flex-col flex items-center md:w-120 h-full transition-transform transform hover:scale-102 hover:bg-white duration-300">
                            <h1 className="font-bold text-2xl md:text-3xl text-center mb-4">News Credibility</h1>

                            <div className="flex flex-col md:flex-row -ml-6 items-center justify-center gap-12 md:gap-16">
                                <SemiCircleMeter percentage={data?.confidencePercent || 40} />
                                <h1 className={`text-3xl font-bold ${data && data.aiResult === "real" ? "text-green-500" : "text-red-500"}`}>{data ? data.aiResult : <Skeleton width={80}/>}</h1>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-6 mt-4">
                                <div className="flex flex-col">
                                    <h1><strong>Result :</strong>{" "}{data ? data.aiResult : <Skeleton width={100} />}</h1>
                                    <p className="text-[10px] text-gray-500">result fetched from internet</p>
                                </div>

                                <div className="flex flex-col">
                                    <h1><strong>Model Result :</strong> {data ? data.modelResult : <Skeleton width={100} />}</h1>
                                    <p className="text-[10px] text-gray-500">ML model result can fetch wrong output</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center px-4 pt-6 w-full">
                                <p><span className="font-bold">User Source : </span>{data?.submittedSource || <Skeleton width={120} />}</p>
                            </div>
                        </div>

                        <div className="bg-gray-100 border-2 border-gray-300 p-6 rounded-2xl shadow-lg flex flex-col md:w-full h-full transition-transform transform hover:scale-102 hover:bg-white hover:shawdow-lg duration-300">
                            <h1 className="font-bold text-2xl md:text-3xl pb-4 text-center w-full">News Analysis</h1>
                            <div className="flex flex-col gap-2 md:gap-3">
                                <p className="pt-2"><span className="font-bold">News Category: </span>{data?.category || <Skeleton width={150} />}</p>
                                <p className="pt-2"><span className="font-bold">News Trend:</span> {data?.trend || <Skeleton width={150} />}</p>
                                <p className="pt-2"><span className="font-bold">Source for analysis:</span> {data?.source || <Skeleton width={100} />}</p>
                                <p className="pt-2"><span className="font-bold">More about the news:</span> {data?.context || <Skeleton count={2} />}</p>
                                <p className="pt-2"><span className="font-bold">Analysis:</span> {data?.aiAnalysis || <Skeleton count={2} />}</p>
                            </div>
                        </div>
                    </div>


                    <div className="bg-gray-100 border-2 border-gray-300 h-full w-full p-6 rounded-2xl shadow-lg transition-transform transform hover:scale-102 hover:bg-white hover:shawdow-lg duration-300 mt-6">
                        <h1 className="text-2xl text-center font-bold pb-3">Related articles</h1>
                        <ul className="list-inside flex flex-col gap-2">
                            {data ? data.similarArticle.map((url, i) => (
                                <li key={i}>
                                    <strong>{(i+1 )}.</strong>{" "}<a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">{url}</a>
                                </li>
                            )) : Array(3)
                                    .fill(0)
                                    .map((_, i) => <Skeleton key={i} height={20} />)
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsAnalysis;