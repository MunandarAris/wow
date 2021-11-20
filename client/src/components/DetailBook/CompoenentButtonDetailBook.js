import { useState,useEffect} from "react";

import { useParams } from "react-router-dom";

import { useHistory } from "react-router-dom";

import { BiBookmarks,BiChevronRight } from "react-icons/bi";
import { BsFillTrashFill } from "react-icons/bs";

import {API} from "../../config/api";

export default function ComponentButtonDetailBook(){

    const [playlists,setPlaylists] = useState([]);

    let history = useHistory();

    const {id} = useParams();

    const redirectToProfile = () => history.push("/profile");
    const redirectToReadBook = () => history.push("/read-book/"+id);

    const config = {
        headers : {
            "Content-type" : "application/json"
        }
    }

    useEffect( async () => {

        const response = await API.get('/playlists');
        setPlaylists(response.data.data.bookPlaylists);

    },[]);

    const handleAddMyList = async () => {

        const data = {
            idBook : id
        }

        const body = JSON.stringify(data);
        
        await API.post('/playlist',body,config);

        redirectToProfile();
    }

    const handleDeleteMyList = async () => {

        const data = {
            idBook : id
        }

        let body = JSON.stringify(data);
        
        const response = await API.post('/delete-my-playlist',body,config);

        redirectToProfile();
    }

    let statusHide = false;

    if(playlists.length == 0)
    {
        statusHide = false;
    }
    else 
    {
        playlists.map((value) => {
        
            if(value.book.id == id)
            {
                statusHide = true;
            }
        });
    }

    return(

    
           <div className="mt-4 d-flex justify-content-end">
               {
                   statusHide ? 
                    <a onClick={handleDeleteMyList} className="btn btn-danger mx-4">
                        Delete From Playlist <BsFillTrashFill />
                    </a>
                    :
                    <a onClick={handleAddMyList} className="btn btn-danger mx-4">
                        Add My List <BiBookmarks />
                    </a>
               }
                
                <a onClick={redirectToReadBook} className="btn btn-secondary">
                    Read Book <BiChevronRight />
                </a>
           </div>
        

    )

}