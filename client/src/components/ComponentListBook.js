import React,{useState} from "react";

import { useHistory } from "react-router-dom";

import {Col} from 'react-bootstrap';

import ProfileIcon from '../assets/img/profile-icon.png';

import {Modal} from 'react-bootstrap';

import { useQuery } from "react-query";
import { ApiReactQuery } from "../config/reactQueryApi";

export default function ComponentListBook(props){

    let reactQuery = ApiReactQuery();

    const [showModalPaymentWarning,setShowModalPaymentWarning] = useState(false);

    const id = props.id;

    const history  = useHistory();

    // React Query
    let { data: validation } = useQuery("validationStatusSubscribe", async () => {
        const config = {
          method: "GET",
          headers: {
            Authorization: "Basic " + localStorage.token,
          },
        };
        const response = await reactQuery.get("/validation-subscribe", config);
        return response.data;
      });  

    const pathDetailBook = () =>  {
        if(validation === undefined)
        {
            setShowModalPaymentWarning(true);
        }
        else if (validation.validation.statusUser == "Not Active")
        {
            setShowModalPaymentWarning(true);
        }
        else 
        {
            history.push('/detail-book/'+id);
        }
    };

    return(
          <>
            <Col md={3} className="mt-4 mx-4 col-book" style={{cursor:"pointer"}}>
                <img onClick={pathDetailBook} src={props.image} alt="Book" style={{width:"200px",height:"280px",objectFit:"cover",borderRadius:"10px"}}/>

                <p onClick={pathDetailBook} className="fw-bold fs-5 mt-3 book-name">{props.bookName}</p>
                
                <p onClick={pathDetailBook} className="text-muted">
                    <img src={ProfileIcon} alt="Profile Icon" style={{width:"8%"}}/> {props.author}
                </p>
            </Col> 

            <Modal size="lg" show={showModalPaymentWarning} className="d-flex align-items-center" onHide={() => setShowModalPaymentWarning(false)}>
                <Modal.Body>
                    <h4 className="text-danger text-center my-auto p-5">
                        please make a payment to read the latest books
                    </h4>
                </Modal.Body>
            </Modal>               
          </> 
    );
}