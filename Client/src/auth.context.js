import React,{ useState, useEffect} from "react";
import PropTypes from 'prop-types';

const AuthContext = React.createContext();

function AuthProviderWrapper(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    

    const authenticateUser = () => { 
     /*  try {
        const response = await fetch("/", {
        credentials: 'include' // Include cookies in the request
        });
          if (response.status === 200) { */
          const activeUser = localStorage.getItem('user');

            if (activeUser) { //Desaparece quando houver o close session
              const user = activeUser;
              setIsLoggedIn(true);
              setUser(user);
            } else {
              setIsLoggedIn(false);
              setUser(null);
            }
    
              
      /* } catch(error) {    
          setIsLoggedIn(false);
          setUser(null); 
      }       */
        
    };

    const logOutUser = () => {                      
        localStorage.removeItem('user');   
        authenticateUser();
    };

    useEffect(() => {
      authenticateUser();
    }, []);

    useEffect(() => {
      localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);
    


    return (                                                   
      <AuthContext.Provider 
        value={{ 
          isLoggedIn,
          user,
          authenticateUser,
          logOutUser
        }}
      >
        {props.children}
      </AuthContext.Provider>
    )
}

AuthProviderWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProviderWrapper, AuthContext};