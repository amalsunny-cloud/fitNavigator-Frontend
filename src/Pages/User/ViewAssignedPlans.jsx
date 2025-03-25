import React, { useEffect, useState } from "react";
import "../../Styles/ViewAssignedPlans.css";
import Header from "../../Components/Header";
import axios from "axios";
import dietFood from "../../assets/diet-food.png";
import lunges from "../../assets/lunges.png";

const ViewAssignedPlans = () => {
  const [activeTab, setActiveTab] = useState("workout");
  const [workouts, setWorkouts] = useState([]);
  // const [diets, setDiets] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true); // To track loading state

  const userId = sessionStorage.getItem("userId");
  console.log("UserID:", userId);

  const getAssignedWorkouts = async () => {
    try {
      console.log("Fetching assigned workouts...");
      const response = await axios.get(
        `http://localhost:3000/getTrainerAssignedWorkoutUser/${userId}`
      );
      console.log("API Response of getAssignedWorkouts:", response.data);

      setWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getAssignedWorkouts();
      getAssignedDiets();
    }
  }, [userId]);

  const getAssignedDiets = async () => {
    try {
      console.log("Fetching assigned diets...");
      const response = await axios.get(
        `http://localhost:3000/getTrainerAssignedDietUser/${userId}`
      );
      console.log("API Response getAssignedDiets:", response.data);

      setDietPlans(response.data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, wordLimit = 15) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  return (
    <>
      <Header />
      <div className="view-plans-container">
        <div className="plans-header-view-assign-plan">
          <h2>Your Assigned Plans</h2>
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === "workout" ? "active" : ""}`}
              onClick={() => setActiveTab("workout")}
            >
              Workout Plans
            </button>
            <button
              className={`tab-btn ${activeTab === "diet" ? "active" : ""}`}
              onClick={() => setActiveTab("diet")}
            >
              Diet Plans
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {activeTab === "workout" && (
              <>
                <div className="main-for-image-and-card">
                  <div className="image-container">
                    <img src={lunges} alt="Workout" width="300px" />
                  </div>
                  <div className="plan-list">
                    {workouts.length > 0 ? (
                      <div className="plan-details">
                        {workouts.map((plan) => (
                          <div key={plan._id} className="plan-card">
                            <h3>{plan.planname || "Unnamed Workout"}</h3>
                            <p>
                              {truncateText(
                                plan.instructions || "No description available"
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "red",
                            fontSize: "26px",
                            fontWeight: "bold",
                          }}
                        >
                          No workouts found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === "diet" && (
              <>
                <div className="main-for-image-and-card">
                  <div className="image-container">
                    <img src={dietFood} alt="food" width="300px" />
                  </div>

                  <div className="plan-list">
                    {dietPlans.length > 0 ? (
                      <div className="plan-details">
                        {dietPlans.map((plan) => (
                          <div key={plan._id} className="plan-card">
                            <h3>{plan.planname || "Unnamed Diet Plan"}</h3>
                            <p>
                              {truncateText(
                                plan.instructions || "No description available"
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            color: "red",
                            fontSize: "26px",
                            fontWeight: "bold",
                          }}
                        >
                          No Diet plans found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ViewAssignedPlans;
