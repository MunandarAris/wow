import { useContext, useEffect,useState} from "react";

import { Navbar,Container,Dropdown } from "react-bootstrap";

import Logo from "../assets/img/Icon.png";

import { useHistory } from "react-router-dom";

import { BsFillPlusSquareFill,BsBoxArrowInLeft,BsBook,BsFillChatSquareDotsFill } from "react-icons/bs";

import {GlobalContext} from "../context/globalContext";

import {API} from "../config/api";

const Styles = {
    img : {
        width:"25%",
        cursor:"pointer"
    },
    img1 : {
        width:"50px",
        height:"50px",
        borderRadius : "100%"
    }
}


export default function NavComponent(){

    const [_,dispatch] = useContext(GlobalContext);
    const [profile,setProfile] = useState({});

    let history = useHistory();
    const redirectToTransaction = () => history.push("/transaction");
    const redirectToAddBook = () => history.push("/add-book");
    const redirectToLandingPage = () => history.push('/');

    const handleLogout = () => {
        dispatch({
            type : "LOGOUT"
        });

        redirectToLandingPage();
    }

    useEffect( async () => {

        const response = await API.get('/profile');
        setProfile(response.data.data.profileUser);

    },[]);

    return(
          <>
            <Navbar bg="transparant" className="mx-4" expand="lg">
                <Container fluid>
                    <Navbar.Brand className="mx-5 px-1">
                        <img src={Logo} style={Styles.img} onClick={redirectToTransaction} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                    <Dropdown className="ms-auto mx-5 px-3">
                        <Dropdown.Toggle variant="transparant" className="cutom-btn" id="dropdown-basic">
                            <img className="shadow" src={profile.image} style={Styles.img1}/>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="shadow">
                            <Dropdown.Item>
                                <h6 onClick={redirectToAddBook}><BsFillPlusSquareFill className="text-success" /> Add Book</h6>
                            </Dropdown.Item>
                            <Dropdown.Divider />

                            <Dropdown.Item>
                                <h6 onClick={() => history.push('/manage-books')}><BsBook className="fw-bold text-primary"/> Manage Books</h6>
                            </Dropdown.Item>
                            <Dropdown.Divider />

                            <Dropdown.Item>
                                <h6 onClick={() => history.push('/complain')}><BsFillChatSquareDotsFill className="fw-bold text-warning"/> Complain</h6>
                            </Dropdown.Item>
                            <Dropdown.Divider />

                            <Dropdown.Item>
                                <h6 onClick={handleLogout}><BsBoxArrowInLeft className="fw-bold text-danger"/> Logout</h6>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    </Navbar.Collapse>
                </Container>
            </Navbar>
          </>   
    );
}