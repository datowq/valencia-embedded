import React, { useState, useEffect } from "react";

const Door = () => {
  const doorstyle = {
    position: "absolute",
    left: 900,
    top: 80,
    width: "10px",
    height: "10px",
    fontSize: "1px",
    color: "black",
    zIndex: "5",
  };

  return <pre style={doorstyle}>{``}</pre>;
};

export default Door;
