import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component that will wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check if token exists in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    const handleUser = (storedUser, token) => {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    };

    try {
      if (storedUser && token) {
        handleUser(storedUser, token);
      }
    } catch (error) {
      console.error("Error parsing stored user data:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Optionally notify the user here
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to register a new user
  const register = async (email, username, password) => {
    try {
      setError(null);
      const response = await axios.post(
        "https://kick-lover-backend-e8f6c3f52d0d.herokuapp.com/api/users/register",
        {
          email,
          username,
          password,
        }
      );
      const { token, userId, isAdmin } = response.data;

      // Save token and user to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ userId, isAdmin }));

      // Set token in axios headers
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Update user state
      setUser({ userId, isAdmin });
      navigate("/");
    } catch (err) {
      setError(err.response.data.message || "Registration failed");
    }
  };

  // Function to login user
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(
        "https://kick-lover-backend-e8f6c3f52d0d.herokuapp.com/api/users/login",
        {
          email,
          password,
        }
      );
      const { token, userId, isAdmin } = response.data;

      // Set token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ userId, isAdmin }));

      // Set axios authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Update user state
      setUser({ userId, isAdmin });
      navigate("/");
    } catch (err) {
      setError(err.response.data.message || "Login failed");
    }
  };

  // Function to logout user
  const logout = () => {
    // Remove user data and token from local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear axios authorization header
    delete axios.defaults.headers.common["Authorization"];

    // Update user state to null
    setUser(null);
  };

  // Fetch all users by Admin
  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://kick-lover-backend-e8f6c3f52d0d.herokuapp.com/api/users"
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a user by Admin
  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await axios.delete(
        `https://kick-lover-backend-e8f6c3f52d0d.herokuapp.com/api/users/${userId}`,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        deleteUser,
        fetchAllUsers,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
