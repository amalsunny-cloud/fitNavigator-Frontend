import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
} from "recharts";
import Header from "../../Components/Header";
import "../../Styles/TrackWorkout.css";
import axios from "axios";
import moment from "moment";
import scheduleTrack from '../../assets/schedule-track.png';
import toast, { Toaster } from 'react-hot-toast';


const TrackWorkout = () => {
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [inputData, setInputData] = useState({});
  const [progressHistory, setProgressHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [userFitnessGoal, setUserFitnessGoal] = useState("");
  const [streak, setStreak] = useState(0);
  const [consistency, setConsistency] = useState(0);
  const [stats, setStats] = useState({
    weeklyAverage: 0,
    totalWorkouts: 0,
    bmiDistribution: [],
  });

  const [currentBMI, setCurrentBMI] = useState(null);

  const [savedExerciseType, setSavedExerciseType] = useState("");

  useEffect(() => {
    if (chartData.length > 0) {
      calculateStats(chartData);
    }
  }, [chartData]);

  const calculateStats = (data) => {
    console.log("data is:",data);
    
    
    if (!data || data.length === 0) return;

    // const filteredData = chartData;

    // Streak calculation
    let currentStreak = 0;
    const today = new Date();

    console.log("today is s:",today);
    
    const sortedDates = data
    .map((entry) => {
      // Parse date with explicit format using moment
      const date = moment(entry.date, "DD/MM/YYYY").toDate();
      console.log("Parsed date:", date);
      return date;
    })
    .filter(date => !isNaN(date.getTime())) // Filter out invalid dates
    .sort((a, b) => b - a);

      console.log("sortedDates is s:",sortedDates);


    for (let i = 0; i < sortedDates.length; i++) {
      const diff = Math.floor((today - sortedDates[i]) / (1000 * 60 * 60 * 24));

      if (diff <= i + 1) currentStreak++;
      else break;
    }
    setStreak(currentStreak);

    // Consistency calculation
    const weeksTracking = Math.max(1, Math.ceil(data.length / 7));
    console.log("weeksTracking is s:",weeksTracking);

    const consistencyValue = (data.length / weeksTracking).toFixed(1);
    console.log("consistencyValue is s:",consistencyValue);

    setConsistency(consistencyValue);

    // Weekly average for weight loss
    const weeklyAverage =
      data.length > 0
        ? (
            data.reduce((acc, curr) => acc + parseFloat(curr.weight || 0), 0) /
            data.length
          ).toFixed(1)
        : 0;

    // BMI distribution
    const bmiDistribution =
      data.length > 0
        ? [
            {
              name: "Underweight",
              value: data.filter((d) => d.bmi < 18.5).length,
            },
            {
              name: "Normal",
              value: data.filter((d) => d.bmi >= 18.5 && d.bmi < 25).length,
            },
            {
              name: "Overweight",
              value: data.filter((d) => d.bmi >= 25).length,
            },
          ]
        : [];

    // Update stats state
    setStats({
      weeklyAverage,
      totalWorkouts: data.length,
      bmiDistribution,
    });
  };

  const updateChartData = (data) => {
    console.log("data inside updateChartData line 87:", data);

    if (!data || !Array.isArray(data)) {
      console.error("updateChartData: Invalid data received", data);
      return;
    }

    // Ensure fitnessGoal is set before filtering

    const filteredData = data
      .filter((entry) => entry && entry.fitnessGoal === fitnessGoal) // Check entry exists
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log("filteredData in 87:", filteredData);

    if (!fitnessGoal) {
      console.warn("Skipping updateChartData due to missing fitnessGoal.");
      return;
    }

    if (!filteredData.length) {
      console.warn("No data found for fitnessGoal:", fitnessGoal);
    }

    // Use latest entry for each date
    const dateMap = new Map();
    console.log("dateMap in 107:", dateMap);

    filteredData.forEach((entry) => {
      // Ensure date is valid before processing
      console.log("entrytime:", entry.date);

      const dateObj = entry.date;
      console.log("dateObj in 110:", dateObj);

      // if (isNaN(dateObj.getTime())) {
      //   console.error("Invalid date encountered:", entry.date);
      //   return;
      // }

      const dateKey = dateObj;
      console.log("dateKey in 126 ***:", dateKey);

      dateMap.set(dateKey, {
        date: dateKey,
        ...entry.progressData,
      });
    });

    const formattedData = Array.from(dateMap.values());
    console.log("formattedData in 123 *:", formattedData);

    setChartData(formattedData);

    if (formattedData.length > 0) {
      setCurrentBMI(formattedData[formattedData.length - 1].bmi);
    }
  };

  const fetchProgressHistory = async () => {
    try {
      const token = sessionStorage.getItem("userToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/getuserprogress`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.progressData;
      console.log("data line 198:", data);

      // Sort data by date and remove duplicates
      const uniqueData = data.reduce((acc, current) => {
        const existingEntry = acc.find(
          (item) =>
            item.date === current.date &&
            item.fitnessGoal === current.fitnessGoal
        );

        if (!existingEntry) {
          acc.push(current);
        } else if (new Date(current.date) > new Date(existingEntry.date)) {
          // Replace with newer entry
          const index = acc.indexOf(existingEntry);
          acc[index] = current;
        }
        return acc;
      }, []);

      console.log("uniqueData is in 150:", uniqueData);
      setProgressHistory(uniqueData);

      // Set the saved exercise type if there's existing endurance data
      const enduranceData = uniqueData.filter(
        (entry) => entry.fitnessGoal === "Endurance"
      );
      if (enduranceData.length > 0) {
        setSavedExerciseType(enduranceData[0].progressData.exerciseType);
      }

      if (uniqueData.length > 0) {
        const lastGoal = uniqueData[uniqueData.length - 1].fitnessGoal;
        setFitnessGoal(lastGoal);
        setUserFitnessGoal(lastGoal);
      }
      updateChartData(uniqueData);
    } catch (error) {
      console.error("Error fetching progress history:", error);
      toast.error("Error fetching progress history")
    }
  };

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem("userToken");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedGoal = response.data.data.purpose;
      const validGoals = ["Weight Loss", "Endurance", "Muscle Building"];

      if (validGoals.includes(fetchedGoal)) {
        setFitnessGoal(fetchedGoal);
        setUserFitnessGoal(fetchedGoal);
      } else {
        setFitnessGoal("Weight Loss");
        setUserFitnessGoal("Weight Loss");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Error fetching user data")

    }
  };

  

  const postProgress = async (newData) => {
    try {
      const token = sessionStorage.getItem("userToken");

      // Add validation for progress data
      if (!newData || typeof newData !== "object") {
        console.error("Invalid progress data");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/userprogress`,
        {
          fitnessGoal,
          progressData: newData,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle server response
      console.log("response is 293 *:", response.data);

      const serverEntry = response.data.progress;
      console.log("serverEntry is:", serverEntry);

      setProgressHistory((prev) => {
        const existingIndex = prev.findIndex(
          (entry) => entry.date === serverEntry.date
        );
        if (existingIndex === -1) {
          return [...prev, serverEntry];
        } else {
          return prev.map((entry) =>
            entry.date === serverEntry.date ? serverEntry : entry
          );
        }
      });

      toast.success(
        savedExerciseType 
          ? `${savedExerciseType} progress saved!`
          : 'Progress recorded successfully'
      );

      setInputData({});
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Error saving progress")
      // Rollback on error
      setProgressHistory((prev) =>
        prev.filter((entry) => entry.date !== newData.date)
      );
    }
  };

  useEffect(() => {
    fetchProgressHistory();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (progressHistory.length > 0) {
      updateChartData(progressHistory);
    }
  }, [progressHistory]);

  // Function to determine BMI color
  const getBMIColor = (bmi) => {
    if (!bmi) return "#e0e0e0";
    if (bmi < 18.5) return "#42A5F5"; // Underweight - blue
    if (bmi < 25) return "#66BB6A"; // Normal - green
    if (bmi < 30) return "#f1c40f"; // Yellow for Overweight
    return "#FFA726"; // Overweight - orange
  };

  const goalInputComponents = {
    "Weight Loss": () => {
      // Create data for the RadialBarChart
      const bmiData = [
        {
          name: "BMI",
          value: parseFloat(currentBMI || 0),
          fill: getBMIColor(currentBMI),
        },
      ];

      const bmiCategories =
        chartData.length > 0
          ? [
              {
                name: "Underweight (<18.5)",
                value: chartData.filter((d) => d.bmi < 18.5).length,
                fill: "#42A5F5",
              },
              {
                name: "Normal (18.5 - 25)",
                value: chartData.filter((d) => d.bmi >= 18.5 && d.bmi < 25)
                  .length,
                fill: "#66BB6A",
              },
              {
                name: "Overweight (25-29.9)",
                value: chartData.filter((d) => d.bmi >= 25 && d.bmi < 30)
                  .length,
                fill: "#f1c40f",
              },
              {
                name: "Obese (≥30)",
                value: chartData.filter((d) => d.bmi >= 30).length,
                fill: "#e74c3c",
              },
            ]
          : [];

      const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

      // / Data for Gauge Chart (Semi-circle)
      const gaugeData = [
        { name: "Underweight", value: 3.5, fill: "#3498db" },
        { name: "Normal", value: 6.5, fill: "#2ecc71" }, // 25 - 18.5 = 6.5
        { name: "Overweight", value: 5, fill: "#f1c40f" }, // 30 - 25 = 5
        { name: "Obese", value: 10, fill: "#e74c3c" }, // 40 - 30 = 10
      ];

      // Data for PieChart (Each BMI category occupies a portion)
      const data = bmiCategories.map((range) => ({
        name: range.label,
        value: range.max - range.min,
        color: range.color,
      }));

      // Needle position calculation
      console.log("currentBMI here:", currentBMI);

      const initialValueBmi = 0;

      // Restrict BMI range between 15 and 40
      // const clampedBMI = Math.min(Math.max(currentBMI, 15), 40);
      // console.log("clampedBmi here:",clampedBMI);

      const minAngle = -95; // Adjust based on your gauge position
      const maxAngle = 95;

      const parsedBMI = parseFloat(currentBMI) || 0;
      const clampedBMI = Math.min(Math.max(parsedBMI, 15), 40);
      // const needleRotation = ((clampedBMI - 15) / (40 - 15)) * (maxAngle - minAngle) + minAngle;

      const needleRotation = ((clampedBMI - 15) / (40 - 15)) * 180;

      console.log("needleRotation here:", needleRotation);

      return (
        <div className="tracking-section">
          <div className="stats-grid">
            <div className="stats-card-track">
              <div className="bmi-section">
                <h3>BMI Calculator</h3>
                <div className="input-group">
                  <label>Height (cm)</label>
                  <input
                    type="number"
                    value={inputData.height || ""}
                    onChange={(e) =>
                      setInputData({ ...inputData, height: e.target.value })
                    }
                  />
                </div>
                <div className="input-group">
                  <label>Weight (kg)</label>
                  <input
                    type="number"
                    value={inputData.weight || ""}
                    onChange={(e) =>
                      setInputData({ ...inputData, weight: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={() => {
                    if (inputData.height && inputData.weight) {
                      const height = inputData.height / 100;
                      const weight = inputData.weight;
                      const bmi = (weight / (height * height)).toFixed(2);
                      // Update local state immediately
                      setCurrentBMI(bmi);
                      // Update chart data optimistically
                      const newProgressData = {
                        ...inputData,
                        bmi: parseFloat(bmi),
                        date: moment(new Date()).format("DD/MM/YYYY"),
                      };

                      setProgressHistory((prev) => {
                        const newEntry = {
                          fitnessGoal,
                          date: moment(new Date()).format("DD/MM/YYYY"),
                          progressData: newProgressData,
                        };

                        const updated = [...prev, newEntry];
                        updateChartData(updated);
                        return updated;
                      });
                      // Send to server
                      postProgress(newProgressData);
                      toast.success(`BMI ${bmi} recorded successfully!`)
                    }
                    else{
                      toast.error('Please enter both height and weight');
                    }
                  }}
                >
                  Record Progress
                </button>
              </div>
            </div>

            {/* bmi gauge chart section */}
            <div className="stats-card-track">
              <h3>BMI Gauge </h3>
              {gaugeData && gaugeData.length >0 ?(
              <PieChart width={300} height={250}>
                {/* Semi-circle background */}
                {console.log("gaugeData:", gaugeData)}
                <Pie
                  data={gaugeData}
                  dataKey="value"
                  cx="50%"
                  cy="60%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={0}
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>

                {/* Needle */}
                <svg svg width="300" height="200" viewBox="0 0 300 200">
                  <g transform="translate(150,140)">
                    {" "}
                    {/* Center the gauge */}
                    {/* Needle (Line) */}
                    <line
                      x1="0"
                      y1="0"
                      x2="-80" // Shortened for correct length
                      y2="0"
                      stroke="black"
                      strokeWidth="4"
                      transform={`rotate(${needleRotation}, 0, 0)`} // Correct rotation syntax
                    />
                    {/* Needle Pivot (Circle) */}
                    <circle cx="0" cy="0" r="8" fill="black" />
                  </g>
                </svg>

                {/* BMI Value */}
                <text
                  x="155"
                  y="220"
                  textAnchor="middle"
                  // dominantBaseline="middle"
                  // style={{ fontSize: "24px", fontWeight: "bold" }}


                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    fontFamily: "Arial, sans-serif",
                    fill: currentBMI ? 
                      (currentBMI < 18.5 ? "#3498db" :
                      currentBMI < 25 ? "#2ecc71" :
                      currentBMI < 30 ? "#f1c40f" : "#e74c3c") 
                      : "#95a5a6",
                    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    letterSpacing: "0.5px"
                  }}
                >
                  {currentBMI ? `BMI: ${currentBMI}` : "No BMI Data"}
                </text>

                <text
                  x="20"
                  y="175"
                  style={{ fontSize: "12px", fill: "#3498db" }}
                >
                  Underweight
                </text>
                <text
                  x="105"
                  y="175"
                  style={{ fontSize: "12px", fill: "#2ecc71" }}
                >
                  Normal
                </text>
                <text
                  x="160"
                  y="175"
                  style={{ fontSize: "12px", fill: "#f1c40f" }}
                >
                  Overweight
                </text>
                <text
                  x="240"
                  y="175"
                  style={{ fontSize: "12px", fill: "#e74c3c" }}
                >
                  Obese
                </text>
              </PieChart>
              ):(
                <div style={{
                  display:"flex",
                  justifyContent:"center",
                  alignItems:"center",
                  minHeight:"300px"
                }}>
                  <p style={{color:"red",fontSize:"24px"}}>No Data Available</p>
                </div>
              )}
            </div>

            <div className="stats-card-track-new">
              <h3>BMI Distribution</h3>
              {bmiCategories && bmiCategories.length >0 ?(
              <PieChart width={500} height={250}>
                <Pie
                  data={bmiCategories}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ percent }) => ` ${(percent * 100).toFixed(0)}%`}
                >
                  {console.log("bmiCategories 296:", bmiCategories)}
                  {bmiCategories.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
              ):(
                <div style={{
                  display:"flex",
                  justifyContent:"center",
                  alignItems:"center",
                  minHeight:"300px"
                }}>
                  <p style={{color:"red",fontSize:"24px"}}>No data Available</p>
                </div>
              )}
            </div>

            <div className="stats-card-track">
              <h3>Progress Overview</h3>
              <div className="stats-grid-mini-2">
                {/* <div className="stat-item">
                  <span className="stat-value">{streak}</span>
                  <span className="stat-label">Day Streak</span>
                </div> */}
                <div className="stat-item">
                  <span className="stat-value">{stats.weeklyAverage}kg</span>
                  <span className="stat-label">Avg Weight</span>
                </div>
                {/* <div className="stat-item">
                  <span className="stat-value">{consistency}</span>
                  <span className="stat-label">Workouts/Week</span>
                </div> */}
              </div>
            </div>

            {console.log("chartData is 505:", chartData)}
            {chartData.length > 0 && (
              <div className="stats-card-weightProgress">
                <h3>Weight Progress</h3>
                <LineChart width={500} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#8884d8"
                    name="Weight"
                    
                  />
                  <Line
                    type="monotone"
                    dataKey="bmi"
                    stroke="#82ca9d"
                    name="BMI"
                  />
                  <Legend />
                </LineChart>
              </div>
            )}
          </div>
        </div>
      );
    },

    Endurance: () => (
      <div className="tracking-section">
        <div className="stats-grid">
          <div className="stats-card-track">
            <div className="endurance-section">
              <h3>Endurance Tracking</h3>
              <div className="input-group">
                <label>Exercise Type</label>
                {savedExerciseType ? (
                  // If exercise type is already set, show it as read-only
                  <div className="selected-exercise">
                    <strong>
                      {savedExerciseType.charAt(0).toUpperCase() +
                        savedExerciseType.slice(1)}
                    </strong>
                    <p className="exercise-note" style={{color:"red",fontSize:"18px"}}>
                      You've been tracking {savedExerciseType}. To maintain
                      consistent progress tracking, you can't change the
                      exercise type.
                    </p>
                  </div>
                ) : (
                  <select
                    value={inputData.exerciseType || ""}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        exerciseType: e.target.value,
                      })
                    }
                  >
                    {/* <option value="">Select Exercise</option> */}
                    <option value="push-ups">Push-ups</option>
                    <option value="squats">Squats</option>
                    {/* <option value="pull-ups">Pull-ups</option>
                  <option value="burpees">Burpees</option> */}
                    <option value="plank">Plank (seconds)</option>
                  </select>
                )}
              </div>
              <div className="input-group">
                <label>
                  {" "}
                  {savedExerciseType === "plank"
                    ? "Duration (seconds)"
                    : "Repetitions"}
                </label>
                <input
                  type="number"
                  value={inputData.maxReps || ""}
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      maxReps: e.target.value,
                      exerciseType: savedExerciseType || inputData.exerciseType,
                    })
                  }
                />
              </div>
              <button
                className="buttonForRecordProgress"
                onClick={() => {

                  if (!inputData.maxReps) {
                    toast.error('Please enter repetitions/duration');
                    return;
                  }

                  const newData = {
                    ...inputData,
                    date: moment(new Date()).format("DD/MM/YYYY"),
                    exerciseType: savedExerciseType || inputData.exerciseType,
                  };
                  postProgress(newData);
                }}
                disabled={!savedExerciseType && !inputData.exerciseType}
              >
                Record Progress
              </button>
            </div>
          </div>

          {chartData.length > 0 && (
            <>
              <div className="stats-card-track">
                <h3>
                  {savedExerciseType
                    ? `${
                        savedExerciseType.charAt(0).toUpperCase() +
                        savedExerciseType.slice(1)
                      } Progress`
                    : "Progress"}
                </h3>
                <BarChart width={400} height={400} data={chartData.slice(-7)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="maxReps"
                    fill="#8884d8"
                    name={
                      savedExerciseType === "plank"
                        ? "Duration (s)"
                        : "Repetitions"
                    }
                  />
                  <Legend />
                </BarChart>
              </div>

              <div className="stats-card-track">
                <h3>Progress Over Time</h3>
                <LineChart width={400} height={400} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="maxReps"
                    stroke="#82ca9d"
                    name="Repetitions"
                  />
                  <Legend />
                </LineChart>
              </div>

              <div className="stats-card-track">
                <h3>Workout Stats</h3>
                <div className="stats-grid-mini-2">
                  {/* <div className="stat-item">
                    <span className="stat-value">{streak}</span>
                    <span className="stat-label">Day Streak</span>
                  </div> */}
                  <div className="stat-item">
                    <span className="stat-value">{consistency}</span>
                    <span className="stat-label">Workouts/Week</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{progressHistory.length}</span>
                    <span className="stat-label">Total Workouts</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    ),

    "Muscle Building": () => (
      <div className="tracking-section">
        <div className="stats-grid">
          {/* <div className="stats-card">
            
          </div> */}

          <div className="muscle-measurement-section">
            <h3>Body Measurements</h3>
            {["chest", "arms", "waist", "shoulders", "legs"].map(
              (measurement) => (
                <div key={measurement} className="input-group">
                  <label>
                    {measurement.charAt(0).toUpperCase() + measurement.slice(1)}{" "}
                    (cm)
                  </label>

                  <input
                    type="number"
                    value={inputData[measurement] || ""}
                    onChange={(e) =>
                      setInputData({
                        ...inputData,
                        [measurement]: Number(e.target.value),
                      })
                    }
                    min="0"
                  />
                </div>
              )
            )}
            <button
              onClick={() => {
                // Ensure all measurements have values, default to 0 if empty


                const newData = {
                  chest: inputData.chest || 0,
                  arms: inputData.arms || 0,
                  waist: inputData.waist || 0,
                  shoulders: inputData.shoulders || 0,
                  legs: inputData.legs || 0,
                  date: moment(new Date()).format("DD/MM/YYYY"),
                };
                postProgress(newData);
                // toast.success("Measurements recorded")
              }}
            >
              Record Progress
            </button>
          </div>

          {chartData.length > 0 && (
            <>
              <div className="stats-card-track">
                <h3>Measurement Progress</h3>
                <LineChart width={500} height={500} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="chest" stroke="#8884d8" />
                  <Line type="monotone" dataKey="arms" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="waist" stroke="#ffc658" />
                  <Line type="monotone" dataKey="shoulders" stroke="#ff8042" />
                  <Line type="monotone" dataKey="legs" stroke="#0088fe" />
                  <Legend />
                </LineChart>
              </div>

              <div className="stats-card-track">
                <h3>Daily Comparison</h3>
                <BarChart width={400} height={350} data={chartData.slice(-2)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="chest" fill="#8884d8" />
                  <Bar dataKey="arms" fill="#82ca9d" />
                  <Bar dataKey="waist" fill="#ffc658" />
                  <Bar dataKey="shoulders" fill="#ff8042" />
                  <Bar dataKey="legs" fill="#0088fe" />
                  <Legend />
                </BarChart>
              </div>

              <div className="stats-card-track">
                <h3>Workout Stats</h3>
                <div className="stats-grid-mini-2">
                  {/* <div className="stat-item">
                    <span className="stat-value">{streak}</span>
                    <span className="stat-label">Day Streak</span>
                  </div> */}
                  <div className="stat-item">
                    <span className="stat-value">{consistency}</span>
                    <span className="stat-label">Workouts/Week</span>
                  </div>
                  {/* <div className="stat-item">
                    <span className="stat-value">{progressHistory.length}</span>
                    <span className="stat-label">Total Sessions</span>
                  </div> */}
                </div>
              </div>

              <div className="stats-card-track">
                <h3>Measurement Changes</h3>
                <div className="measurement-changes">
                  {["chest", "arms", "waist", "shoulders", "legs"].map(
                    (measurement) => {
                      const initial = chartData[0]?.[measurement] || 0;

                      const current =
                        chartData[chartData.length - 1]?.[measurement] || 0;
                      const change = (current - initial).toFixed(1);
                      const isPositive = change > 0;

                      return (
                        <div
                          key={measurement}
                          className="measurement-change-item"
                        >
                          <span className="measurement-label">
                            {measurement.charAt(0).toUpperCase() +
                              measurement.slice(1)}
                          </span>
                          <span
                            className={`measurement-value ${
                              isPositive ? "positive" : "negative"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {change} cm
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              




              
            </>
          )}
        </div>
      </div>
    ),
  };

  return (
    <>
      <Header />
      <div className="fitness-goal-tracker">
        <h2>Fitness Goal Tracker</h2>
        <div className="goal-selection">
        <span>🎯 <label>Your Fitness Goal </label></span>

          

          {/* <div className="goal-selection-sub"> */}
          <select
            value={fitnessGoal}
            onChange={(e) => {
              setFitnessGoal(e.target.value);
              updateChartData(progressHistory);
            }}
          >
            <option value="">Choose Goal</option>
            <option
              value="Weight Loss"
              disabled={userFitnessGoal !== "Weight Loss"}
            >
              Weight Loss{" "}
              {userFitnessGoal === "Weight Loss" ? "(Your Goal)" : ""}
            </option>
            <option
              value="Endurance"
              disabled={userFitnessGoal !== "Endurance"}
            >
              Endurance {userFitnessGoal === "Endurance" ? "(Your Goal)" : ""}
            </option>
            <option
              value="Muscle Building"
              disabled={userFitnessGoal !== "Muscle Building"}
            >
              Muscle Building{" "}
              {userFitnessGoal === "Muscle Building" ? "(Your Goal)" : ""}
            </option>
          </select>


            <div className="img-for-track-user-workout">
            <img src={scheduleTrack} alt="" />
          </div>
          

          {/* </div> */}
          {fitnessGoal && (
            <span className="goal-note">
              This goal was assigned based on your purpose while registering.
            </span>
          )}
        </div>

        {fitnessGoal && goalInputComponents[fitnessGoal]?.()}
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#4CAF50",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#FF5252",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
};

export default TrackWorkout;
