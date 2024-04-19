import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

// Create a context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const auth = getAuth();
  const [authUser, setAuthUser] = useState(auth.currentUser);
  const [user, setUser] = useState(null);

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setUser(user);
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [auth]);

  // Sign out function
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Reset authUser and user state
      setAuthUser(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, authUser, setAuthUser, handleSignOut }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => useContext(UserContext);