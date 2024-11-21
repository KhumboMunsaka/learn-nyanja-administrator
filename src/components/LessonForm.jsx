import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  Undo,
} from "ckeditor5";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase/firebase.config"; // Import your Firebase configuration

import styles from "../styles/LessonForm.module.css";

// Initialize Firestore
// const db = getFirestore(getFirebaseApp());

function LessonForm() {
  const [title, setTitle] = useState("");
  const [section, setSection] = useState("");
  const [lessonText, setLessonText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !section || !lessonText) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Path: lessons -> section (e.g., "verb") -> subcollection "sublessons" -> lesson title
      const sublessonsCollectionRef = collection(
        db,
        "lessons",
        section, // e.g., "verb"
        "sublessons" // subcollection name where lessons will go
      );

      // Path: lessons -> section -> subcollection -> lesson title
      const lessonDocRef = doc(sublessonsCollectionRef, title); // Using title as document name

      // Set the lesson data in the document
      await setDoc(lessonDocRef, {
        title,
        text: lessonText,
        timestamp: new Date(), // Optional: Add a timestamp
      });

      alert("Lesson added successfully!");
      // Clear the form
      setTitle("");
      setSection("");
      setLessonText("");
    } catch (error) {
      console.error("Error adding lesson: ", error);
      alert("Failed to add lesson. Try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.smallScreen}>
        Please Revert to using a larger screen to add lessons
      </h3>
      <form onSubmit={handleSubmit}>
        <h3>Add a Lesson</h3>
        <div className={styles.lessonTitle}>
          <label htmlFor="title">Lesson Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.section}>
          <label>For Which Section?</label>
          <select value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">Select Section</option>
            <option value="nouns">Nouns</option>
            <option value="verbs">Verbs</option>
            <option value="adjectives">Adjectives</option>
            <option value="adverbs">Adverbs</option>
            <option value="pronouns">Pronouns</option>
            <option value="prepositions">Prepositions</option>
          </select>
        </div>
        <div className={styles.lessonText}>
          <label>Enter Lesson Text</label>
          <CKEditor
            editor={ClassicEditor}
            config={{
              toolbar: {
                items: ["undo", "redo", "|", "bold", "italic"],
              },
              plugins: [Bold, Essentials, Italic, Paragraph, Undo],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setLessonText(data);
            }}
          />
          <button type="submit" className={styles.submitLesson}>
            Submit Lesson
          </button>
        </div>
      </form>
    </div>
  );
}

export default LessonForm;
