import React, { useEffect, useState } from "react";
import "../../Styles/TrainingSchedules.css";
import TrainerHeader from "../../Components/Trainer/TrainerHeader";
import axios from "axios";
import moment from "moment";

import toast, { Toaster } from "react-hot-toast";

const TrainingSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    sessionName: "",
    date: "",
    time: "",
    username: "",
  });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [userOfTrainer, setUserOfTrainer] = useState([]);

  const trainerId = sessionStorage.getItem("trainerId");
  console.log("trainerId is :", trainerId);

  const fetchAssignedUsersOfTrainer = async () => {
    try {
      console.log("Inside fetchAssignedUsersOfTrainer function");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/trainer-fetchAssign-users/${trainerId}`
      );
      console.log("response of fetchAssignedUsersOfTrainer:", response.data);

      const mappedData = response.data.map((entry, index) => ({
        userId: entry.user._id, // Store user ID
        username: entry.user.username, // Store username
      }));
      console.log("mappedData:", mappedData);

      setUserOfTrainer(mappedData);
    } catch (error) {
      console.error("Error at frontend fetchAssignedUsersOfTrainer", error);
      toast.error("Failed to fetch assigned users");
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/add-schedules`);
      setSchedules(response.data);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      toast.error("Failed to fetch schedules");
    }
  };

  useEffect(() => {
    fetchAssignedUsersOfTrainer();
    fetchSchedules();
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        console.log("Inside of getData function");

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/add-schedules`);
        console.log(response.data);
        setSchedules(response.data);
      } catch (err) {
        console.log("error", err);
      }
    };
    getData();
  }, []);

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "userId") {
      const selectedUser = userOfTrainer.find((user) => user.userId === value);
      setFormData({
        ...formData,
        username: selectedUser.username,
        userId: selectedUser.userId,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: formData.userId,
        sessionName: formData.sessionName,
        date: formData.date,
        time: formData.time,
        trainerId: trainerId,
      };

      
      console.log("payload.date is 239:", formData.time);

      if (editingSchedule) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/update-schedules/${editingSchedule._id}`,
          payload
        );
        toast.success("Schedule updated successfully!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/add-schedules`, {
          ...payload,
          username: formData.username,
        });
        toast.success("Schedule added successfully!");
      }

      await fetchSchedules(); // Refetch schedules to update the list
      setFormData({
        userId: "",
        sessionName: "",
        date: "",
        time: "",
        username: "",
      });
      setEditingSchedule(null);
    } catch (err) {
      console.error("Error handling schedule:", err);
      toast.error("Failed to save schedule");
    }
  };

  const handleEditSchedule = (schedule) => {
    setFormData({
      userId: schedule.userId._id,
      username: schedule.userId.username,
      sessionName: schedule.sessionName,
      date: moment(schedule.date).format("YYYY-MM-DD"),
      time: schedule.time,
    });
    setEditingSchedule(schedule);
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/delete-schedules/${scheduleId}`
      );
      toast.success("Schedule deleted successfully!");

      await fetchSchedules(); // Refetch schedules after deletion
    } catch (err) {
      console.error("Error deleting schedule:", err);
      toast.error("Failed to delete schedule");
    }
  };

  return (
    <>
      <TrainerHeader />
      <div className="training-schedules">
        <h1>Training Schedules</h1>

        <div className="training-sub-schedules">
          <form className="form-container-trainer" onSubmit={handleFormSubmit}>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a user</option>
              {console.log("userOftrainer is:", userOfTrainer)}
              {userOfTrainer.map((user, index) => (
                <option key={index} value={user.userId}>
                  {user.username}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="sessionName"
              placeholder="Session Name"
              value={formData.sessionName}
              onChange={handleInputChange}
              required
            />
            <br />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="custom-date-input"
              required
            />
            <br />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
            <br />
            <button type="submit" className="buttonForAddUpdate">
              {editingSchedule ? "Update Schedule" : "Add Schedule"}{" "}
            </button>
          </form>

          <div className="schedule-list">
            {console.log("schedules in 218:", schedules)}
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <div key={schedule._id} className="schedule-item">
                  <div>
                    <p>
                      <strong>User:</strong> <span>{schedule.userId.username}</span>
                    </p>
                    <p>
                      <strong>Session:</strong> <span> {schedule.sessionName} </span>
                    </p>
                    <p>
                      <strong>Date:</strong> <span>   {" "}
                      {moment(schedule.date).format("DD-MM-YYYY")}
                      </span>
                    </p>
                    <p>
                      <strong>Time:</strong>  <span>{schedule.time}</span>
                    </p>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="edit-button-4"
                      onClick={() => handleEditSchedule(schedule)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="delete-button-4"
                      onClick={() => handleDeleteSchedule(schedule._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div 
      style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '350px',  // Adjust height as needed
        width: '100%'
      }}
    >
      <p style={{ color: 'red', margin: 0 ,fontSize:"24px" }}>
        No schedules available.
      </p>
    </div>
            )}
          </div>
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

export default TrainingSchedules;
