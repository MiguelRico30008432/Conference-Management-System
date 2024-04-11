import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    authenticateUser();
  }, []);

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const authenticateUser = () => {
    const activeUser = localStorage.getItem("user");

    if (activeUser) {
      setIsLoggedIn(true);
      setUser(activeUser);
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        authenticateUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

AuthProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthProviderWrapper, AuthContext };
