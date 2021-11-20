import React from "react";

import Logo from '../assets/img/Icon.png';

import { useHistory } from "react-router";

import { BsFillAwardFill } from "react-icons/bs";

import { useQuery } from "react-query";
import { ApiReactQuery } from "../config/reactQueryApi";

export default function ComponentHomeProfileUser(){
  
    let reactQuery = ApiReactQuery();

    let history = useHistory();
    const redirectToHome = () => history.push("/home");

    // React Query
    let { data: profileUser } = useQuery("getProfileUser", async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await reactQuery.get("/profile", config);
      return response.data;
    });

    // React Query
    let { data: validation } = useQuery("validationSubscribe", async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await reactQuery.get("/validation-subscribe", config);
      return response.data;
    });  

    return(
          <>
            <div  className="d-flex flex-column align-items-center" style={{borderBottom:"2px solid #C9C9C9"}}>

                <img onClick={redirectToHome} src={Logo} alt="Icon" className="home-logo" style={{cursor:"pointer"}}/>

                <img src={profileUser?.profileUser.image} alt="User Image" style={{width:"100px",height:"100px",objectFit:"cover"}} className="home-user-image shadow-lg rounded-circle" />

                <h4 className="fw-bold mt-4">{profileUser?.profileUser.users.fullName}</h4>

                <p className="fw-bold mt-3 pb-3">
                  {
                    validation?.validation.statusUser === "Active" ? <span className="text-success">Subscribed <BsFillAwardFill /></span> : <span class="text-danger">Not Subscribed Yet</span>
                  }
                </p>

            </div>
          </> 
    );
}