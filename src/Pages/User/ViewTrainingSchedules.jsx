import React, { useState, useEffect } from "react";
import "../../Styles/ViewTrainingSchedules.css";
import Header from "../../Components/Header";
import axios from "axios";
import moment from "moment";
import session from "../../assets/session.png";
import toast, { Toaster } from "react-hot-toast";

const ViewTrainingSchedules = () => {
  const [mockSchedules, setMockTrainingSchedules] = useState([]);
  const userId = sessionStorage.getItem("userId");

  const fetchTrainingSchedules = async () => {
    try {
      console.log("Inside fetchTrainingSchedules");
      

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/gettrainer-schedules/${userId}`
      );
      console.log("response is:", response);
      console.log("response data is:", response.data);

      const sortedData = response.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Extract session name and time
      const formattedSessions = sortedData.map((session) => ({
        sessionName: session.sessionName,
        time: session.time,
        date: session.date,
      }));

      // Set state
      setMockTrainingSchedules(formattedSessions);
    } catch (error) {
      console.error("error at fetching training schedules", error);
      toast.error("Error fetching trainer schedules")
    }
  };

  useEffect(() => {
    fetchTrainingSchedules();
  }, []);

  // Function to format date
  // const formatDate = (dateString) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric'
  //   });
  // };

  // Function to format time
  // const formatTime = (timeString) => {
  //   return new Date(`2025-01-01T${timeString}`).toLocaleTimeString('en-US', {
  //     hour: 'numeric',
  //     minute: '2-digit'
  //   });
  // };

  return (
    <>
      <Header />
      <div className="schedule-management-container">
        <h2 className="">Training Schedules</h2>

        <div className="img-container-session">
          <img src={session} alt="session" />
        </div>

        <div className="main-section-for-schedules">
          <div className="header-section mb-4">
            <p className="">View all upcoming training sessions</p>
          </div>

          <div className="schedule-container-main">
            {/* <div className="view-row mt-5"> */}
            {console.log("mockSchedules:", mockSchedules)}
            {mockSchedules.map((schedule, index) => (
              <div key={index} className="col-md-4">
                <div className="view-schedule-card">
                  <div className="view-card-header">
                    <h3>{schedule.sessionName}</h3>
                  </div>
                  <div className="view-card-body">
                    <div className="schedule-info">
                      <div className="info-row">
                        {/* <span className="info-label">Date:</span> */}
                        <span className="info-value">
                          {moment(schedule.date).format("DD-MM-YYYY")}
                        </span>
                      </div>
                      <div className="info-row">
                        {/* <span className="info-label">Time:</span> */}
                        <span className="info-value">
                          {moment(schedule.time, "HH:mm").format("hh-mm A")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* </div> */}
          </div>

          {mockSchedules.length === 0 && (
            <div className="text-center py-5">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  height: "120px",
                }}
              >
                <p
                  style={{ color: "red", marginTop: "50px", fontSize: "24px" }}
                >
                  No training schedules available right now !
                </p>
              </div>{" "}
            </div>
          )}
        </div>
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

export default ViewTrainingSchedules;
