import React, { useState, useContext, useEffect } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import Context from '../Context';

// import 'ant-design-pro/dist/ant-design-pro.css';
// import Login from 'ant-design-pro/lib/Login';



function Header() {
    const { PREFIX,name, userLogin } = useContext(Context);
    const [buttonText, setButtonText] = useState("הזדהה כלקוח");


    useEffect(() => {

        if (!userLogin) {
            setButtonText("הזדהה כלקוח");
        }
        else if (userLogin) {
            if (name) {
                setButtonText(name);
            }
            else {
                setButtonText("לקוח לא מילא שם")
            }

        }
    }, [userLogin])



    return (
        <div className="header">
            <div className="header_text">welcome to the our digital shop!
              <Link to={`${PREFIX}/adminLogIn`}>
                    <button className="login_button">admin acces</button>
                    {/* <Login /> */}
                </Link>
                <Link to={`${PREFIX}/Login`}>
                    <button className="Customer_login_button">{buttonText}</button>
                </Link>
            </div >
        </div >
    )
}



export default Header;
