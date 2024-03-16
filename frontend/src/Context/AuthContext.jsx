import { createContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthServices';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user1, setUser1] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        AuthService.isAuthenticated().then(data => {
            setUser1(data.user);
            setIsAuthenticated(data.isAuthenticated);
            setIsLoaded(true);
        });
    }, []);

    return (
        <div>
            {!isLoaded ? <h1>Loading</h1> :
                <AuthContext.Provider value={{ user1, setUser1, isAuthenticated, setIsAuthenticated }}>
                    {children}
                </AuthContext.Provider>}
        </div>
    );
};

AuthProvider.displayName = 'AuthProvider';

export default AuthProvider;
