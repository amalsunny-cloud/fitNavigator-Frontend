import React, { useState, useEffect } from "react";
import { Button, Table, Toast } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import "../../Styles/CheckMembership.css";
import CheckMembershipModal from "../../Components/User/CheckMembershipModal";
import Header from "../../Components/Header";

const CheckMembership = () => {
  const [show, setShow] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [membershipData, setMembershipData] = useState([]);
  const [allMembershipPlans, setAllMembershipPlans] = useState([]);
  const [scheduledMemberships, setScheduledMemberships] = useState([]);

  const [retrieveFormattedStartedDate, setRetrieveFormattedStartedDate] =
    useState([]);

  const userId = sessionStorage.getItem("userId");
  console.log("userId is", userId);

  useEffect(() => {
    const fetchMembershipData = async () => {
      try {
        console.log("---------------------------------");
        console.log("before the response of checkmemnbersip");

        const plansResponse = await axios.get(`${import.meta.env.VITE_API_URL}/plans`);
        setAllMembershipPlans(plansResponse.data.data || []);

        // Fetch user's current memberships if applicable
        // This might depend on your backend implementation

        console.log("---------------------------------");
        console.log("before membershipResponse");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/memberships/${userId}`
        );
        console.log("after response ooo:", response);

        // Ensure response contains valid data
        const memberships = response.data.data || [];

        // Current date
        // const currentDate = new Date();

        // Separate active and scheduled memberships correctly
        const activeMemberships = memberships.filter(
          (m) => m.status === "active"
        );
        const scheduledMemberships = memberships.filter(
          (m) => m.status === "scheduled"
        );

        console.log("activeMemberships", activeMemberships);
        console.log("scheduledMemberships", scheduledMemberships);

        setMembershipData(activeMemberships);
        setScheduledMemberships(scheduledMemberships);
        // setMembershipData(membershipResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching membership data:", error);
      }
    };

    fetchMembershipData();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleInvoiceClose = () => setShowInvoice(false);

  const handlePayment = async (plan) => {
    console.log("id of the button/plan:", plan._id);

    setToastMessage(`Processing payment of $${plan.price} for ${plan.name}...`);
    setShowToast(true);

    setTimeout(() => {
      setToastMessage(`Payment successful for ${plan.name}!`);
      setShowToast(true);

      const invoiceData = {
        invoiceNumber: `INV-${Date.now()}`,
        planName: plan.name,
        price: plan.price,
        purchaseDate: moment().format("YYYY-MM-DD"),
        expiryDate: moment().add(plan.duration, "months").format("YYYY-MM-DD"),
        duration: plan.duration,
      };

      setCurrentInvoice(invoiceData);
      setShowInvoice(true);
    }, 2000);

    try {
      console.log("inside the handlePayment function");
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-order`, {
        amount: plan.price,
        currency: "INR",
        planId: plan._id,
        userId: userId,
      });

      console.log("response is:", response);

      const { order, paymentId } = response.data;
      console.log("order is :", order);
      console.log("paymentId is :", paymentId);

      // Fetch the Razorpay key from environment variables
      // console.log("Razorpay Key:", process.env.REACT_APP_RAZORPAY_KEY_ID);
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

      // Check if environment variable is defined

      if (!razorpayKey) {
        console.error("Razorpay key is missing! Check your .env file.");
        return;
      }

      console.log("RazorPay is:", razorpayKey);

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: "Gym Management",
        description: `Payment for ${plan.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            console.log("Inside 2nd try block");

            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/verify-payment`,
              {
                razorpay_order_id: order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                notes: {
                  paymentId: paymentId,
                  planId: plan._id,
                  userId: userId,
                },
                planDetails: {
                  name: plan.name,
                  duration: plan.duration,
                  price: plan.price,
                },
              }
            );
            console.log("After the response:", response);

            if (verifyResponse.data.success) {
              setToastMessage(`Payment successful for ${plan.name}!`);
              setShowToast(true);

              // Fetch updated membership data to get the new scheduled membership
              const updatedMembershipsResponse = await axios.get(
                `${import.meta.env.VITE_API_URL}/user/memberships/${userId}`
              );

              console.log(
                "updatedMembership response 167 :",
                updatedMembershipsResponse
              );

              const updatedMemberships =
                updatedMembershipsResponse.data.data || [];
              const updatedScheduledMemberships = updatedMemberships.filter(
                (m) => m.status === "scheduled"
              );

              const retrieveForStartDate =
                updatedMemberships[updatedMemberships.length - 1].startDate;

              const FormattedStartDate =
                moment(retrieveForStartDate).format("DD-MM-YYYY");

              console.log("Latest Start Date:", FormattedStartDate);

              setRetrieveFormattedStartedDate(FormattedStartDate);

              setScheduledMemberships(updatedScheduledMemberships);

              const invoiceData = {
                invoiceNumber: `INV-${Date.now()}`,
                planName: plan.name,
                price: plan.price,
                purchaseDate: moment().format("YYYY-MM-DD"),
                expiryDate: moment()
                  .add(plan.duration, "months")
                  .format("YYYY-MM-DD"),
                duration: plan.duration,
              };

              setCurrentInvoice(invoiceData);
              setShowInvoice(true);
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            setToastMessage(
              "Payment verification failed. Please contact support."
            );
            setShowToast(true);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error at frontend payment:", error);
      setToastMessage("Failed to initiate payment. Please try again.");
      setShowToast(true);
    }
  };

  return (
    <>
      <Header />
      <div className="membership-container-main">
        <h2 style={{ marginBottom: "30px" }}>Check Membership Details</h2>
        <div className="membership-details">
          <div className="membership-section">
            <h3>Your Memberships</h3>
            <div className="membership-cards"  style={{
                  minHeight:"200px",
                  display:"flex",
                  justifyContent:"center",
                  alignItems:"center",
                }}>
              {/* Active Memberships */}
              {membershipData.length > 0 ? (
                membershipData.map((membership, index) => (
                  <div className="membership-card active-card" key={index}>
                    <span className="sstatus-badge active-badge">Active</span>
                    <h4 style={{color:"gold"}}>{membership.planId?.name || "N/A"}</h4>
                    <p>
                      Duration: <span style={{color:"#7dd87d"}}> {membership.planId?.duration}{" "}
                      month(s) </span>
                    </p>
                    <p>
                      Price: <span style={{color:"#7dd87d"}}>  ${membership.planId?.price}</span>
                    </p>
                    <p>
                      Start Date: <span style={{color:"#7dd87d"}}>  {" "}
                      {moment(membership.startDate).format("DD-MM-YYYY")}</span>
                    </p>
                    <p>
                      Expiry Date: <span style={{color:"#7dd87d"}}> {" "}
                      {moment(membership.endDate).format("DD-MM-YYYY")}</span>
                    </p>
                  </div>
                ))
              ) : (
                <div>
                <p style={{color:"red",fontSize:"24px"}}>No active memberships !</p>
                </div>
              )}

              {/* Scheduled Memberships */}
              {scheduledMemberships.length > 0 &&
                scheduledMemberships.map((membership, index) => (
                  <div className="membership-card scheduled-card" key={index}>
                    <span className="sstatus-badge scheduled-badge">
                      Scheduled
                    </span>
                    <h4 style={{color:"gold"}}>{membership.planId?.name || "N/A"}</h4>
                    <p>
                      Duration: <span style={{color:"#f05d23"}}> {membership.planId?.duration}{" "}
                      month(s) </span>
                    </p>
                    <p>
                      Price: <span style={{color:"#f05d23"}}> ${membership.planId?.price}</span>
                    </p>
                    <p>
                      Start Date: <span style={{color:"#f05d23"}}>  {" "}
                      {moment(membership.startDate).format("DD-MM-YYYY")}</span>
                    </p>
                    <p>
                      End Date: <span style={{color:"#f05d23"}}>  {" "}
                      {moment(membership.endDate).format("DD-MM-YYYY")}</span>
                    </p>
                  </div>
                ))}
            </div>

            {/* <Button variant="primary" onClick={handleShow}>
          View All Membership Plans
        </Button> */}
          </div>

          <h3>Payment Options</h3>
          <div className="payment-table-container">
            <Table striped bordered hover>
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th>Plan Name</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                {allMembershipPlans.map((plan) => (
                  <tr key={plan._id}>
                    <td>{plan.name}</td>
                    <td>{plan.duration} months</td>
                    <td>${plan.price}</td>
                    <td>
                      <Button
                        key={`pay-${plan._id}`}
                        variant="success"
                        onClick={() => handlePayment(plan)}
                      >
                        Pay Now
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <CheckMembershipModal
          show={show}
          handleClose={handleClose}
          allMembershipPlans={allMembershipPlans}
          showInvoice={showInvoice}
          handleInvoiceClose={handleInvoiceClose}
          currentInvoice={currentInvoice}
          scheduledMemberships={scheduledMemberships}
          retrieveFormattedStartedDate={retrieveFormattedStartedDate}
        />

        <div className="toast-container">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              minWidth: "250px",
            }}
          >
            <Toast.Header>
              <strong className="me-auto">Payment Status</strong>
            </Toast.Header>
            <Toast.Body style={{color:"black"}}>{toastMessage}</Toast.Body>
          </Toast>
        </div>
      </div>
    </>
  );
};

export default CheckMembership;
