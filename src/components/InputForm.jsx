import { useContext } from "react";
import AddWordContext from "../contexts/AddWordContext";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

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
  } = useContext(AddWordContext);

  const recorderControls = useAudioRecorder();

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

export default InputForm;
