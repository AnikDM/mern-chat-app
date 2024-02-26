import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const {authUser}=useAuthContext();
  return (
    
    <BrowserRouter>
      <Toaster />
      <div className="flex h-screen items-center justify-center sm:p-5 p-2">
        <Routes>
          <Route path="/" element={authUser?<Navigate to={'/home'} />:<Login />} />
          <Route path="/signup" element={authUser?<Navigate to={'/home'} />:<Signup />} />
          <Route path="/home" element={authUser?<Home />:<Navigate to={'/'}/>} />
          <Route path="/*" exact element={authUser?<Navigate to={'/home'}/>:<Navigate to={'/'}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
