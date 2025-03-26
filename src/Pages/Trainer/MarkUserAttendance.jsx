import React, { useContext, useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Search,
  Calendar,
  UserCheck,
  UserX,
} from "lucide-react";
import "../../Styles/MarkUserAttendance.css";
import TrainerHeader from "../../Components/Trainer/TrainerHeader";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";
import moment from "moment";

import toast, { Toaster } from "react-hot-toast";

const MarkUserAttendance = () => {
  // const userName = useContext(UserContext)
    // const { userName } = useContext(UserContext);
    // console.log("userName is :",userName);
    
  

  const [activeTab, setActiveTab] = useState("mark-attendance");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [attendanceForm, setAttendanceForm] = useState({
    userId: "",
    status: "Present",
  });

  const [getUserAttendanceToday, setGetUserAttendanceToday] = useState([]);
  const [fetchedAssignedTrainerUser, setFetchedAssignedTrainerUser] = useState(
    []
  );
  // console.log(editingId);

  const trainerId = sessionStorage.getItem("trainerId");

  const fetchAssignedUsersofTrainer = async () => {
    try {
      console.log("inside the fetchAssignedUsersofTrainer function");
      console.log("trainerId:",trainerId);
      
      if (!trainerId) {
        console.error("Trainer ID is missing!");
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-all-users?trainerId=${trainerId}`
      );

      console.log("response after:", response.data.data);
      


      



      // Extracting user objects from assignedUsers response
      const users = response.data.data.map((item) => item.user);
      console.log("users in 67:",users);
      
      setFetchedAssignedTrainerUser(users);

    } catch (error) {
      console.error("Error at fetchAssignedUsersofTrainer function", error);
      setFetchedAssignedTrainerUser([]);
    }
  };

  useEffect(() => {
    if (trainerId) {
      fetchAssignedUsersofTrainer();
    }
  }, [trainerId]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      console.log("Inside fetchattendance records try block");
      
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/getuserattendance/${trainerId}`);

      console.log("response is 88:",response.data);
      
      setAttendanceRecords(response.data.data || []); // Ensure data is an array
      setError(null);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("Failed to load attendance records");
      toast.error("Failed to load attendance records");
      setAttendanceRecords([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getuserAttendanceToday = async () => {
    try {
      console.log("Fetching today's attendance...");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/getuser-attendance/today/${trainerId}`
      );

      if (response.data && response.data.data) {
        console.log("Response received:", response.data.data);
        setGetUserAttendanceToday(response.data.data);
      } else {
        console.warn("No attendance data found");
        setGetUserAttendanceToday([]);
      }
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
      setGetUserAttendanceToday([]);
    }
  };

  useEffect(() => {
    getuserAttendanceToday();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attendanceForm.userId) {
      // setError("Please fill in all required fields");
      toast.error("Please select a user");
      return;
    }

    try {
      setLoading(true);
      const trainerId = sessionStorage.getItem("trainerId");

      if (!trainerId) {
        console.error("Trainer not logged in");
        return;
      }
      console.log(trainerId);
      console.log(attendanceForm.userId);
      console.log(attendanceForm.status);

     
      const today = new Date().toISOString().split("T")[0];

      // Check if attendance already exists before submitting
      const isAlreadyMarked = getUserAttendanceToday.some(
        (record) =>
          record.userId === attendanceForm.userId && record.date === today
      );

      if (isAlreadyMarked) {
        toast.error("Attendance for this user is already marked today.");
        setLoading(false);
        return;
      }

      console.log(editingId);

      if (editingId) {
        console.log("before responsePut");

        const responsePut = await axios.put(
          `${import.meta.env.VITE_API_URL}/update-userattendance/${editingId}`,
          {
            userId: attendanceForm.userId,
            trainerId: trainerId,
            status: attendanceForm.status,
          }
        );

        console.log(responsePut);

        setGetUserAttendanceToday((prevData) =>
          prevData.map((item) =>
            item._id === editingId ? responsePut.data.data : item
          )
        );

        toast.success("Attendance updated successfully!");
        setEditingId(null);
      } else {
        console.log("before responsePost");

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/mark-userattendance`,
          {
            userId: attendanceForm.userId,
            trainerId: trainerId,
            status: attendanceForm.status,
          }
        );

        console.log(response.data);
        toast.success("Attendance marked successfully!");
      }

      await fetchAttendanceRecords();
      await getuserAttendanceToday();

      setShowAttendanceForm(false);
      setEditingId(null);
      setAttendanceForm({
        userId: "",
        status: "Present",
      });
      setError(null);
    } catch (error) {
      console.error("Error saving attendance:", error.response);
      toast.error("Failed to save attendance");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [error]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = (record) => {
    setAttendanceForm({
      userId: record.userId?._id.toString() || "",
      // date: record.date,
      status: record.status,
    });
    console.log(record._id);

    setEditingId(record._id);

    setShowAttendanceForm(true);
  };

  useEffect(() => {
    if (editingId !== null) {
      console.log("Updated editingId:", editingId);
    }
  }, [editingId]);

  const handleDelete = async (id) => {
    try {
      console.log(id);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/delete-userattendance/${id}`
      );

      console.log(response);

      setAttendanceRecords((records) =>
        records.filter((record) => record._id !== id)
      );
      await getuserAttendanceToday();
      toast.success("Attendance record deleted successfully!");
    } catch (error) {
      console.error("Error deleting attendance record:", error);
      toast.error("Failed to delete attendance record");
    }
  };

  const filteredRecords = (attendanceRecords || []).filter(
    (record) =>
      record.userId?.username &&
      record.userId.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {" "}
      <TrainerHeader />
      <div className="member-management-container-mark">
        <div className="management-card-mark">
          <h2 className="card-title">Attendance Management</h2>

          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="tabs-mark">
            <button
              className={`tab-button ${
                activeTab === "mark-attendance" ? "active" : ""
              }`}
              onClick={() => setActiveTab("mark-attendance")}
            >
              Mark Attendance
            </button>
            <button
              className={`tab-button ${
                activeTab === "history" ? "active" : ""
              }`}
              onClick={() => setActiveTab("history")}
            >
              Attendance History
            </button>
          </div>

          {/* Attendance Form - Moved outside of tab content */}
          {console.log("showattendanceform iss:", showAttendanceForm)}

          {showAttendanceForm && (
            <div className="form-overlay">
              {error && <div className="error-message">{error}</div>}

              <form className="member-form-mark" onSubmit={handleSubmit}>
                <select
                  value={attendanceForm.userId}
                  onChange={(e) =>
                    setAttendanceForm({
                      ...attendanceForm,
                      userId: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select User</option>
                  {console.log("users are:", fetchedAssignedTrainerUser)}
                  {fetchedAssignedTrainerUser.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
                {/* <input
                type="date"
                value={attendanceForm.date}
                onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                max={today}
                required
              /> */}
                <select
                  value={attendanceForm.status}
                  onChange={(e) => {
                    const selectedStatus = e.target.value;
                    setAttendanceForm({
                      ...attendanceForm,
                      status: selectedStatus,
                    });
                    console.log(`selected option: ${selectedStatus}`);
                  }}
                  required
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>

                <div className="form-buttons-mark">
                  <button type="submit" className="save-button-mark">
                    <Check size={16} /> Save
                  </button>
                  <button
                    type="button"
                    className="cancel-button-mark"
                    onClick={() => {
                      setShowAttendanceForm(false);
                      setEditingId(null);
                    }}
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Mark Attendance Tab */}
          {activeTab === "mark-attendance" && (
            <div className="tab-content-mark-attendance">
              <button
                className="add-button"
                onClick={() => {
                  setShowAttendanceForm(true);
                  setEditingId(null);
                  setAttendanceForm({
                    userId: userName._id,
                    
                    status: "Present",
                  });
                }}
              >
                <Plus size={20} /> Mark Attendance
              </button>

              <h3 className="section-title-mark" style={{ paddingTop: "50px" }}>
                Today's Attendance
              </h3>
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log(
                    "getUserAttendanceToday:",
                    getUserAttendanceToday
                  )}
                  {getUserAttendanceToday.map((record) => (
                    <tr key={record._id}>
                      <td>{record.userId?.username}</td>
                      <td>
                        <div className="date-display">
                          <Calendar size={16} />
                          {/* {formatDate(record.date)} */}
                          {moment(record.date).format("DD-MM-YYYY")}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge-mark ${record.status}`}>
                          {record.status === "Present" ? (
                            <UserCheck size={16} />
                          ) : (
                            <UserX size={16} />
                          )}
                          {record.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(record)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(record._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Attendance History Tab */}
          {activeTab === "history" && (
            <div className="tab-content-history">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((record) => (
                      <tr key={record.id}>
                        <td>{record.userId.username}</td>
                        <td>
                          <div className="date-display">
                            <Calendar size={16} />
                            {moment(record.date).format("DD-MM-YYYY")}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge-history ${record.status}`}
                          >
                            {record.status === "Present" ? (
                              <UserCheck size={16} />
                            ) : (
                              <UserX size={16} />
                            )}
                            {record.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="edit-button-1"
                              onClick={() => handleEdit(record)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="delete-button-1"
                              onClick={() => handleDelete(record._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
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

export default MarkUserAttendance;
