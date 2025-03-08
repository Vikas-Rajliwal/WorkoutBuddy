// components/footer/Footer.jsx

import React from "react";

const Footer = () => {
  return (
    <div
      className="footer"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "120px",
        backgroundColor: "black",
        color: "white",
        fontWeight: "800",
        gap: "10px",
      }}
    >
      <p>Workout Buddy</p>
      <div
        style={{
          fontSize: "0.9rem",
          fontWeight: "500",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        Created by{" "}
        <a
          href="https://www.linkedin.com/in/vikas-rajliwal-42b668274/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "white",
            textDecoration: "underline",
            fontWeight: "600",
          }}
        >
          Vikas Rajliwal
        </a>
      </div>
    </div>
  );
};

export default Footer;
