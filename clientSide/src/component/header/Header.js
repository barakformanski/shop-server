import React, { useState, useContext, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import Context from "../Context";

function Header() {
  const { PREFIX, name, userLogin } = useContext(Context);
  const [userName, setUserName] = useState(",אורח");

  useEffect(() => {
    if (userLogin) {
      setUserName(name);
    }
  }, [userLogin]);

  return (
    <div className="header">
      <Link to={"/"}>
        <h1>!ברוכים הבאים לחנות האינטרנטית שלנו</h1>
      </Link>
      <Link to={`/adminLogIn`}>
        <span>{userName} ברוך הבא</span>
        <button className="headers_buttons">כניסת מנהל</button>
        {/* <Login /> */}
      </Link>
      <Link to={`/Login`}>
        <button className="headers_buttons">הרשם כלקוח</button>
      </Link>
      <Link to={`/Login`}>
        <button className="headers_buttons">התחבר</button>
      </Link>
    </div>
  );
}

export default Header;
