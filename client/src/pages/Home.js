import React,{ useState,useEffect } from "react";

import Loading from "../components/Load/Loading";

import ComponentHome from '../components/ComponentHome';

import { API } from '../config/api';

export default function Home(){

    const [status,setStatus] = useState(false);

    useEffect( async () => {

      await API.get('/users');
      setStatus(true);

    },[]);

    return(
          <>
            {
                status ? <ComponentHome /> : <Loading />
            }
          </>   
    );
}