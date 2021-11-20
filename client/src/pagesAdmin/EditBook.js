import {useState,useEffect} from "react";

import { Button } from "react-bootstrap";
import { Container,Form,Modal } from "react-bootstrap";

import { BsPencilSquare } from "react-icons/bs";

import { useParams,useHistory } from "react-router-dom";

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

export default function EditBook(){

    const [modalSuccessfully,setModalSuccessfully] = useState(false);

    const {id} = useParams();
    let history = useHistory();

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
        bookCover : ""
    });

    useEffect( async () => {

        const response = await API.get('/book/'+id);

        setForm({
            ...form,
            title : response.data.data.book.title,
            date : response.data.data.book.publicationDate,
            pages : response.data.data.book.pages,
            author : response.data.data.book.author,
            isbn : response.data.data.book.isbn,
            aboutBook : response.data.data.book.aboutBook,
            bookFile : "",
            bookCover : ""
        });
        setPriview(response.data.data.book.bookCover);

        document.getElementById('publicationDate').value = response.data.data.book.publicationDate;

        const bookFile = response.data.data.book.bookFile;
        const split = bookFile.split("-");

        setPriviewBookFile(split[1]);

    },[]);

    const handleOnChange = (e) => {

        setForm({

            ...form,
            [e.target.name] : e.target.value

        });

    }

    // Get Priview Book Cover
    const handleOnChangePriview = (e) => {

        if(e.target.name == "bookCover" && e.target.files)
        {

            let url = URL.createObjectURL(e.target?.files[0]);
            setPriview(url);

            setForm({
                ...form,
                bookCover : e.target.files
            })

        }

    }



    // Get Priview Book File
    const handleOnChangePriviewBookFile = (e) => {

        if(e.target.name == "bookFile" && e.target.files)
        {
            setPriviewBookFile(e.target?.files[0].name);

            setForm({
                ...form,
                bookFile : e.target.files
            });
        }

    }

    const config = {
        headers : {
            "Content-type" : "multipart/form-data"
        }
    }

    // Save Data Changes
    const handleOnSubmit = async (e) => {

        e.preventDefault();

        let formData = new FormData();

        if(form.bookFile != "" && form.bookCover == "")
        {
            formData.set('bookFile',form.bookFile[0],form.bookFile[0]?.name);
        }
        else if(form.bookCover != "" && form.bookFile == "")
        {
            formData.set('bookCover',form.bookCover[0],form.bookCover[0]?.name);
        }
        else if(form.bookCover != "" && form.bookFile != "")
        {
            formData.set('bookFile',form.bookFile[0],form.bookFile[0]?.name);
            formData.set('bookCover',form.bookCover[0],form.bookCover[0]?.name);
        }

        formData.set('title',form.title);
        formData.set('publicationDate',form.date);
        formData.set('pages',form.pages);
        formData.set('author',form.author);
        formData.set('isbn',form.isbn);
        formData.set('aboutBook',form.aboutBook);

        await API.put('/book/'+id, formData, config);
        setForm({
            ...form,
            bookCover : "",
            bookFile : ""
        })

        setModalSuccessfully(true);

    }

    return(
        <>
        <Container style={Styles.container} className="mt-4 pb-5" md={6}>
            <h2 className="fw-bold"><BsPencilSquare className="text-danger"/> Edit Book</h2>

            <Form className="mt-5" onSubmit={handleOnSubmit}>
                <Form.Group className="mb-4">
                    <Form.Control className="form-add-book" style={Styles.form} type="text" placeholder="Title" required name="title" onChange={handleOnChange} value={form.title}/>
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Control className="form-add-book" style={Styles.form} type="date" placeholder="Publication Date" id="publicationDate" required name="date" onChange={handleOnChange}/>
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
                    <Form.Control hidden type="file" placeholder="name@example.com" name="bookFile" accept=".epub" onChange={handleOnChangePriviewBookFile}/>
                    <br/>
                    {
                        priviewBookFile == "" ? <b className="text-danger">Please Select Book File</b> : priviewBookFile
                    }
                </Form.Group>

                <Form.Group className="mb-4 mt-3" controlId="bookCover">
                    <Form.Label style={Styles.label} className="p-2">
                        Attache Book Cover <img style={{width:"6%"}} src={FileIcon}/>
                    </Form.Label>
                    <Form.Control hidden type="file" placeholder="name@example.com" name="bookCover" accept="image/*" onChange={handleOnChangePriview}/>
                    <br/>
                    {
                        priview == "" ? <b className="text-danger">Please Select Book Cover</b> : 
                        <img src={priview} alt="image"  style={{width:"100px",objectFit:"cover"}}/>
                    }
                </Form.Group>

                <Button type="submit" className="btn btn-danger d-flex ms-auto">Save Change</Button>
                
            </Form>
        </Container>

        {/* Success Update Image*/}
        <Modal show={modalSuccessfully}>
            <Modal.Body className="text-center" style={{cursor:"pointer"}} onClick={() => {
                history.push('/manage-books');
            }}>
                <h2 className="text-success">
                    Update Data Successfully
                </h2>
            </Modal.Body>
        </Modal> 
        </>     
    );
}