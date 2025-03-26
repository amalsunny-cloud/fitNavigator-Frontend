import React, { useEffect, useState } from "react";
import "../../Styles/TrackPendingPayments.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Search, DollarSign, Calendar, Send } from "lucide-react";
import AdminHeader from "../../Components/Admin/AdminHeader";
import axios from "axios";
import moment from "moment";

import toast, { Toaster } from "react-hot-toast";

const TrackPendingPayments = () => {
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fullDetails, setFullDetails] = useState([]);
  const [noPlanUser, setNoPlanUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [planCountsNumber, setPlanCountsNumber] = useState({});

  const transformUserData = (subscriptionData) => {
    return subscriptionData.map((subscription) => {
      const endDate = subscription.endDate
        ? new Date(subscription.endDate)
        : null;
      const today = new Date();
      const daysPending = endDate
        ? Math.max(0, Math.floor((endDate - today) / (1000 * 60 * 60 * 24)))
        : 0;

      return {
        id: subscription._id || subscription.id,
        userId: subscription.userId?._id || "N/A",
        userName: subscription.userId?.username || "Unknown",
        plan: subscription.planId?.name || "No Plan",
        dueDate: endDate ? endDate.toLocaleDateString() : "N/A",
        daysPending,
      };
    });
  };

  const fetchFullDetails = async () => {
    try {
      // console.log("Inside the fetchFullDetails function");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin-fetchFullDetails`
      );
      
      const transformedData = transformUserData(response.data);
      setFullDetails(transformedData);
    } catch (error) {
      console.error("Error at backend fetchFull Details function");
      setFullDetails([]);
    }
  };

  useEffect(() => {
    fetchFullDetails();
  }, []);

  const fetchUsers = async () => {
    try {
      // console.log("inside the fetchUsers frontend function");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin-fetchusers`
      );
      // console.log("response after fetching:",response.data);
      setFetchedUsers(response.data);
    } catch (error) {
      console.error("Error at frontend fetchUsers function");
      setFetchedUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate summary statistics

  console.log("fullDetails 90:", fullDetails);
  console.log("noPlanUser 90:", noPlanUser);

  const totalPending = noPlanUser.length;
  const totalAmount = noPlanUser.reduce(
    (sum, payment) => sum + payment.amountDue,
    0
  );
  const averageDaysPending = Math.round(
    noPlanUser.reduce((sum, payment) => sum + payment.daysPending, 0) /
      totalPending
  );

  const totalPurchased = fullDetails.length;

  const expiredPlanUsers = fullDetails.filter((user) => user.daysPending === 0);
  console.log("expiredPlanUsers is:,", expiredPlanUsers);

  // Data for pie chart
  const planDistribution = fullDetails.reduce((acc, payment) => {
    acc[payment.plan] = (acc[payment.plan] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(planDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  // Colors for pie chart
  const COLORS = ["#059669", "#047857", "#065f46", "#064e3b"];

  const formattedDate = moment(fullDetails.dueDate).format("DD-MM-YYYY");

  const filteredPayments = fullDetails.filter(
    (payment) =>
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchNoPlanUsers = async () => {
    try {
      console.log("Inside the fetchNoPlanUsers frontend");
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin-fetchNoPlanUsers`
      );

      console.log("response is:", response.data);
      setNoPlanUser(response.data);
    } catch (error) {
      console.error("Error at frontend fetchNoPlanUsers");
    }
  };

  useEffect(() => {
    fetchNoPlanUsers();
  }, []);

  // const fetchExpiredPlanUsers = async()=>{

  // }

  const handleReminder = async (_id) => {
    try {
      console.log("inside frontend handleReminder");
      console.log("userId handleReminder:", _id || userId);
      // const userId = _id;
      const userId = _id ? _id : userId;
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/send-reminder-payment/${userId}`
      );

      console.log("response is:", response.data);
      const username = response.data.PaymentReminders.userId.username;
      console.log(`Payment reminder sent to user ${username}`);

      // setSuccessMessage(`Payment reminder sent to user ${PaymentReminder.userId.username}`);
      toast.success(`Remainder sent to ${username}`);
    } catch (error) {
      console.error("Error at frontend handleReminder");
    }
  };

  
  useEffect(() => {
    const calculatePlanCounts = () => {
      console.log("Inside the calculatePlanCounts function");

      const counts = fullDetails.reduce((acc, payment) => {
        acc[payment.plan] = (acc[payment.plan] || 0) + 1;
        return acc;
      }, {});

      console.log("counts in 188:", counts);

      setPlanCountsNumber(counts);
    };

    calculatePlanCounts();
  }, [fullDetails]); 

  const unameOfNoPlan = noPlanUser.map((entry) => entry.username);
  console.log("unameOfNoPlan:", unameOfNoPlan);

  return (
    <>
      <AdminHeader />

      <div className="admin-management-container-track">
        <div className="management-card-track glassmorphic-card">
          <h2 className="card-title neon-text">Payment Analytics Dashboard</h2>

          {/* Summary Stats */}
          <div className="admin-payment-stats-container grid-layout">
            <div className="stat-card gradient-purple">
              <DollarSign size={24} className="stat-icon" />
              <h3 className="stat-title">Total Pending</h3>
              <p className="stat-value-totalpending" style={{color:"black"}}>{totalPending}</p>
            </div>

            <div className="stat-card gradient-blue">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="stat-icon"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3 className="stat-title">Pending Users</h3>
              <div className="user-list-scroll">
                {unameOfNoPlan.map((name) => (
                  <div key={name} className="user-chip">
                    {name}
                  </div>
                ))}
              </div>
            </div>

            <div className="stat-card gradient-green">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="stat-icon"
              >
                <path d="M12 2v20M2 12h20" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              <h3 className="stat-title">Total Purchased</h3>
              <p className="stat-value-total-purchased" style={{fontSize:"24px"}}>{totalPurchased}</p>
            </div>

            <div className="stat-card gradient-orange">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="stat-icon"
              >
                <path d="M12 2v20M8 8l4-4 4 4M8 16l4 4 4-4M2 12h4M18 12h4" />
              </svg>
              <h3 className="stat-title">Plan Distribution</h3>
              <div className="plan-distribution">
                <div className="plan-item">
                  <span className="plan-dot basic"></span>
                  Basic: {planCountsNumber.Basic || 0}
                </div>
                <div className="plan-item">
                  <span className="plan-dot intermediate"></span>
                  Intermediate: {planCountsNumber.Intermediate || 0}
                </div>
                <div className="plan-item">
                  <span className="plan-dot advanced"></span>
                  Advanced: {planCountsNumber.Advanced || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar-track-pending-futuristic-input">
            {/* <Search size={20} className="search-icon" /> */}
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Charts Container */}
          <div className="charts-container grid-layout">
            {/* Days Pending Chart */}
            <div className="chart-card glassmorphic-card">
              <h3 className="chart-title">Subscription Timeline</h3>
              <div className="chart">
                <ResponsiveContainer width="100%" height={300}>
                  {filteredPayments && filteredPayments.length > 0 ? (
                    <BarChart data={filteredPayments}>
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#6366f1"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="100%"
                            stopColor="#a855f7"
                            stopOpacity={0.6}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="userName"
                        tick={{ fill: "#9CA3AF" }}
                        axisLine={{ stroke: "#4B5563" }}
                      />
                      <YAxis
                        tick={{ fill: "#9CA3AF" }}
                        axisLine={{ stroke: "#4B5563" }}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#FFFFFF",
                          // background: '#1F2937',
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Bar
                        dataKey="daysPending"
                        fill="url(#barGradient)"
                        radius={[12, 12, 0, 0]}
                        animationDuration={800}
                      />
                    </BarChart>
                  ) : (
                    <div className="data-empty-state">
                      <div className="empty-state-icon">📊</div>
                      <p className="empty-state-text" style={{color:"red",
                        fontSize:"24px"
                      }}>
                        No subscription data available
                      </p>
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Plan Distribution Chart */}
            <div className="chart-card glassmorphic-card">
              <h3 className="chart-title">Plan Segmentation</h3>
              <div className="chart">
                {pieData && pieData.length > 0?(
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      animationDuration={600}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#1F2937"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#FFFFFF",
                        // background: '#1F2937',

                        border: "1px solid #374151",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                ):(
                  <div style={{
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    minHeight:"230px"
                  }}>
                  <p style={{color:"red",fontSize:"24px"}}>No data available</p>
                  </div>
                )
              }
              </div>
            </div>
          </div>

          {/* User Tables */}
          <div className="tables-container">
            {/* <div className="table-section"> */}
            <div className="glassmorphic-card" style={{marginTop:"50px"}}>
              <h5 className="table-title" style={{marginBottom:"30px"}}>Unsubscribed Users</h5>
              <div className="table-wrapper">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {noPlanUser.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="user-info">
                            <span className="user-avatar">👤</span>
                            {user.username}
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <button
                            className="reminder-button-hover-scale"
                            onClick={() => handleReminder(user._id)}
                          >
                            <Send size={16} className="button-icon" />
                            <span className="button-text">Send Reminder</span>
                            <div className="button-hover-effect"></div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glassmorphic-card" style={{marginTop:"50px"}}>
              <h5 className="table-title" style={{marginBottom:"30px"}}>Expired Plan Users</h5>
              <div className="table-wrapper">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>User</th>
                      <th>User Id</th>
                      {/* <th>Email</th> */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiredPlanUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="user-info">
                            <span className="user-avatar">👤</span>
                            {user.userName}
                          </div>
                        </td>
                        <td>{user.userId}</td>
                        <td>
                          <button
                            className="reminder-button-hover-scale"
                            onClick={() => handleReminder(user.userId)}
                          >
                            <Send size={16} className="button-icon" />
                            <span className="button-text">Send Reminder</span>
                            <div className="button-hover-effect"></div>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* <div className="table-section"> */}
            <div className="glassmorphic-card" style={{marginTop:"50px",marginBottom:"50px"}}>
              <h5 className="table-title" style={{marginBottom:"30px"}}>Active Subscriptions</h5>
              <div className="table-wrapper">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>User</th>
                      <th>Plan</th>
                      <th>Renewal Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment, index) => (
                      <tr key={payment.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="user-info">
                            <span className="user-avatar">👤</span>
                            {payment.userName}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`plan-tag ${payment.plan.toLowerCase()}`}
                          >
                            {payment.plan}
                          </span>
                        </td>
                        <td>
                          <div className="date-display">
                            <Calendar size={16} className="date-icon" />
                            {moment(payment.dueDate).format("DD MMM YYYY")}
                          </div>
                        </td>
                        <td>
                          <div
                            className={`status-indicator ${
                              payment.daysPending > 7 ? "safe" : "urgent"
                            }`}
                          >
                            <div className="status-dot"></div>
                            {payment.daysPending} days
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {successMessage && (
            <div className="floating-notification slide-in">
              <div className="notification-content">
                <svg viewBox="0 0 24 24" className="notification-icon">
                  <path
                    fill="currentColor"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  />
                </svg>
                {successMessage}
              </div>
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
            iconTheme: { primary: "#4CAF50", secondary: "#fff" },
          },
          error: {
            iconTheme: { primary: "#FF5252", secondary: "#fff" },
          },
        }}
      />
    </>
  );
};

export default TrackPendingPayments;
