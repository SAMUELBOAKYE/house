import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./header.css";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <span className="logo-purple">Yafafa</span>
        </Link>

        <nav className="nav desktop-nav">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link
            to="/rooms"
            className={location.pathname === "/rooms" ? "active" : ""}
          >
            Rooms
          </Link>
          <Link
            to="/booking"
            className={location.pathname === "/booking" ? "active" : ""}
          >
            Book Now
          </Link>
          <Link
            to="/register"
            className={location.pathname === "/register" ? "active" : ""}
          >
            Register
          </Link>
        </nav>

        <div className="header-icons">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="dark-toggle"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
            <Link
              to="/rooms"
              className={location.pathname === "/rooms" ? "active" : ""}
            >
              Rooms
            </Link>
            <Link
              to="/booking"
              className={location.pathname === "/booking" ? "active" : ""}
            >
              Book Now
            </Link>
            <Link
              to="/register"
              className={location.pathname === "/register" ? "active" : ""}
            >
              Register
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

