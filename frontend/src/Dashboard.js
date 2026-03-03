import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

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
    if (!url) return;

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/scan", {
        ip: "127.0.0.1",
        url: url,
        responseCode: 200,
      });

      setResult(res.data);
      setUrl("");
      fetchHistory();

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Statistics
  // ----------------------------
  const totalAttacks = history.length;
  const highCount = history.filter(i => i.severity === "High").length;
  const mediumCount = history.filter(i => i.severity === "Medium").length;
  const lowCount = history.filter(i => i.severity === "Low").length;

  // ----------------------------
  // Pie Chart Data
  // ----------------------------
  const attackTypes = {};
  history.forEach(item => {
    attackTypes[item.attackType] =
      (attackTypes[item.attackType] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(attackTypes),
    datasets: [
      {
        data: Object.values(attackTypes),
        backgroundColor: [
          "#ef4444",
          "#facc15",
          "#22c55e",
          "#3b82f6",
          "#a855f7",
        ],
      },
    ],
  };

  const getSeverityColor = (severity) => {
    if (severity === "High") return "text-red-400";
    if (severity === "Medium") return "text-yellow-400";
    return "text-green-400";
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

        <h1 className="text-3xl font-bold mb-8">
          AI Security Scanner
        </h1>

        {/* =======================
            Stats Cards
        ======================== */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-[#161b22] p-6 rounded-xl">
            <h3 className="text-gray-400">Total Attacks</h3>
            <p className="text-3xl font-bold">{totalAttacks}</p>
          </div>

          <div className="bg-[#161b22] p-6 rounded-xl">
            <h3 className="text-red-400">High Severity</h3>
            <p className="text-3xl font-bold">{highCount}</p>
          </div>

          <div className="bg-[#161b22] p-6 rounded-xl">
            <h3 className="text-yellow-400">Medium Severity</h3>
            <p className="text-3xl font-bold">{mediumCount}</p>
          </div>

          <div className="bg-[#161b22] p-6 rounded-xl">
            <h3 className="text-green-400">Low Severity</h3>
            <p className="text-3xl font-bold">{lowCount}</p>
          </div>
        </div>

        {/* =======================
            Chart + Scan Section
        ======================== */}
        <div className="flex gap-10 mb-10">

          {/* Pie Chart */}
          <div className="bg-[#161b22] p-6 rounded-xl w-1/3">
            <h2 className="text-xl mb-4">Attack Distribution</h2>
            {history.length > 0 ? (
              <Pie data={chartData} />
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>

          {/* Scan Box */}
          <div className="bg-[#161b22] p-6 rounded-xl flex-1">
            <input
              type="text"
              placeholder="Enter URL to scan..."
              className="w-full p-3 bg-black border border-gray-700 rounded"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <button
              onClick={scanUrl}
              className="mt-4 bg-green-500 px-6 py-2 rounded hover:bg-green-600"
            >
              {loading ? "Scanning..." : "Scan URL"}
            </button>

            {result && (
              <div className="mt-6">
                <p>
                  Attack:
                  <span className="ml-2 font-bold">
                    {result.attackType}
                  </span>
                </p>
                <p>
                  Severity:
                  <span className={`ml-2 font-bold ${getSeverityColor(result.severity)}`}>
                    {result.severity}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =======================
            History Table
        ======================== */}
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
              {history.map((item, index) => (
                <tr key={index} className="border-b border-gray-800">
                  <td className="py-2">{item.attackType}</td>
                  <td className={getSeverityColor(item.severity)}>
                    {item.severity}
                  </td>
                  <td>{item.status}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>
    </div>
  );
}