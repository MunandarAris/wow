import React,{useState,useEffect} from "react";

import {Row} from 'react-bootstrap';

import FramerImage from '../assets/img/framer.png';
import ComponentListBook from "./ComponentListBook";

import Loading1 from "./Load/Loading1";

import { BiListCheck } from "react-icons/bi";

import { API } from '../config/api';

import Icon from "../assets/img/noData.svg";

export default function ComponentCardRightHome(){

  const [status,setStatus] = useState(false);
  const [bookLists,setBookLists] = useState([]);

  useEffect( async () => {

    await API.get('/users');
    const response = await API.get('/books');
    setStatus(true);
    setBookLists(response.data.data.books);

  },[]);

    return(
          <>
          {
            status ? 
            <>
            <img src={FramerImage} alt="framer" className="framer-image"></img>
            <h1 className="fw-bold p-3">
              <BiListCheck class='bx bx-list-check fs-1 text-danger'/> List Book
            </h1>
            <Row className="mt-3 justify-content-center">
              {
                bookLists.length > 0 ?
                  bookLists.map((value,index) => {
                    return(
                      <ComponentListBook key={index} id={value.id} image={value.bookCover} bookName={value.title} author={value.author} />
                    )
                  })
                :
                  <img src={Icon} style={{width:"50%"}} />

              }
            </Row>
            </>
            :
            <Loading1 />
          }
          </> 
    );
}