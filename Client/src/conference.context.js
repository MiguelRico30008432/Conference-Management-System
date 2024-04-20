import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ConferenceContext = React.createContext();

function ConferenceProviderWrapper(props) {
  const [confID, setConfID] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {}, [confID, userRole]);

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
