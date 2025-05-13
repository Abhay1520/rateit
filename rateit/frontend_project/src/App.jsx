// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { useContext } from 'react';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

function ProtectedRoute({ component: Component }) {
  const { authUser, loading } = useContext(UserContext);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  return authUser ? <Component /> : <Navigate to="/login" />;
}

export default App;
