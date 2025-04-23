import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./components/LoginPage"
import Dashboard from "./components/Dashboard";
import ModulePage from "./components/ModulePage";
import QuizPage from "./components/QuizPage";
import ReviewPage from "./components/ReviewPage";
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;