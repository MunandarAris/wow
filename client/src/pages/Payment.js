import React,{useState,useEffect} from "react";

import Loading1 from "../components/Load/Loading1";
import ComponentPayment from "../components/Payment/ComponentPayment";

import { API } from '../config/api';

export default function Payment(){

    const [status,setStatus] = useState(false);

    useEffect( async () => {

      await API.get('/users');
      setStatus(true);

    },[]);

    useEffect(() => {

      // Midtrans Configuration
      const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
      const myMidtransClientKey = "SB-Mid-client-aW4D8XZm3Po1d7BF";

      let scriptTag = document.createElement("script");
      scriptTag.src = midtransScriptUrl;
      scriptTag.setAttribute("data-client-key", myMidtransClientKey);

      document.body.appendChild(scriptTag);
      return () => {
        document.body.removeChild(scriptTag);
      };

    },[])

    return(
          <>
            {
                status ? 
                <ComponentPayment />
                :
                <Loading1 />
            }
          </>   
    );
}