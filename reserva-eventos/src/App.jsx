import { BrowserRouter as Router, Routes, Route ,useLocation} from "react-router-dom";
import Login from "./pages/Login";
import AdminView from "./pages/AdminView";
import UserView from "./pages/UserView";
import Home from "./pages/Home";
import BarraNav from "./components/BarraNav";
import { UserProvider } from "./components/UserContext";
import RutaProtegida from "./components/RutaProtegida";
import { Navigate } from "react-router-dom";
import OauthSuccess from "./pages/OauthSuccess";
import Footer from "./components/Footer";


function AppContent() {
  const location = useLocation();
  const hideNavbarAndFooter = location.pathname === "/login";
  

  return (
    <>
      {!hideNavbarAndFooter && <BarraNav />}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<RutaProtegida><AdminView /></RutaProtegida>} />
        <Route path="/usuario" element={<RutaProtegida><UserView /></RutaProtegida>} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/oauth-success" element={<OauthSuccess />} />
      </Routes>
       {!hideNavbarAndFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <UserProvider> 
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
}
export default App;