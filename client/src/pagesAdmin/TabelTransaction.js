import { useEffect,useState } from "react";

import { Container, Table, Dropdown,DropdownButton,Modal } from "react-bootstrap";

import { BiBlanket } from "react-icons/bi";

import {API} from "../config/api";

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

import { useQuery } from "react-query";
import { ApiReactQuery } from "../config/reactQueryApi";

export default function TableTransaction(){

    let reactQuery = ApiReactQuery();
    
    const [showModal,setShowModal] = useState(false);

    const config = {
        headers : {
            "Content-type" : "application/json"
        }
    }

    let { data: dataTransaction, refetch } = useQuery("dataTransactions", async () => {
        const config = {
          method: "GET",
          headers: {
            Authorization: "Basic " + localStorage.token,
          },
        };
        const response = await reactQuery.get("/transactions", config);
        return response.data;
    });    


    const handleApprove = async (e) => {

        const id = e.target.id;

        let data = {
            statusPayment : "Approve"
        }

        const body = JSON.stringify(data);

        await API.put('/transaction/'+id,body,config);
        setShowModal(true);
        refetch();

    }

    const handleCancel = async (e) => {

        const id = e.target.id;

        let data = {
            statusPayment : "Cancel"
        }

        const body = JSON.stringify(data);

        await API.put('/transaction/'+id,body,config);

        setShowModal(true);
        refetch();

    }
    let date = new Date().toLocaleTimeString();

    useEffect( async ()=>{
        await API.get("/transactions");
    },[date]);

    return(
          <>
            <Container className="mt-4">
                <h2 className="my-5">
                    <BiBlanket className="text-danger"/> Incoming Transaction
                </h2>
                <Table striped className="text-center mt-4" size="sm">
                    <thead className="text-danger">
                        <tr>
                            <th className="p-3">No</th>
                            <th className="p-3">Users</th>
                            <th className="p-3">Proof Transaction</th>
                            <th className="p-3">Account Number</th>
                            <th className="p-3">Remaining Active</th>
                            <th className="p-3">Status User</th>
                            <th className="p-3">Status Payment</th>
                            <th className="p-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        dataTransaction?.transactions?.map((value,index) => {
                            return (
                                
                                <tr key={index}>
                                    <td  className="p-3">{index+1}</td>

                                    <td  className="p-3">{value.user.fullName}</td>

                                    <td  className="p-3">
                                        <Zoom overlayBgColorEnd="#dcdcde" zoomMargin={30}>
                                            <img src={value.proofTransaction} alt="image" style={{width:"50px",objectFit:"cover"}}/>
                                        </Zoom>
                                    </td>

                                    <td  className="p-3">{value.accountNumber}</td>

                                    <td  className="p-3">{value.remainingActive} / Day</td>
                        
                                    <td  className="p-3">
                                        {value.statusUser == "Not Active" ? <b style={{color:"#FF0742"}}>Not Active</b> : <b className="text-success">Active</b>}
                                    </td>

                                    <td  className="p-3">
                                        {value.statusPayment === "Approve" ? <span className="text-success">Approve</span> : ""}
                                        {value.statusPayment === "Cancel" ? <span className="text-danger">Cancel</span> : ""}
                                        {value.statusPayment === "Pending" ? <span style={{color:"#F7941E"}}>Pending</span> : ""}
                                    </td>

                                    <td  className="p-3">
                                        <DropdownButton id="dropdown-basic-button">
                                            <Dropdown.Item className="text-success" onClick={handleApprove} id={value.id}>Approved</Dropdown.Item>
                                            <Dropdown.Item className="text-danger" onClick={handleCancel} id={value.id}>Cancel</Dropdown.Item>
                                        </DropdownButton>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
            </Container>

            {/* Success Add Data */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body className="text-center">
                    <h2 className="text-success">Data Update Successfully</h2>
                </Modal.Body>
            </Modal>
          </>   
    );
}