import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/Login/LoginPage"
import RegisterPage from "./pages/Register/RegisterPage"
import { useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard/Dashboard";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userInfo } = useSelector((state: any) => state.userInfo);
  console.log(userInfo);


  if (userInfo) {
    return <>{children}</>;
  } else {
    return <Navigate to="/" replace />;
  }
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
