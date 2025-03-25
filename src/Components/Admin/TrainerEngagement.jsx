import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,

} from "recharts";

const TrainerEngagement = ({ TrainerAttendanceDataForChart }) => {
  return (
    <>
      <div className="glassmorphic-card">
        <h3 className="chart-title">Trainer Engagement</h3>
        <div className="chart-container">
          {TrainerAttendanceDataForChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={TrainerAttendanceDataForChart}>
                <defs>
                  <linearGradient
                    id="trainerAttendance"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                    <stop offset="100%" stopColor="#f472b6" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <YAxis
                  tick={{ fill: "#9CA3AF" }}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#aAaAfA",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#trainerAttendance)"
                  radius={[14, 14, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="data-empty-state">
              <div className="empty-state-icon">📈</div>
              <p className="empty-state-text">No trainer data</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TrainerEngagement;
