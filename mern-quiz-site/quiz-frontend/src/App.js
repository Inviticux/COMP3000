import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./components/LoginPage"
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
