// pages/OauthSuccess.jsx
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

export default function OauthSuccess() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8090/auth/me", {
      credentials: "include",
    })
      .then(res => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      .then(data => {
        setUser({
          nombreCompleto: data.nombreCompleto,
          roles: data.roles,
        });

        if (data.roles === "USUARIO") navigate("/usuario");
        else navigate("/admin");
      })
      .catch(() => navigate("/login"));
  }, []);

  return <div>Cargando tu cuenta...</div>;
}
