import React, { useState, useEffect } from "react";
import { Search, Calendar, UserCheck, UserX } from "lucide-react";
import "../../Styles/ViewUserAttendance.css";

import axios from "axios";
import moment from "moment";

const ViewUserAttendances = ({ setViewUserAttendances }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const fetchUserAttendanceRecords = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/admin-fetch-user-attendance`
        );
        console.log("Fetched Userattendance records:", response.data);

        setAttendanceRecords(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch attendance records");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAttendanceRecords();
  }, []);

  console.log("attendanceRecords for checking:", attendanceRecords);

  const filteredRecords = attendanceRecords.filter((record) =>
    record.userId.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("filteredRecords after is:", filteredRecords);

  const handleClose = (e) => {
    e.stopPropagation();
    setViewUserAttendances(false);
  };

  return (
    <>
      <div className="attendance-modal-overlay" onClick={handleClose}>
        <div className="attendance-modal" onClick={(e) => e.stopPropagation()}>
          <div className="closingForModal">
            <h2 className="modal-title">Attendance History</h2>
            <button className="close-button-" onClick={handleClose}>
              &times;
            </button>
          </div>

          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && (
            <div className="loading">Loading attendance records...</div>
          )}
          {error && <div className="error">{error}</div>}

          {!loading && !error && (
            <table className="attendance-table-modals">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Trainer</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {console.log("filteredRecords in 138:", filteredRecords)}
                {filteredRecords
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((record) => (
                    <tr key={record.id}>
                      <td>{record.userId.username}</td>
                      <td>{record.trainerId.username}</td>
                      <td>{moment(record.date).format("DD-MM-YYYY")}</td>
                      <td>
                        <span
                          className={`status-badge-view-user-attendance ${record.status}`}
                        >
                          {record.status === "Present" ? (
                            <UserCheck size={16} className="icon-present" />
                          ) : (
                            <UserX size={16} className="icon-absent" />
                          )}
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewUserAttendances;
