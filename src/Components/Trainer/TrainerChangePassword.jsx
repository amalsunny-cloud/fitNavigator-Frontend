import React, { useState } from "react";
import axios from "axios";
import { Lock, Check, X } from "lucide-react";
import "../../Styles/TrainerChangePassword.css";

import toast, { Toaster } from "react-hot-toast";

const TrainerChangePassword = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const trainerChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Inside try block handle Sbmit");

      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("New passwords don't match");
      }

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/trainer-change-password`,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("trainerId")}`,
          },
        }
      );

      console.log("response after trainer-change-password in 35:", response.data);

      
        toast.success("Password changed successfully!");
        setFormData({
          newPassword: "",
          confirmPassword: "",
        });
        onClose();
      
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error("Error at front trainer-change-password");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-overlay-trainer-change-password">
        <div className="password-modal-trainer-change-password">
          <div className="modal-header-trainer-change-password">
            <h2>Change Password</h2>
            <button
              onClick={onClose}
              className="close-btn-trainer-change-password"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={trainerChangePasswordSubmit}
            className="password-form-trainer-change-password"
          >
            <div className="form-group-trainer-change-password">
              
            </div>

            <div className="form-group-trainer-change-password">
              <Lock size={18} className="input-icon-trainer-change-password" />
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

            <div className="form-group-trainer-change-password">
              <Lock size={18} className="input-icon-trainer-change-password" />
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

            <div className="form-actions-trainer-change-password">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn-trainer-change-password"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="confirm-btn-trainer-change-password"
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
      
    </>
  );
};

export default TrainerChangePassword;
