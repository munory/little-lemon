import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = useCallback((email) => {
    setUser({
      firstName: 'Mario',
      lastName:  'Rossi',
      email:     'mario.rossi@example.com',
      phone:     '+1 (312) 555-0199',
      address: {
        street: '1250 N Dearborn St',
        apt:    'Apt 4B',
      },
      payment: {
        cardName:   'Mario Rossi',
        cardNumber: '4242 4242 4242 4242',
        expiry:     '12/28',
      },
    });
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
