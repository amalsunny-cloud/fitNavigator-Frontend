import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar as RechartsBar,
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Line,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "../../Styles/AdminDashboard.css";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminProfile from "../../Components/Admin/AdminProfile";
import moment from "moment";

import {
  Send,
  Bell,
  User,
  Settings,
  BarChart2,
  DollarSign,
  Users,
  Activity,
} from "lucide-react";
import MemberAttendanceDashboard from "../../Components/Admin/MemberAttendanceDashboard";
import TrainerEngagement from "../../Components/Admin/TrainerEngagement";
import RevenueAnalytics from "../../Components/Admin/RevenueAnalytics";
import AdminChangePassword from "../../Components/Admin/AdminChangePassword";
import { Lock, Check, X } from "lucide-react";

const AdminDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [admin, setAdmin] = useState([]);
  const [fetchedUsersNumber, setFetchedUsersNumber] = useState([]);
  const [fetchedTrainersNumber, setFetchedTrainersNumber] = useState([]);
  const [noPlanUser, setNoPlanUser] = useState([]);
  const [noPlanUserNumber, setNoPlanUserNumber] = useState([]);
  const [attendanceDataForChart, setAttendanceDataForChart] = useState([]);
  const [TrainerAttendanceDataForChart, setTrainerAttendanceDataForChart] =
    useState([]);
  const [amountChart, setAmountChart] = useState([]);
  const [monthlyChart, setMonthlyChart] = useState([]);

  const [totalRevenueValue, setTotalRevenueValue] = useState(0);

  const adminId = sessionStorage.getItem("adminId");
  console.log("adminId is:", adminId);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const gradientColors = [
    { id: "color1", start: "#2c786c", end: "#a6d5c1" }, // Dark green to light green
    { id: "color2", start: "#4f98ca", end: "#a0c4ff" }, // Dark blue to light blue
    { id: "color3", start: "#a83279", end: "#ff758c" }, // Dark pink to light pink
    { id: "color4", start: "#ff9800", end: "#ffcc80" }, // Dark orange to light orange
  ];

  const fetchAllUsers = async () => {
    try {
      // console.log("inside the fetchUsers frontend function");
      const response = await axios.get(
        "http://localhost:3000/admin-fetch-All-users"
      );
      console.log("response after fetching:", response.data);

      const numVariable = response.data.length;
      console.log("response numVariable:", numVariable);

      setFetchedUsersNumber(numVariable);
    } catch (error) {
      console.error("Error at frontend fetchUsers function");
      setFetchedUsersNumber();
    }
  };
  const fetchAllTrainers = async () => {
    try {
      // console.log("inside the fetchUsers frontend function");
      const response = await axios.get(
        "http://localhost:3000/admin-fetch-All-trainers"
      );
      console.log("response after fetchAllTrainers:", response.data);

      const numVariable2 = response.data.length;
      console.log("response numVariable:", numVariable2);

      setFetchedTrainersNumber(numVariable2);
    } catch (error) {
      console.error("Error at frontend fetchUsers function");
      setFetchedTrainersNumber();
    }
  };

  const fetchNoPlanUsers = async () => {
    try {
      console.log("Inside the fetchNoPlanUsers frontend");
      const response = await axios.get(
        "http://localhost:3000/admin-fetchNoPlanUsers"
      );

      console.log("response is:", response.data);
      const numOfNoPlanUser = response.data.length;
      console.log("numOfNoPlanUser is:", numOfNoPlanUser);

      setNoPlanUserNumber(numOfNoPlanUser);
      setNoPlanUser(response.data);
    } catch (error) {
      console.error("Error at frontend fetchNoPlanUsers");
    }
  };

  useEffect(() => {
    fetchNoPlanUsers();
  }, []);

  useEffect(() => {
    fetchAllUsers();
    fetchAllTrainers();
    getTotalRevenue();
    fetchAllUsersAttendances();
    fetchAllTrainersAttendances();
  }, []);

  const fetchAllUsersAttendances = async () => {
    try {
      console.log("Inside the fetchAllUsersAttendances function");
      const response = await axios.get(
        "http://localhost:3000/admin-fetchAllUsersAttendance"
      );

      console.log("response fetchAllUsersAttendances:", response.data);

      let Present = 0;
      let Absent = 0;

      // Loop through attendance data
      response.data.forEach((entry) => {
        if (entry.status === "Present") {
          Present += 1;
        } else if (entry.status === "Absent") {
          Absent += 1;
        }
      });

      const calculatedPresent = Present;
      const calculatedAbsent = Absent;
      const total = calculatedPresent + calculatedAbsent;

      console.log("Total:", total);
      console.log("Total calculatedPresent:", calculatedPresent);
      console.log("Total calculatedAbsent:", calculatedAbsent);

      setAttendanceDataForChart([
        { name: "Present", count: Present, fill: "#4CAF50" },
        { name: "Absent", count: Absent, fill: "#F44336" },
      ]);
    } catch (error) {
      console.error("error at the frontend fetchAllUsersAttendances");
    }
  };

  const fetchAllTrainersAttendances = async () => {
    try {
      console.log("Inside the fetchAllTrainersAttendances function");
      const response = await axios.get(
        "http://localhost:3000/admin-fetchAllTrainersAttendance"
      );

      console.log("response fetchAllTrainersAttendances:", response.data);

      let Present = 0;
      let Absent = 0;

      // Loop through attendance data
      response.data.forEach((entry) => {
        if (entry.status === "Present") {
          Present += 1;
        } else if (entry.status === "Absent") {
          Absent += 1;
        }
      });

      const calculatedPresent = Present;
      const calculatedAbsent = Absent;
      const total = calculatedPresent + calculatedAbsent;

      console.log("Total:", total);
      console.log("Total calculatedPresent:", calculatedPresent);
      console.log("Total calculatedAbsent:", calculatedAbsent);

      setTrainerAttendanceDataForChart([
        { name: "Present", count: Present, fill: "#4CAF50" },
        { name: "Absent", count: Absent, fill: "#F44336" },
      ]);
    } catch (error) {
      console.error("Error at frontend fetchAllTrainersAttendances");
    }
  };

  const getTotalRevenue = async () => {
    try {
      console.log("Inside the getTotalRevenue function");
      const response = await axios.get(
        "http://localhost:3000/admin-fetch-TotalRevenue"
      );

      console.log("response after the getTotalRevenue:", response.data);
      setTotalRevenueValue(response.data);
    } catch (error) {
      console.error("Error at the frontend getTotalRevenue");
    }
  };

  // const revenueForChart = async () => {
  //   try {
  //     console.log("inside the revenueForChart function");
  //     const response = await axios.get(
  //       "http://localhost:3000/admin-fetch-revenueForChart"
  //     );

  //     console.log("response in revenueForChart is:", response.data);

  //     const groupedData = response.data.reduce((acc, entry) => {
  //       const formattedDate = entry.paymentDate.split("T")[0];

  //       if (acc[formattedDate]) {
  //         acc[formattedDate] += entry.amount;
  //       } else {
  //         acc[formattedDate] = entry.amount;
  //       }

  //       return acc;
  //     }, {});

  //     const formattedData = Object.keys(groupedData).map((date) => ({
  //       date,
  //       amount: groupedData[date],
  //     }));
  //     console.log("amount in revenueForChart is:", formattedData);

  //     setAmountChart(formattedData);
  //   } catch (error) {
  //     console.error("Error at the frontend revenueForChart");
  //   }
  // };

  const revenueForChart = async () => {
    try {
      console.log("inside the revenueForChart function");
      const response = await axios.get(
        "http://localhost:3000/admin-fetch-revenueForChart"
      );

      console.log("response in revenueForChart is:", response.data);

      // Process daily data
      const dailyGrouped = response.data.reduce((acc, entry) => {
        const formattedDate = entry.paymentDate.split("T")[0];
        acc[formattedDate] = (acc[formattedDate] || 0) + entry.amount;
        return acc;
      }, {});

      const formattedDailyData = Object.keys(dailyGrouped)
        .map((date) => ({
          date,
          amount: dailyGrouped[date],
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // Process monthly data
      const monthlyGrouped = response.data.reduce((acc, entry) => {
        const month = moment(entry.paymentDate).format("YYYY-MM");
        acc[month] = (acc[month] || 0) + entry.amount;
        return acc;
      }, {});

      const formattedMonthlyData = Object.keys(monthlyGrouped)
        .map((month) => ({
          date: `${month}-01`, // Set to first day of month for proper date parsing
          amount: monthlyGrouped[month],
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setAmountChart(formattedDailyData);
      setMonthlyChart(formattedMonthlyData);
    } catch (error) {
      console.error("Error at the frontend revenueForChart", error);
    }
  };

  const fetchAdminData = async () => {
    try {
      console.log("inside the fetchAdminData frontend");
      console.log("adminId iss:", adminId);
      if (!adminId) {
        console.error("Admin ID not found in sessionStorage");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/fetch-admindata/${adminId}`
      );
      console.log("response after fetchAdminData", response.data);
      setAdmin(response.data);
    } catch (error) {
      console.error("Error at fetchAdminData frontend");
      setAdmin("");
    }
  };

  useEffect(() => {
    fetchAdminData();
    revenueForChart();
  }, []);

  console.log("attendanceDataForChart:", attendanceDataForChart);

  const revenueData = [
    { month: "Jan", value: 5000 },
    { month: "Feb", value: 4000 },
    { month: "Mar", value: 6000 },
    { month: "Apr", value: 7000 },
    { month: "May", value: 8000 },
    { month: "Jun", value: 7500 },
    { month: "Jul", value: 9000 },
  ];

  // const stats = [
  //   { title: "Total Members", value: fetchedUsersNumber },
  //   { title: "Active Trainers", value: fetchedTrainersNumber },
  //   { title: "Monthly Revenue", value: totalRevenueValue },
  //   { title: "Pending Payments", value: noPlanUserNumber },
  // ];

  const stats = [
    {
      title: "Total Members",
      value: fetchedUsersNumber,
      icon: <Users size={24} />,
      gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    },
    {
      title: "Active Trainers",
      value: fetchedTrainersNumber,
      icon: <Activity size={24} />,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    },
    {
      title: "Monthly Revenue",
      value: totalRevenueValue,
      icon: <DollarSign size={24} />,
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    },
    {
      title: "Pending Payments",
      value: noPlanUserNumber,
      icon: <Bell size={24} />,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    },
  ];

  const sidebarStyle = {
    position: "fixed",
    top: "0",
    left: isMenuOpen ? "0" : "-400px",
    width: "350px",
    height: "100%",
    background: "linear-gradient(to right,rgb(87, 101, 107),rgb(35, 52, 70))",
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
    backgroundColor: "#fff",
  };

  const cardStyle = {
    background: "linear-gradient(to right, #eeeeee,rgb(187, 198, 209))",
    border: "1px solid rgb(187, 238, 199)",
    borderRadius: "8px",
    padding: "20px",
    margin: "30px 10px 10px 10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    textDecoration: "none",
  };

  const buttonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "10px 20px",
    backgroundColor: "#394a51",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "0px 0px 20px 0px",
    width: "100px",
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

      <div
        className={`glassmorphic-sidebar ${isMenuOpen ? "open" : ""}`}
        style={sidebarStyle}
      >
        <button
          className="admin-profile-button hover-scale"
          onClick={handleShowModal}
        >
          <User size={18} />
          Admin Profile
        </button>



        <div className="navigation-links">
          <Link
            to="/trackpendingpayment"
            style={linkStyle}
            className="hover-scale"
          >
            <BarChart2 size={20} />
            Payment Analytics
          </Link>
          <Link to="/sendmessages" style={linkStyle} className="hover-scale">
            <Send size={20} />
            Communications
          </Link>
          <Link
            to="/manageattendance"
            style={linkStyle}
            className="hover-scale"
          >
            <Activity size={20} />
            Attendance
          </Link>
          <Link to="/admin/members" style={linkStyle} className="hover-scale">
            <Users size={20} />
            Member Hub
          </Link>
          <Link
            to="/payment-management"
            style={linkStyle}
            className="hover-scale"
          >
            <DollarSign size={20} />
            Billing Center
          </Link>

          {/* <Link to="/admin-change-password" style={linkStyle} className="hover-scale">
            <DollarSign size={20} />
            Change Password
          </Link> */}

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

      <AdminChangePassword
        show={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

      <div className="dashboard-header-admin">
        <h1 className="neon-title">Admin Command Center</h1>
        <p className="dashboard-subtitle">Welcome back, {admin.username} 👋</p>
      </div>

      {/* <div className="dashboard"> */}
      <div className="admin-dashboard-container">
        {/* Header */}
        {/* <div className="admin-header">
          <h1>Welcome, {admin.username} (Admin)</h1>
        </div> */}

        {/* Stats Cards */}
        <div className="metrics-grid-admin">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="metric-card"
              style={{ background: stat.gradient }}
            >
              <div className="metric-icon">{stat.icon}</div>
              <h3 className="metric-title">{stat.title}</h3>
              <p className="metric-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="analytics-grid">
          {/* User Attendance */}
          {console.log("attendanceDataForChart 587:", attendanceDataForChart)}

          <MemberAttendanceDashboard
            attendanceDataForChart={attendanceDataForChart}
          />

          {/* Trainer Attendance */}
          <TrainerEngagement
            TrainerAttendanceDataForChart={TrainerAttendanceDataForChart}
          />

          {/* Revenue Charts */}
          <RevenueAnalytics
            amountChart={amountChart}
            monthlyChart={monthlyChart}
          />
        </div>

        <AdminProfile showModal={showModal} handleClose={handleCloseModal} />
      </div>
    </>
  );
};

export default AdminDashboard;
