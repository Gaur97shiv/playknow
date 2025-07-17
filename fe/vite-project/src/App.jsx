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
import { Navigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const { user} = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchAuthUser());
  }, [dispatch]);

  console.log("Auth User Data:", user);

  return (
    <div className='flex max-w-6xl mx-auto bg-black min-h-screen'>
     {user ? <Sidebar/> :null}
      <Routes>
        <Route path='/' element={user ? <HomePage /> : <Navigate to="/login" replace />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/notifications' element={user ? <NotificationPage />: <Navigate to="/login" replace/>} />
        <Route path='/profile/:username' element={user ?<ProfilePage /> :<Navigate to="/login" replace/>} />
      </Routes>
     {user ? <RightPanel /> : null}
      <Toaster />
    </div>
  );
}

export default App;
