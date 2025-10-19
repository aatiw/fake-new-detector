import { useLocation } from "react-router-dom"
import SemiCircleMeter from "../components/GaugeChart";

function NewsAnalysis() {

    const location = useLocation();
    
    return (
        <div className="w-screen">
            <div className="w-screen flex-col items-center justify-center">
                <div className="w-screen bg-blue-300 flex items-center justify-center md:h-[3rem]">
                    <h1 className="text-amber-50">News Analysis</h1>
                </div>

                <div className="w-screen flex-col p-6">
                    <div className="flex-row md:flex-col">
                        <div className="bg-[#3aed672f] p-4 md:flex-col items-center justify-center md:w-160 h-full">
                            <h1 className="font-bold text-2xl text-center">News Credibility</h1>
                            <div className="flex flex-row items-center gap-20">
                                <SemiCircleMeter />
                                {/* <h2> {data ? data.aiResult : "invalid"} </h2> */}
                                <h1 className="text-5xl font-bold">Fake/Real</h1>
                            </div>
                            <div className="hidden md:flex flex-row items-center pl-7 gap-28">
                                <div className="flex flex-col gap-2">
                                    <h1>searchResults :</h1>
                                    <p className="text-sm">result fetched from internet</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h1>modelResults :</h1>
                                    <p className="text-sm">result fetched by the machine learning model</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsAnalysis;