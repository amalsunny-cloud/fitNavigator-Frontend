import React, { useContext, useState,useEffect } from 'react';
import PerformanceModal from '../../Components/Trainer/PerformanceModal';
// import PerformanceModal from './PerformanceModal';
import '../../Styles/MemberPerform.css'
import TrainerHeader from '../../Components/Trainer/TrainerHeader';
import { UserContext } from '../../Context/UserContext';
import axios from 'axios'

const MemberPerform = () => {
  // const {userName} = useContext(UserContext)
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fetchedAssignedTrainerUser,setFetchedAssignedTrainerUser] = useState([])
  const [userProgress,setUserProgress] = useState([])
  // console.log(userName);

  const trainerId = sessionStorage.getItem('trainerId');

  const fetchAssignedUsersofTrainer = async()=>{
    try{
      console.log("inside the fetchAssignedUsersofTrainer function");
      if (!trainerId) {
        console.error("Trainer ID is missing!");
        return;
    }
      const response = await axios.get(`http://localhost:3000/get-all-users?trainerId=${trainerId}`)

      console.log("response after in fetchAssignedUsersofTrainer:",response.data.data);

      // Extracting user objects from assignedUsers response
      const users = response.data.data.map(item => item.user); 
      setFetchedAssignedTrainerUser(users)  
    }
    catch(error){
      console.error("Error at fetchAssignedUsersofTrainer function",error); 
      setFetchedAssignedTrainerUser([]);
    }
  }

  const fetchUserProgress = async()=>{
    try{
      console.log("Inside the frontend fetchUserProgress");
      const response = await axios.get(`http://localhost:3000/get-all-users-progress?trainerId=${trainerId}`)

      console.log("response after in fetchUserProgress:",response.data.data);
  
      // const saved = response.data.data.map((progress)=>(
      //   progress.progressData
      // ))

      // console.log("saved savvv:",saved);
      setUserProgress(response.data.data)
      
    }
    catch(error){
      console.error("Error at frontend fetchUserProgress",error);
      setUserProgress([]);

    }
  }

  useEffect(() => {
    if (trainerId) {
      fetchAssignedUsersofTrainer();
      fetchUserProgress();
    }
  }, [trainerId]);

  // Function to handle user name click
  const handleUserClick = (user) => {
    console.log("user  i:",user);
    
    setSelectedUser(user);
    setShowModal(true); // Show performance chart modal when a user is clicked
  };

  

  return (
    <>
    <TrainerHeader/>
    <div className="member-perform-container" style={{ display: 'flex' }}>
      {/* Left side - User names with goals */}
      <div className="user-list" style={{ width: '50%', padding: '20px' }}>
        <h2>User Performance</h2>
        <ul>
          {fetchedAssignedTrainerUser.map((user) => (
            <li
              key={user.id}
              style={{ cursor: 'pointer', marginBottom: '10px' }}
              onClick={() => handleUserClick(user)}
            >
              {user.username} - <span style={{color:"goldenrod",fontWeight:"600"}}>Goal </span>: {user.purpose}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Performance chart modal */}
      {showModal && selectedUser && (
        <div className="performance-modal-container" style={{ width: '50%', padding: '20px' }}>
          <PerformanceModal
            user={selectedUser}
            progressData={userProgress}
            onClose={() => setShowModal(false)} // Hide the modal
          />
        </div>
      )}
    </div>
    </>
  );
};

export default MemberPerform;
