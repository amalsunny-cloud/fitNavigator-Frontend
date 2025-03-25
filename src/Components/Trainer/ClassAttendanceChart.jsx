import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const ClassAttendanceChart = ({ attendanceData }) => {
  const [transformedData, setTransformedData] = useState([]);
  console.log("attendanceData is:",attendanceData);
  

  useEffect(() => {
    // Check if attendanceData exists and has the expected data property
    if (!attendanceData || !Array.isArray(attendanceData.data)) {
      console.log('No valid attendance data available');
      return;
    }

    // Transform the attendance data
    const attendanceMap = {};

    attendanceData.data.forEach((item) => {
      if (item && item.userId && item.userId.username && item.status) {
        const username = item.userId.username;
        const status = item.status;

        if (!attendanceMap[username]) {
          attendanceMap[username] = { username, Present: 0, Absent: 0 };
        }

        attendanceMap[username][status]++;
      }
    });

    // Convert the map to an array for the chart
    const chartData = Object.values(attendanceMap);
    setTransformedData(chartData);
  }, [attendanceData]);

  // If no transformed data, show a message or return null
  if (transformedData.length === 0) {
    // return <div className="text-center p-4">No attendance data available</div>;

    <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-red-500 font-medium text-center p-4">
          No attendance data available
        </div>
      </div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >

<defs>
          {/* Present Gradient */}
          <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8bc34a" stopOpacity={1} />
            <stop offset="95%" stopColor="#689f38" stopOpacity={0.4} />
          </linearGradient>

          {/* Absent Gradient */}
          <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF5722" stopOpacity={1} />
            <stop offset="95%" stopColor="#d84315" stopOpacity={0.4} />
          </linearGradient>
        </defs>


        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="username" />
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
        {/* <Bar dataKey="Present" fill="#8bc34a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Absent" fill="#FF5722" radius={[4, 4, 0, 0]} /> */}


        <Bar 
          dataKey="Present" 
          fill="url(#presentGradient)" 
          radius={[14, 14, 0, 0]}
          
        />
        <Bar 
          dataKey="Absent" 
          fill="url(#absentGradient)" 
          radius={[14, 14, 0, 0]}
          
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClassAttendanceChart;