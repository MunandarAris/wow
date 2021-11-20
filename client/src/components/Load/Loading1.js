import RotateLoader from "react-spinners/RotateLoader";
import { Container } from "react-bootstrap";

export default function Loading1 () {
    return (
        <Container className="m-auto text-center">
            <RotateLoader color={"#d10202"} size={30} margin={20}/>
        </Container>
    )
}