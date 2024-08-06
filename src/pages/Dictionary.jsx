import { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

function AdminForm() {
  const [user, setUser] = useState(null);
  const [word, setWord] = useState("");
  const [meanings, setMeanings] = useState([
    { translation: "", partOfSpeech: "" },
  ]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const handleWordChange = (e) => setWord(e.target.value);

  const handleTranslationChange = (index, e) => {
    const newMeanings = meanings.map((meaning, i) =>
      i === index ? { ...meaning, translation: e.target.value } : meaning
    );
    setMeanings(newMeanings);
  };

  const handlePartOfSpeechChange = (index, e) => {
    const newMeanings = meanings.map((meaning, i) =>
      i === index ? { ...meaning, partOfSpeech: e.target.value } : meaning
    );
    setMeanings(newMeanings);
  };

  const handleAddMeaning = () =>
    setMeanings([...meanings, { translation: "", partOfSpeech: "" }]);

  const handleRemoveMeaning = (index) => {
    const newMeanings = meanings.filter((_, i) => i !== index);
    setMeanings(newMeanings);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Nyanja to English"), { word, meanings });
      setWord("");
      setMeanings([{ translation: "", partOfSpeech: "" }]);
      alert("Word added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, "admin@example.com", "password");
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  if (!user) {
    return <button onClick={handleLogin}>Login as Admin</button>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Word: </label>
        <input type="text" value={word} onChange={handleWordChange} required />
      </div>
      {meanings.map((meaning, index) => (
        <div key={index}>
          <label>Translation: </label>
          <input
            type="text"
            value={meaning.translation}
            onChange={(e) => handleTranslationChange(index, e)}
            required
          />
          <label>Part of Speech: </label>
          <input
            type="text"
            value={meaning.partOfSpeech}
            onChange={(e) => handlePartOfSpeechChange(index, e)}
            required
          />
          <button type="button" onClick={() => handleRemoveMeaning(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddMeaning}>
        Add Another Meaning
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}

export default AdminForm;
