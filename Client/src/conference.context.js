import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "auth.context";

const ConferenceContext = React.createContext();

function ConferenceProviderWrapper(props) {
  const [confID, setConfID] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [confName, setConfName] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function getConfData() {
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/confContext`, {
          method: "POST",
          body: JSON.stringify({ userid: user }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          withCredentials: true,
        });

        if (response.ok) {
          const userData = await response.json();
          setConfID(parseInt(userData[0].usercurrentconfid));
          setUserRole(userData[0].userrole);
        }
      } catch (error) {
        console.error("Error in auth context", error);
      }
    }

    if (user) {
      getConfData();
    }
  }, [user]);

  return (
    <ConferenceContext.Provider
      value={{
        confID,
        setConfID,
        userRole,
        setUserRole,
      }}
    >
      {props.children}
    </ConferenceContext.Provider>
  );
}

ConferenceProviderWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ConferenceProviderWrapper, ConferenceContext };
