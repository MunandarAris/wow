import React,{useState,useEffect} from "react";

import { Container,Row } from "react-bootstrap";

import Loading1 from "../components/Load/Loading1";

import ComponentDetailData from "../components/Profile/ComponentDetailData";
import ComponentListBook from "../components/ComponentListBook";

import { API } from '../config/api';

import noData from '../assets/img/noData.svg';


export default function Profile(){

    const [status,setStatus] = useState(false);
    const [bookPlaylists,setBookPlaylists] = useState([]);

    useEffect( async () => {

        await API.get('/users');
        const response = await API.get('/playlists');

        setBookPlaylists(response.data.data.bookPlaylists);
        setStatus(true);
  
      },[]);

    return(
          <>
            {
            status ? 

            <Container className="mt-3">

                <h1 >Profile</h1>

                <ComponentDetailData />

                <h1 className="mt-5">My List Book</h1>

                <Row>
                    {
                        bookPlaylists !="" ? 
                        bookPlaylists.map((value,index) => {

                            return (
                            <ComponentListBook key={index} id={value.book.id} image={value.bookCover} author={value.book.author} bookName={value.book.title}/> 
                            )

                        })
                        : 
                        <img className="mt-3" src={noData} style={{width:"30%",margin:"auto"}} alt="no data"/>
                    }
                    
                </Row>
            </Container>

            :
                <Loading1 />
            }
          </>   
    );
}