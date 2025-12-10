import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@services/api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const logout = useCallback(async () => {
        try {
            await authService.logout();
        } catch (error) {
            // Continue with logout even if request fails
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            localStorage.removeItem(
                import.meta.env.VITE_AUTH_TOKEN_KEY || 'flowgatex_auth_token'
            );
        }
    }, []);

    const setAuthUser = (userData, token) => {
        if (userData && token) {
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem(
                import.meta.env.VITE_AUTH_TOKEN_KEY || 'flowgatex_auth_token',
                token
            );
        }
    };

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const token = localStorage.getItem(
                    import.meta.env.VITE_AUTH_TOKEN_KEY || 'flowgatex_auth_token'
                );

                if (storedUser && token) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAuthenticated(true);

                    // Verify token is still valid by fetching current user
                    try {
                        const response = await authService.getCurrentUser();
                        if (response.data?.data?.user) {
                            setUser(response.data.data.user);
                            localStorage.setItem('user', JSON.stringify(response.data.data.user));
                        }
                    } catch (error) {
                        // Token invalid, clear auth state
                        logout();
                    }
                }
            } catch (error) {
                // Clear invalid data
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [logout]);

    const value = {
        user,
        isLoading,
        isAuthenticated,
        logout,
        setAuthUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};
