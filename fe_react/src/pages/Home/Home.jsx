import React, { useEffect } from "react";
import "./Home.scss";
import { getToken } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (getToken()) {
      navigate("/home");
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div className="home-page">Home</div>;
};

export default Home;
