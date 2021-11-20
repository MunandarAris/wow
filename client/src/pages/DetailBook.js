import React,{useState,useEffect} from "react";

import Loading1 from "../components/Load/Loading1";

import ComponentDetailBook from "../components/DetailBook/CompnentDetailBook";
import ComponentAboutBook from "../components/DetailBook/ComponentAboutBook";
import ComponentButtonDetailBook from "../components/DetailBook/CompoenentButtonDetailBook";

import { useParams } from 'react-router-dom';

import { Container } from "react-bootstrap";

import {API} from "../config/api";

export default function Payment(){

    const [status,setStatus] = useState(false);
    const [detailBook,setDetailBook] = useState({});

    let { id } = useParams();

    useEffect( async () => {

        await API.get('/books');

        const response = await API.get('/book/' + id);
        setDetailBook(response.data.data.book);

        setStatus(true);
  
      },[]);

    return(
          <>
            {
                status ? 
                    <Container>
                        <ComponentDetailBook data={detailBook}/>
                        <ComponentAboutBook data={detailBook}/>
                        <ComponentButtonDetailBook/>
                    </Container>
                :
                <Loading1 />
            }
          </>   
    );
}