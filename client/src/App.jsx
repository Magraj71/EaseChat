import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Auth from './pages/auth';
import Profile from './pages/profile';
import Chat from './pages/chat';
import { useAppStore } from './stores';
import { useEffect, useState } from 'react';
import apiclient from './lib/api-client';
import { GET_USER_INFO } from './utils/constant';

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  return userInfo ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore(); // ✅ Ensure function name matches the store
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        console.log("Fetching user data...");
        // console.log(userInfo)
        const response = await apiclient.get(GET_USER_INFO, { withCredentials: true });

        if (response.status === 200 && response.data) {
          console.log("User data found:", response.data);
          if (typeof setUserInfo === "function") {
            setUserInfo(response.data);
          } else {
            console.error("setUserInfo is not a function!");
          }
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>; // Show loading state before user info is fetched
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
