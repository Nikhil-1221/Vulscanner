import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {

  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch history from MongoDB
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/attacks");
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const scanUrl = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/scan", {
        ip: "127.0.0.1",
        url: url,
        responseCode: 200
      });

      setResult(res.data);
      setUrl("");
      fetchHistory(); // refresh real DB data

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex">

      {/* Sidebar */}
      <div className="w-60 bg-[#161b22] p-6">
        <h2 className="text-green-400 text-2xl font-bold mb-10">
          VulScanner 🔥
        </h2>

        <ul className="space-y-4">
          <li className="hover:text-green-400 cursor-pointer">Dashboard</li>
          <li className="hover:text-green-400 cursor-pointer">Scan</li>
          <li className="hover:text-green-400 cursor-pointer">Reports</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">

        <h1 className="text-3xl font-bold mb-6">
          AI Security Scanner
        </h1>

        {/* Scan Box */}
        <div className="bg-[#161b22] p-6 rounded-xl mb-8 max-w-2xl">
          <input 
            type="text"
            placeholder="Enter URL to scan..."
            className="w-full p-3 bg-black border border-gray-700 rounded"
            value={url}
            onChange={(e)=>setUrl(e.target.value)}
          />

          <button 
            onClick={scanUrl}
            className="mt-4 bg-green-500 px-6 py-2 rounded hover:bg-green-600"
          >
            Scan URL
          </button>
        </div>

        {/* Result Card */}
        {result && (
          <div className="bg-[#161b22] p-6 rounded-xl mb-8 max-w-2xl">
            <h2 className="text-xl mb-2">Scan Result</h2>
            <p>
              Attack: 
              <span className="ml-2 text-red-400 font-bold">
                {result.attackType}
              </span>
            </p>
            <p>
              Severity: 
              <span className="ml-2 text-yellow-400 font-bold">
                {result.severity}
              </span>
            </p>
          </div>
        )}

        {/* History Table */}
        <div className="bg-[#161b22] p-6 rounded-xl">
          <h2 className="text-xl mb-4">Scan History</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2">Attack</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item,index)=>(
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-2">{item.attackType}</td>
                  <td>{item.severity}</td>
                  <td>{item.status}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

    </div>
  );
}