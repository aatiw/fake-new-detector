import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";

export default function Charts() {
  const [stats, setStats] = useState({ fake: 0, real: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/news/stats")
      .then(res => setStats(res.data));
  }, []);

  const data = {
    labels: ["Fake", "Real"],
    datasets: [{
      data: [stats.fake, stats.real],
      backgroundColor: ["#ff6384", "#36a2eb"],
    }]
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3">News Classification Stats</h2>
      <Pie data={data} />
    </div>
  );
}
