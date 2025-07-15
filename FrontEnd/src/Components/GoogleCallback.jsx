import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");

      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
        navigate("/home"); // Changed from /second to /home
        return;
      }

      // Check cookie if URL token is not present
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (cookieToken) {
        localStorage.setItem("token", cookieToken);
        navigate("/home"); // Changed from /second to /home
        return;
      }

      toast.error("Authentication failed or no token received.");
      navigate("/login");
    };

    handleGoogleCallback();
  }, [navigate]);

  return <div>Logging in...</div>;
};

export default GoogleCallback;