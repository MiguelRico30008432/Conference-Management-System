import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser, setUserEmail, setIsAdmin } =
    useContext(AuthContext);

  useEffect(() => {
    async function logout() {
      await fetch(`${process.env.REACT_APP_API_URL}/logOut`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      });

      setIsLoggedIn(false);
      setUser(null);
      setUserEmail(null);
      setIsAdmin(false);
      navigate("/");
    }

    logout();
  }, []);
}
