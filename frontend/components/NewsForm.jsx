import { useState } from "react";
import axios from "axios";

export default function NewsForm() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/news/classify", { text });
    setResult(res.data);
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          className="border p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste news text here..."
        />
        <button className="bg-blue-500 text-white p-2 rounded">Check</button>
      </form>

      {result && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <p><b>Result:</b> {result.result}</p>
          <p><b>Confidence:</b> {(result.confidence * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}
