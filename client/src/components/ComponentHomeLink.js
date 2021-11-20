import React,{useContext} from "react";

import {NavLink} from 'react-router-dom'

import { BiUser,BiReceipt,BiLogOut } from "react-icons/bi";
import { BsFillChatSquareDotsFill } from "react-icons/bs";

import { useHistory } from "react-router-dom";

import { GlobalContext } from "../context/globalContext";

export default function ComponentHomeLink(){

    const [state,dispatch] = useContext(GlobalContext);
    
    let history = useHistory();

    const handleLogout = () => {
        dispatch({
            type: 'LOGOUT'
        })

        history.push("/");
    }

    return(
          <>
            <div  className="d-flex flex-column mt-5 link" style={{color:"#929292",borderBottom:"2px solid #C9C9C9"}}>
                
                <NavLink to="/profile" style={{color:"#929292",textDecoration:"none"}} activeStyle={{textDecoration:"none",color:"#D60000"}}>
                    <p className="fw-bold fs-6">
                        <BiUser className="fs-4"/> Profile
                    </p>
                </NavLink>

                <NavLink to="/payment" style={{color:"#929292",textDecoration:"none"}} activeStyle={{textDecoration:"none",color:"#D60000"}}>
                    <p className="navigasi-link mt-4 fs-6 fw-bold">
                        <BiReceipt className="fs-4"/> Subscribe
                    </p>
                </NavLink>

                <NavLink to="/contact-admin" style={{color:"#929292",textDecoration:"none"}} activeStyle={{textDecoration:"none",color:"#D60000"}}>
                    <p className="navigasi-link mt-4 fs-6 pb-4 fw-bold">
                        <BsFillChatSquareDotsFill className="fs-5"/> Contact Admin
                    </p>
                </NavLink>
            </div>

            <div  className="d-flex flex-column mt-5 link" style={{color:"#929292"}}>
                <p onClick={handleLogout} className="fs-6 fw-bold"><BiLogOut className="fs-4"/> Logout</p>
            </div>
          </> 
    );
}