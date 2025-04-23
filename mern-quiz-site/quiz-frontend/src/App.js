import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./components/LoginPage"
import Dashboard from "./components/Dashboard";
import ModulePage from "./components/ModulePage";
import QuizPage from "./components/QuizPage";
import ReviewPage from "./components/ReviewPage";
import Editor from "./components/Editor";
import ProfilePage from "./components/ProfilePage";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/module' element={<ModulePage />} />
        <Route path='/quiz' element={<QuizPage />} />
        <Route path='/review' element={<ReviewPage />} />
        <Route path='/editor' element={<Editor />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;