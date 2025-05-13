import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async (accessToken) => {
    try {
      const res = await axios.get('http://localhost:8000/users/me/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setAuthUser({ ...res.data, token: accessToken });
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
  
    const initializeUser = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp > currentTime) {
            await fetchCurrentUser(token); 
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false); 
    };
  
    initializeUser();
  }, []);
  

  const login = async (userData) => {
    const { access, refresh } = userData;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);

    await fetchCurrentUser(access); // 🔥 Fetch and store full user info
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuthUser(null);
  };

  return (
    <UserContext.Provider value={{ authUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
