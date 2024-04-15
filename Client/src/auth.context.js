import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("user", user);
    localStorage.setItem("isAdmin", isAdmin);
    localStorage.setItem("userRole", userRole);
  }, [isLoggedIn, user, isAdmin, userRole]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isAdmin,
        setIsAdmin,
        userRole,
        setUserRole,
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
