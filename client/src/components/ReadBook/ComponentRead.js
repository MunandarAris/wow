import { useState,useEffect } from "react";

import { API } from '../../config/api';

import { useParams } from "react-router-dom";

import { ReactReader } from "react-reader";

import Loading from '../Load/Loading';

export default function ComponentRead() {

const [readBook,setReadBook] = useState({});

const [location, setLocation] = useState(null)
const locationChanged = (epubcifi) => {
    setLocation(epubcifi)
}

const {id} = useParams();

useEffect( async () => {

    const response = await API.get('/book/' + id);

    setReadBook(response.data.data.book);

},[]);

const wow = <h6 className="fw-bold">&copy; Window Of World</h6>

return(

    <div style={{ height: "100vh",position:"relative" }} className="mx-3 my-3">
        <ReactReader url={readBook?.bookFile} title={wow} loadingView={Loading} location={location} locationChanged={locationChanged}/>
    </div>

    );
}