import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, DollarSign, Calendar, Search } from 'lucide-react';
import '../../Styles/PaymentManagement.css'; 
import AdminHeader from '../../Components/Admin/AdminHeader';
import axios from 'axios';

import toast, { Toaster } from "react-hot-toast";


const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('plans');
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: '',
    duration: '',
    price: ''
  });

  const [paymentHistory, setPaymentHistory] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch data from the backend
  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const plansResponse = await axios.get(`${import.meta.env.VITE_API_URL}/plans`);
        console.log('Plans response:', plansResponse.data);
        setPlans(plansResponse.data.data || []);

        const historyResponse = await axios.get(`${import.meta.env.VITE_API_URL}/payment-history`);
        console.log('History responsess:', historyResponse.data);

        setPaymentHistory(historyResponse.data.data || []);
      } catch (err) {
        // setError(false);
        console.error(err);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [refreshKey]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        // Update existing plan
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/plans/${editingId}`, {
          name: planForm.name,
          duration: parseInt(planForm.duration, 10),
          price: parseFloat(planForm.price)
        });
        setPlans((prevPlans) => prevPlans.map(plan => plan._id === editingId ? response.data.data : plan));
        setEditingId(null);

        toast.success("Plan updated successfully!");
      } else {
        // Create new plan
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/plans`, {
          name: planForm.name,
          duration: parseInt(planForm.duration, 10),
          price: parseFloat(planForm.price)
        });

        setPlans((prevPlans) => [...prevPlans, response.data.data]);
        toast.success("New plan created successfully!");

        console.log('New plan created:', response.data.data);
      }
        setPlanForm({ name: '', duration: '', price: '' });
        setShowPlanForm(false);
        setRefreshKey(prev => prev + 1);

    } catch (error) {
      console.error('Error submitting plan:', error);
      toast.error("Failed to save plan.")
    }
  };

 

  const handleEdit = (plan) => {
    setPlanForm(plan);
    setShowPlanForm(true);
    setRefreshKey(prev => prev + 1);
    setEditingId(plan._id);
  };

  const handleDelete = async (id) => {
    try {
      console.log('Deleting plan with ID:', id);
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/plans/${id}`);
      console.log('Delete response:', response);

      toast.success("Deleted Plan Successfully")

      setPlans((prevPlans) => prevPlans.filter(plan => plan._id !== id));
      setRefreshKey(prev => prev + 1);

    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan.');
    }
  };

  // Filter plans and payment history based on search
  const filteredPlans = plans.filter(plan =>
    plan?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const filteredHistory = paymentHistory.filter(payment =>
    payment?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment?.userId?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  return (
    <>
      <AdminHeader />
      <div className="payment-management-container">
        <div className="management-card-payment">
          <h2 className="card-title">Payment Management</h2>

          {error && <div className="error-message">{error}</div>}
          {loading && <div className="loading">Loading...</div>}

          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name or id"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="tabs-payment">
            <button
              className={`tab-button ${activeTab === 'plans' ? 'active' : ''}`}
              onClick={() => setActiveTab('plans')}
            >
              Membership Plans
            </button>
            <button
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Payment History
            </button>
          </div>

          {activeTab === 'plans' && (
            <div className="tab-contents">
              <button 
                className="add-button"
                onClick={() => {
                  setShowPlanForm(true);
                  setEditingId(null);
                  setPlanForm({ name: '', duration: '', price: '' });
                }}
              >
                <Plus size={20} /> Add New Plan
              </button>

              {showPlanForm && (
                <form className="member-form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Plan Name"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Duration (months)"
                    value={planForm.duration}
                    onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={planForm.price}
                    onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                    required
                  />
                  <div className="form-buttons-payment-management">
                    <button type="submit" className="save-button-payment-management">
                      <Check size={16} /> Save
                    </button>
                    <button 
                      type="button" 
                      className="cancel-button-payment-management"
                      onClick={() => {
                        setShowPlanForm(false);
                        setEditingId(null);
                      }}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </form>
              )}

              <table className="members-table">
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlans.map((plan) => (
                    <tr key={plan._id}>
                      <td>{plan.name}</td>
                      <td>{plan.duration} month{plan.duration > 1 ? 's' : ''}</td>
                      <td>${plan.price}</td>
                      <td>
                        <div className="action-buttons-payment-management">
                          <button 
                            className="edit-button-1"
                            onClick={() => handleEdit(plan)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="delete-button-1"
                            onClick={() => handleDelete(plan._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="tab-contents">
              <table className="members-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {filteredHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.userId}</td>
                    <td>{payment.userName}</td>
                    <td>{payment.plan}</td>
                    <td>${payment.amount}</td>
                    <td>
                      <div className="date-display">
                        <Calendar size={16} />
                        {payment.date}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badges ${payment.status}`}>
                        <DollarSign size={16} />
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default PaymentManagement;