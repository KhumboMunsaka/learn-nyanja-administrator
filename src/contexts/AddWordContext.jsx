import { addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { createContext, useState } from "react";
import { db } from "../firebase/firebase.config";

const AddWordContext = createContext();

export const AddWordProvider = ({ children }) => {
  const [word, setWord] = useState("");
  const [meanings, setMeanings] = useState([
    { translation: "", partOfSpeech: "" },
  ]);
  const [selectedAudio, setSelectedAudio] = useState(null);

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
      handleAudio();
      alert("Word added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleAudio = () => {
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
  };

  return (
    <AddWordContext.Provider
      value={{
        word,
        meanings,
        selectedAudio,
        handleWordChange,
        handleTranslationChange,
        handlePartOfSpeechChange,
        handleAddMeaning,
        handleRemoveMeaning,
        handleSubmit,
        handleAudio,
        setSelectedAudio,
      }}
    >
      {children}
    </AddWordContext.Provider>
  );
};

export default AddWordContext;
