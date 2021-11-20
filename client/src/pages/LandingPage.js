import React,{useState,useContext} from "react";

import "../index.css";

import {Container,Row,Col,Modal,Form,Alert} from 'react-bootstrap';

import Icon from '../assets/img/Icon.png';

import { useHistory } from "react-router-dom";

import { GlobalContext } from "../context/globalContext";

import { API } from "../config/api";

export default function LandingPage(){

    const [_,dispatch] = useContext(GlobalContext);

    const [showSignin,setShowSignin] = useState(false);
    const [showSignup,setShowSignup] = useState(false);

    const [formSignup,setFormSignup] = useState({
        email : "",
        password : "",
        fullName : ""
    })

    const [message,setMessage] = useState(null);

    const config = {

        headers : {
            "Content-type" : "application/json"
        }

    }

    let history = useHistory();
    const handleRedirectToHome = () => history.push("/home");

    const {email,password,fullName} = formSignup;
    const handleChangeFormSignup = (e) => {

        setFormSignup({
            ...formSignup,
            role : "user",
            [e.target.name] : e.target.value,
        });

    }

    const handelOnSubmitSignup = async (event) => {

        try {

            event.preventDefault();

            const body = JSON.stringify(formSignup);
            const response = await API.post('/register',body,config);

            let payload = response.data.data.user

            if(response.status == 200)
            {
                dispatch({
                    type : "LOGIN_SUCCESS",
                    payload
                });

                handleRedirectToHome();

            }

        } catch (error) {

            setFormSignup({
                email : "",
                password : "",
                fullName : ""
            });
            
            const alert = (
                <Alert variant="danger mt-3">
                    Email Already Exists
                </Alert>
            );

            setMessage(alert);

        }

    }

    const handelOnSubmitSignin = async (event) => {
        
        try {

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const data = {
                email,
                password
            }

            const body = JSON.stringify(data);

            event.preventDefault();

            const response = await API.post('/login',body,config);

            if(response.status == 200)
            {
                dispatch({
                    type : "LOGIN_SUCCESS",
                    payload : response.data.data.user
                });

                handleRedirectToHome();
            }
            
        } catch (error) {
            console.log(error); 
            const alert = (
                <Alert variant="danger mt-3">
                    Email And Password Not Match
                </Alert>
            );

            document.getElementById('email').value = "";
            document.getElementById('password').value = "";

            setMessage(alert); 
        }

    }

    return (

        <>
        <Container fluid className="container-landing-page">
            <Row className="justify-content-center">
                <Col md={1}></Col>
                <Col md={5}>
                    <img src={Icon} className="icon-landing-page" alt="Icon"/>

                    <p className="paragraf-landing-page">
                        Sign-up now and subscribe to enjoy all the cool and latest books - The best book rental service provider in Indonesia
                    </p>
                    
                    <button className="btn-signup fw-bold my-4 py-2 px-5" onClick={() => setShowSignup(true)}>Sign Up</button>

                    <button onClick={() => {setShowSignin(true)}} className="btn-signin my-4 py-2 px-5 mx-4 fw-bold">Sign In</button>
                </Col>
                <Col md={6}></Col>
            </Row>
        </Container>

        {/* Modal Signup */}
        <Modal show={showSignup} onHide={() => {setShowSignup(false);setMessage(null)}}>
            <Modal.Body>
                <h2 className="fw-bold">Sign Up</h2>

                {message}
                
                <Form className="mt-4" onSubmit={handelOnSubmitSignup}>

                    <Form.Group className="mb-4">
                        <Form.Control id="email" type="email" required autoComplete="off" placeholder="Email" name="email" onChange={handleChangeFormSignup} value={formSignup.email}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control id="password" type="password" required placeholder="Password" name="password" onChange={handleChangeFormSignup} value={formSignup.password}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control type="text" id="fullName" required autoComplete="off" name="fullName" placeholder="Full Name" onChange={handleChangeFormSignup} value={formSignup.fullName}/>
                    </Form.Group>
                    <div className="mt-5 text-center">
                        <button type="submit" className="btn-signin-modal mb-3 text-white fw-bold py-2 px-4">Sign Up</button> <br/>

                        <a className="btn btn-secondary m-auto btn-close-modal text-white fw-bold py-2 px-4" onClick={() => { setShowSignup(false);setMessage(null)}}>Close</a>
                    </div>
                    <p className="text-center mt-5 text-muted">
                        Already have an account ? Klik <b onClick={() => {
                            setShowSignin(true); setShowSignup(false)
                        }} className="text-dark" style={{cursor:"pointer"}} className="text-dark">Here</b>
                    </p>

                </Form>
            </Modal.Body>
        </Modal>

        {/* Modal Signin */}
        <Modal show={showSignin} onHide={() => {setShowSignin(false);setMessage(null)}}>
            <Modal.Body>
                <h2 className="fw-bold">Sign In</h2>

                {message}
                
                <Form className="mt-3" onSubmit={handelOnSubmitSignin}>

                    <Form.Group className="mb-4">
                        <Form.Control type="email" required autoComplete="off" placeholder="Email" id="email"/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control id="password" type="password" required placeholder="Password"/>
                    </Form.Group>
                    <div className="mt-5 text-center">
                        <button className="btn-signin-modal mb-3 text-white fw-bold py-2 px-4" type="submit">Sign In</button> <br/>
                        <a className="btn btn-secondary m-auto btn-close-modal text-white fw-bold py-2 px-4" onClick={() => { setShowSignin(false);setMessage(null)}}>Close</a>
                    </div>
                    <p className="text-center mt-5 text-muted">
                        Don't have an account ? Klik <b onClick={() => {
                            setShowSignup(true); setShowSignin(false)
                        }} className="text-dark" style={{cursor:"pointer"}}>Here</b>
                    </p>

                </Form>
            </Modal.Body>
        </Modal>

        </>

    );

} 