import { createContext, useEffect, useState } from "react";
import axios from "axios";


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState([]);
    const [trainerName, setTrainerName] = useState([]);

    const fetchUserData = async() => {
        try {
            const response = await axios.get("http://localhost:3000/admin-userregister");
            setUserName(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const fetchTrainerData = async() => {
        try {
            const response = await axios.get("http://localhost:3000/admin-trainerregister");
            setTrainerName(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData(); // Fetch user data on mount
        fetchTrainerData(); // Fetch user data on mount
    }, []);

    return (
        <UserContext.Provider value={{ userName, setUserName,trainerName ,setTrainerName, fetchUserData, fetchTrainerData }}>
            {children}
        </UserContext.Provider>
    );
};

