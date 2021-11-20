import { Container } from "react-bootstrap";
import RotateLoader from "react-spinners/RotateLoader";

export default function Loading()
{
    return (

        <Container className="container-loading" fluid>
            <RotateLoader color={"#d10202"} size={30} margin={20}/>
        </Container>

    );
}