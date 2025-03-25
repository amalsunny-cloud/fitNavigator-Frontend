import React, { useState, useEffect } from "react";
import axios from "axios";
import { Send, Search, X, Check } from "lucide-react";
import "../../Styles/SendMessages.css";
import AdminHeader from "../../Components/Admin/AdminHeader";
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';


const SendMessages = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMessageForm, setShowMessageForm] = useState(true);
  const [messageHistory, setMessageHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: "",
    recipients: "all",
  });

  // Check if form has any content
  const hasContent =
    messageForm.subject.trim() !== "" ||
    messageForm.message.trim() !== "" ||
    messageForm.recipients !== "all";

  // Fetch messages with debounced search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchMessages();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [activeTab, searchTerm]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:3000/messages?type=${activeTab}&search=${searchTerm}`
      );
      setMessageHistory(response.data.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate recipient selection
      if (!messageForm.recipients) {
        setError("Please select a recipient group");
        alert("Please select a recipient group");
        return;
      }

      console.log("Before response");
      const response = await axios.post("http://localhost:3000/messages", {
        subject: messageForm.subject,
        message: messageForm.message,
        recipients: messageForm.recipients,
      });

      console.log(response);

      // Refresh the message list
      await fetchMessages();

      // Reset form
      setMessageForm({
        subject: "",
        message: "",
        recipients: "all",
      });
      
      // toast.success(`Message sent successfully `);
      toast.success(`Message sent successfully to ${messageForm.recipients}!`);
    } catch (error) {
      console.error("Error sending message:", error);

      // setError("Failed to send message");
      toast.error(`Failed to send message to ${recipients}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessageForm({
      subject: "",
      message: "",
      recipients: "all",
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm(""); // Clear search when changing tabs
  };

  return (
    <>
      <AdminHeader />
      <div className="member-management-container">
        {/* <div className="message-management-card"> */}
        <div className="glassmorphic-card-member-management">
          <h2 className="card-title-send">Send Messages</h2>

          <div className="search-bar-send">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {showMessageForm && (
            <form className="member-form-send-message" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Subject"
                value={messageForm.subject}
                onChange={(e) =>
                  setMessageForm({ ...messageForm, subject: e.target.value })
                }
                required
                // className="w-full"
                disabled={loading}
              />
              <textarea
                placeholder="Message"
                value={messageForm.message}
                onChange={(e) =>
                  setMessageForm({ ...messageForm, message: e.target.value })
                }
                required
                // className="w-full min-h-[400px] p-2"
                disabled={loading}
              />
              <div className="form-buttons">
                <select
                  value={messageForm.recipients}
                  onChange={(e) =>
                    setMessageForm({
                      ...messageForm,
                      recipients: e.target.value,
                    })
                  }
                  className="styled-select"
                  required
                  disabled={loading}
                >
                  <option value="all">All Members</option>
                  <option value="users">Users Only</option>
                  <option value="trainers">Trainers Only</option>
                </select>
                <button
                  type="submit"
                  className="save-button-send"
                  disabled={loading}
                >
                  <Send size={16} />
                  {loading ? "Sending..." : "Send Message"}
                </button>
                {hasContent && (
                  <button
                    type="button"
                    className="cancel-button-send"
                    onClick={handleClear}
                    disabled={loading}
                  >
                    <X size={16} /> Clear
                  </button>
                )}
              </div>
            </form>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="glassmorphic-card-member-management">
          <div style={{ margin: "40px auto" }}>
            <div className="tabsss">
              <button
                className={`tab-button ${activeTab === "all" ? "active" : ""}`}
                onClick={() => handleTabChange("all")}
              >
                All Messages
              </button>
              <button
                className={`tab-button ${
                  activeTab === "users" ? "active" : ""
                }`}
                onClick={() => handleTabChange("users")}
              >
                User Messages
              </button>
              <button
                className={`tab-button ${
                  activeTab === "trainers" ? "active" : ""
                }`}
                onClick={() => handleTabChange("trainers")}
              >
                Trainer Messages
              </button>
            </div>

            <table className="members-table my-4">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Sent To</th>
                </tr>
              </thead>
              <tbody>
              {console.log("messageHistory:",messageHistory)}

                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : messageHistory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4" style={{color:"red"}}>
                      No messages found
                    </td>
                  </tr>
                ) : (
                  messageHistory.map((msg) => (
                    <tr key={msg._id}>
                      <td>{moment(msg.date).format('DD-MM-YYYY')}</td>
                      <td>{msg.subject}</td>
                      <td>
                        {msg.message.length > 50
                          ? `${msg.message.substring(0, 50)}...`
                          : msg.message}
                      </td>
                      <td>{msg.sentTo}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
            zIndex:7
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

export default SendMessages;
