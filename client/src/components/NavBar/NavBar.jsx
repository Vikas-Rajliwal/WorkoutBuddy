//components/Navbar/Navbar.jsx

import "./NavBar.css";
import { useState, useContext } from "react";
// import { faBars } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, dispatch } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Workout Buddy
      </Link>

      {/* Desktop Navigation */}
      <div className="nav-links nav-desktop">
        <Link to="/home" className="nav-link">
          Home
        </Link>
        <Link to="/routines" className="nav-link">
          Routine
        </Link>
        <Link to="/meals" className="nav-link">
          Meal
        </Link>
        <Link to="/entries" className="nav-link">
          Entries
        </Link>
        {user ? (
          <>
            <Link to={`/user/${user._id}`} className="nav-link">
              <div className="profile-container">
                <img
                  src={
                    user.profilePicture ||
                    "https://i.ibb.co/MBtjqXQ/no-avatar.gif"
                  }
                  alt={user.username}
                  className="profile-picture"
                />
                <span className="username">{user.username}</span>
              </div>
            </Link>
            <button onClick={handleClick} className="nav-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/register" className="nav-button">
              Register
            </Link>
            <Link to="/login" className="nav-link">
              Login
            </Link>
          </>
        )}
      </div>

      {/* Hamburger Menu Button */}
      <button
        className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <Link to="/home" className="nav-link" onClick={toggleMobileMenu}>
          Home
        </Link>
        <Link to="/routines" className="nav-link" onClick={toggleMobileMenu}>
          Routine
        </Link>
        <Link to="/meals" className="nav-link" onClick={toggleMobileMenu}>
          Meal
        </Link>
        <Link to="/entries" className="nav-link" onClick={toggleMobileMenu}>
          Entries
        </Link>
        {user ? (
          <>
            <Link
              to={`/user/${user._id}`}
              className="nav-link"
              onClick={toggleMobileMenu}
            >
              <div className="profile-container">
                <img
                  src={
                    user.profilePicture ||
                    "https://i.ibb.co/MBtjqXQ/no-avatar.gif"
                  }
                  alt={user.username}
                  className="profile-picture"
                />
                <span className="username">{user.username}</span>
              </div>
            </Link>
            <button
              onClick={() => {
                handleClick({ preventDefault: () => {} });
                toggleMobileMenu();
              }}
              className="nav-button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className="nav-button"
              onClick={toggleMobileMenu}
            >
              Register
            </Link>
            <Link to="/login" className="nav-button" onClick={toggleMobileMenu}>
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
