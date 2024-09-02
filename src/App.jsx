import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import Login from "./pages/Login";
import MemeOfTheDay from "./pages/MemeOfTheDay";
import Dictionary from "./pages/Dictionary";
import { DictionaryProvider } from "./contexts/DictionaryContext";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route
          path="dashboard"
          element={
            <DictionaryProvider>
              <Dashboard />
            </DictionaryProvider>
          }
        >
          <Route index path="lessons" element={<Lessons />} />
          <Route path="mod" element={<MemeOfTheDay />} />
          <Route path="dictionary" element={<Dictionary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
