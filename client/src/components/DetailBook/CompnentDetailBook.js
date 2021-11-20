import { useState } from "react";

import { Col, Row } from "react-bootstrap";

const Styles = {
    img : {
        width:"290px",
        objectFit: "cover",
        height:"100%",
        borderRadius : "10px"
    }
}

export default function ComponentDetailBook(props){

    const [detailBook] = useState(props.data);

    return(

        <>
            <Row className=" justify-content-between">
                <Col md={5}>
                        <img src={detailBook.bookCover} alt="Book" style={Styles.img} />
                </Col>
                <Col md={6}>
                    <h1 className="fw-bold">{detailBook.title}</h1>
                    <p className="text-muted">{detailBook.author}</p>

                    <h5 className="fw-bold mt-5">Publication Date</h5>
                    <p className="text-muted">{detailBook.publicationDate}</p>

                    <h5 className="fw-bold mt-5">Pages</h5>
                    <p className="text-muted">{detailBook.pages}</p>

                    <h5 className="fw-bold mt-5 text-danger">ISBN</h5>
                    <p className="text-muted">{detailBook.isbn}</p>
                </Col>
            </Row>
        </>

    )

}