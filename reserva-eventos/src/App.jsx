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


function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <BarraNav />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RutaProtegida><Home/></RutaProtegida>} />
        <Route path="/admin" element={<RutaProtegida><AdminView /></RutaProtegida>} />
        <Route path="/usuario" element={<RutaProtegida><UserView /></RutaProtegida>} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/oauth-success" element={<OauthSuccess />} />
      </Routes>
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