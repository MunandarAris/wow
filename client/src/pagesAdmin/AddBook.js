import {useState} from "react";

import {Button} from 'react-bootstrap';
import { Container,Form,Modal } from "react-bootstrap";

import { BiAddToQueue,BiBookAdd } from "react-icons/bi";

import FileIcon from "../assets/img/upload-file-add-book.png";

import { API } from "../config/api";

const Styles = {
    container : {
        width:"60%",
    },
    form : {
        backgroundColor:"#D2D2D240",
        border:"2px solid #BFBFBF",
    },
    label : {
        backgroundColor:"#D2D2D240",
        border:"2px solid #BFBFBF",
        width:"30%",
        cursor:"pointer",
        borderRadius:'5px'
    }
}

export default function AddBook(){

    const [showModal,setShowModal] = useState(false);
    const [modalError,setModalError] = useState(false);

    const [priview,setPriview] = useState("");
    const [priviewBookFile,setPriviewBookFile] = useState("");
    const [form,setForm] = useState({
        title : "",
        date : "",
        pages : "",
        author : "",
        isbn : "",
        aboutBook : "",
        bookFile : "",
    });

    const handleOnChange = (e) => {

        setForm({

            ...form,
            [e.target.name] : e.target.value

        });

    }

    const handleOnChangeBookFile = (e) => {

        setForm({

            ...form,
            [e.target.name] : e.target.type == "file" ? e.target.files : e.target.value

        });

        let url = e.target.files[0]?.name;
        setPriviewBookFile(url);


    }

    const handleOnChangeBookCover = (e) => {

        setForm({

            ...form,
            [e.target.name] : e.target.type == "file" ? e.target.files : e.target.value

        });

        let url = URL.createObjectURL(e.target?.files[0]);
        setPriview(url);

    }

    const config = {
        headers : {
            "Content-type" : "multipart/form-data"
        }
    }

    const handleOnSubmitAddBook = async (event) => {

        event.preventDefault();

        let formData = new FormData();
        formData.set('bookFile',form.bookFile[0],form.bookFile[0]?.name);
        formData.set('bookCover',form.bookCover[0],form.bookCover[0]?.name);
        formData.set('title',form.title);
        formData.set('publicationDate',form.date);
        formData.set('pages',form.pages);
        formData.set('author',form.author);
        formData.set('isbn',form.isbn);
        formData.set('aboutBook',form.aboutBook);

        await API.post('/book',formData,config);

        setShowModal(true);
        setForm({
            title : "",
            date : "",
            pages : "",
            author : "",
            isbn : "",
            aboutBook : "",
            bookFile : "",
        });

        setPriview("");
        setPriviewBookFile("");

    }

    return(
        <>
        <Container style={Styles.container} className="mt-4 pb-5" md={6}>
            <h2 className="fw-bold"><BiAddToQueue className="text-danger"/> Add Book</h2>

            <Form className="mt-5" onSubmit={handleOnSubmitAddBook}>
                <Form.Group className="mb-4">
                    <Form.Control className="form-add-book" style={Styles.form} type="text" placeholder="Title" required name="title" onChange={handleOnChange} value={form.title}/>
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control className="form-add-book" style={Styles.form} type="date" placeholder="Publication Date" required name="date" onChange={handleOnChange} value={form.date}/>
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control className="form-add-book" style={Styles.form} type="number" placeholder="Pages" required name="pages" onChange={handleOnChange} value={form.pages}/>
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control className="form-add-book" style={Styles.form} type="text" placeholder="Author" required name="author" onChange={handleOnChange} value={form.author}/>
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control className="form-add-book" style={Styles.form} type="text" placeholder="ISBN" required name="isbn" onChange={handleOnChange} value={form.isbn}/>
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Control className="form-add-book" style={Styles.form} type="text" as="textarea" rows={4} placeholder="About This Book" required name="aboutBook" onChange={handleOnChange} value={form.aboutBook}/>
                </Form.Group>
                <Form.Group className="mb-4" controlId="bookFile">
                    <Form.Label style={Styles.label} className="p-2">
                        Attache Book File <img style={{width:"6%"}} src={FileIcon}/>
                    </Form.Label>
                    <Form.Control hidden type="file" placeholder="name@example.com" required onChange={handleOnChangeBookFile} name="bookFile" accept=".epub"/>
                    <br/>
                    {
                        priviewBookFile == "" ? <b className="text-danger">Please Select Book File</b> : priviewBookFile
                    }
                </Form.Group>

                <Form.Group className="mb-4 mt-3" controlId="bookCover">
                    <Form.Label style={Styles.label} className="p-2">
                        Attache Book Cover <img style={{width:"6%"}} src={FileIcon}/>
                    </Form.Label>
                    <Form.Control hidden type="file" placeholder="name@example.com" required onChange={handleOnChangeBookCover} name="bookCover" accept="image/*"/>
                    <br/>
                    {
                        priview == "" ? <b className="text-danger">Please Select Book Cover</b> : 
                        <img src={priview} alt="image"  style={{width:"100px",objectFit:"cover"}}/>
                    }
                </Form.Group>

                <Button type="submit" className="btn btn-danger d-flex ms-auto">Add Book <BiBookAdd className="fs-5" /></Button>
                
            </Form>
        </Container> 

        {/* Success Add Data */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Body className="text-center">
                <h2 className="text-success">Data Saved Successfully</h2>
            </Modal.Body>
        </Modal> 

        {/* Error Save Image */}
        <Modal show={modalError} onHide={() => setModalError(false)}>
            <Modal.Body className="text-center">
                <h2 className="text-danger">Please Select Book File</h2>
            </Modal.Body>
        </Modal> 
        </>     
    );
}