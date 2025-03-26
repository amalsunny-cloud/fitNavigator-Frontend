import React, { useState } from "react";
import axios from "axios";
import { Lock, Check, X } from "lucide-react";
import "../../Styles/AdminChangePassword.css";

import toast, { Toaster } from "react-hot-toast";

const AdminChangePassword = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const adminChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Inside try block handle Sbmit");

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("New passwords don't match");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/admin-change-password`,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("adminId")}`,
          },
        }
      );

      console.log("response after admin-change-password in 35:", response.data);

      
        toast.success("Password changed successfully!");
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
        onClose();
      
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error("Error at front admin-change-password");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay-admin-change-password">
        <div className="password-modal-admin-change-password">
          <div className="modal-header-admin-change-password">
            <h2>Change Password</h2>
            <button
              onClick={onClose}
              className="close-btn-admin-change-password"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={adminChangePasswordSubmit}
            className="password-form-admin-change-password"
          >
            <div className="form-group-admin-change-password">
              
            </div>

            <div className="form-group-admin-change-password">
              <Lock size={18} className="input-icon-admin-change-password" />
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

            <div className="form-group-admin-change-password">
              <Lock size={18} className="input-icon-admin-change-password" />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="form-actions-admin-change-password">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn-admin-change-password"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="confirm-btn-admin-change-password"
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

export default AdminChangePassword;
