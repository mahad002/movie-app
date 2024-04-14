import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AuthService from '../services/AuthServices';

export const AuthContext = createContext();

const AuthProvider = ({ children, userId }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (userId) {
            AuthService.isAuthenticated(userId).then(data => {
                setUser(data.user);
                setIsAuthenticated(data.isAuthenticated);
                setIsLoaded(true);
            });
        } else {
            setIsLoaded(true);
        }
    }, [userId]);

    return (
        <div>
            {!isLoaded ? <h1>Loading</h1> :
                <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
                    {children}
                </AuthContext.Provider>}
        </div>
    );
};

AuthProvider.displayName = 'AuthProvider';

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
    userId: PropTypes.number,
};

export { AuthProvider };
