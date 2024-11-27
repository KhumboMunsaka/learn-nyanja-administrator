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
  const [isAWordSelected, setIsAWordSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      await addDoc(collection(db, "Nyanja to English"), { word, meanings });
      setWord("");
      setMeanings([{ translation: "", partOfSpeech: "" }]);
      handleAudio();
      alert("Word added successfully!");
      setIsLoading(false);
      setSelectedAudio(null);
    } catch (error) {
      alert("Error Adding the Word");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleAudio = () => {
    setIsLoading(true);

    if (word == "" || meanings.translation == "") {
      setIsLoading(false);
      return;
    }
    const storage = getStorage();
    if (!selectedAudio) {
      setIsLoading(false);

      alert("No audio selected");
      return;
    }
    setIsLoading(false);

    const fileName = `${word}.webm`; // Unique file name using the word and a timestamp
    const storageRef = ref(storage, `audios/${fileName}`);

    // Upload the audio file to Firebase Storage
    uploadBytes(storageRef, selectedAudio).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot.metadata);
    });
    setIsLoading(false);
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
        isLoading,
      }}
    >
      {children}
    </AddWordContext.Provider>
  );
};

export default AddWordContext;
