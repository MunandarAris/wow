import React from "react";

import {Container,Row,Col} from 'react-bootstrap';

import ComponentHomeProfileUser from "./ComponentHomeProfileUser";
import ComponentHomeLink from "./ComponentHomeLink";
import ComponentCardRightHome from './ComponentCardRightHome';
import Payment from "../pages/Payment";
import Profile from "../pages/Profile";
import DetailBook from "../pages/DetailBook";
import ContactAdmin from "../pages/ContactAdmin"

import {Route} from 'react-router-dom';

export default function ComponentHome(){

    return(
          <>
                <Container fluid className="container-home">
                    <Row className="justify-content-center">
                        <Col className="d-flex flex-column m-4" md={3}>
                            <ComponentHomeProfileUser />
                            <ComponentHomeLink />
                        </Col>
                        <Col className="d-flex flex-column m-4" md={8}>
                            <Route exact path="/home" component={ComponentCardRightHome}/>
                            <Route exact path="/payment" component={Payment}/>
                            <Route exact path="/profile" component={Profile}/>
                            <Route exact path="/detail-book/:id" component={DetailBook}/>
                            <Route exact path="/contact-admin" component={ContactAdmin}/>
                        </Col>
                    </Row>
                </Container>
          </> 
    );
}