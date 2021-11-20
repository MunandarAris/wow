import React from "react";
import { Col, Row } from "react-bootstrap";

export default function ComponentData(props){

    return(
          <>
          <Row className=" mt-2">
            <Col md={2} className="fs-2">{props.icon}</Col>
            <Col>
                <p className="fw-bold">{props.data}</p>
                <p className="text-muted">{props.detail}</p>
            </Col>
        </Row>
          </>   
    );
}