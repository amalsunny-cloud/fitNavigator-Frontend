import React, { useContext, useEffect, useState } from "react";
import { Calendar, Edit2, Check, X } from "lucide-react";
import "../../Styles/ManageAttendance.css";
import ViewUserAttendances from "../../Components/Admin/ViewUserAttendances";
import AdminHeader from "../../Components/Admin/AdminHeader";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import moment from "moment";

import toast, { Toaster } from "react-hot-toast";

const ManageAttendance = () => {
  const { trainerName } = useContext(UserContext); // Assuming trainerName is an array of trainers
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [editingRecord, setEditingRecord] = useState(null);
  const [editStatus, setEditStatus] = useState(""); // Added missing state for edit status
  const [viewUserAttendances, setViewUserAttendances] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allTrainersAttendanceRecords, setAllTrainersAttendanceRecords] =
    useState([]);

  // Fetch attendance records
  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/attendance`);
        console.log("Fetched attendance records:", response.data);

        setAttendanceRecords(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch attendance records");
        toast.error("Failed to load attendance records");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendanceRecords();
  }, [selectedDate]);

  const fetchAllTrainersAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/all-day-trainer-attendance`
      );
      console.log("Fetched all trainers attendance records:", response.data);

      setAllTrainersAttendanceRecords(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch attendance records");
      toast.error("Failed to load attendance history");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTrainersAttendanceRecords();
  }, []);

  // Mark attendance
  const markAttendance = async (trainerId, status) => {
    try {
      const existingRecordIndex = attendanceRecords.findIndex(
        (record) =>
          record.trainerId === trainerId &&
          new Date(record.date).toISOString().split("T")[0] === selectedDate
      );

      if (existingRecordIndex !== -1) {
        // Update existing record
        await axios.put(
          `${import.meta.env.VITE_API_URL}/attendance/${attendanceRecords[existingRecordIndex]._id}`,
          { status }
        );

        toast.success("Attendance updated successfully!");
      } else {
        // Add new record
        await axios.post(`${import.meta.env.VITE_API_URL}/attendance`, {
          trainerId,
          date: selectedDate,
          status,
        });
        toast.success("Attendance marked successfully!");
      }

      fetchAllTrainersAttendanceRecords();

      // Explicitly fetch updated attendance data
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/attendance?date=${selectedDate}`
      ); // Adjust endpoint as necessary
      setAttendanceRecords(response.data); // Update state with fresh data

      setError(null); // Clear any errors
    } catch (err) {
      setError("Failed to mark attendance");
      toast.error("Failed to mark attendance");
      console.error(err);
    }
  };

  // Update attendance
  const handleEditSave = async () => {
    try {
      console.log(editingRecord);
      console.log(editStatus);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/attendance/${editingRecord}`,
        {
          status: editStatus,
        }
      );
      console.log("API Response:", response.data);

      setAttendanceRecords((prevRecords) =>
        prevRecords.map((record) =>
          record._id === editingRecord
            ? { ...record, status: editStatus }
            : record
        )
      );
      fetchAllTrainersAttendanceRecords();
      setEditingRecord(null);
      setError(null);
      toast.success("Attendance updated successfully!");
    } catch (err) {
      setError("Failed to update attendance");
      toast.error("Failed to update attendance");
      console.error("Error in handleEditSave:", err);
    }
  };

  // Change the view/hide user attendances
  const handleViewUserAttendances = () => {
    setViewUserAttendances((prev) => !prev);
  };

  // Get attendance status for a trainer on selected date
  const getAttendanceStatus = (trainerId) => {
    const record = attendanceRecords.find(
      (record) =>
        (record.trainerId === trainerId ||
          record.trainerId._id === trainerId) && // Handle both direct and nested trainerId
        new Date(record.date).toISOString().split("T")[0] === selectedDate // Normalize date comparison
    );
    return record ? record.status : "Not Marked";
  };

  const handleEditCancel = () => {
    setEditingRecord(null);
    setEditStatus("");
  };

  const handleEditStart = (record) => {
    setEditingRecord(record._id);
    setEditStatus(record.status);
  };

  return (
    <>
      <AdminHeader />
      <div className="trainer-attendance-container">
        {error && <div className="error-message">{error}</div>}

        {/* <div className="attendance-card"> */}
        <h2 className="card-title">Trainer Attendance Management</h2>

        {/* Date Selection Section */}
        <div className="date-selection">
          <div className="date-picker">
            <Calendar size={20} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="styled-date"
            />
          </div>
          <h6
            style={{ textAlign: "end", cursor: "pointer", color: "white" }}
            onClick={handleViewUserAttendances}
          >
            {viewUserAttendances
              ? "Hide User Attendances"
              : "View User Attendances"}
          </h6>
          {/* {viewUserAttendances && <ViewUserAttendances />} */}

          {viewUserAttendances && (
            <div
              className="modal-overlay-manage-attendance"
              onClick={() => setViewUserAttendances(false)}
            >
              <div
                className="modal-content-manage-attendance"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>User Attendance History</h3>
                <div className="modal-header-manage-attendance">
                  <button
                    className="close-button-manage-attendance"
                    style={{ width: "400px", margin: "auto" }}
                    onClick={() => setViewUserAttendances(false)}
                  >
                    <X size={24} />
                  </button>
                </div>
                <ViewUserAttendances
                  setViewUserAttendances={setViewUserAttendances}
                />
              </div>
            </div>
          )}
        </div>

        {/* Mark Attendance Section */}
        <div className="attendance-marking">
          <h3>
            Mark Attendance for {moment(selectedDate).format("DD-MM-YYYY")}
          </h3>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Trainer Name</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainerName.map((trainer) => (
                <tr key={trainer._id}>
                  <td>{trainer.username || "No Name"}</td>
                  <td>{trainer.specialization || "N/A"}</td>
                  <td>{getAttendanceStatus(trainer._id)}</td>
                  <td>
                    <div className="attendance-actions">
                      <button
                        className={`status-button present ${
                          getAttendanceStatus(trainer._id) === "Present"
                            ? "active"
                            : ""
                        }`}
                        onClick={() => markAttendance(trainer._id, "Present")}
                      >
                        Present
                      </button>
                      <button
                        className={`status-button absent ${
                          getAttendanceStatus(trainer._id) === "Absent"
                            ? "active"
                            : ""
                        }`}
                        onClick={() => markAttendance(trainer._id, "Absent")}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attendance History Section */}
        <div className="attendance-history">
          <h3>Attendance History</h3>
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Trainer Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allTrainersAttendanceRecords
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((record) => (
                  <tr key={record._id}>
                    <td>
                      {moment(new Date(record.date)).format("DD-MM-YYYY")}
                    </td>
                    <td>{record.trainerId?.username || "No Name"}</td>
                    <td>
                      {editingRecord === record._id ? (
                        <select
                          className="edit-select"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      ) : (
                        <span
                          className={`status-badge-manage-attendance ${record.status.toLowerCase()}`}
                        >
                          {record.status}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingRecord === record._id ? (
                        <div className="edit-actions">
                          <button
                            className="save-button"
                            onClick={handleEditSave}
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="cancel-button"
                            onClick={handleEditCancel}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="edit-button"
                          onClick={() => handleEditStart(record)}
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {/* </div> */}
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

export default ManageAttendance;
