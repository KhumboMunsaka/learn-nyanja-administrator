import { useContext } from "react";
import DictionaryContext from "../contexts/DictionaryContext";

function DisplayWords() {
  const { allWords, filteredWords, setFilteredWords, loading } =
    useContext(DictionaryContext);
  console.log(allWords);
  return (
    <>
      <div>Words in the Dictionary</div>
      {allWords.map((word, key) => (
        <p key={key}>{word.word}</p>
      ))}
    </>
  );
}

export default DisplayWords;
