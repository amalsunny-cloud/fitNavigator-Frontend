import React, { useState } from "react";
import axios from "axios";
import { Lock, Check, X } from "lucide-react";
import "../../Styles/UserChangePassword.css";

import toast, { Toaster } from "react-hot-toast";

const UserChangePassword = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const userChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Inside try block userChangePasswordSubmit");

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("New passwords don't match");
      }

      console.log("Before sending api request");
      
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/user-change-password`,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("userId")}`,
          },
        }
      );

      console.log("response after user-change-password in 35:", response.data);

      
        toast.success("Password changed successfully!");
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
            onClose();  
        }, 2000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error("Error at front user-change-password");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay-user-change-password">
        <div className="password-modal-user-change-password">
          <div className="modal-header-user-change-password">
            <h2>Change Password</h2>
            <button
              onClick={onClose}
              className="close-btn-user-change-password"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={userChangePasswordSubmit}
            className="password-form-user-change-password"
          >
            <div className="form-group-user-change-password">
              
            </div>

            <div className="form-group-user-change-password">
              <Lock size={18} className="input-icon-user-change-password" />
              <input
                type="password"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group-user-change-password">
              <Lock size={18} className="input-icon-user-change-password" />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                //   minLength="8"
              />
            </div>

            <div className="form-actions-user-change-password">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn-user-change-password"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="confirm-btn-user-change-password"
                disabled={loading}
              >
                {loading ? (
                  "Changing..."
                ) : (
                  <>
                    <Check size={16} />
                    Confirm Change
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Toaster
        position="top-center"
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

export default UserChangePassword;
