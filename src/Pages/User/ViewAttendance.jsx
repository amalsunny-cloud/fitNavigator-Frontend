import React, { useState, useEffect } from "react";
import moment from "moment";
import '../../Styles/ViewAttendance.css'
import Header from "../../Components/Header";
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Calendar,
  Award,
  Download,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { CheckCircle, XCircle } from 'lucide-react';
import { Flame } from 'lucide-react';
import people from '../../assets/people.png';


const ViewAttendance = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceCount, setAttendanceCount] = useState([]);
  const [totalAttendanceData,setTotalAttendanceData] = useState({
    present:"",
    absent:""
  })

  const [attendanceGraphData, setAttendanceGraphData] = useState([]);
  const [motivationMessage, setMotivationMessage] = useState("");
  // const [isLoading, setIsLoading] = useState(true);


  const token = sessionStorage.getItem('userToken');
  const userId = sessionStorage.getItem('userId');



  const downloadPDF = () => {
    const input = document.getElementById("attendance-report");
  
    html2canvas(input, {
      scale: 1, 
      logging: false,
      backgroundColor: "#000000" 
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg"); // Use JPEG compression
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = 200; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Center the image horizontally
      const xPos = (pageWidth - imgWidth) / 2;
      const yPos = 15;
  
      pdf.addImage(imgData, "JPEG", xPos, yPos, imgWidth, imgHeight);
  
      let heightLeft = imgHeight;
      let position = yPos;
  
      while (heightLeft >= pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", xPos, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save("Attendance-Report.pdf");
    });
  };


  

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      console.log("Inside the fetchAttendanceData function");
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/getuser-attendances`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("fetchAttendanceData response:",response.data);
      setAttendanceData(response.data.data);

      const AttendanceCount = response.data.data.reduce((acc,entry)=>{
        if(entry.status === "Present"){
          acc.present+=1;
        }
        else if (entry.status === "Absent") {
          acc.absent += 1;
        }
        return acc;
      },
      { present: 0, absent: 0 }
      )

      console.log("AttendanceCount is:",AttendanceCount);
      
      setTotalAttendanceData(AttendanceCount)

    } catch (error) {
      console.error("error", error);
    }
  };


  useEffect(() => {
    setAttendanceGraphData([
      { name: "Attendance", Present: totalAttendanceData.present, Absent: totalAttendanceData.absent }
    ]);
  }, [totalAttendanceData]); 


  const calculateStreaks = () => {
    if (!attendanceData || attendanceData.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }
  
    // Sort attendance data by date (oldest to newest)
    const sortedData = [...attendanceData].sort((a, b) => moment(a.date) - moment(b.date));
  
    let longestStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    let lastDate = null;
    let today = moment().startOf('day');
  
    sortedData.forEach((entry) => {
      const entryDate = moment(entry.date).startOf('day');
  
      if (entry.status === "Present") {
        if (lastDate && entryDate.diff(lastDate, 'days') === 1) {
          tempStreak++;  // Continue the streak
        } else {
          tempStreak = 1; // Reset streak if there's a gap
        }
  
        longestStreak = Math.max(longestStreak, tempStreak);
        
        // Check if streak is ongoing till today
        if (entryDate.isSame(today)) {
          currentStreak = tempStreak;
        }
      } else {
        tempStreak = 0;  // Reset streak on an absent day
      }
      lastDate = entryDate;
    });
  
    return { currentStreak, longestStreak };
  };
  
  const { currentStreak, longestStreak } = calculateStreaks();

  


  const generateCalendar = () => {
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");
    const startDay = startOfMonth.day();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= endOfMonth.date(); i++) {
      days.push(moment(currentDate).date(i));
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
  };

  const getDayStyle = (day) => {
    if (!day) return "empty";
    
    // Format both dates to start of day for comparison
    const today = moment().startOf('day');
    const checkDay = day.clone().startOf('day');
    const isToday = checkDay.isSame(today);

    if (!attendanceData || attendanceData.length === 0) {
      return isToday ? "today" : "";
    }

    // Find matching attendance entry
    const attendance = attendanceData.find((entry) => {
      const entryDate = moment(entry.date).startOf('day');
      return entryDate.isSame(checkDay);
    });

    if (attendance) {
      if (attendance.status === "Present") {
        return isToday ? "today present" : "present";
      }
      return isToday ? "today absent" : "absent";
    }

    return isToday ? "today" : "";
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDays = generateCalendar();



  const attendanceForVieweAttendance = async()=>{
    try{
      console.log("Inside the attendanceForUserDashboard function");
      const response  = await axios.get(`${import.meta.env.VITE_API_URL}/fetch-attendance-userdashboard/${userId}`)

     // Extract attendance count
    const attendanceCount = response.data.attendanceCount;
    console.log("User Attendance Count:", attendanceCount);
    setAttendanceCount(attendanceCount)

    }
    catch(error){
      console.error("Error at frontend attendanceForUserDashboard");
    }

  }

  useEffect(()=>{
    attendanceForVieweAttendance();
  },[])


  const motivationalMessages = [
    "Great job! Keep up the consistency! 💪",
    "You're building a strong habit! Stay focused! 🔥",
    "One step closer to your fitness goals! 🏆",
    " Every workout counts! Keep going! 🚀",
    "Discipline beats motivation! Stay committed! 💯",
    "You showed up today, and that's what matters! 👏",
    " Success is the sum of small efforts, repeated daily! ✅"
  ];
  

  const getMotivationMessage = () => {
    if (currentStreak >= 7) {
      return "Wow! A whole week of consistency! Keep pushing! 🏅";
    } else if (currentStreak > 3) {
      return "You're on a roll! Stay consistent! 🔥";
    } else if (currentStreak === 0) {
      return "Every journey starts with a single step. Let's get back on track! 🚶‍♂️";
    }
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  useEffect(() => {
    setMotivationMessage(getMotivationMessage());
  }, [currentStreak]);

  

  return (
    <>
      <Header />

        <div className="attendance-container fade-in">
          <div className="motivation-message">
            <h3>💡 Motivation for You:</h3>
            <p>{motivationMessage}</p>
          </div>
          <div id="attendance-report" className="attendance-report">
            <h5>Attendance Report for {currentDate.format("MMMM YYYY")}</h5>
            <div className="attendance-stats">
              <span><Calendar color="green" size={24}/>Total Days: {attendanceCount}</span>
              <span>        <CheckCircle color="green" size={24} />Present Days: {totalAttendanceData.present}</span>
              <span>        <XCircle color="red" size={24} />Absent Days: {totalAttendanceData.absent}</span>
            {/* <div className="streak-info"> */}
              {/* <h3>Attendance Streaks</h3> */}
              <span>
                <Flame color="orange" size={24} className="me-2" /> Current Streak: {currentStreak} days
              </span>
              <span>
                <Award color="blue" size={24} className="me-2" /> Longest Streak: {longestStreak} days
              </span>
            {/* </div> */}
            </div>

              <div className="img-for-attendance-user">
                <img src={people} alt="people" />
              </div>
            <div className="calendar-header">


              <button onClick={handlePrevMonth}>
                <ChevronLeft size={24} />
              </button>
              <h2>
                <Calendar size={24} className="me-2" /> {currentDate.format("MMMM YYYY")}
              </h2>
              <button onClick={handleNextMonth}>
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="calendar">
              <div className="days-of-week">
                {daysOfWeek.map((day) => (
                  <div key={day} className="day-name">
                    {day}
                  </div>
                ))}
              </div>
              <div className="days-grid">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`day ${getDayStyle(day)}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    title={
                      day
                        ? `${day.format("MMMM D, YYYY")} - ${
                            attendanceData.find((entry) =>
                              moment(entry.date).isSame(day, "day")
                            )?.status || "No data"
                          }`
                        : ""
                    }
                  >
                    {day ? (
                      <>
                        <span>{day.format("D")}</span>
                        {attendanceData.find((entry) =>
                          moment(entry.date).isSame(day, "day")
                        )?.status === "Present" && (
                          <Check size={16} className="status-icon" />
                        )}
                        {attendanceData.find((entry) =>
                          moment(entry.date).isSame(day, "day")
                        )?.status === "Absent" && (
                          <X size={16} className="status-icon" />
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
              <div className="calendar-legend">
                <div className="legend-item">
                  <div className="legend-color present"></div>
                  <span>Present</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color absent"></div>
                  <span>Absent</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color today"></div>
                  <span>Today</span>
                </div>
              </div>
            </div>
            <div className="attendance-percentage">
              <h4>Attendance Percentage</h4>
              <p>
                {attendanceCount > 0
                  ? ((totalAttendanceData.present / attendanceCount) * 100).toFixed(1)
                  : 0}
                %
              </p>
            </div>
            <h3 className="chart-title">Attendance Summary</h3>
            {/* <div style={{ width: "50%", height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceGraphData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="name" stroke="#5c5470" />
                  <YAxis stroke="#5c5470" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "white", border: "none" }}
                  />
                  <Legend />
                  <Bar dataKey="Present" fill="#10B981" barSize={50} />
                  <Bar dataKey="Absent" fill="#EF4444" barSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div> */}





<div style={{ 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '50vh', // or your preferred height
    minHeight: '400px'
}}>
    <div style={{ 
        width: "60%", 
        height: 400,
        backgroundColor: 'rgba(30, 41, 59, 0.7)', // Optional: match your card background
        borderRadius: '24px', // Optional: match your card style
        padding: '20px'
    }}>
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attendanceGraphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                <XAxis dataKey="name" stroke="#5c5470" />
                <YAxis stroke="#5c5470" />
                <Tooltip
                    contentStyle={{ 
                        backgroundColor: "#1e293b",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#F3F4F6"
                    }}
                />
                <Legend />
                <Bar dataKey="Present" fill="#10B981" barSize={50} />
                <Bar dataKey="Absent" fill="#EF4444" barSize={50} />
            </BarChart>
        </ResponsiveContainer>
    </div>
</div>



          <button onClick={downloadPDF} className="download-btn">
            <Download size={20} className="me-2" /> Download PDF
          </button>

          </div>
        </div>
      {/* ) */}
      {/* } */}

      

    </>
  );
};

export default ViewAttendance;