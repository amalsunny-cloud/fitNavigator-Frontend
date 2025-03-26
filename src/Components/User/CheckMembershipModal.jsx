import React, { useEffect } from "react";
import { Button, Modal } from 'react-bootstrap';
import moment from 'moment';
import '../../Styles/CheckMembershipModal.css'

const CheckMembershipModal = ({ 
  show, 
  handleClose, 
  allMembershipPlans, 
  showInvoice, 
  handleInvoiceClose, 
  currentInvoice,
  scheduledMemberships,
  retrieveFormattedStartedDate
}) => {

  

  const getLatestStartDate = () => {

    console.log("inside getLatestStartDate in modal");
    console.log("retrieveFormattedStartedDate in without:", retrieveFormattedStartedDate);

    if (retrieveFormattedStartedDate && retrieveFormattedStartedDate.length > 0) {
      return retrieveFormattedStartedDate
    }
    return currentInvoice?.expiryDate ? moment(currentInvoice.expiryDate).format("DD-MM-YYYY") : "N/A";
  };

  

  const getLatestExpiryDate = () => {
    if (scheduledMemberships && scheduledMemberships.length > 0) {
      const latestScheduledMembership = scheduledMemberships[scheduledMemberships.length - 1];
      return moment(latestScheduledMembership.endDate).format("DD-MM-YYYY");
    }
    return currentInvoice?.expiryDate ? moment(currentInvoice.expiryDate).format("DD-MM-YYYY") : "N/A";
  };


  

  useEffect(() => {
    console.log("retrieveFormattedStartedDate in useEffect:", retrieveFormattedStartedDate);
  }, [retrieveFormattedStartedDate]);


  useEffect(() => {
    console.log("Updated Invoice Data:", currentInvoice);
  }, [currentInvoice]);

  useEffect(() => {
    console.log("Scheduled Memberships Data in Frontend:", scheduledMemberships);
  }, [scheduledMemberships]);
  
  
  return (
    <>
    {  console.log("scheduledMemberships",scheduledMemberships)
      
    }
      {/* Plans Modal */}
      <Modal className="membership-moal d-flex"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton className="membership-modal-header">
          <Modal.Title>Available Membership Plans</Modal.Title>
        </Modal.Header>
        <Modal.Body className="membership-modal-body">
          {allMembershipPlans.map((plan) => (
            <div key={plan.id} className="membership-plan-card">
              <h4>{plan.name}</h4>
              <div className="membership-plan-details">
                <p><strong>Duration:</strong> {plan.duration} months</p>
                <p><strong>Price:</strong> ${plan.price}</p>
                <p><strong>Description:</strong> {plan.description}</p>
              </div>
            </div>
          ))}
        </Modal.Body>
       
      </Modal>

      {/* Invoice Modal */}
      <Modal
      className="invoice-modal"
        show={showInvoice}
        onHide={handleInvoiceClose}
        size="md"
        centered
      >
        <Modal.Header closeButton className="invoice-modal-header">
          <Modal.Title>Payment Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body className="invoice-modal-body">
          {console.log("currentInvoice:",currentInvoice)
          }
          {currentInvoice && (
            <div className="invoice-content">
              <div className="invoice-header-section">
                <h2>Fit-Navigator</h2>
              </div>
              <div className="invoice-details-section">
                <div className="invoice-row">
                  <span>Plan Name:</span>
                  <span>{currentInvoice.planName}</span>
                </div>
                <div className="invoice-row">
                  <span>Duration:</span>
                  <span>{currentInvoice.duration} months</span>
                </div>
                <div className="invoice-row">
                  <span>Amount Paid:</span>
                  <span>${currentInvoice.price}</span>
                </div>
                <div className="invoice-row">
                  <span>Purchase Date:</span>
                  <span>{moment(currentInvoice.purchaseDate).format("DD-MM-YYYY")}</span>
                </div>
                <div className="invoice-row">
                  <span>Start Date:</span>
                  <span>{getLatestStartDate()}</span>
                </div>
                <div className="invoice-row">
                  <span>Expiry Date:</span>
                  <span>{getLatestExpiryDate()}</span>
                </div>
              </div>
              <div className="invoice-footer-section">
                <p>Thank you for choosing Fit-Navigator!</p>
              </div>
            </div>
          )}
        </Modal.Body>
        
      </Modal>

      <style jsx>{`
        .membership-plan-card {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
          .modal-body{
            padding:16px 16px 0px 16px;
          }

        .invoice-content {
          padding: 20px;
        }

        .invoice-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eee;
        }

        .invoice-number {
          color: #666;
          margin-top: 10px;
        }

        .invoice-details {
          margin-bottom: 30px;
        }

        .invoice-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }

        .invoice-row span:first-child {
          font-weight: bold;
          color: #666;
        }

        .invoice-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #eee;
          color: #666;
        }
      `}</style>
    </>
  );
};

export default CheckMembershipModal;