import React,{useState} from "react";

import { Container,Form,Button,Modal } from "react-bootstrap";

import WowLogo from '../../assets/img/Wow.png';
import IconUploadImage from '../../assets/img/icon-upload-image.png';

import { useHistory } from "react-router-dom";

import {API} from "../../config/api";

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const styles = {
    formInputAccount : {
        width:"50%",backgroundColor:"#BCBCBC",color:"black"
    },
    formUpload : {
        color:"#D60000",cursor:"pointer",border:"2px solid #BCBCBC",borderRadius:"5px",width:"50%"
    }
}

export default function ComponentPayment(){

    const [showModal,setShowModal] = useState(false);
    const [priview,setPriview] = useState("");
    const [form,setForm] = useState({
        accountNumber : "",
    });
    const [payLoading, setPayLoading] = useState(false);

    let history = useHistory();

    const config = {
        headers : {
            "Content-type" : "multipart/form-data"
        }
    }

    const handleOnChange = (e) => {

        if(e.target.type == "file" && e.target.files)
        {
            let url = URL.createObjectURL(e.target.files[0]);
            setPriview(url);
        }
        else 
        {
            setPriview("");
        }

        setForm({
            ...form,
            [e.target.name] : e.target.type == "file" ? e.target.files[0] : e.target.value

        });

    }

    const handleOnSubmitPayment = async (e) => {

        try {

            e.preventDefault();

            let formData = new FormData();
            if(form.proofTransaction !== "")
            {
                formData.set('proofTransaction',form.proofTransaction,form.proofTransaction.name)
            }
            formData.set("accountNumber",form.accountNumber)

            await API.post('/transaction',formData,config);

            setShowModal(true);
            
        } catch (error) {
            console.log(error)
        }

    }

    // Show Midtrans Snap
    const showMidtransSnap = async () => {

        setPayLoading(true)

        const response = await API.get('/payment');
        const tokenMidtrans = response.data?.midtransData?.token;

        window.snap.pay(tokenMidtrans, {
            onSuccess: function () {
                setPayLoading(false)
            },
            onPending : function() {
                setPayLoading(false)
            },
            onClose : function() {
                setPayLoading(false)
            }
        });

    }

    return(
          <>
            <Container className="text-center m-auto ">
                <h1 className="fw-bold">Premium</h1>
                
                <p className="mt-4">
                    Pay now and access all the latest books from <img src={WowLogo} alt="WOW" />
                </p>

                <p className="fw-bold mt-4">
                    <img src={WowLogo} alt="WOW" /> : Rp. <b className="text-danger">100.000.00</b> / Month { payLoading ? 
                    <Button disabled className="btn btn-danger mx-3">Pay</Button>
                    :
                        <Button className="btn btn-danger mx-3" onClick={showMidtransSnap}>Pay</Button>
                    }
                </p>

                <Form onSubmit={handleOnSubmitPayment}>
                    <Form.Group className="mb-4 mt-5">
                        <Form.Control type="number" className="py-2 mx-auto" style={styles.formInputAccount} required placeholder="Input your account number" onChange={handleOnChange} name="accountNumber"/>
                    </Form.Group>

                    <Form.Group controlId="formFile" className="mb-4">
                        <Form.Label className="fw-bold py-2" style={styles.formUpload}>Attache proof of transfer <img src={IconUploadImage} alt="icon" style={{width:"7%"}} /></Form.Label>
                        <Form.Control hidden name="proofTransaction" required type="file" onChange={handleOnChange} accept="image/*" /> <br />
                        {
                            priview == "" ? "" : 
                            <Zoom overlayBgColorEnd="#dcdcde" zoomMargin={30}>
                                <img src={priview} className="mt-2" alt="image" style={{width:"150px"}}/>
                            </Zoom>
                        }
                    </Form.Group>

                    <Button variant="danger" type="submit" style={{width:"50%"}}>Send</Button>
                </Form>
            </Container>

            <Modal show={showModal} size="lg" className="d-flex my-auto align-items-center">
                <Modal.Body onClick={() => history.push('/profile')} style={{cursor:"pointer"}}>
                    <p className="text-success p-3 fs-5 text-center">
                        Thank you for subscribing to premium, your premium package will be active after our admin approves your transaction, thank you
                    </p>
                </Modal.Body>
            </Modal>
          </>   
    );
}