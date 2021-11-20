import React,{useState} from "react";
import Loading from "../components/Load/Loading";

import TableTransaction from "./TabelTransaction";
import NavComponent from "./Navbar";

import {Container} from "react-bootstrap";

const Styles = {
  container : {
      backgroundColor : "#E5E5E5"
  }
}

export default function TransactionPage(){

    const [status,setStatus] = useState(false);

    setTimeout(() =>setStatus(true) , 2000);

    return(
          <>
            {
                status ? 
                <Container fluid className="p-1" style={Styles.container}>
                  <NavComponent />
                  <TableTransaction /> 
                </Container>
                : 
                <Loading />
            }
          </>   
    );
}