import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PerformanceModal = ({ user, progressData, onClose }) => {
  const [showChart, setShowChart] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Filter progress data for the selected user
    const userProgressData = progressData.filter(
      (progress) => progress.userId._id === user._id
    );

    console.log("userProgressData in 34:",userProgressData);
    
    if (!userProgressData || userProgressData.length === 0) {
      setChartData(null);
      return;
    }

    const labels = userProgressData.map((entry) =>
      entry.date
    );
    // const labels = userProgressData.map((entry) =>
    //   new Date(entry.date).toLocaleDateString()
    // );

    console.log("labels is:",labels);
    
    let datasets = [];

    // Handle different fitness purposes
    switch (user.purpose) {
      case "Weight Loss":
        datasets = [
          {
            label: "Weight (kg)",
            data: userProgressData.map((entry) => entry.progressData.weight),
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
            fill: true,
          },
          {
            label: "BMI",
            data: userProgressData.map((entry) => entry.progressData.bmi),
            borderColor: "rgba(54,162,235,1)",
            backgroundColor: "rgba(54,162,235,0.2)",
            fill: false,
          },
        ];
        break;

      case "Muscle Building":
        datasets = [
          {
            label: "Chest (cm)",
            data: userProgressData.map((entry) => entry.progressData.chest),
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgb(12, 249, 249)",
            fill: true,
          },
          {
            label: "Shoulder",
            data: userProgressData.map((entry) => entry.progressData.shoulders),
            borderColor: "rgb(255, 48, 93)",
            backgroundColor: "rgb(255, 0, 55)",
            fill: false,
          },
          {
            label: "Arms (cm)",
            data: userProgressData.map(
              (entry) => entry.progressData.arms
            ),
            borderColor: "rgb(39, 197, 139)",
            backgroundColor: "rgb(6, 253, 142)",
            fill: false,
          },
          {
            label: "Waist (cm)",
            data: userProgressData.map(
              (entry) => entry.progressData.waist
            ),
            borderColor: "rgba(235, 220, 54, 0.23)",
            backgroundColor: "rgb(255, 204, 0)",
            fill: false,
          },
          {
            label: "Legs (cm)",
            data: userProgressData.map(
              (entry) => entry.progressData.legs
            ),
            borderColor: "rgb(102, 18, 107)",
            backgroundColor: "rgb(255, 1, 247)",
            fill: false,
          },
        ];
        break;

      case "Endurance":
        datasets = [
          // {
          //   label: "Exercise",
          //   data: userProgressData.map(
          //     (entry) => entry.progressData.exerciseType
          //   ),
          //   borderColor: "rgba(75,192,192,1)",
          //   backgroundColor: "rgba(75,192,192,0.2)",
          //   fill: true,
          //   color:"white",
          // },

          
          {
            label: "Repetitions",
            data: userProgressData.map((entry) => entry.progressData.maxReps),
            borderColor: "rgba(255,99,132,1)",
            backgroundColor: "rgba(255,99,132,0.2)",
            color:"white",
            fill: false,
          },
        ];
        break;

      default:
        datasets = [];
    }

    setChartData({
      labels,
      datasets,
    });
  }, [progressData, user]);

  // const options = {
  //   responsive: true,
  //   scales: {
  //     x: { title: { display: true, text: "Date" } },
  //     y: { title: { display: true, text: "Value" }, beginAtZero: true },
  //   },
  // };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "yellow", // Set legend text color
          font: {
            size: 15, // Optional: Adjust font size
          },
          padding: 20, 
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white", // Tooltip title color
        bodyColor: "yellow", // Tooltip body color
        
        titleFont: {
          size: 16, // Title font size
          weight: "bold",
        },
        bodyFont: {
          size: 14, // Body text font size
        },
        borderWidth: 1, // Border width
      borderColor: "#ffcc00", // Border color
      cornerRadius: 8, 
        padding: 10,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "yellow", // X-axis title color
          font: {
            size: 16, // Increase font size for X-axis title
          },
        },
        ticks: {
          color: "white", // X-axis label color
          font: {
            size: 14,
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
          color: "yellow", // Y-axis title color
          font: {
            size: 16, // Increase font size for X-axis labels
          },
        },
        ticks: {
          color: "white", // Y-axis label color
          font: {
            size: 16,
          },
        },
        beginAtZero: true,
      },
    },
  };
  

  return (
    <div
      className="performance-modal"
      style={{
        background: "rgba(30, 41, 59, 0.7)",
        backdropFilter: "blur(16px)",
        borderRadius: "24px",
        padding: "1.5rem",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <h3 style={{ background: "linear-gradient(90deg, #f95f00, #ffffff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",  }}>{user.username}'s Performance</h3>
      <p style={{ color: "white",fontSize:"20px",letterSpacing:"0.6px" }}>Goal: {user.purpose}</p>

      {chartData ? (
        <>
          {showChart && (
            <div className="chart-container">
              <Line data={chartData} options={options} />
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setShowChart(!showChart)}
              style={{
                padding: "10px",
                // backgroundColor: "#007bff",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              {showChart ? "Hide Charts" : "Show Charts"}
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "10px",
                // backgroundColor: "#dc3545",
                backgroundColor: "#d01609",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </>
      ) : (
        <div style={{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          minHeight:"50px",
          width:"100%"
        }}>
          <p style={{color: "red"}}>No performance data available for {user.username}.</p>

        </div>
      )}
      <style>
        {`
        .performance-modal-container{
                      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

       
        `}
      </style>
    </div>
  );
};

export default PerformanceModal;
