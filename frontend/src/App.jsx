import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SubmitNews from "../pages/SubmitNews";
import Dashboard from "../pages/Dashboard";
import './App.css';
import NewsAnalysis from "../pages/NewsAnalysis";

export default function App() {
  return (
    <BrowserRouter>
      {/* <nav className="p-4 bg-gray-200 flex gap-4">
        <Link to="/">Submit News</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<SubmitNews />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/result" element={<NewsAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}
