import HomePage from "./pages/Home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage";
import { Routes, Route } from 'react-router-dom';
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from 'react-hot-toast';
function App() {
  return (
    <div className='flex max-w-6xl mx-auto bg-black min-h-screen'>
       <Sidebar />
      <Routes>
        <Route path='/' element={<HomePage/>} />
        <Route path='/signup' element={<SignUpPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/NotificationPage' element={<NotificationPage/>} />
        <Route path='/profile/:username' element={<ProfilePage/>} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  );
}

export default App
