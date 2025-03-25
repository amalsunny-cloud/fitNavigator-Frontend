// TrainingContext.jsx
import React, { createContext, useState } from 'react';

export const TrainingContext = createContext();

export const TrainingProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([
    // Mock data
    {
      sessionName: "Morning Cardio",
      date: "2025-01-10",
      time: "06:00",
      trainer: "John Smith"
    },
    {
      sessionName: "Weight Training",
      date: "2025-01-12",
      time: "14:30",
      trainer: "Sarah Johnson"
    },
    {
      sessionName: "Yoga Session",
      date: "2025-01-15",
      time: "08:00",
      trainer: "Mike Wilson"
    },
    {
      sessionName: "HIIT Workout",
      date: "2025-01-18",
      time: "16:00",
      trainer: "Emma Davis"
    }
  ]);

  return (
    <TrainingContext.Provider value={{ schedules, setSchedules }}>
      {children}
    </TrainingContext.Provider>
  );
};