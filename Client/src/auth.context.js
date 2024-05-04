import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PopUpWithMessage from "OurComponents/Info/PopUpWithMessage";

import PropTypes from "prop-types";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [getUserAuth, setGetUserAuth] = useState(
    localStorage.getItem("UserAuth") === null
      ? false
      : JSON.parse(localStorage.getItem("UserAuth"))
  );
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("UserAuth", getUserAuth);
  }, [getUserAuth]);

  useEffect(() => {
    async function getUserAuthData() {
      try {
        const response = await fetch("http://localhost:8003/authUser", {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setIsLoggedIn(true);
          setUser(userData.userid);
          setUserEmail(userData.useremail);
          setIsAdmin(userData.useradmin);
        } else {
          setErrorDialogOpen(true);
          setGetUserAuth(false);
          navigate("/");
        }
      } catch (error) {
        console.error("Error in auth context", error);
        setErrorDialogOpen(true);
        setGetUserAuth(false);
        navigate("/");
      }
    }

    if (getUserAuth) {
      getUserAuthData();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        userEmail,
        setUserEmail,
        isAdmin,
        setIsAdmin,
        setGetUserAuth,
      }}
    >
      {props.children}

      <PopUpWithMessage
        open={errorDialogOpen}
        handleConfirm={() => setErrorDialogOpen(false)}
        justOneButton={true}
        title={"Sorry but it seems that you lost your connection :("}
        text={"Please try again later..."}
      />
    </AuthContext.Provider>
  );
}

AuthProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthProviderWrapper, AuthContext };
