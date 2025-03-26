import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Plus, Trash2, Calendar } from "lucide-react";
import "../../Styles/MessagesUser.css";
import { UserContext } from "../../Context/UserContext";
import {  Search } from 'lucide-react';
import moment from "moment";
import Header from "../../Components/Header";
import { MessageContext } from "../../Context/MessageContext";
import mail from '../../assets/mail.png';
import toast, { Toaster } from "react-hot-toast";



const MessagesUser = () => {
  const { userName } = useContext(UserContext);
  const users = userName.map(user => user.username);
  const { setMessagesUpdated } = useContext(MessageContext);
  console.log("setMessagesUpdated is:",setMessagesUpdated);


  const [activeTab, setActiveTab] = useState("sent");
  const [messagesSent, setMessagesSent] = useState([]);
  const [adminMessagesReceived, setAdminMessagesReceived] = useState([]);
  const [trainerMessagesReceived, setTrainerMessagesReceived] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const userId = sessionStorage.getItem("userId");
  console.log("userId is:",userId);
  const token = sessionStorage.getItem("userToken");
  console.log("userToken is:",token);
  

  // Fetch received messages from admin
  useEffect(() => {
    fetchReceivedMessages();
    fetchSentMessages();
  }, []);


  const fetchReceivedMessages = async () => {
    try {
      setLoading(true);
      console.log("inside the fetchReceivedMessages");
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/fetch-all-user-messages`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    //   const trainerMessages = response.data.data.messages.filter(
    //     msg => msg.sentTo === 'Trainers' || msg.sentTo === 'All Members'
    //   );
    //   setMessagesReceived(trainerMessages);
    console.log("response what i got:",response);

    const { adminMessages, trainerMessages } = response.data.data;

    console.log("Admin Messages:", adminMessages);
    console.log("Trainer Messages:", trainerMessages);

    // Combine both sets of messages
    // const allMessages = [...adminMessages, ...trainerMessages];
    const allAdminMessages = [...adminMessages]
    const allTrainerMessages = [...trainerMessages]

    // Sort messages by timestamp (optional)
    allAdminMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    allTrainerMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Update state
    setAdminMessagesReceived(allAdminMessages);
    setTrainerMessagesReceived(allTrainerMessages);

  } catch (error) {
    console.error('Error fetching messages:', error.response ? error.response.data : error.message);
    // setError('Failed to load messages');
    toast.error("Error fetching messages")
  } finally {
    setLoading(false);
  }
};

  console.log(adminMessagesReceived);
  console.log(trainerMessagesReceived);
  

  const fetchSentMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user-sent-messages/${userId}`);
      setMessagesSent(response.data.messages || []);
    } catch (error) {
      // setError('Failed to load sent messages');
      toast.error("Failed to load sent messages")
    } finally {
      setLoading(false);
    }
  };

  const userMessageToTrainer = async(userId, messageText)=>{
    try{
      console.log("Inside the userMessageToTrainer function");
      console.log("Fetching trainer for user:", userId);

      if (!messageText) {
        console.error("Message text is required");
        return;
      }
  
      const trainerResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user-messages/${userId}`)
      console.log("trainerResponse is:",trainerResponse);

      if (!trainerResponse.data.trainerId) {
        console.error("No trainer assigned to this user.");
        return;
      }
      
      const trainerId = trainerResponse.data.trainerId;
      console.log("Trainer ID fetched:", trainerId);
  

    const newMessage = {
      trainer: trainerId, 
      user: userId, 
      text: messageText,
      timestamp: new Date(),
    };


    console.log("after newMessage");
    console.log("Sending message:", newMessage);
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/user-messages`, newMessage, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Message sent successfully:", response.data);
    toast.success("Message sent successfully")
    return response.data;

    }catch(error){
      console.error("Error at the frontend userMessageToTrainer", error.response ? error.response.data : error.message);
      toast.error("Error at sending message")
      throw error;
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      setError("Please enter a message");
      return;
    }
    try {
      await userMessageToTrainer(userId, newMessage);
      setNewMessage(""); // Clear input after sending
      await fetchSentMessages(); // Refresh the sent messages list
      setError(null);

       // Trigger refresh in trainer component
    setMessagesUpdated(prev => !prev);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      // setError("Failed to send message. Please try again.");
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      setLoading(true);
      console.log("before the response in handleDeleteMessage");
      console.log("Deleting message with ID:", id);
      
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/delete-usermessages/${id}`);
      console.log("After the response in handleDeleteMessage",response.data);
      toast.success("Deleted Message Successfully")
      await fetchSentMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="message-management-container-message-user">

      
        <div className="management-card-message-user">
          <h2 className="card-title-message-user">Message Management</h2>

          {error && <div className="error-message">{error}</div>}


          {/* <div className="img-container-messageuser">
        <img src={mail} alt="mail" />
      </div> */}

          <div className="tabs-message-user">
            <button
              className={`tab-button ${activeTab === "sent" ? "active" : ""}`}
              onClick={() => setActiveTab("sent")}
            >
              Sent Messages
            </button>
            <button
              className={`tab-button ${activeTab === "received" ? "active" : ""}`}
              onClick={() => setActiveTab("received")}
            >
              Received Messages
            </button>
          </div>

          {activeTab === "sent" && (
            <div className="tab-content-message-user">
              <div className="message-input">
                <div className="search-bar-message-user">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Write a message to trainer..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  className="message-send-button"
                  onClick={handleSendMessage}
                  disabled={loading || !newMessage.trim()}
                >
                  <Plus size={16} /> Send
                </button>
              </div>

              <table className="messages-table">
                <thead>
                  <tr>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="loading">
                        Loading...
                      </td>
                    </tr>
                  ) : messagesSent.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No messages sent
                      </td>
                    </tr>
                  ) : (
                    messagesSent.map((msg) => (
                      <tr key={msg._id}>
                        <td>{msg.text}</td>
                        <td>
                          <div className="date-display">
                            <Calendar size={16} />
                            {moment(msg.timestamp).format("DD-MM-YYYY")}
                          </div>
                        </td>
                        <td>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteMessage(msg._id)}
                            disabled={loading}
                          >
                            <Trash2 size={20} />
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
            <div className="tab-contents-before">
              <div className="tab-content-new">
                <h4>Admin Messages</h4>
                <table className="messages-table">
                  <thead>
                    <tr>
                      <th>Message</th>
                      <th>Subject</th>
                      <th>From</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="loading">
                          Loading...
                        </td>
                      </tr>
                    ) : adminMessagesReceived.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No messages received
                        </td>
                      </tr>
                    ) : (
                      adminMessagesReceived.map((msg) => (
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

              <div className="tab-content-new">
                <h4>Trainer Messages</h4>
                <table className="messages-table">
                  <thead>
                    <tr>
                      <th>Message</th>
                      <th>From</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="loading">
                          Loading...
                        </td>
                      </tr>
                    ) : trainerMessagesReceived.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No messages received
                        </td>
                      </tr>
                    ) : (
                      trainerMessagesReceived.map((msg) => (
                        <tr key={msg._id}>
                          <td>{msg.text}</td>
                          <td>Trainer</td>
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

export default MessagesUser;