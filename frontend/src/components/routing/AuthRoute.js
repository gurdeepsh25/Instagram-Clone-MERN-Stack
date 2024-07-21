import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../common/Loader";

function AuthRoute() {
  const [loading, setLoading] = useState(true);

  const userToken = localStorage.getItem("userToken");

  const isAuthenticated = !!userToken;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return loading ? (
    <Loader />
  ) : isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/qrlink" />
  );
}

export default AuthRoute;
