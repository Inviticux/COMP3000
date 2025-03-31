import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./components/LoginPage"
import Dashboard from "./components/Dashboard";
import ModulePage from "./components/ModulePage";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/module' element={<ModulePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;