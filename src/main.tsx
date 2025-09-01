import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./index.css";

const token = localStorage.getItem("token");

createRoot(document.getElementById("root")!).render(
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={token ? <App /> : <Navigate to="/login" />} />
        </Routes>
    </Router>
);
