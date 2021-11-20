import { useEffect,useState,useContext, useRef } from "react"

import { GlobalContext } from "../context/globalContext";

import { Row,Form,Button,Col } from "react-bootstrap";
import Icon from "../assets/img/noData.svg";

import {format} from 'timeago.js';

import { io } from "socket.io-client";
let socket;

export default function ContactAdmin(){

    const [state] = useContext(GlobalContext);
    const [contact,setContact] = useState(null);
    const [message,setMessage] = useState("");
    const [messages,setMessages] = useState([]);
    const [validate,setValidate]= useState(null);
    const scrollToBottom = useRef();

    useEffect(() =>{

        socket = io('http://localhost:5000',{
            auth : {
                token : localStorage.getItem('token')
            },
            query : {
                id : state.user.id
            }
        });

        loadContactAdmin();
        getMessages();

        scrollToBottom.current?.scrollIntoView({behavior : "smooth"});

        socket.on('new message', () => {
            socket.emit('load message',contact?.id);
        })

        return () => {
            socket.disconnect();
        }

    },[messages]);


    // Get Contact Admin
    const loadContactAdmin = () => {

        socket.emit('load contact admin');
        socket.on("contact admin",(data) => {

            setContact(data);

        });

    }

    // Handle Changing Message
    const handleOnChange = (e) => {

        const chat = e.target.name == "message" ? e.target.value : "";

        setMessage(chat);

    }

    // Send Message
    const handleOnSubmit = (e) => {

        try {
            
            e.preventDefault();

            const data = {
                idRecipient : contact.id,
                message
            }

            if(message != "")
            {
                socket.emit('send message',data);
            }

            setMessage("");

        } catch (error) {
            console.log(error)
        }

    }

    // Get Messages 
    const getMessages = () => {
        socket.on("messages",(data) => {

            setMessages(data);

        });
    }

    // Handle Valdiasion
    const handleValidation = () => {

        socket.emit('load message',contact.id);
        setValidate(contact.id);

    }

    return (
    <>
    {
        validate ? 
            <>
                <div style={{height:"30vh"}} className="text-center">
                    <h1 className="text-danger m-auto">Contact To Admin</h1>
                </div>
                <div style={{height:"70vh"}} className="overflow-auto chat-area">
                    {
                        messages.length > 0  ?
                            messages.map(item => (

                                item.idSender == state.user.id ?
                                <div className="d-flex px-4 py-4 align-items-end flex-column">
                                    <div>
                                        <h6 style={{background:"white",padding:"10px",borderRadius:"15px 15px 0px 15px"}}>{item.message}</h6>
                                    </div>
                                    <p className="text-muted" style={{fontSize:"14px"}}>{format(item.createdAt)}</p>
                                </div>

                                :
                                <div className="d-flex px-4 py-4 align-items-start flex-column">
                                    <div>
                                        <h6 style={{padding:"10px",borderRadius:"15px 15px 15px 0px"}} className="bg-danger text-white">{item.message}</h6>
                                    </div>
                                    <p className="text-muted" style={{fontSize:"14px"}}>{format(item.createdAt)}</p>
                                </div>
                            ))
                        :
                            <div className="text-center mt-5 py-5">
                                <img src={Icon} style={{width:"30%"}}/>
                            </div>
                    }
                    <div ref={scrollToBottom}></div>
                </div>
                <Form onClick={handleOnSubmit} className="mt-5">
                    <Row>
                        <Col md={10}>
                            <Form.Group className="mb-3" controlId="message">
                                <Form.Control onChange={handleOnChange} type="text" placeholder="Message" name="message" autoComplete="off" value={message} className="inputMessage"/>
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            {
                                message ?   
                                <Button variant="danger" type="submit">
                                Send
                                </Button>
                                :
                                <Button variant="danger" disabled type="button">
                                Send
                                </Button>
                            }
                            
                        </Col>
                    </Row>
                </Form>
            </>
        : 
        <Button className="m-auto" onClick={handleValidation} variant="danger">
            Chat Admin
        </Button>
    }
    </>
                
    )
}
