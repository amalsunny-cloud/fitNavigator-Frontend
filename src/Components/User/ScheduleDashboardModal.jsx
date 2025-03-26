
import React from 'react';
import '../../Styles/ScheduleDashboardModal.css'; 

const ScheduleDashboardModal = ({ show, handleClose, schedule }) => {
  return (
    <div 
      className={`modal-backdrop ${show ? "show" : "hide"}`}
      onClick={handleClose}
    >
      <div 
        className="modal-content-wrapper-schedule"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-container-schedule">
          <div className="modal-header-schedule">
            <h2 className="modal-title-schedule">
              <span className="accent-gradient">Training</span> Schedule Details
            </h2>
            <button 
              className="close-button"
              onClick={handleClose}
              aria-label="Close"
            >
              <div className="close-icon">
                <div className="close-line rotate-45"></div>
                <div className="close-line -rotate-45"></div>
              </div>
            </button>
          </div>

          <div className="modal-body">
            <div className="detail-grid">
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">📛</span>
                  <h3 className="detail-label">Session Name</h3>
                </div>
                <p className="detail-value pulse">
                  {schedule.sessionName || "Not scheduled"}
                </p>
              </div>

              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">📅</span>
                  <h3 className="detail-label">Date</h3>
                </div>
                <p className="detail-value">
                  {schedule.date || "N/A"}
                </p>
              </div>

              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">⏰</span>
                  <h3 className="detail-label">Time</h3>
                </div>
                <p className="detail-value">
                  {schedule.time || "To be announced"}
                </p>
              </div>

              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">📍</span>
                  <h3 className="detail-label">Location</h3>
                </div>
                <p className="detail-value">
                  {schedule.location || "Main gym"}
                </p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              className="action-button hover-scale"
              onClick={handleClose}
            >
              <span className="button-gradient-text">Close Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDashboardModal;