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
              setIsLoggedIn(true);
              setUser(activeUser);
            } else {
              setIsLoggedIn(false);
              setUser(null);
            }
    
              
      /* } catch(error) {    
          setIsLoggedIn(false);
          setUser(null); 
      }       */
        
    };

    const logOutUser = async () => {
      try {
          const response = await fetch('http://localhost:8003/logOut', {
              method: 'POST', 
              credentials: 'include', 
          });
          
          if (response.ok) {
              localStorage.removeItem('user');
              setIsLoggedIn(false);
              setUser(null);
              console.log('Logged out successfully');
          } else {
              throw new Error('Failed to log out');
          }
      } catch (error) {
          console.error('Logout error:', error);
      }
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