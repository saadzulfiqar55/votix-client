import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import VotingPanel from "./pages/VotingPanel";

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route
            path="/vote"
            element={
              <ProtectedRoute>
                <VotingPanel />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/vote" element={<VotingPanel />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
