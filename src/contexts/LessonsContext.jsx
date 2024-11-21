import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config"; // Firebase config import

// Create a context for lessons data
const LessonsContext = createContext();

// Custom hook to use the LessonsContext
export const useLessons = () => {
  return useContext(LessonsContext);
};

// LessonsProvider component to fetch and provide lessons data
export const LessonsProvider = ({ children }) => {
  const [lessons, setLessons] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLessonCollections = async (section) => {
    if (!section) return;

    try {
      // Path to the section (e.g., "lessons/verbs")
      const sectionRef = doc(db, "lessons", section); // "lessons/verbs"
      const sectionDoc = await getDoc(sectionRef);

      if (!sectionDoc.exists()) {
        setError(`No such section: ${section}`);
        setLoading(false);
        return;
      }

      // Fetch collections within the section document
      const subCollectionsSnapshot = await getDocs(
        collection(db, "lessons", section)
      );

      const collections = subCollectionsSnapshot.docs.map((doc) => doc.id);
      setLessons(collections);
      setLoading(false);
      console.log("I called the lessons");
    } catch (error) {
      setError("Error fetching lesson collections: " + error.message);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <LessonsContext.Provider
      value={{ lessons, loading, error, fetchLessonCollections }}
    >
      {children}
    </LessonsContext.Provider>
  );
};
