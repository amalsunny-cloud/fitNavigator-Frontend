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

const MemberAttendanceDashboard = ({ attendanceDataForChart }) => {
  return (
    <>
      <div className="glassmorphic-card">
        <h3 className="chart-title">Member Attendance</h3>
        <div className="chart-container">
          {console.log("attendanceDataForChart:", attendanceDataForChart)}
          {attendanceDataForChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceDataForChart}>
                <defs>
                  <linearGradient
                    id="userAttendanceGradients"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.4} />
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
                    backgroundColor: "#aaaafa",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#userAttendanceGradients)"
                  radius={[14, 14, 0, 0]}

                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="data-empty-state">
              <div className="empty-state-icon">📊</div>
              <p className="empty-state-text">No attendance data</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MemberAttendanceDashboard;
