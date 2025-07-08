import React, { useEffect, useState } from "react";

// Get backend URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/activity/logs`, {
        headers: {
          "auth-token": localStorage.getItem("token"),
        },
      });

      const data = await response.json();
      setLogs(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="text-center">📜 Activity Logs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p className="text-muted text-center">No activity logs to display.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead className="table-dark text-center">
              <tr>
                <th>👤 User</th>
                <th>📝 Action</th>
                <th>🆔 Note ID</th>
                <th>⏱️ Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="text-center">{log.userName}</td>
                  <td className="text-center">{log.action}</td>
                  <td className="text-center">{log.noteId}</td>
                  <td className="text-center">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
