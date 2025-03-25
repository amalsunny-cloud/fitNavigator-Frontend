import Footer from './Components/Footer'
import Home from './Pages/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import UserAuth from './Pages/User/UserAuth'
import UserDashboard from './Pages/User/UserDashboard'
import MemberManagement from './Pages/Admin/MemberManagement'
import AdminAuth from './Pages/Admin/AdminAuth'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import TrackPendingPayments from './Pages/Admin/TrackPendingPayments'
import ManageAttendance from './Pages/Admin/ManageAttendance'
import PaymentManagement from './Pages/Admin/PaymentManagement'
import SendMessages from './Pages/Admin/SendMessages'
import TrainerLogin from './Pages/Trainer/TrainerLogin'
import TrainerDashboard from './Pages/Trainer/TrainerDashboard'
import TrainingSchedules from './Pages/Trainer/TrainingSchedules'
import WorkoutDiet from './Pages/Trainer/WorkoutDiet'
import MemberPerform from './Pages/Trainer/MemberPerform'
import MarkUserAttendance from './Pages/Trainer/MarkUserAttendance'
import Messages from './Pages/Trainer/Messages'
import ViewAssignedPlans from './Pages/User/ViewAssignedPlans'
import CheckMembership from './Pages/User/CheckMembership'
import TrackWorkout from './Pages/User/TrackWorkout'
import ViewAttendance from './Pages/User/ViewAttendance'
import ViewTrainingSchedules from './Pages/User/ViewTrainingSchedules'
import MessagesUser from './Pages/User/MessagesUser'
import AdminChangePassword from './Components/Admin/AdminChangePassword'
import TrainerChangePassword from './Components/Trainer/TrainerChangePassword'
import UserChangePassword from './Components/User/UserChangePassword'


function App() {

  return (
    <>

    <Routes>
      <Route path='/' element={<Home/>}></Route>
      {/* <Route path='/admin/login' element={<Auth/>}></Route> */}
      <Route path='/userauth' element={<UserAuth/>}></Route>
      <Route path='/userdashboard' element={<UserDashboard/>}></Route>
      <Route path='/*' element={<Navigate to={'/'}/>}></Route>


      <Route path='/adminauth' element={<AdminAuth/>}></Route>
      <Route path='/admindashboard' element={<AdminDashboard/>}></Route>
      <Route path='/trackpendingpayment' element={<TrackPendingPayments/>}></Route>
      <Route path="/admin/members" element={<MemberManagement />} />
      <Route path="/manageattendance" element={<ManageAttendance />} />
      <Route path="/payment-management" element={<PaymentManagement />} />
      <Route path="/sendmessages" element={<SendMessages />} />

      <Route path="/admin-change-password" element={<AdminChangePassword />} />

      {/* <Route 
  path="/admin-change-password" 
  element={<AdminChangePassword show={true} onClose={() => window.history.back()} />} 
/> */}

      <Route path="/trainer/login" element={<TrainerLogin />} />
      <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
      <Route path="/trainer/trainingschedules" element={<TrainingSchedules />} />
      <Route path="/trainer/workoutdiet" element={<WorkoutDiet />} />
      <Route path="/trainer/memberperform" element={<MemberPerform />} />
      <Route path="/trainer/markuserattendance" element={<MarkUserAttendance />} />
      <Route path="/trainer/messages" element={<Messages />} />

      <Route path="/trainer-change-password" element={<TrainerChangePassword />} />


      <Route path="/user/viewassignedplans" element={<ViewAssignedPlans />} />
      <Route path="/user/checkmembership" element={<CheckMembership />} />
      <Route path="/user/trackworkout" element={<TrackWorkout />} />
      <Route path="/user/viewattendance" element={<ViewAttendance />} />
      <Route path="/user/viewtraining" element={<ViewTrainingSchedules />} />
      <Route path="/user/messageUser" element={<MessagesUser />} />
      <Route path="/user-change-password" element={<UserChangePassword />} />

    </Routes>
    </>
  )
}

export default App
