import React, { useEffect, useState } from "react";
import { Edit2, Save, X, Search, Check, AlertCircle } from "lucide-react";
import "../../Styles/AssignTrainers.css";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";

const AssignTrainers = ({ users, trainers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentAssignment, setCurrentAssignment] = useState({
    user: "",
    trainer: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [assignmentMessage, setAssignmentMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/assignments");
      setAssignments(response.data);
    } catch (error) {
      showMessage("Error fetching assignments. Please try again.", "error");
      toast.error("Error fetching assignments.")
    }
  };

  // Helper function to show messages
  const showMessage = (message, type = "error") => {
    setAssignmentMessage(message);
    setMessageType(type);
    // Clear message after 5 seconds
    setTimeout(() => {
      setAssignmentMessage("");
      setMessageType("");
    }, 5000);
  };

  const handleEditClick = (assignment) => {
    setEditingId(assignment._id);
    setCurrentAssignment({
      user: assignment.user,
      trainer: assignment.trainer,
    });
  };

  const handleSaveClick = async (id) => {
    try {
      if (!currentAssignment.trainer?._id) {
        toast.error("Please select a trainer")
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/assignments/${id}`,
        {
          trainerId: currentAssignment.trainer._id,
        }
      );

      const updatedAssignment = response.data;
      setAssignments(
        assignments.map((assignment) =>
          assignment._id === id ? updatedAssignment : assignment
        )
      );
      setEditingId(null);
      setCurrentAssignment({ user: "", trainer: "" });
      toast.success("Trainer updated successfully!");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating assignment";
      toast.error(errorMessage)
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/assignments/${id}`);
      setAssignments(assignments.filter((assignment) => assignment._id !== id));
      toast.success("Assignment deleted successfully!");
    } catch (error) {
      toast.error("Error deleting assignment. Please try again.");
    }
  };

  const handleAssignTrainer = async () => {
    if (!selectedUser || !selectedTrainer) {
      // showMessage("Please select both a user and a trainer", "error");
      toast.error("Please select both a user and a trainer");
      return;
    }

    

    const existingAssignment = assignments.find(
      (assignment) =>
        assignment.user && assignment.user._id === selectedUser._id
    );

    if (existingAssignment) {
      

      toast.error(
        `${selectedUser.username} already has a trainer assigned. Please edit the existing assignment instead.`
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/assign-trainer",
        {
          userId: selectedUser._id,
          trainerId: selectedTrainer._id,
        }
      );

      if (response.status === 201) {
        setAssignments([...assignments, response.data]);
        

        toast.success(
          `Trainer ${selectedTrainer.username} successfully assigned to ${selectedUser.username}!`
        );

        setSelectedUser(null);
        setSelectedTrainer(null);
        await fetchAssignments();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error during assignment";
      toast.error(errorMessage);
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.user?.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      assignment.trainer?.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const unassignedUsers = users.filter(
    (user) =>
      !assignments.some(
        (assignment) => assignment.user && assignment.user._id === user._id
      )
  );

  return (
    <>
      <div className="assign-trainers-containers">
        <h2 className="card-title">Assign Trainers</h2>

        

        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by user or trainer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="user">Select User:</label>
          <select
            id="user"
            value={selectedUser?._id || ""}
            onChange={(e) => {
              const selected = users.find(
                (user) => user._id === e.target.value
              );
              setSelectedUser(selected);
              setAssignmentMessage("");
            }}
          >
            <option value="">Select User</option>
            {unassignedUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
          {users.length > unassignedUsers.length && (
            <small className="help-text">
              Some users are not shown because they already have trainers
              assigned.
            </small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="trainer">Select Trainer:</label>
          <select
            id="trainer"
            value={selectedTrainer?._id || ""}
            onChange={(e) => {
              const selected = trainers.find(
                (trainer) => trainer._id === e.target.value
              );
              setSelectedTrainer(selected);
            }}
          >
            <option value="">Select Trainer</option>
            {trainers.map((trainer) => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.username} ({trainer.specialization})
              </option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button
            type="button"
            onClick={handleAssignTrainer}
            className="assign-button-assign-trainer"
            disabled={!selectedUser || !selectedTrainer}
          >
            <Check size={16} /> Assign
          </button>
          <button
            type="button"
            className="cancel-button-assign-trainer"
            onClick={() => {
              setSelectedUser(null);
              setSelectedTrainer(null);
              setAssignmentMessage("");
            }}
          >
            <X size={16} /> Cancel
          </button>
        </div>

        <table className="assignments-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Trainer</th>
              <th>Assigned Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map((assignment) => (
              <tr key={assignment._id}>
                <td>{assignment.user?.username}</td>
                <td>
                  {editingId === assignment._id ? (
                    <select
                      value={currentAssignment.trainer?._id || ""}
                      onChange={(e) => {
                        const selected = trainers.find(
                          (t) => t._id === e.target.value
                        );
                        setCurrentAssignment({
                          ...currentAssignment,
                          trainer: selected,
                        });
                      }}
                    >
                      <option value="">Select Trainer</option>
                      {trainers.map((trainer) => (
                        <option key={trainer._id} value={trainer._id}>
                          {trainer.username}
                        </option>
                      ))}
                    </select>
                  ) : (
                    assignment.trainer?.username || "Not Assigned"
                  )}
                </td>
                <td>
                  {new Date(assignment.assignedDate).toLocaleDateString(
                    "en-GB",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }
                  )}
                </td>
                <td>
                  {editingId === assignment._id ? (
                    <div className="action-buttonsss">
                      <button
                        className="save-button-assign-trainers"
                        onClick={() => handleSaveClick(assignment._id)}
                      >
                        <Save size={16} /> Save
                      </button>
                      <button
                        className="cancel-button-assign-trainer"
                        onClick={() => {
                          setEditingId(null);
                          setCurrentAssignment({ user: "", trainer: "" });
                        }}
                      >
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="action-buttons">
                      <button
                        className="edit-button-3"
                        onClick={() => handleEditClick(assignment)}
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        className="delete-button-3"
                        onClick={() => handleDeleteClick(assignment._id)}
                      >
                        <X size={16} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* </div> */}

        <style jsx>{`
          .message {
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            display: flex;
            align-items: center;
          }

          .message.error {
            background-color: #fee2e2;
            border: 1px solid #ef4444;
            color: #991b1b;
          }

          .message.success {
            background-color: #dcfce7;
            border: 1px solid #22c55e;
            color: #166534;
          }

          .message-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .help-text {
            color:rgb(252, 36, 36);
            font-size: 0.875rem;
            margin-top: 0.25rem;
          }

          .assign-button-assign-trainer:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        `}</style>
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

export default AssignTrainers;
