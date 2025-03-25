import React, { useContext, useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Search } from "lucide-react";
import "../../Styles/WorkoutDiet.css";
import TrainerHeader from "../../Components/Trainer/TrainerHeader";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";

import toast, { Toaster } from 'react-hot-toast';


const WorkoutDiet = () => {
  const { userName } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("workout");
  const [searchTerm, setSearchTerm] = useState("");
  const [dietPlans, setDietPlans] = useState({
    message: "",
    response: [],
  });
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("workout");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    userId: "",
    userName: "",
  });

  const [users, setUsers] = useState([]);
  const [usernameMappings, setUsernameMappings] = useState([]);
  const [workoutDetails, setWorkoutDetails] = useState([]);

  // Fetch all users associated with the trainer
  useEffect(() => {
    const fetchAllUsers = async () => {
      const trainerId = sessionStorage.getItem("trainerId");
      if (!trainerId) {
        console.error("Trainer ID is missing");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/get-all-users",
          {
            params: { trainerId },
          }
        );

        const result = response.data.data;
        const mappings = result.map((item) => ({
          username: item.user.username,
          id: item.user._id,
        }));

        setUsernameMappings(mappings);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  // Fetch all workouts
  const fetchWorkouts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/get-all-workouts"
      );
      const workoutDetails = response.data.workoutPlans.map((workout) => ({
        id: workout._id,
        userId: workout.userId._id,
        userName: workout.userId.username,
        planname: workout.planname,
        instructions: workout.instructions,
      }));

      setWorkoutDetails(workoutDetails);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      toast.error("Error fetching workouts")
    }
  };

  // Fetch all diet plans
  const fetchDietPlans = async () => {
    try {
      const response = await axios.get("http://localhost:3000/get-dietplans");
      setDietPlans({
        message: response.data.message || "Successfully fetched diet plans",
        response: response.data.response || [],
      });
    } catch (error) {
      console.error("Error fetching diet plans:", error);
      toast.error("Error fetching diet plans")

    }
  };

  useEffect(() => {
    fetchWorkouts();
    fetchDietPlans();
  }, []);

  const handleUserSelect = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = usernameMappings.find(
      (mapping) => mapping.id === selectedUserId
    );

    if (selectedUser) {
      setFormData((prev) => ({
        ...prev,
        userId: selectedUserId,
        userName: selectedUser.username,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        if (formType === "workout") {
          await axios.put(
            `http://localhost:3000/update-assign-workoutplan/${editingId}`,
            {
              planname: formData.name,
              instructions: formData.description,
              userId: formData.userId,
            }
          );

          toast.success("Updated Workout Successfully!")
          console.log("FormData after updateAssignWorkouts", formData);

          await fetchWorkouts();
        } else {
          console.log("random for update diet plan...");

          await axios.put(
            `http://localhost:3000/update-dietplan/${editingId}`,
            {
              planname: formData.name,
              instructions: formData.description,
              userId: formData.userId,
            }
          );

          toast.success("Updated Diet Plan Successfully!")

          console.log("FormData after updateDietPlans", formData);

          await fetchDietPlans();
        }
      } else {
        if (formType === "workout") {
          await axios.post("http://localhost:3000/assign-workouts", {
            planname: formData.name,
            instructions: formData.description,
            userId: formData.userId,
          });

          toast.success("Added Workouts Successfully!")

          await fetchWorkouts();
        } else {
          await axios.post("http://localhost:3000/post-dietplans", {
            planname: formData.name,
            instructions: formData.description,
            userId: formData.userId,
          });

          toast.success("Added Diet Plans Successfully!")

          await fetchDietPlans();
        }
      }

      setFormData({ name: "", description: "", userId: "", userName: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error submitting plan:", error);
      toast.error("Error submitting plan")
    }
  };

  const handleEdit = (plan, type) => {
    console.log("handleEdit plan in 160", plan);

    setFormType(type);
    setFormData({
      name: plan.planname,
      description: plan.instructions,
      userId: type === "workout" ? plan.userId : plan.userId._id,
      userName: type === "workout" ? plan.userName : plan.userId.username,
    });
    setShowForm(true);
    setEditingId(plan.id || plan._id);
  };

  const handleDelete = async (id, type) => {
    try {
      if (type === "workout") {
        console.log("id in handle Delete:", id);

        const response1 = await axios.delete(
          `http://localhost:3000/delete-assignworkout/${id}`
        );

        console.log("response1 is :", response1);
        toast.success("Deleted workout successfully!")

        await fetchWorkouts();
      } else {
        console.log("id in handle Delete 2:", id);
        const response2 = await axios.delete(
          `http://localhost:3000/delete-dietplan/${id}`
        );

        console.log("response 2 is:", response2);
        toast.success("Deleted DietPlan Successfully!")

        await fetchDietPlans();
      }
    } catch (error) {
      console.error("Error deleting plan:", error);
      toast.error("Error deleting plan")
    }
  };

  const filteredWorkoutPlans = workoutDetails.filter(
    (plan) =>
      plan.planname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDietPlans = dietPlans.response.filter(
    (plan) =>
      plan.planname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.userId.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <TrainerHeader />
      <div className="workout-diet-container-trainer-workout-diet">
        <div className="management-card-trainer-workout-diet">
          <h2 className="card-title">Workout and Diet Management</h2>

          <div className="search-bar-trainer-workout-diet">
            {/* <div className="search-box"> */}
            <Search className="search-icon-workout-diet" size={24} />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* </div> */}
          </div>

          <div className="tabs">
            <div className="tab-buttons-container">
              <button
                className={`tab-button ${
                  activeTab === "workout" ? "active" : ""
                }`}
                onClick={() => setActiveTab("workout")}
              >
                Workout Plans
              </button>
              <button
                className={`tab-button ${activeTab === "diet" ? "active" : ""}`}
                onClick={() => setActiveTab("diet")}
              >
                Diet Plans
              </button>
            </div>
          </div>

          {activeTab === "workout" && (
            <div className="plan-section-trainer-workout-diet">
              <button
                className="add-btn-trainer-workout-diet"
                onClick={() => {
                  setFormType("workout");
                  setShowForm(true);
                  setFormData({
                    name: "",
                    description: "",
                    userId: "",
                    userName: "",
                  });
                  setEditingId(null);
                }}
              >
                <Plus size={20} /> Add Workout Plan
              </button>

              {showForm && formType === "workout" && (
                <form
                  className="plan-form-trainer-workout-diet"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group-trainer-workout-diet">
                    <input
                      type="text"
                      placeholder="Workout Plan Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group-trainer-workout-diet">
                    <textarea
                      placeholder="Exercise Details & Instructions"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group-trainer-workout-diet">
                    <select
                      value={formData.userId}
                      onChange={handleUserSelect}
                      required
                    >
                      <option value="">Assign to User</option>
                      {usernameMappings.map((mapping) => (
                        <option key={mapping.id} value={mapping.id}>
                          {mapping.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions-trainer-workout-diet">
                    <button type="submit" className="save-btn-trainer-workout-diet">
                      <Check size={16} /> Save
                    </button>
                    <button
                      type="button"
                      className="cancel-btn-trainer-workout-diet"
                      onClick={() => setShowForm(false)}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="table-wrapper-trainer-workout-diet">
                <table className="plans-table">
                  <thead>
                    <tr>
                      <th>Workout Plan</th>
                      <th>Exercise Details</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkoutPlans.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.planname}</td>
                        <td>{plan.instructions}</td>
                        <td>{plan.userName}</td>
                        <td>
                          <div className="action-buttons-trainer-workout-diet">
                            <button
                              className="edit-btn-trainer-workout-diet"
                              onClick={() => handleEdit(plan, "workout")}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="delete-btn-trainer-workout-diet"
                              onClick={() => {
                                console.log(
                                  "Workout delete clicked, plan:",
                                  plan
                                );
                                console.log(
                                  "Workout ID being passed:",
                                  plan.id
                                );
                                handleDelete(plan.id, "workout");
                              }}
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
            </div>
          )}

          {activeTab === "diet" && (
            <div className="plan-section-trainer-workout-diet">
              <button
                className="add-btn-trainer-workout-diet"
                onClick={() => {
                  setFormType("diet");
                  setShowForm(true);
                  setFormData({
                    name: "",
                    description: "",
                    userId: "",
                    userName: "",
                  });
                  setEditingId(null);
                }}
              >
                <Plus size={20} /> Add Diet Plan
              </button>

              {showForm && formType === "diet" && (
                <form
                  className="plan-form-trainer-workout-diet"
                  onSubmit={handleSubmit}
                >
                  <div className="form-group-trainer-workout-diet">
                    <input
                      type="text"
                      placeholder="Diet Plan Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group-trainer-workout-diet">
                    <textarea
                      placeholder="Meal Plan & Nutritional Guidelines"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group-trainer-workout-diet">
                    <select
                      value={formData.userId}
                      onChange={handleUserSelect}
                      required
                    >
                      <option value="">Assign to User</option>
                      {console.log("usernameMappings", usernameMappings)}
                      {usernameMappings.map((mapping) => (
                        <option key={mapping.id} value={mapping.id}>
                          {mapping.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions-trainer-workout-diet">
                    <button
                      type="submit"
                      className="save-btn-trainer-workout-diet"
                    >
                      <Check size={16} /> Save
                    </button>
                    <button
                      type="button"
                      className="cancel-btn-trainer-workout-diet"
                      onClick={() => setShowForm(false)}
                    >
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="table-wrapper-trainer-workout-diet">
                <table className="plans-table diet-table">
                  <thead>
                    <tr>
                      <th>Diet Plan</th>
                      <th>Meal Details</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDietPlans.map((plan) => (
                      <tr key={plan.id}>
                        <td>{plan.planname}</td>
                        <td>{plan.instructions}</td>
                        <td>{plan.userId.username}</td>
                        <td>
                          <div className="action-buttons-trainer-workout-diet">
                            <button
                              className="edit-btn-trainer-workout-diet"
                              onClick={() => handleEdit(plan, "diet")}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="delete-btn-trainer-workout-diet"
                              onClick={() => {
                                console.log("diet delete clicked, plan:", plan);
                                console.log("diet ID being passed:", plan._id);
                                handleDelete(plan._id, "diet");
                              }}
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

export default WorkoutDiet;
