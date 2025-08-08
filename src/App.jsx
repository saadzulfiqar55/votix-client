import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Header from './components/Header';
import AdminPanel from './pages/admin/AdminPanel';
import HomePage from './components/HomePage';
import VotingPanel from './pages/vote/VotingPanel';
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vote"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <VotingPanel />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
