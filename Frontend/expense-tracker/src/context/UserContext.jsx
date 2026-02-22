import React, { createContext, useState ,useMemo} from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  // Function to update user data
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Function to clear user data (e.g logout)
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = useMemo(
    () => ({
      user,
      updateUser,
      clearUser,
    }),
    [user],
  );

  return (
    <UserContext.Provider
      value={value}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
