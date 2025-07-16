import HomePage from "./pages/Home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import { Routes, Route } from 'react-router-dom';
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthUser } from "./redux/authSlice";

function App() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAuthUser());
  }, [dispatch]);

  console.log("Auth User Data:", user);

  return (
    <div className='flex max-w-6xl mx-auto bg-black min-h-screen'>
      <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/NotificationPage' element={<NotificationPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
}

export default App;
