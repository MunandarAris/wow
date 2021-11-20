import React,{useState,useEffect} from "react";
import Loading from "../components/Load/Loading";

import Logo from "../assets/img/Icon.png";
import { Container } from "react-bootstrap";

import { useHistory } from "react-router-dom";

import ComponentRead from "../components/ReadBook/ComponentRead";

import { API } from '../config/api';

const Styles = {
    container : {
        backgroundColor:"#E5E5E5"
    },
    img : {
        width:"15%",
        cursor:"pointer"
    }
}

export default function ReadBook(){

    const [status,setStatus] = useState(false);

    useEffect( async () => {

        await API.get('/users');
        setStatus(true);
  
    },[]);

    let history = useHistory();

    const redirecToHome = () => history.push('/home');

    return(
          <>
            {
                status ? 

                <>
                    <Container fluid style={Styles.container}>
                        <img onClick={redirecToHome} src={Logo} className="d-flex mx-auto" style={Styles.img} />
                        <ComponentRead/>
                    </Container>
                    
                </>

            : <Loading />
            }
          </>   
    );
}