import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound(){
    return(

        <Container className="text-center">
            <h1 className="fw-bold text-danger pt-5 mt-5 m-auto">Not Found</h1>

            <h1 className="fw-bold mt-3 text-danger m-auto">
                <i className='bx bxs-notification-off'></i>
            </h1>

            <Link to="/home">
                <h1 className="fw-bold mt-5 m-auto">
                    <i className='bx bx-left-arrow-alt'></i> Back TO Home
                </h1>
            </Link>
            
        </Container>

    );
}