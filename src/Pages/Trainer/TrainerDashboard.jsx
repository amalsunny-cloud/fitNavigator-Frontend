import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar as RechartsBar,
  Bar,
  LineChart,
  Line as RechartsLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

import { Activity, Calendar, Users, MessageSquare, Award, Bell } from "lucide-react";

import { Lock, Check, X } from "lucide-react";


import "../../Styles/TrainerDashboard.css";
import TrainerHeader from "../../Components/Trainer/TrainerHeader";
import TrainerProfile from "../../Components/Trainer/TrainerProfile";
import axios from "axios";
import ClassAttendanceChart from "../../Components/Trainer/ClassAttendanceChart";
import MemberProgressChart from "../../Components/Trainer/MemberProgressChart";
import DonutChartSingle from "../../Components/Trainer/DonutChartSingle";
import TrainerChangePassword from "../../Components/Trainer/TrainerChangePassword";


const TrainerDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [trainer, setTrainer] = useState([]);
  const [bmiDashboardPercentage, setBmiDashboardPercentage] = useState(0);
  const [muscleProgressDashboard, setMuscleProgressDashboard] = useState(0);
  const [enduranceDashboardPercentage, setEnduranceDashboardPercentage] =
    useState(0);

  const [userAttendanceTrainerDashboard, setUserAttendanceTrainerDashboard] =
    useState([]);
  const [totalUserAttendanceTrainerDashboard, setTotalUserAttendanceTrainerDashboard] =
    useState(0);

  const [retrievingBmiChart,setRetrievingBmiChart] = useState([]);
  const [classScheduleCount,setClassScheduleCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [countNotificationTrainerDashboard, setCountNotificationTrainerDashboard] = useState(0);
  const [countAdminMessageTrainerDashboard, setCountAdminMessageTrainerDashboard] = useState(0);
  const [totalMessagesCount, setTotalMessagesCount] = useState(0);

  //   const array = ['apple', 'banana', 'orange', 'apple', 'kiwi'];

  // const hasDuplicates = array.some((item, index) => array.indexOf(item) !== index);
  // console.log("hasDuplicates is:", hasDuplicates);

  // if (hasDuplicates) {
  //     console.log('There are duplicates in the array.');
  // } else {
  //     console.log('No duplicates found.');
  // }

  const trainerId = sessionStorage.getItem("trainerId");
  console.log("trainerId is:", trainerId);



  

  const fetchTrainerData = async () => {
    try {
      // console.log("inside the fetchTrainerData frontend");
      // console.log("trainerId iss:", trainerId);
      if (!trainerId) {
        console.error("Trainer ID not found in sessionStorage");
        return;
      }

      const response = await axios.get(
        `http://localhost:3000/fetch-trainerdata/${trainerId}`
      );
      // console.log("response after fetchTrainerData", response.data);
      setTrainer(response.data);
    } catch (error) {
      console.error("Error at fetchTrainerData frontend");
      setTrainer("");
    }
  };

  useEffect(() => {
    fetchTrainerData();
    fetchTodaysClassSchedulingsTrainerDashboard();
  }, []);

  const classAttendanceData = [
    { month: "Jan", value: 85 },
    { month: "Feb", value: 82 },
    { month: "Mar", value: 88 },
    { month: "Apr", value: 90 },
    { month: "May", value: 86 },
    { month: "Jun", value: 89 },
    { month: "Jul", value: 87 },
  ];

  const memberProgressData = [
    { month: "Jan", value: 75 },
    { month: "Feb", value: 78 },
    { month: "Mar", value: 80 },
    { month: "Apr", value: 82 },
    { month: "May", value: 85 },
    { month: "Jun", value: 88 },
    { month: "Jul", value: 90 },
  ];

  const [numUser, setNumUser] = useState(0);

  // const stats = [
  //   { title: "Assigned Members", value: numUser },
  //   { title: "Today's Classes", value: classScheduleCount || "Nil" },
  //   { title: "Average Attendance", value: `${totalUserAttendanceTrainerDashboard} % ` || "Nil" },
  //   { title: "notifications", value: "4" },
  // ];





  const stats = [
    { 
      title: "Assigned Members", 
      value: numUser,
      icon: <Users size={24} />,
      gradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"
    },
    { 
      title: "Today's Classes", 
      value: classScheduleCount || "Nil",
      icon: <Calendar size={24} />,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
    },
    { 
      title: "Avg Attendance", 
      value: `${totalUserAttendanceTrainerDashboard}%` || "Nil",
      icon: <Activity size={24} />,
      gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
    },
    { 
      title: "Notifications", 
      value: totalMessagesCount,
      icon: <Bell size={24} />,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
    },
  ];




  const sidebarStyle = {
    position: "fixed",
    top: "0",
    left: isMenuOpen ? "0" : "-400px",
    width: "400px",
    height: "100%",
    // backgroundColor: '#8594e4',
    background: "linear-gradient(to right, #8594e4, #37476d)",

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

  const buttonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "10px 20px",
    // backgroundColor: "#18daff",
    backgroundColor: "#394a51",
    width: "100px",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "0px 0px 20px 0px",
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
    backgroundColor: " #37476d",
  };

  const cardStyle = {
    backgroundColor: "#cce5ff", // Light blue background
    background: "linear-gradient(to right, #eeeeee, #cce5ff)",

    border: "1px solid #b8daff", // Matching border color
    borderRadius: "8px",
    padding: "20px",
    margin: "25px 0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    textDecoration: "none",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#004085", // Dark blue text for better contrast
    fontWeight: "bold",
    fontSize: "18px",
  };


  // const fetchNotificationsToTrainerDashboard = async()=>{
  //   try{
  //     console.log("Inside the notificationsToTrainerDashboard");
  //     const response = await axios.get(`http://localhost:3000/fetchNotificationsToTrainerDashboard/${trainerId}`)
  //     console.log("After the response of notificationTrainer :", response.data.count);

  //     setCountNotificationTrainerDashboard(response.data.count)
      
  //   }
  //   catch(error){
  //     console.error("Error at the frontend notificationsToTrainerDashboard");
  //     toast.error("Error fetching notifications")
  //   }
  // }

  // const fetchAdminMessageForTrainerDashboard = async()=>{
  //   try{
  //     console.log("Inside the fetchAdminMessageForTrainerDashboardd");
  //     const response = await axios.get('http://localhost:3000/fetchAdminMessageForTrainerDashboard')
  //     console.log("After the response of admin messages :", response.data.count);

  //     setCountAdminMessageTrainerDashboard(response.data.count)
  //     updateTotalMessagesForTrainerDashboard(count)
  //   }
  //   catch(error){
  //     console.error("Error at the frontend fetchAdminMessageForTrainerDashboard");
  //     toast.error("Error fetching admin messages")
  //   }
  // }


  // const updateTotalMessagesForTrainerDashboard = (notificationCount,adminMessageCount)=>{
  //   setTotalMessageCount(notificationCount + adminMessageCount)
  // }





  const fetchNotificationsToTrainerDashboard = async () => {
    try {
      console.log("Inside the notificationsToTrainerDashboard");
      const response = await axios.get(`http://localhost:3000/fetchNotificationsToTrainerDashboard/${trainerId}`);
      console.log("After the response of notificationTrainer:", response.data.count);

      setCountNotificationTrainerDashboard(response.data.count);
      // updateTotalMessages(response.data.count, countAdminMessageTrainerDashboard); // Update total
    } catch (error) {
      console.error("Error at the frontend notificationsToTrainerDashboard");
      toast.error("Error fetching notifications");
    }
  };

  const fetchAdminMessageForTrainerDashboard = async () => {
    try {
      console.log("Inside the fetchAdminMessageForTrainerDashboard");
      const response = await axios.get("http://localhost:3000/fetchAdminMessageForTrainerDashboard");
      console.log("After the response of admin messages:", response.data.count);

      setCountAdminMessageTrainerDashboard(response.data.count);
      // updateTotalMessages(countNotificationTrainerDashboard, response.data.count); 
    } catch (error) {
      console.error("Error at the frontend fetchAdminMessageForTrainerDashboard");
      toast.error("Error fetching admin messages");
    }
  };

  // Function to update the total count
  // const updateTotalMessages = (notificationCount, adminMessageCount) => {
  //   setTotalMessagesCount(notificationCount + adminMessageCount);
  // };
  

  useEffect(() => {
    setTotalMessagesCount(countNotificationTrainerDashboard + countAdminMessageTrainerDashboard);
  }, [countNotificationTrainerDashboard, countAdminMessageTrainerDashboard]); 


  const fetchTodaysClassSchedulingsTrainerDashboard = async()=>{
    try{
      console.log("Inside the fetchTodaysClassSchedulingsTrainerDashboard");
      const response = await axios.get(`http://localhost:3000/fetchTodaysClassSchedulingsTrainerDashboard/${trainerId}`)
      console.log("response.data iss:",response.data);
      const ScheduleCount = response.data.length;
      console.log("ScheduleCount:",ScheduleCount);
      
      setClassScheduleCount(ScheduleCount)


      
    }catch(error){
      console.error("Error at the fetchTodaysClassSchedulingsTrainerDashboard");
      
    }
  }

  const getuserattendance = async () => {
    try {
      // console.log("inside the getuserattendance frontend");
      const response = await axios.get(
        `http://localhost:3000/getuserattendance/${trainerId}`
      );
      // console.log("response after getuserattendance:", response.data);
      console.log("response after getuserattendance:", response.data.data);

      const totalCount = response.data.data.length;
     
      const presentCount  = response.data.data.filter(entry=>entry.status === 'Present').length
      console.log("presentCount :", presentCount );

      const percentagePresent = (presentCount/totalCount)*100;
      console.log("percentagePresent:",percentagePresent);
      
      const formattedPercentagePresent = percentagePresent.toFixed(2);
     console.log("formattedPercentagePresent:",formattedPercentagePresent);
     
      setTotalUserAttendanceTrainerDashboard(formattedPercentagePresent);
      setUserAttendanceTrainerDashboard(response.data);
    } catch (error) {
      console.error("Error at getuserattendance function");
    }
  };

  const fetchTrainersUsers = async () => {
    try {
      // console.log("inside the fetchTrainersUsers frontend");
      const response = await axios.get(
        `http://localhost:3000/get-all-users/${trainerId}`
      );
      // console.log("response after getting:", response.data);
      const count = response.data.data.length;
      // console.log("count is :", count);
      setNumUser(count);
    } catch (error) {
      console.error("Error at fetchTrainersUsers function");
    }
  };
  useEffect(() => {
    fetchTrainersUsers();
    fetchAllUsersProgressOfTrainer();
    getuserattendance();
    fetchNotificationsToTrainerDashboard()
    fetchAdminMessageForTrainerDashboard()
  }, []);

  const fetchAllUsersProgressOfTrainer = async () => {
    try {
      // console.log("inside the frontend fetchAllUsersProgressOfTrainer");
      const response = await axios.get(
        `http://localhost:3000/fetchTrainer-all-user-progress/${trainerId}`
      );

      // console.log("response in 194:", response.data);

      const sortedProgress = response.data.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split("/");
        const [dayB, monthB, yearB] = b.date.split("/");

        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

        return dateB - dateA;
      });

      // console.log("sortedProgress:", sortedProgress);

      const latestTwoProgress = sortedProgress.slice(
        0,
        Math.min(2, sortedProgress.length)
      );

      // console.log("latestTwoProgress:", latestTwoProgress);
      const fitnessGoalAccessed = latestTwoProgress[0].fitnessGoal;
      // console.log("fitnessGoalAccessed:", fitnessGoalAccessed);

      if (fitnessGoalAccessed === "Weight Loss") {
        // Extract BMI values and convert to numbers
        const latestProgressData = latestTwoProgress.map(
          (entry) => entry.progressData
        );
        // console.log("latestProgressData:", latestProgressData);

        const retrievingBmi = latestProgressData.map((data) =>
          parseFloat(data.bmi)
        );
        // console.log("retrievingBmi:", retrievingBmi);

        setRetrievingBmiChart(retrievingBmi)

        const idealBmi = 21.75;

        // Calculate BMI difference for each entry
        const differencesBmi = retrievingBmi[0] - retrievingBmi[1];
        // console.log("differencesBmi:", differencesBmi);

        // Determine progress
        const initialBmi = retrievingBmi[1]; // Older BMI
        const latestBmi = retrievingBmi[0]; // Latest BMI

        if (latestBmi < initialBmi) {
          console.log("Progress: User has lost weight (BMI is decreasing)");
        } else if (latestBmi > initialBmi) {
          console.log("Progress: User has gained weight (BMI is increasing)");
        } else {
          console.log("Progress: No change in BMI");
        }

        // Calculate improvement percentage towards ideal BMI
        const progressPercentages =
          ((initialBmi - latestBmi) / (initialBmi - idealBmi)) * 100;
        // console.log("Progress BMI:", progressPercentages, "%");
        const progressPercentage = progressPercentages.toFixed(2);
        // console.log("Progress Towards Ideal BMI:", progressPercentage, "%");

        setBmiDashboardPercentage(progressPercentage);
      } else if (fitnessGoalAccessed === "Muscle Building") {
        const latestProgressData = response.data.map(
          (data) => data.progressData
        );
        console.log("latestProgressData:", latestProgressData);

        const latest = latestProgressData[0];
        const previous = latestProgressData[1];

        const measurementKeys = ["chest", "legs", "arms", "waist", "shoulders"];

        const progressComparison = measurementKeys.map((key) => {
          const latestValue = latest[key] || 0;
          const previousValue = previous[key] || 0;
          const difference = latestValue - previousValue;

          const progressPercentage = (
            (difference / previousValue) *
            100
          ).toFixed(2);
          // console.log("progressPercentage  is:",progressPercentage  );

          return {
            measurement: key,

            progressPercentage: `${progressPercentage}%`,
          };
          // const progressPercentage = progressPercentages.toFixed(2);
          // console.log("progressPercentage after:",progressPercentage );
        });
        // console.log("progressComparison is:", progressComparison);



        // const addedPercentage = progressComparison.map((a,b)=>a+b)
        // console.log("addedPercentage is:",addedPercentage );

        const totalProgressPercentages = progressComparison
          .map((item) => parseFloat(item.progressPercentage)) // Convert "%"-string to number
          .reduce((sum, value) => sum + value, 0); // Sum all values

        // console.log("Total Progress Percentage:", totalProgressPercentages);

        const totalProgressPercentage = totalProgressPercentages.toFixed(2);
        // console.log(
        //   "Total Progress Percentage fixed:",
        //   totalProgressPercentage
        // );

        setMuscleProgressDashboard(totalProgressPercentage);
      } else if (fitnessGoalAccessed === "Endurance") {
        // console.log("Inside endurance else if");

        const latestProgressData = latestTwoProgress.map(
          (entry) => entry.progressData
        );

        // console.log("endurance latestProgressData", latestProgressData);

        const maxReps = latestProgressData.map((data) =>
          parseInt(data.maxReps)
        );
        // console.log("endurance maxReps:", maxReps);

        const improvement = ((maxReps[0] - maxReps[1]) / maxReps[1]) * 100;
        // console.log("endurance improvement:", improvement);

        setEnduranceDashboardPercentage(improvement.toFixed(2));
      }
    } catch (error) {
      console.error("Error at the frontend fetchAllUsersProgressOfTrainer");
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



<div className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="menu-bar"></div>
        <div className="menu-bar"></div>
        <div className="menu-bar"></div>
      </div>

      {/* Overlay */}
      {/* <div style={overlayStyle} onClick={() => setIsMenuOpen(false)}></div> */}

      <div className={`sidebar-overlay ${isMenuOpen ? 'active' : ''}`} 
           onClick={() => setIsMenuOpen(false)}></div>

      {/* Sidebar */}
      <div className={`glassmorphic-sidebar-trainer ${isMenuOpen ? 'open' : ''}`}>
        <button className="trainer-profile-button hover-scale" onClick={handleShowModal}>
          <Users size={18} />
          Trainer Profile
        </button>

        <div className="navigation-links">
          <Link to="/trainer/trainingschedules" className="hover-scale">
            <Calendar size={20} />
            Schedule Manager
          </Link>
          <Link to="/trainer/markuserattendance" className="hover-scale">
            <Activity size={20} />
            Attendance Tracker
          </Link>
          <Link to="/trainer/memberperform" className="hover-scale">
            <Award size={20} />
            Performance Hub
          </Link>
          <Link to="/trainer/workoutdiet" className="hover-scale">
            <Activity size={20} />
            Fitness Programs
          </Link>
          <Link to="/trainer/messages" className="hover-scale">
            <MessageSquare size={20} />
            Communications
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


       <TrainerChangePassword
              show={showPasswordModal}
              onClose={() => setShowPasswordModal(false)}
            />

      <div className="trainer-dashboard-container">
        {/* Header */}
        <div className="dashboard-header-trainer">
          {/* <div> */}
            <h1 className="neon-title">Training Command Center</h1>
            <p className="dashboard-subtitle">Welcome back, {trainer.username} 👋</p>
          {/* </div> */}
          {/* <NotificationBell userId={trainer._id} /> */}
        </div>

        {/* Stats Cards */}
        <div className="metrics-grid">
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
          {/* Class Attendance Chart */}
          <div className="glassmorphic-card">
            <h3 className="chart-title">Class Attendance Analytics</h3>
            <div className="chart-container">
              <ClassAttendanceChart attendanceData={userAttendanceTrainerDashboard} />
            </div>
          </div>

          {/* Specialization Metrics */}
          <div className="glassmorphic-card">
            <h3 className="chart-title">Specialization Performance</h3>
            <div className="specialization-metrics">
              {trainer?.specialization === "Weight Loss Coach" && (
                <div className="metric-box">
                  <h4>BMI Improvement</h4>
                  <DonutChartSingle memberProgressPercentage={bmiDashboardPercentage} />
                  <p className="metric-description">{bmiDashboardPercentage}% Progress</p>
                </div>
              )}

              {trainer?.specialization === "Muscle Building Coach" && (
                <div className="metric-box">
                  <h4>Muscle Growth</h4>
                  <DonutChartSingle memberProgressPercentage={muscleProgressDashboard} />
                  <p className="metric-description" >{muscleProgressDashboard}% Overall Gain</p>
                </div>
              )}

              {trainer?.specialization === "Endurance Coach" && (
                <div className="metric-box">
                  <h4 style={{color:"green",paddingBottom:"10px"}}>Endurance Boost</h4>
                  <DonutChartSingle memberProgressPercentage={enduranceDashboardPercentage} />
                  <p className="metric-description">{enduranceDashboardPercentage}% Progress</p>
                </div>
              )}
            </div>
          </div>

          {/* Member Progress Chart */}
          <div className="glassmorphic-card">
            <h3 className="chart-title">Member Progress Overview</h3>
            <div className="chart-container">
              <MemberProgressChart memberProgress={retrievingBmiChart} />
            </div>
          </div>
        </div>

        <TrainerProfile showModal={showModal} handleClose={handleCloseModal} />
      </div>
    </>
  );
};

export default TrainerDashboard;
