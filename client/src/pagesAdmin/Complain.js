import { useEffect,useState,useContext,useRef } from "react";

import { Col, Container, Row, Form, Button } from "react-bootstrap";

import { GlobalContext } from "../context/globalContext";

import Icon from "../assets/img/noData.svg";

import {format} from 'timeago.js';

import {io} from 'socket.io-client';
let socket;

export default function Complain () {

    const [state] = useContext(GlobalContext);
    const [contacts,setContacts] = useState([]);
    const [contact,setContact] = useState(null);
    const [message,setMessage] = useState("");
    const [messages,setMessages] = useState([]);
    const scrollToBottom = useRef();

    useEffect(() => {

        socket = io('http://localhost:5000',{
            auth : {
                token : localStorage.getItem('token')
            },
            query: {
                id: state.user.id
            }
        });
        loadContacts();
        dataMessage();

        scrollToBottom.current?.scrollIntoView({behavior : "smooth"});
        
        socket.on('new message', () => {
            socket.emit('load message',contact?.id);
        });

        return () => {
            socket.disconnect();
        }

    },[messages]);

    const onClickCustomer = (item) => {

        setContact(item);
        socket.emit('load message',item?.id);

    }

    const loadContacts = () => {

        socket.emit('load customer contacts');

        socket.on('customer contacts',(data) => {

            let dataManipulation = data;

            dataManipulation = dataManipulation.map(item => ({
                ...item,
                image : "http://localhost:5000/uploads/" + item.profile.image
            }));

            setContacts(dataManipulation);

        })

    }

    // Handle On Change
    const handelOnChange = (e) => {

        const chat = e.target.name == "message" ? e.target.value : "";

        setMessage(chat);

    }

    // Send Message
    const handelOnSubmit = (e) => {

        try {

            e.preventDefault();

            const data = {
                idRecipient : contact.id,
                message
            }
            

            socket.emit("send message",data)
            setMessage("");

            
        } catch (error) {
            console.log(error)
        }

    }

    // Load Message
    const dataMessage = () => {
        socket.on('messages', (data) => {

            setMessages(data);

        });
    }

    return (

        <>
        <Container>

            <Row>

                <Col md={3} className="border-end border-danger">
                    {
                        contacts.map((item,index) => {
                            return (
                                <div key={index} className={`mt-4 ${contact?.id == item.id ? "contact-active" : ""} `} onClick={() => onClickCustomer(item)} style={{cursor:"pointer"}}>
                                    <Row className="align-items-center" >
                                        <Col md={4}>
                                            <img src={item.image} style={{width:"60px",height:"60px",objectFit:"cover"}} className="rounded-circle"/>
                                        </Col>
                                        <Col md={8}>
                                            <p>{item.fullName}</p>
                                        </Col>
                                    </Row>
                                </div>
                            )
                        })
                    }
                </Col>

                <Col md={9}>
                    {
                        contact ? 
                        <>
                            <div style={{height:"60vh"}} className="overflow-auto chat-area">
                                {
                                    messages.length > 0 ?
                                
                                        messages.map((item,index) => (

                                            item.idSender == state.user.id ?

                                            <div key={index} className="d-flex px-4 py-4 align-items-end flex-column">
                                                <div>
                                                    <h6 style={{background:"white",padding:"10px",borderRadius:"15px 15px 0px 15px"}}>{item.message}</h6>
                                                </div>
                                                <p className="text-muted" style={{fontSize:"14px"}}>{format(item.createdAt)}</p>
                                            </div>

                                            :
                                            <div key={index} className="d-flex px-4 py-4 align-items-start flex-column">
                                                <div>
                                                    <h6 style={{padding:"10px",borderRadius:"15px 15px 15px 0px"}} className="bg-danger text-white">{item.message}</h6>
                                                </div>
                                                <p className="text-muted" style={{fontSize:"14px"}}>{format(item.createdAt)}</p>
                                            </div>

                                        ))
                                    : 
                                    <div className="text-center">
                                        <img src={Icon} style={{width:"30%"}}/>
                                    </div>
                                }
                                <div ref={scrollToBottom}></div>
                            </div>
                            <Form onSubmit={handelOnSubmit} className="mt-3">
                                <Row>
                                    <Col md={10}>
                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Control onChange={handelOnChange}  type="text" placeholder="Message" name="message" value={message} autoComplete="off" className="inputMessage"/>
                                        </Form.Group>
                                    </Col>

                                    <Col>
                                    {
                                        message ? 
                                        <Button variant="danger" type="submit">
                                            Send
                                        </Button>
                                        :
                                        <Button variant="danger" type="submit" disabled>
                                            Send
                                        </Button>
                                    }
                                        
                                    </Col>
                                </Row>
                            </Form>
                        </>
                        :
                        <div className="text-center">
                            <h4 className="text-danger">No User Selected</h4>
                        </div>
                    }
                    
                </Col>
                
            </Row>

        </Container>
        </>

    )

}