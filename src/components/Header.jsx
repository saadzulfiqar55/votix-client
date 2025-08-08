import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname.startsWith('/register') || location.pathname.startsWith('/login');
  if (isAuthPage) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 shadow flex justify-between items-center">
      <h1
        onClick={() => navigate('/')}
        className="text-2xl font-bold cursor-pointer"
      >
        🗳️ Votix
      </h1>

      {/* Only show logout button if NOT on auth pages */}
      {!isLoggedIn && (
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded font-semibold shadow hover:bg-gray-100"
        >
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
