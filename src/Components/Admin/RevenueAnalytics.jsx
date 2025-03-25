import React from "react";
import moment from "moment";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line as RechartsLine,
} from "recharts";

const RevenueAnalytics = ({ amountChart, monthlyChart }) => {
  // Custom tooltip formatter for daily chart
  const dailyTooltipFormatter = (value, name, props) => {
    if (name === "amount") {
      return [`$${value}`, "Revenue"];
    }
    return [value, name];
  };

  // Custom tooltip labelFormatter for daily chart
  const dailyLabelFormatter = (label) => {
    return moment(label, "YYYY-MM-DD").format("DD-MM-YYYY");
  };

  // Custom tooltip formatter for monthly chart
  const monthlyTooltipFormatter = (value, name, props) => {
    if (name === "amount") {
      return [`$${value}`, "Revenue"];
    }
    return [value, name];
  };

  // Custom tooltip labelFormatter for monthly chart
  const monthlyLabelFormatter = (label) => {
    return moment(label).format("MMMM YYYY");
  };

  return (
    <>
      <div className="glassmorphic-card">
        <h3 className="chart-title">Revenue Analytics</h3>
        <div className="revenue-charts-container">
          <div className="revenue-chart">
            <h4>Daily Revenue</h4>
            {amountChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={amountChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      moment(date, "YYYY-MM-DD").format("DD-MM-YY")
                    }
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis tick={{ fill: "#9CA3AF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#aAaAfA",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                    }}
                    formatter={dailyTooltipFormatter}
                    labelFormatter={dailyLabelFormatter}
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="amount"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="data-empty-state">
                <div className="empty-state-icon">💸</div>
                <p className="empty-state-text">No revenue data</p>
              </div>
            )}
          </div>

          <div className="revenue-chart">
            <h4>Monthly Revenue</h4>
            {monthlyChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => moment(date).format("MMM YY")}
                    tick={{ fill: "#9CA3AF" }}
                  />
                  <YAxis tick={{ fill: "#9CA3AF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#aAaAfA",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                    }}
                    formatter={monthlyTooltipFormatter}
                    labelFormatter={monthlyLabelFormatter}
                  />
                  <RechartsLine
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="data-empty-state">
                <div className="empty-state-icon">📆</div>
                <p className="empty-state-text">No monthly data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RevenueAnalytics;
