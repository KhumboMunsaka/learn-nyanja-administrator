import { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

function AdminForm() {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const recorderControls = useAudioRecorder();
  const [user, setUser] = useState(null);
  const [word, setWord] = useState("");
  const [meanings, setMeanings] = useState([
    { translation: "", partOfSpeech: "" },
  ]);
  // const addAudioElement = (blob) => {
  //   const url = URL.createObjectURL(blob);
  //   const audio = document.createElement("audio");
  //   audio.src = url;
  //   audio.controls = true;
  //   document.body.appendChild(audio);
  // };
  // This effect runs once when the component mounts, and sets up an authentication state listener.
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const handleWordChange = (e) => setWord(e.target.value);

  // These handlers update the translations and parts of speech in the state.
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

  // Adds a new meaning object to the meanings array in state.
  const handleAddMeaning = () =>
    setMeanings([...meanings, { translation: "", partOfSpeech: "" }]);

  // Removes a meaning object from the meanings array in state.
  const handleRemoveMeaning = (index) => {
    const newMeanings = meanings.filter((_, i) => i !== index);
    setMeanings(newMeanings);
  };

  // This function handles form submission and adds the word to Firestore.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "Nyanja to English"), { word, meanings });
      setWord("");
      setMeanings([{ translation: "", partOfSpeech: "" }]);
      handleAudio();
      alert("Word added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  function handleAudio() {
    // console.log(selectedAudio);
    const storage = getStorage();

    if (!selectedAudio) {
      console.error("No audio selected");
      return;
    }
    const fileName = `${word}.webm`; // Unique file name using the word and a timestamp
    const storageRef = ref(storage, `audios/${fileName}`);

    // Upload the audio file to Firebase Storage
    uploadBytes(storageRef, selectedAudio).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot.metadata);
    });
  }

  // If the user is authenticated, show the form.
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
          <select
            value={meaning.partOfSpeech}
            onChange={(e) => handlePartOfSpeechChange(index, e)}
            required
          >
            <option value="">Select part of speech</option>
            <option value="verb">Verb</option>
            <option value="noun">Noun</option>
            <option value="adjective">Adjective</option>
            <option value="adverb">Adverb</option>
            <option value="pronoun">Pronoun</option>
            <option value="preposition">Preposition</option>
            <option value="conjunction">Conjunction</option>
            <option value="interjection">Interjection</option>
          </select>
          <button type="button" onClick={() => handleRemoveMeaning(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddMeaning}>
        Add Another Meaning
      </button>
      <div>
        <AudioRecorder
          // onRecordingComplete={(blob) => addAudioElement(blob)}
          onRecordingComplete={(audio) => setSelectedAudio(audio)}
          recorderControls={recorderControls}
        />
        <button onClick={recorderControls.stopRecording}>Stop recording</button>
        <button onClick={() => handleAudio()}>Submit</button>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default AdminForm;
