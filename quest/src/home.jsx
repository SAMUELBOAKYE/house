import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import AdminSidebar from "./AdminSidebar";
import "./home.css";
import myImage from "./assets/yoo.jpg"; // Adjust path if needed

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <div className="home-wrapper">
      {/* Toggle Button for Mobile */}
      {isMobile && (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
      )}

      {/* Overlay on mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay active" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${myImage})`,
          marginLeft: !isMobile && sidebarOpen ? "280px" : "0",
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              Welcome to <span>Yafafa</span>
            </h1>
            <p>A peaceful, stylish retreat — your home away from home</p>
            <div className="hero-buttons">
              <Link to="/booking" className="btn primary-btn">
                Book Your Stay
              </Link>
              <Link to="/rooms" className="btn secondary-btn">
                View Rooms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
