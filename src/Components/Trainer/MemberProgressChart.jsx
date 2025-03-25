import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MemberProgressChart = ({ memberProgress }) => {
  console.log("memberProgress is:", memberProgress);


  const gradientColors = {
    start: "#689f38",  // Darker shade of green
    end: "#8bc34a"     // Original green color
  };

  // Ensure memberProgress is in the correct format
  const chartData = memberProgress.map((value, index) => ({
    label: `Entry ${index + 1}`,
    bmi: value, // Assuming memberProgress contains BMI values
  }));

  return (
    <div style={{ position: "relative", width: "100%", height: 300 }}>
      {chartData && chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={gradientColors.start}
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor={gradientColors.end}
                  stopOpacity={0.4}
                />
              </linearGradient>
            </defs>


            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip 
          contentStyle={{
            backgroundColor: '#aAaAfA',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.6)'
          }}
        
        />

            <Legend />
            <Bar dataKey="bmi" fill="url(#progressGradient)" radius={[14, 14, 0, 0]} 
              />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ color: "red", fontSize: "24px", fontWeight: "bold" }}>
            No chart data
          </p>
        </div>
      )}
    </div>
  );
};

export default MemberProgressChart;
