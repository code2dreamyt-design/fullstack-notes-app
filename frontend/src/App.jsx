import './App.css'
import Notes from './components/Notes'
import Home from './components/Home'
import Login from './components/Login'
import Nav from './components/Nav'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './components/Register'
import {BrowserRouter,Routes,Route } from 'react-router-dom'
import CompleteProfile from './components/CompleteProfile'
import EmailVerification from './components/EmailVerification'
import ForgetPass from './components/ForgetPass'
import VerifyOTP from './components/VerifyOTP'
import ChangePassword from './components/ChangePassword';
import { lazy,Suspense } from 'react'
function App() {
  return (
    <div className="w-full h-screen bg-[linear-gradient(310deg,rgba(9,15,13,1)_0%,rgba(1,1,1,1)_65%,rgba(0,163,0,1)_100%)] flex flex-col overflow-hidden">

      {/* FIXED NAVBAR */}
      <div className="w-full z-50  flex-shrink-0">
        <Nav />
      </div>

      {/* SCROLLABLE PAGE CONTENT */}
      <div className="w-full flex-1 overflow-y-auto text-white flex justify-center">
        <div className="w-full md:w-[80%] mt-3">
        <Suspense>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/completeprofile" element={<CompleteProfile />} />
            <Route path="/emailverify" element={<EmailVerification />} />
            <Route path="/forgetPass" element={<ForgetPass/>} />
            <Route path="/verifyotp" element={<VerifyOTP/>} />
            <Route path="/changePass" element={<ChangePassword/>} />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
        </div>
      </div>

    </div>
  );
}


export default App
