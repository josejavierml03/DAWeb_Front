import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminView from "./pages/AdminView";
import UserView from "./pages/UserView";
import Home from "./pages/Home";
import BarraNav from "./components/BarraNav";

function App() {
  return (
    <Router>
      <BarraNav />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminView />} />
      <Route path="/usuario" element={<UserView />} />
      </Routes>
    </Router>
  );
}

export default App;
