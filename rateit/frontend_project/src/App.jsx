import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, UserContext } from './context/UserContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/MainLayout'; // New
import Store from './pages/Store';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Store />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

function ProtectedRoute({ children }) {
  const { authUser, loading } = useContext(UserContext);

  if (loading) return <div className="text-center w-screen h-screen bg-gray-900 pt-10 text-white text-lg">Loading...</div>;
  return authUser ? children : <Navigate to="/login" />;
}

export default App;
