import React,{useContext,useState,useEffect} from "react";

import { Col, Container, Row, Modal, Form } from "react-bootstrap";

import ComponentData from "./ComponentData";

import { BiMap,BiEditAlt,BiPhone,BiBody } from "react-icons/bi";
import { BsFillEnvelopeFill } from "react-icons/bs";

import { GlobalContext } from "../../context/globalContext";
import {Button} from "react-bootstrap";

import { useQuery } from "react-query";
import { ApiReactQuery } from "../../config/reactQueryApi";

import { API } from "../../config/api";

const Styles = {
    container : { 
        backgroundColor:"#FFD9D9",
        borderRadius : "10px"
    },
    img : {
        borderRadius :'10px',
        width : "80%"
    },
    button : {
        width : "60%"
    },
    profile : {
        backgroundColor : "#D60000",
        color : "white",
        borderRadius : "5px",
        cursor : "pointer"
    }
}

const iEmail = <BsFillEnvelopeFill />;
const iPhone = <BiPhone />;
const iGender = <BiBody />;
const ILocation = <BiMap/>;


export default function ComponentDetailData(){
    
    let reactQuery = ApiReactQuery();

    const [state] = useContext(GlobalContext);
    const [form,setForm] = useState({
        mobilePhone : "",
        address : "",
        image : "",
        gender : ""
    });
    const [priview,setPriview] = useState("");

    const [showModal,setShowModal] = useState(false);

    const config = {
        headers : {
            "Content-type" : "multipart/form-data"
        }
    }

    // Get Profile
    useEffect( async () => {

        const response = await API.get('/profile');
        setPriview(response.data.data.profileUser.image);
        setForm({
            mobilePhone : response.data.data.profileUser.mobilePhone,
            address : response.data.data.profileUser.address,
            gender : response.data.data.profileUser.gender,
            image : ""
        });

    },[]);

    const handleChange = (e) => {

        if(e.target.type === "file")
        {
            let url = URL.createObjectURL(e.target.files[0]);
            setPriview(url)
        }

        setForm({
            ...form,
            [e.target.name === "gander"] : e.target.value,
            [e.target.name] : e.target.type === "file" ? e.target.files : e.target.value
        });

    }

    // Update Profile
    const handleOnSubmit = async (event) => {

        try {

            event.preventDefault();

            const formData = new FormData();
            if(form.image !== "")
            {
                formData.set("image",form.image[0],form.image[0]?.name);
            }
            formData.set("gender",form.gender);
            formData.set("mobilePhone",form.mobilePhone);
            formData.set("address",form.address);

            await API.put('/profile',formData,config);

            setShowModal(false);
            refetch();
            window.location.reload();

        } catch (error) {
            console.log(error);
        }

    }

    // React Query
    let { data: profileUser,refetch } = useQuery("DetailProfileUser", async () => {
        const config = {
          method: "GET",
          headers: {
            Authorization: "Basic " + localStorage.token,
          },
        };
        const response = await reactQuery.get("/profile", config);
        return response.data;
    });

 return (
    <>
    <Container style={Styles.container} className="p-3 mt-4 shadow ">
        <Row className="justify-content-between align-items-center">
            <Col md={5}>
                <ComponentData icon={iEmail} data={state.user.email} detail="Email"/>
                <ComponentData icon={iGender} data={profileUser?.profileUser?.gender} detail="Gender"/>
                <ComponentData icon={iPhone} data={profileUser?.profileUser?.mobilePhone} detail="Mobile Phone"/>
                <ComponentData icon={ILocation} data={profileUser?.profileUser?.address} detail="Address"/>
            </Col>
            <Col md={5} className="text-center">
                <img src={profileUser?.profileUser?.image} alt="usr" style={Styles.img} />
                <a style={Styles.button} className="btn btn-danger mt-4" variant="danger" onClick={() => setShowModal(true)}><BiEditAlt /> Edit Profile</a>
            </Col>
        </Row>
    </Container>

    <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleOnSubmit}>
                <Form.Group className="mb-4" controlId="image">
                    <Form.Label className="p-2" style={Styles.profile}>Upload File</Form.Label>
                    <Form.Control hidden type="file" accept="image/*" onChange={handleChange} name="image" placeholder="Select Image" /> <br/>
                    <img src={priview} className="mt-2" src={priview} style={{width:"20%"}} />
                </Form.Group>
                <Form.Group className="mb-4" controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Check checked={form?.gender === "male"} required type="radio" onChange={handleChange} value="male" name="gender" id="male" label="Male"/>
                    <Form.Check checked={form?.gender === "female"} required type="radio" onChange={handleChange} value="female" name="gender" id="female" label="Female"/>
                </Form.Group>
                <Form.Group className="mb-4" controlId="mobilePhone">
                    <Form.Label>Mobile Phone</Form.Label>
                    <Form.Control required type="number" onChange={handleChange} name="mobilePhone" placeholder="Enter Mobile Phone" value={form?.mobilePhone}/>
                </Form.Group>
                <Form.Group className="mb-4" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control required type="text" onChange={handleChange} name="address" as="textarea" rows={4} placeholder="Address" value={form?.address}></Form.Control>
                </Form.Group>

                <Button type="submit" className="btn btn-success ms-auto d-flex">Save</Button>
            </Form>
        </Modal.Body>
     </Modal>
    </>
 )
    
}