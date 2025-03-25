// MemberManagement.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search } from 'lucide-react';
import AssignTrainers from '../../Components/Admin/AssignTrainers';
import AdminHeader from '../../Components/Admin/AdminHeader';
import axios from 'axios'
import { UserContext } from '../../Context/UserContext';
import '../../Styles/MemberManagement.css';

import toast, { Toaster } from "react-hot-toast";




const MemberManagement = () => {
  const { userName, fetchUserData ,trainerName,setTrainerName, fetchTrainerData } = useContext(UserContext)
  

  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);  // New state for selected user

  
  // Form states
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    // contact: '',
    purpose: 'Muscle Building'
  });

  const [trainerForm, setTrainerForm] = useState({
    name: '',
    email: '',
    // contact: '',
    specialization: 'Muscle Building Coach'
  });



  // Handle form submissions
  const handleUserSubmit = async(e) => {
    e.preventDefault();

    if (!userForm.name || !userForm.email  ) {
      // alert("All fields are required.");
      toast.error("All fields are required.")
      return;
    }
  
    try {
      console.log("before the response");
      if (editingId) {
        // Send PUT request to update user
        const response = await axios.put(`http://localhost:3000/admin-user/${editingId}`, {
          username: userForm.name,
          email: userForm.email,
          // contact: userForm.contact,
          purpose: userForm.purpose,
        });
        // alert(response.data.message || "User updated successfully!");
        toast.success("User updated successfully!")
        fetchUserData(); // Refresh the user list
      } else {
        // Send POST request to create new user
        const response = await axios.post("http://localhost:3000/admin-userregister", {
          username: userForm.name,
          email: userForm.email,
          // contact: userForm.contact,
          password: userForm.password || "defaultpassword",
          purpose: userForm.purpose || "Muscle Building",
        });
      console.log("recived resposne");
      toast.success("User registered successfully!")
      
      fetchUserData();
      // alert(response.data.message || "User registered successfully!");
      }
      console.log(userName);
      
      // Add the new user to the UI
      setUserForm({ name: "", email: "", purpose: "Muscle Building", password: "" });
      setShowUserForm(false);
      setEditingId(null); // Reset editing ID

    } catch (error) {
      console.error("Error during user registration:", error);
      toast.error("Error during user registration")
    }
  };




  const handleTrainerSubmit = async(e) => {
    e.preventDefault();

    const trainerData = {
      username: trainerForm.name,
      email: trainerForm.email,
      password: "defaultpassword", // Set a default password or allow input for password
      // phone: trainerForm.contact,
      specialization: trainerForm.specialization,
    };

  try {
    console.log("Editing ID:", editingId);

    if (editingId !== null) {
      const response = await axios.put(`http://localhost:3000/trainer/${editingId}`, trainerData);

      if (response.status === 200) {
        fetchTrainerData(); // Refresh trainers list
        // alert("Trainer updated successfully!");
        toast.success("Trainer updated successfully!")
      }
    } else {
      console.log("Before posting for trainer register by admin");
      
      const response = await axios.post('http://localhost:3000/admin-trainerregister', trainerData);

      if (response.status === 201) {
        fetchTrainerData(); // Refresh trainers list
        // alert("Trainer registered successfully!");
        toast.success("Trainer registered successfully!")

      }
    }
    setTrainerForm({ name: '', email: '', contact: '', specialization: 'Muscle Building Coach' });
    setShowTrainerForm(false);
    setEditingId(null);
  } catch (error) {
    console.error("Error managing trainer:", error.response?.data || error.message);
    // alert(error.response?.data?.message || "Operation failed");
    toast.error("Operation failed")
  }
};

 
  const handleEdit = (member, type) => {
    console.log('Editing Member:', member);

    if (type === 'user') {
      setUserForm({
        name: member.username,
        email: member.email,
        // contact: member.contact,
        purpose: member.purpose || member.specialization
      });
      setShowUserForm(true);
      setEditingId(member._id); // Make sure to use _id instead of id
      setSelectedUser(member);  // Set the selected user
    } else {
      setTrainerForm({
        name: member.username,
        email: member.email,
        // contact: member.phone,
        specialization: member.specialization
      });      
      setShowTrainerForm(true);
      setEditingId(member._id);
    }
  };


  const handleDelete = async (id, type) => {
    try {
      if (type === 'user') {
        // Show confirmation dialog
        if (window.confirm('Are you sure you want to delete this user?')) {
          const response = await axios.delete(`http://localhost:3000/admin-user/${id}`);
          if (response.status === 200) {
            // alert('User deleted successfully');
            toast.success("User deleted successfully")
            fetchUserData(); // Refresh the user list
          }
        }
      } 
      else {
        // For trainers (assuming you have a similar endpoint for trainers)
        // if (window.confirm('Are you sure you want to delete this trainer?')) {
        console.log("before resonse");
        
          const response = await axios.delete(`http://localhost:3000/trainer/${id}`);
          console.log("after response");
          console.log("Trainer deleted successfully:", response.data);

          
          if (response.status === 200) {
            console.log("entered inside");
            
            setTrainerName(trainerName.filter(trainer => trainer.id !== id));
            // alert('Trainer deleted successfully');
            toast.success("Trainer deleted successfully")
            fetchTrainerData();
          }
        
      }
    } catch (error) {
      console.error("Error deleting:", error);
      // alert(error.response?.data?.message || "Failed to delete. Please try again.");

      toast.error("Failed to delete")
    }
  };

  // Filter members based on search
  const filteredUsers = userName.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTrainers = trainerName.filter(trainer =>
    trainer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <AdminHeader/>
    <div className="member-management-container">
      <div className="management-card-admin">
        <h2 className="card-title">Member Management</h2>

        {/* Search Bar */}
        <div className="search-bar-admin">
          <Search size={26} style={{marginTop:"9px",marginLeft:"10px"}}/>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="tabss">
          <button
            className={`tab-buttonss ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`tab-buttonss ${activeTab === 'trainers' ? 'active' : ''}`}
            onClick={() => setActiveTab('trainers')}
          >
            Trainers
          </button>
        </div>

        {/* Users Tab Content */}
        {activeTab === 'users' && (
          <div className="tab-contentss">
            
            <button 
              className="add-button-member-management"
              onClick={() => {
                setShowUserForm(true);
                setEditingId(null);
                setUserForm({ name: '', email: '', contact: '' });
              }}
            >
             <Plus size={20}/> Add New User
            </button>

            {showUserForm && (
              <form className="member-form-2" onSubmit={handleUserSubmit}>
                {/* <div className="first-input-section"> */}
                <input
                  type="text"
                  placeholder="Name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                />
                {/* </div> */}
                
                {/* <input
                  type="tel"
                  placeholder="Contact Number"
                  value={userForm.contact}
                  onChange={(e) => setUserForm({...userForm, contact: e.target.value})}
                  required
                /> */}
                {/* <input
                  type="text"
                  placeholder="purpose"
                  value={userForm.purpose}
                  onChange={(e) => setUserForm({...userForm, purpose: e.target.value})}
                  required
                /> */}

                  {console.log("userForm ATT:",userForm)
                  }

                  {/* <div className="second-input-section"> */}
                <select value={userForm.purpose}
                  onChange={(e) => setUserForm({...userForm, purpose: e.target.value})}
                  required>
                  <option value="Muscle Building">Muscle Building</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Endurance">Endurance</option>
                </select>


                <input
                  type="password"
                  placeholder="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                  
                />
                {/* </div> */}
                <div className="form-buttons-member-management">
                  <button type="submit" className="save-button-member-management">
                    <Check size={16} /> Save
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button-member-management"
                    onClick={() => {
                      setShowUserForm(false);
                      setEditingId(null);
                    }}
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </form>


            )}

            <table className="members-table-user">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {/* <th>Contact</th> */}
                  <th>purpose</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      {/* <td>{user.contact}</td> */}
                      <td>{user.purpose}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-button"
                            onClick={() => handleEdit(user, 'user')}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDelete(user._id, 'user')}
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

        {/* Trainers Tab Content */}
        {activeTab === 'trainers' && (
          <div className="tab-content-trainer">
            <button 
              className="add-button-member-management"
              onClick={() => {
                setShowTrainerForm(true);
                setEditingId(null);
                setTrainerForm({ name: '', email: '', specialization: 'Muscle Building Coach' });
              }}
            >
              <Plus size={20} /> Add New Trainer
            </button>

            {showTrainerForm && (
              <form className="member-form-2" onSubmit={handleTrainerSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={trainerForm.name}
                  onChange={(e) => setTrainerForm({...trainerForm, name: e.target.value})}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={trainerForm.email}
                  onChange={(e) => setTrainerForm({...trainerForm, email: e.target.value})}
                  required
                />
                {/* <input
                  type="tel"
                  placeholder="Contact Number"
                  value={trainerForm.contact}
                  onChange={(e) => setTrainerForm({...trainerForm, contact: e.target.value})}
                  required
                /> */}
                {/* <input
                  type="text"
                  placeholder="Specialization"
                  value={trainerForm.specialization}
                  onChange={(e) => setTrainerForm({...trainerForm, specialization: e.target.value})}
                  required
                /> */}

                <select value={trainerForm.specialization}
                  onChange={(e) => setTrainerForm({...trainerForm, specialization: e.target.value})}
                  required>
                  <option value="Muscle Building Coach">Muscle Building Coach</option>
                  <option value="Weight Loss Coach">Weight Loss Coach</option>
                  <option value="Endurance Coach">Endurance Coach</option>
                </select>
                

                <div className="form-buttons-member-management">
                  <button type="submit" className="save-button-member-management">
                    <Check size={16} /> Save
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button-member-management"
                    onClick={() => {
                      setShowTrainerForm(false);
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
                    <th>Name</th>
                    <th>Email</th>
                    {/* <th>Contact</th> */}
                    <th>Specialization</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainers.map((trainer) => (
                    <tr key={trainer._id}>
                      <td>{trainer.username}</td>
                      <td>{trainer.email}</td>
                      {/* <td>{trainer.phone}</td> */}
                      <td>{trainer.specialization}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-button"
                            onClick={() => handleEdit(trainer, 'trainer')}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="delete-button"
                            onClick={() => handleDelete(trainer._id, 'trainer')}
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
      </div>
    <AssignTrainers users={userName} trainers={trainerName} selectedUser={selectedUser}/>
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



export default MemberManagement;