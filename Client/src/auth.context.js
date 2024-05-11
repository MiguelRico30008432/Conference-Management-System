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
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserAuthData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/authUser`, {
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
        }
      } catch (error) {
        console.error("Error in auth context", error);
        setErrorDialogOpen(true);
        navigate("/");
      }
    }

    getUserAuthData();
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
