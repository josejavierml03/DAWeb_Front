import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import AdminView from "./pages/AdminView";
import UserView from "./pages/UserView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminView />} />
        <Route path="/usuario" element={<UserView />} />
      </Routes>
    </Router>
  );
}

export default App;
