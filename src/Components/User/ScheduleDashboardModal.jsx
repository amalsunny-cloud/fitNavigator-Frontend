// import React from 'react';

// const ScheduleDashboardModal = ({ show, handleClose, schedule }) => {
//   return (
//     <div 
//       className={`modal fade ${show ? "show d-block" : "d-none"}`} 
//       tabIndex="-1" 
//       role="dialog"
//       style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
//     >
//       <div 
//         className="modal-dialog-schedule modal-dialog-centered" 
//         style={{ maxWidth: '1000px', margin: 'auto',marginLeft:"518px" }}
//       >
//         <div className="modal-content-schedule">
//           <div className="modal-header-schedule bg-secondary rounded-3 text-white">
//             <h5 className="modal-title-schedule">Training Schedule Details</h5>
//             <button 
//               type="button" 
//               className="close text-dark w-25 rounded-led btn btn-light fs-5 fw-bold" 
//               onClick={handleClose}
//             >
//               <span>&times;</span>
//             </button>
//           </div>
//           <div className="modal-body-schedule bg-light p-4 ">
//             <div className="row mb-3">
//               <div className="col-md-6">
//                 <p><strong>Session Name:</strong></p>
//                 <p>{schedule.sessionName || "Not scheduled"}</p>
//               </div>
//               <div className="col-md-6">
//                 <p><strong>Date:</strong></p>
//                 <p>{schedule.date || "N/A"}</p>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-md-6">
//                 <p><strong>Time:</strong></p>
//                 <p>{schedule.time || "To be announced"}</p>
//               </div>
//               <div className="col-md-6">
//                 <p><strong>Location:</strong></p>
//                 <p>{schedule.location || "Main gym"}</p>
//               </div>
//             </div>
//           </div>
//           <div className="modal-footer-schedule">
//             <button 
//               type="button" 
//               className="btn btn-secondary" 
//               onClick={handleClose}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScheduleDashboardModal;


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