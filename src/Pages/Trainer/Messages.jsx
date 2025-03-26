import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Plus, Trash2, Calendar } from "lucide-react";
import "../../Styles/TrainerMessages.css";
import TrainerHeader from "../../Components/Trainer/TrainerHeader";
import { UserContext } from "../../Context/UserContext";
import { Search } from "lucide-react";
import moment from "moment";
import { MessageContext } from "../../Context/MessageContext";

import toast, { Toaster } from 'react-hot-toast';


const Messages = () => {
  const { userName } = useContext(UserContext);
  const { setSelectedMessageId } = useContext(MessageContext);
  console.log("setSelectedMessageId:", setSelectedMessageId);



  const { messagesUpdated } = useContext(MessageContext);
  console.log("messagesUpdated:", messagesUpdated);

  const [activeTab, setActiveTab] = useState("sent");
  const [messagesSent, setMessagesSent] = useState([]);
  const [messagesReceived, setMessagesReceived] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [userToTrainerMessagesMessages, setUserToTrainerMessagesMessages] =
    useState([]);



  const trainerId = sessionStorage.getItem("trainerId");
  console.log("trainerId is:", trainerId);

  const fetchAssignedUsers = async () => {
    try {
      console.log("inside the fetchAssignedUsers function");
      const fetchedResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/trainer-fetchAssign-users/${trainerId}`
      );

      console.log("fetchedUsers:", fetchedResponse.data);
      const mappedUsers = fetchedResponse.data.map(
        (user, index) => user.user.username
      );

      console.log("mappedUsers:", mappedUsers);

      setFetchedUsers(mappedUsers);
    } catch (error) {
      console.error("Error at frontend fetchAssignedUsers");
      toast.error("Failed to load assigned users");

    }
  };

  // Fetch received messages from admin
  useEffect(() => {
    fetchAssignedUsers();
    fetchReceivedMessages();
    fetchSentMessages(); // Fetch sent messages initially
    fetchUserToTrainerMessages();
  }, []);



  const fetchReceivedMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages`);
      const trainerMessages = response.data.data.messages.filter(
        (msg) => msg.sentTo === "Trainers" || msg.sentTo === "All Members"
      );
      setMessagesReceived(trainerMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages")
    } finally {
      setLoading(false);
    }
  };

  console.log(messagesReceived);

  const fetchUserToTrainerMessages = async () => {
    try {
      console.log("inside the fetchUserToTrainerMessages");
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/fetchUserToTrainerMessages/${trainerId}`
      );

      console.log("response after fetchUserToTrainerMessages:", response.data);

      setUserToTrainerMessagesMessages(response.data);
    } catch (error) {
      console.error("Error at frontend fetchUserToTrainerMessages");
      toast.error("Failed to load user messages");

    }
  };


  const fetchSentMessages = async () => {
    try {
      console.log("Inside the fetch Sent messages 124");
      
      setLoading(true);
      const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/trainerToUsermessages/trainer/${trainerId}`
      );

      console.log("response.data in 131:",response.data);
      
      // Make sure we're accessing the correct data structure
      const messages = response.data.data.messages || [];
      console.log("Messages in 135:",messages);
      
      setMessagesSent(messages);
    } catch (error) {
      console.error("Error fetching sent messages:", error);
      toast.error("Failed to load sent messages");

    } finally {
      setLoading(false);
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim() || !selectedUser) {
      toast.error("Please select a user and enter a message");
      return;
    }

    try {
      setLoading(true);
      // Send the message with userId
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/trainerToUsermessages`,
        {
          text: newMessage,
          username: selectedUser,
          trainerId,
          date: new Date().toISOString().split("T")[0],
        }
      );

      if (response.data.status === "success") {
        await fetchSentMessages(); // Refresh the sent messages list
        setNewMessage("");
        setSelectedUser("");
        toast.success("Message sent successfully");

      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");

    } finally {
      setLoading(false);
    }
  };


  const handleDeleteMessage = async (id) => {
    try {
      setLoading(true);
      console.log("before the response in handleDeleteMessage");

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/trainerToUsermessages/${id}`
      );
      console.log("After the response in handleDeleteMessage", response);
      toast.success("Message deleted successfully");

      await fetchSentMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message");

    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = async (messageId) => {
    console.log("messageId in markSeen:", messageId);

    try {
      console.log("inside the markAsSeen function");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/mark-seen/${messageId}`
      );

      console.log("response is 177:", response.data);

      if (response.status === 200) {
        // Update message list after marking seen
        setUserToTrainerMessagesMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageId
              ? {
                  ...msg,
                  status: "approved",
                  approvedAt: new Date().toISOString(),
                }
              : msg
          )
        );
      }

      toast.success("Message approved");

      setSelectedMessageId(messageId); // Store in Context
      console.log("Message ID set in Context:", messageId);
    } catch (error) {
      console.error("Error marking message as seen:", error);
      toast.error("Failed to approve message");

    }
  };

  return (
    <>
      <TrainerHeader />
      <div className="message-management-container-messages-trainer">
        <div className="management-card-messages-trainer">
          <h2 className="card-title">Message Management</h2>

          {error && <div className="error-message">{error}</div>}

          <div className="tabss">
            <button
              className={`tab-button ${activeTab === "sent" ? "active" : ""}`}
              onClick={() => setActiveTab("sent")}
            >
              Sent Messages
            </button>
            <button
              className={`tab-button ${
                activeTab === "received" ? "active" : ""
              }`}
              onClick={() => setActiveTab("received")}
            >
              Received Messages
            </button>
          </div>

          {activeTab === "sent" && (
            <div className="tab-content-messages-trainer">
              <div className="message-input">
                <div className="select-layer">
                  <select
                    className="user-select"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">Select User</option>
                    {fetchedUsers.map((user, index) => (
                      <option key={index} value={user}>
                        {user}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="search-bar">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder=" Write a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={loading}
                  />
                </div>

                <button
                  className="message-send-button"
                  onClick={handleAddMessage}
                  disabled={loading || !newMessage.trim() || !selectedUser}
                >
                  <Plus size={16} /> Send
                </button>
              </div>

              <table className="trainer-messages-table">
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>To</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : messagesSent.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No messages sent
                      </td>
                    </tr>
                  ) : (
                    messagesSent.map((msg) => (
                      <tr key={msg._id}>
                        <td>{msg.text}</td>
                        <td>{msg.username}</td>
                        <td>
                          <div className="date-display">
                            <Calendar size={16} />
                            {/* {moment(msg.date).format("DD-MM-YYYY")} */}
                            {moment(msg.timestamp).format("DD-MM-YYYY HH:mm")}
                          </div>
                        </td>
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteMessage(msg._id)}
                            disabled={loading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "received" && (
            <div className="tab-content">
              <table className="trainer-messages-table">
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Subject</th>
                    <th>From</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {console.log("messages recieved 259:", messagesReceived)}
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : messagesReceived.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No messages received
                      </td>
                    </tr>
                  ) : (
                    messagesReceived.map((msg) => (
                      <tr key={msg._id}>
                        <td>{msg.message}</td>
                        <td>{msg.subject}</td>
                        <td>Admin</td>
                        <td>
                          <div className="date-display">
                            <Calendar size={16} />
                            {moment(msg.date).format("DD-MM-YYYY")}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {console.log(
          "userToTrainerMessagesMessages in 368:",
          userToTrainerMessagesMessages
        )}
        <div className="user-messages-section">
          <h2>User Messages</h2>
          <table className="trainer-messages-table">
            <thead>
              <tr>
                <th>Message</th>
                <th>User</th>
                <th>Date</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : userToTrainerMessagesMessages.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No messages sent
                  </td>
                </tr>
              ) : (
                userToTrainerMessagesMessages.map((msg) => {
                  // Convert the timestamp
                  const dateObj = new Date(msg.timestamp);
                  const formattedDate = `${String(dateObj.getDate()).padStart(
                    2,
                    "0"
                  )}-${String(dateObj.getMonth() + 1).padStart(
                    2,
                    "0"
                  )}-${dateObj.getFullYear()}`;
                  const formattedTime = `${String(dateObj.getHours()).padStart(
                    2,
                    "0"
                  )}:${String(dateObj.getMinutes()).padStart(2, "0")}`;

                  return (
                    <tr key={msg._id}>
                      <td>{msg.text}</td>
                      <td>{msg.user?.username || "Unknown User"}</td>
                      <td>{formattedDate}</td>
                      <td>{formattedTime}</td>
                      <td>
                        {msg.status === "approved" ? (
                          <div className="approval-status">
                            <span
                              style={{
                                color: "#4CAF50",
                                fontWeight: "bold",
                                display: "block",
                              }}
                            >
                              Approved
                            </span>
                            <span
                              style={{
                                fontSize: "0.8em",
                                color: "#666",
                              }}
                            >
                              {moment(msg.approvedAt).format("HH:mm")}
                            </span>
                          </div>
                        ) : (
                          <button
                            className="approve-button"
                            onClick={() => markAsSeen(msg._id)}
                          >
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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

export default Messages;
