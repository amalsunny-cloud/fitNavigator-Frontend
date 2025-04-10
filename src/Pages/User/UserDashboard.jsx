import React, { useState, useEffect, useContext } from "react";
import "../../Styles/UserDashboard.css";
import {
  BarChart,
  Bar as RechartsBar,
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  DollarSign,
  Trophy,
  User,
  MessageSquare,
  BookOpen,
} from "lucide-react";

import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import UserProfile from "../../Components/User/UserProfile";
import axios from "axios";
import { Bar, Legend } from "recharts";
import moment from "moment";
import { Bell } from "lucide-react";
import NotificationBell from "../../Components/User/NotificationBell";
import ScheduleDashboardModal from "../../Components/User/ScheduleDashboardModal";
import { MessageContext } from "../../Context/MessageContext";
import UserChangePassword from "../../Components/User/UserChangePassword";
import { Lock, Check, X } from "lucide-react";

const UserDashboard = () => {
  const { selectedMessageId } = useContext(MessageContext);
  console.log("selectedMessageId in 29:", selectedMessageId);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const handleShowScheduleModal = () => setShowScheduleModal(true);
  const handleCloseScheduleModal = () => setShowScheduleModal(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [user, setUser] = useState([]);
  const [resultedPlan, setResultedPlan] = useState([]);
  const [resultedStatus, setResultedStatus] = useState([]);

  const userId = sessionStorage.getItem("userId");
  // console.log("userId is:",userId);

  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [attendanceCount, setAttendanceCount] = useState(0);
  const [attendanceDatas, setAttendanceDatas] = useState([]);

  const [attendanceGraphData, setAttendanceGraphData] = useState([]);

  const [totalAttendanceData, setTotalAttendanceData] = useState({
    present: "",
    absent: "",
  });

  const [finalPercentage, setFinalPercentage] = useState(0);
  const [progressHistory, setProgressHistory] = useState([]);
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [progressDatas, setProgressDatas] = useState([]);
  const [expiryDateForDashboard, setExpiryDateForDashboard] = useState([]);
  const [combinedDatasDashboard, setCombinedDatasDashboard] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const token = sessionStorage.getItem("userToken");
  // const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/progress-percentage-user/${userId}`
        );
        console.log("User Progress:", response.data);

        if (Object.keys(response.data).length < 2) {
          setProgress("Add one day's data too");
        }
        console.log("User Progress DAta:", response.data.progressPercentage);

        const values = Object.values(response.data.progressPercentage).map(
          (value) => parseFloat(value.replace("%", ""))
        );

        console.log("values:", values);

        const total = values.reduce((sum, value) => sum + value, 0);
        console.log("total:", total);

        const averageChange = total / values.length;
        console.log("averageChange:", averageChange);

        console.log(
          "Overall Progress Percentage:",
          averageChange.toFixed(2) + "%"
        );

        const finalResultPercentage = averageChange.toFixed(2);
        console.log("finalResultPercentage::", finalResultPercentage);

        setProgress(finalResultPercentage);
      } catch (error) {
        console.error("Error fetching progress:", error);
        setError(
          error.response?.data?.message || "Error fetching progress data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProgress();
    }
  }, [userId]);

  const retrieveAdminPaymentReminder = async () => {
    try {
      console.log("Inside the retrieveAdminPaymentReminder function");
      console.log("Inside userId:", userId);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/user-retrieveAdminPaymentReminder/${userId}`
      );

      console.log("response in retrieveAdminPaymentReminder:", response.data);
      setGetReminder(response.data);
    } catch (error) {
      console.error("Error at the frontend retrieveAdminPaymentReminder");
    }
  };

  const fetchUserData = async () => {
    try {
      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/fetch-userdata/${userId}`
      );
      console.log("response after fetchUserData", response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error at fetchUserData frontend");
      setUser("");
    }
  };

  useEffect(() => {
    fetchUserData();
    retrieveAdminPaymentReminder();
    getTrainerSeenMessageNotification();
  }, []);

  const getTrainerSeenMessageNotification = async () => {
    try {
      console.log("Inside the getTrainerSeenMessageNotification");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/getTrainerSeenMessageNotification/${userId}`
      );

      console.log("response after ::", response.data);
    } catch (error) {
      console.error("Error at frontend getTrainerSeenMessageNotification");
    }
  };

  // Sample data for progress chart
  const progressData = [
    { week: "Week 1", weight: 75, strength: 60 },
    { week: "Week 2", weight: 74, strength: 65 },
    { week: "Week 3", weight: 73.5, strength: 70 },
    { week: "Week 4", weight: 72.8, strength: 75 },
    { week: "Week 5", weight: 72, strength: 78 },
    { week: "Week 6", weight: 71.5, strength: 82 },
  ];

  // Sample data for attendance chart
  const attendanceData = [
    { month: "Jan", sessions: 20 },
    { month: "Feb", sessions: 18 },
    { month: "Mar", sessions: 22 },
    { month: "Apr", sessions: 20 },
    { month: "May", sessions: 24 },
    { month: "Jun", sessions: 21 },
  ];

  console.log("resulted plan 177:", resultedPlan);
  console.log("resultedStatus 178:", resultedStatus);
  console.log("combinedDatasDashboard 178:", combinedDatasDashboard);

  // const stats = [
  //   { title: "Current Plan", value: resultedPlan.length>0 ?resultedPlan : "Nil"  },
  //   { title: "Days Attended", value: attendanceCount || "Nil" },
  //   { title: "Progress %", value: progress || "Nil" },
  //   { title: "Schedule & date", value: `${combinedDatasDashboard.sessionName } & ${combinedDatasDashboard.date}  `, clickable: true},
  //   { title: "Payment Status", value: resultedStatus.length>0 ?resultedStatus: "Nil" },
  // ];

  const stats = [
    {
      title: "Current Plan",
      value: resultedPlan.length > 0 ? resultedPlan : "Nil",
      icon: <BookOpen size={20} />,
      gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    },
    {
      title: "Days Attended",
      value: attendanceCount || "Nil",
      icon: <Calendar size={20} />,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    },
    {
      title: "Progress %",
      value: progress || "Nil",
      icon: <Activity size={20} />,
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    },
    {
      title: "Upcoming Session",
      // value: `${combinedDatasDashboard.sessionName} | ${combinedDatasDashboard.date}` ,

      value:
        combinedDatasDashboard.sessionName && combinedDatasDashboard.date
          ? `${combinedDatasDashboard.sessionName} | ${combinedDatasDashboard.date}`
          : "Nil",
      icon: <Trophy size={20} />,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
      clickable: true,
    },
  ];

  const sidebarStyle = {
    position: "fixed",
    top: "0",
    left: isMenuOpen ? "0" : "-400px",
    width: "400px",
    height: "100%",
    // backgroundColor: '#fff',
    background: "linear-gradient(to right,#295f4e,rgb(108, 143, 114))",

    boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
    transition: "left 0.3s ease",
    zIndex: "1000",
    padding: "20px",
  };

  const overlayStyle = {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "999",
    display: isMenuOpen ? "block" : "none",
  };

  const hamburgerStyle = {
    position: "fixed",
    top: "10px",
    left: "10px",
    width: "30px",
    height: "30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    cursor: "pointer",
    zIndex: "1001",
  };

  const barStyle = {
    width: "100%",
    height: "4px",
    margin: "3px",
    marginTop: "3px",
    // backgroundColor: '#fff',
    backgroundColor: "rgb(178, 199, 150)",
  };

  const cardStyle = {
    // backgroundColor: '#d4edda',
    background: "linear-gradient(to right,#eeeeee, #d4edda)",

    border: "1px solid rgb(187, 238, 199)",
    borderRadius: "8px",
    padding: "20px",
    // margin: '45px 0',
    margin: "30px 10px 10px 10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    textDecoration: "none",
  };

  const buttonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px", // Align the button to the top-right
    padding: "10px 20px",
    backgroundColor: "#036e28",
    color: "#fff",
    width: "100px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "0px 0px 20px 0px",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#155724",
    fontWeight: "bold",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  };

  const fetchSchedulesOfUserDashboard = async () => {
    try {
      console.log("Inside the fetchSchedulesOfUserDashboard function");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/fetchScheduleOfUserDashboard/${userId}`
      );

      console.log("response.data is:", response.data);

      const mappedResult = response.data.map((entry, index) => ({
        session: entry.sessionName,
        date: entry.date,
      }));

      console.log("mappedReesult:", mappedResult);

      const latestDatas = mappedResult[mappedResult.length - 1];
      console.log("latestDatas in 292:", latestDatas);

      const latestSession = latestDatas.session;

      const formattedDate = moment(latestDatas.date).format("DD-MM-YYYY");
      console.log("formattedDate in 294:", formattedDate);

      const combineDatas = new Object({
        sessionName: latestSession,
        date: formattedDate,
      });
      console.log("combineDatas 303:", combineDatas);
      setCombinedDatasDashboard(combineDatas);
    } catch (error) {
      console.error("Error at fetchSchedulesOfUserDashboard");
    }
  };
  const fetchPlanForDashboard = async () => {
    try {
      console.log("Inside the frontend fetchPlanForDashboard");
      const fetchedPlan = await axios.get(
        `${import.meta.env.VITE_API_URL}/fetch-plan-userdashboard/${userId}`
      );

      console.log("fetchedPlan:", fetchedPlan.data);
      const planname = fetchedPlan.data;
      const resultPlan = planname.fetchedPlan?.planId?.name;
      const resultStatus = planname.fetchedPlan?.status;

      let endDate;
      if (fetchedPlan.data.fetchedPlan.status === "active") {
        endDate = fetchedPlan.data.fetchedPlan.endDate;
      } else {
        endDate = null;
      }
      const endDatePlan = moment(endDate).format("DD-MM-YYYY");

      console.log("endDatePlan is:", endDatePlan);

      console.log("resultPlan is:", resultPlan);
      console.log("resultStatus is:", resultStatus);
      setResultedPlan(resultPlan);
      setResultedStatus(resultStatus);
      setExpiryDateForDashboard(endDatePlan);
    } catch (error) {
      console.error("Error at frontend:", error);
    }
  };

  useEffect(() => {
    fetchPlanForDashboard();
    fetchSchedulesOfUserDashboard();
  }, []);

  const attendanceForUserDashboard = async () => {
    try {
      console.log("Inside the attendanceForUserDashboard function");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/fetch-attendance-userdashboard/${userId}`
      );

      // Extract attendance count
      const attendanceCount = response.data.attendanceCount;
      console.log("User Attendance Count:", attendanceCount);
      setAttendanceCount(attendanceCount);
    } catch (error) {
      console.error("Error at frontend attendanceForUserDashboard");
    }
  };

  useEffect(() => {
    attendanceForUserDashboard();
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      console.log("Inside the fetchAttendanceData dashboard function");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/getuser-attendances`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("fetchAttendanceData response:", response.data);
      setAttendanceDatas(response.data.data);

      const AttendanceCount = response.data.data.reduce(
        (acc, entry) => {
          if (entry.status === "Present") {
            acc.present += 1;
          } else if (entry.status === "Absent") {
            acc.absent += 1;
          }
          return acc;
        },
        { present: 0, absent: 0 }
      );

      // const calculationForMonth = Object.keys(AttendanceCount).length
      const totalDayss = AttendanceCount.present + AttendanceCount.absent;
      const presentPercentage = (AttendanceCount.present / totalDayss) * 100;
      const final = presentPercentage.toFixed(2);

      setFinalPercentage(final);
      setTotalAttendanceData(AttendanceCount);
    } catch (error) {
      console.error("error", error);
    }
  };

  useEffect(() => {
    setAttendanceGraphData([
      {
        name: "Attendance",
        Present: totalAttendanceData.present,
        Absent: totalAttendanceData.absent,
      },
    ]);
  }, [totalAttendanceData]);

  useEffect(() => {
    fetchProgressHistory();
  }, []);

  // useEffect(() => {
  //   updateChartData(progressHistory);
  // }, [progressHistory, fitnessGoal]);

  useEffect(() => {
    if (progressHistory.length > 0) {
      updateChartData(progressHistory);
    }
  }, [progressHistory]);

  // Update the updateChartData function
  const updateChartData = (rawData) => {
    console.log("Raw  data:", rawData);
    if (!rawData || rawData.length === 0) {
      setProgressDatas([]);
      return;
    }

    // Process data based on fitness goal
    const formattedData = rawData
      .filter((entry) => entry.progressData)
      .map((entry) => {
        const base = {
          date: moment(entry.date, "DD-MM-YYYY").format("DD-MM-YYYY"),
        };

        switch (entry.fitnessGoal) {
          case "Weight Loss":
            return {
              ...base,
              weight: entry.progressData.weight,
              bmi: entry.progressData.bmi,
            };
          case "Endurance":
            return {
              ...base,
              exerciseType: entry.progressData.exerciseType,
              maxReps: entry.progressData.maxReps,
            };
          case "Muscle Building":
            return {
              ...base,
              chest: entry.progressData.chest,
              arms: entry.progressData.arms,
              waist: entry.progressData.waist,
              shoulders: entry.progressData.shoulders,
              legs: entry.progressData.legs,
            };
          default:
            return null;
        }
      })
      .filter(Boolean);

    console.log("Formatted chart data:", formattedData);
    setProgressDatas(formattedData);
  };

  // Update the goalMetrics configuration
  const goalMetrics = {
    "Weight Loss": [
      { key: "weight", name: "Weight (kg)", color: "#AAA669" },
      { key: "bmi", name: "BMI", color: "#047857" },
    ],
    Endurance: [{ key: "maxReps", name: "Max Reps", color: "#D97706" }],
    "Muscle Building": [
      { key: "chest", name: "Chest (cm)", color: "#3B82F6" },
      { key: "arms", name: "Arms (cm)", color: "#8B5CF6" },
      { key: "waist", name: "Waist (cm)", color: "#10B981" },
      { key: "shoulders", name: "shoulders (cm)", color: "#F59E0B" },
      { key: "legs", name: "legs (cm)", color: "#EAEd46" },
    ],
  };

  // Get fitness goal safely
  const userFitnessGoal = progressHistory[0]?.fitnessGoal || "Weight Loss";

  // Updated renderProgressChart function
  const renderProgressChart = () => {
    if (progressDatas.length === 0) {
      return (
        <div className="chart-card" style={{ width: "450px" }}>
          <h3 className="chart-title">Fitness Progress</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              height: "100px",
            }}
          >
            <p style={{ color: "red", marginTop: "100px" }}>
              No progress data available
            </p>
          </div>
        </div>
      );
    }

    const metrics = goalMetrics[userFitnessGoal] || [];

    return (
      <div className="chart-card" style={{ width: "650px" }}>
        <h3 className="chart-title">Fitness Progress ({userFitnessGoal})</h3>
        <div className="chart">
          {console.log("progressDatas:", progressDatas)}
          {/* <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressDatas}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#388e3c" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8bc34a" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {metrics.map((metric, index) => (
                <Bar
                  key={metric.key}
                  dataKey={metric.key}
                  radius={[40, 0, 0, 0]}
                  barSize={70}
                  fill="url(#colorProgress)" 
                />
              ))}
            </BarChart>
          </ResponsiveContainer> */}

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressDatas}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#388e3c" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8bc34a" stopOpacity={0.9} />
                </linearGradient>
                <linearGradient id="colorBMI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1976d2" stopOpacity={1} />
                  <stop offset="100%" stopColor="#64b5f6" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="weight"
                radius={[12, 12, 0, 0]}
                barSize={70}
                fill="url(#colorWeight)"
                name="Weight (kg)"
              />
              <Bar
                dataKey="bmi"
                radius={[1, 12, 0, 0]}
                barSize={70}
                fill="url(#colorBMI)"
                name="BMI"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  // Update fetchProgressHistory function
  const fetchProgressHistory = async () => {
    try {
      const token = sessionStorage.getItem("userToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/getuserprogress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const rawData = response.data.progressData || [];

      // Remove duplicates
      const uniqueData = rawData.filter(
        (entry, index, self) =>
          index ===
          self.findIndex(
            (e) =>
              new Date(e.date).getTime() === new Date(entry.date).getTime() &&
              e.fitnessGoal === entry.fitnessGoal
          )
      );

      console.log("rawData in 468:", rawData);
      console.log("uniqueData in 469:", uniqueData);

      setProgressHistory(rawData);
      updateChartData(rawData);
    } catch (error) {
      console.error("Error fetching progress history:", error);
    }
  };
  return (
    <>
      {/* Hamburger Menu Icon */}
      {/* <div style={hamburgerStyle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div style={barStyle}></div>
        <div style={barStyle}></div>
        <div style={barStyle}></div>
      </div> */}

      <div
        className="hamburger-menu"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="menu-bar"></div>
        <div className="menu-bar"></div>
        <div className="menu-bar"></div>
      </div>

      {/* Overlay */}
      {/* <div style={overlayStyle} onClick={() => setIsMenuOpen(false)}></div> */}

      <div
        className={`sidebar-overlay ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className={`glassmorphic-sidebar ${isMenuOpen ? "open" : ""}`}>
        <button
          className="user-profile-button-hover-scale"
          onClick={handleShowModal}
        >
          <User size={18} style={{ marginRight: "7px" }} />
          My Profile
        </button>

        <div className="navigation-links">
          <Link to="/user/viewassignedplans" className="hover-scale">
            <Activity size={20} />
            Workout Plans
          </Link>
          <Link to="/user/checkmembership" className="hover-scale">
            <DollarSign size={20} />
            Membership
          </Link>
          <Link to="/user/trackworkout" className="hover-scale">
            <Trophy size={20} />
            Progress Tracking
          </Link>
          <Link to="/user/viewattendance" className="hover-scale">
            <Calendar size={20} />
            Attendance
          </Link>
          <Link to="/user/viewtraining" className="hover-scale">
            <Calendar size={20} />
            Schedule
          </Link>
          <Link to="/user/messageUser" className="hover-scale">
            <MessageSquare size={20} />
            Messages
          </Link>

          <Link
            onClick={() => setShowPasswordModal(true)}
            style={linkStyle}
            className="hover-scale"
          >
            <Lock size={20} />
            Change Password
          </Link>
        </div>
      </div>

      <UserChangePassword
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <div className="user-dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="neon-title-user">User Dashboard</h1>
          <div className="header-controls">
            <NotificationBell userId={user._id} />
            <p className="dashboard-subtitle-user">
              Welcome back, {user.username} 👋
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="metrics-grid">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`metric-card ${stat.clickable ? "clickable" : ""}`}
              style={{ background: stat.gradient }}
              // onClick={stat.clickable ? handleShowScheduleModal : undefined}
            >
              <div className="metric-icon">{stat.icon}</div>
              <h3 className="metric-title">{stat.title}</h3>
              <p className="metric-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="analytics-grid">
          {/* Attendance Chart */}
          <div className="glassmorphic-card">
            <h3 className="chart-title">Monthly Attendance Performance</h3>
            <div className="chart-container">
              {console.log("attendanceGraphData in 767:", attendanceGraphData)}
              {attendanceGraphData?.length > 0 &&
              attendanceGraphData.some(
                (entry) => entry.Present || entry.Absent
              ) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceGraphData}>
                    <defs>
                      <linearGradient
                        id="presentGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#4f46e5"
                          stopOpacity={1}
                        />
                        <stop
                          offset="100%"
                          stopColor="#818cf8"
                          stopOpacity={0.4}
                        />
                      </linearGradient>
                      <linearGradient
                        id="absentGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#f87171"
                          stopOpacity={0.5}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#FFFFFF" }}
                    />
                    <YAxis
                      tick={{ fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#FFFFFF" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#aAaAfA",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                      }}
                    />

                    <Legend
                      wrapperStyle={{
                        color: "#e2e8f0",
                        fontSize: "0.9rem",
                        paddingTop: "10px",
                      }}
                      formatter={(value) =>
                        value === "Present" ? "Present" : "Absent"
                      }
                    />

                    <Bar
                      dataKey="Present"
                      fill="url(#presentGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="Absent"
                      fill="url(#absentGradient)"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="data-empty-state">
                  <div className="empty-state-icon">📊</div>
                  <p
                    className="empty-state-text"
                    style={{ color: "red", fontSize: "24px" }}
                  >
                    No attendance data available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Chart */}
          <div className="glassmorphic-card">
            <h3 className="chart-title">Fitness Progress Analysis</h3>
            <div className="chart-container">
              {console.log("progressDatas in 875:", progressDatas)}
              {progressDatas?.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={progressDatas}>
                    <defs>
                      {/* Dynamic gradient definitions based on fitness goal */}
                      {goalMetrics[userFitnessGoal]?.map((metric) => (
                        <linearGradient
                          key={`gradient-${metric.key}`}
                          id={`gradient-${metric.key}`}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={metric.color}
                            stopOpacity={1}
                          />
                          <stop
                            offset="95%"
                            stopColor={metric.color}
                            stopOpacity={0.5}
                          />
                        </linearGradient>
                      ))}
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#FFFFFF" }}
                    />
                    <YAxis
                      tick={{ fill: "#9CA3AF" }}
                      axisLine={{ stroke: "#FFFFFF" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#aAaAfA",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                      }}
                    />

                    <Legend />

                    {/* Dynamic bars based on fitness goal */}
                    {goalMetrics[userFitnessGoal]?.map((metric) => (
                      <Bar
                        key={metric.key}
                        dataKey={metric.key}
                        fill={`url(#gradient-${metric.key})`}
                        radius={[6, 6, 0, 0]}
                        name={metric.name}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="data-empty-state">
                  <p
                    className="empty-state-text"
                    style={{ color: "red", fontSize: "24px" }}
                  >
                    No progress data available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <ScheduleDashboardModal
          show={showScheduleModal}
          handleClose={handleCloseScheduleModal}
          schedule={combinedDatasDashboard}
        />
        <UserProfile showModal={showModal} handleClose={handleCloseModal} />
      </div>
    </>
  );
};

export default UserDashboard;
