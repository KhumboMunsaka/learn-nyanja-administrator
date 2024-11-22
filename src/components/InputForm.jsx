import { useContext, useState } from "react";
import AddWordContext from "../contexts/AddWordContext";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import styles from "../styles/InputForm.module.css";
import SpinnerItem from "./SpinnerItem";
function InputForm() {
  const {
    word,
    meanings,
    handleWordChange,
    handleTranslationChange,
    handlePartOfSpeechChange,
    handleAddMeaning,
    handleRemoveMeaning,
    handleSubmit,
    handleAudio,
    setSelectedAudio,
    isLoading,
  } = useContext(AddWordContext);
  const recorderControls = useAudioRecorder();

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label>Word: </label>
        <input
          type="text"
          value={word}
          onChange={handleWordChange}
          required
          className={styles.textInput}
        />
      </div>
      {meanings.map((meaning, index) => (
        <div key={index} className={styles.meaningGroup}>
          <div className={styles.wordMeaning}>
            <div className={styles.translation}>
              <label>Translation: </label>
              <input
                type="text"
                value={meaning.translation}
                onChange={(e) => handleTranslationChange(index, e)}
                required
                className={styles.textInput}
              />
            </div>
            <div className={styles.partOfSpeech}>
              <label>Part of Speech: </label>
              <select
                value={meaning.partOfSpeech}
                onChange={(e) => handlePartOfSpeechChange(index, e)}
                required
                className={styles.selectInput}
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
            </div>
            <button
              type="button"
              onClick={() => handleRemoveMeaning(index)}
              className={styles.removeButton}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddMeaning}
        className={styles.addMeaningButton}
      >
        Add Another Meaning
      </button>
      <div className={styles.audioGroup}>
        <AudioRecorder
          onRecordingComplete={(audio) => setSelectedAudio(audio)}
          recorderControls={recorderControls}
        />
        <span
          onClick={recorderControls.stopRecording}
          className={styles.stopRecording}
        >
          Stop Recording
        </span>
        <button onClick={() => handleAudio()} className={styles.submitButton}>
          {!isLoading ? "Submit Word To Dictionary" : <SpinnerItem />}
        </button>
      </div>
    </form>
  );
}

export default InputForm;
