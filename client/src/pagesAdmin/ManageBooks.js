import { useEffect,useState } from "react";

import { Container, Table, Modal, Button} from "react-bootstrap";

import { BsBook,BsFillTrashFill,BsPencilSquare } from "react-icons/bs";

import {useHistory} from 'react-router-dom';

import {API} from "../config/api";

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export default function ManageBooks() {

    const [books,setBooks] = useState([]);
    const [show, setShow] = useState(false);
    const [modalDeleteSuccess, setModalDeleteSuccess] = useState(false);
    const [idBook,setIdBook] = useState(0);

    let history = useHistory();

    useEffect( async () => {

        const response = await API.get('/books');
        setBooks(response.data.data.books);

    },[idBook]);

    const handleDeleteBook = async () => {

        await API.delete('/book/' + idBook);

        setIdBook(0);
        setShow(false);
        setModalDeleteSuccess(true);
    }

    return(
       
            <>
            <Container className="mt-4">
                <h2 className="my-5">
                    <BsBook className="text-danger"/> Manage Books
                </h2>
                <Table striped className="text-center mt-4" size="sm">
                    <thead className="text-danger">
                        <tr>
                            <th className="p-3">No</th>
                            <th className="p-3">Title</th>
                            <th className="p-3">Author</th>
                            <th className="p-3">ISBN</th>
                            <th className="p-3">Book Cover</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="">
                    {
                        books.map((value,index) => {
                            return (
                                
                                <tr key={index}>
                                    <td  className="p-3">{index+1}</td>

                                    <td  className="p-3">{value.title}</td>

                                    <td  className="p-3">{value.author}</td>

                                    <td  className="p-3">{value.isbn}</td>

                                    <td  className="p-3">
                                        <Zoom overlayBgColorEnd="#dcdcde" zoomMargin={30}>
                                            <img src={value.bookCover} alt="image" style={{width:"50px",objectFit:"cover"}}/>
                                        </Zoom>
                                    </td>

                                    <td className="p-3">
                                        <h5 style={{cursor:"pointer"}} className="text-success" onClick={() => history.push('/edit-book/'+value.id)}>
                                            <BsPencilSquare />
                                        </h5>
                                        <h5 style={{cursor:"pointer"}} className="text-danger" onClick={() => {setShow(true);setIdBook(value.id)}}>
                                            <BsFillTrashFill />
                                        </h5>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </Container>

            {/* Modal Confirm Delete */}
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header>
                <Modal.Title className="text-danger">Are You Sure ?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={() => {setShow(false);setIdBook(0)}}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteBook}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Delete Success */}
            <Modal show={modalDeleteSuccess} className="text-center" onHide={() => setModalDeleteSuccess(false)}>
                <Modal.Body className="text-center">
                    <h2 className="text-success">Data Deleted Successfully</h2>
                </Modal.Body>
            </Modal>
        </>   

    )

}