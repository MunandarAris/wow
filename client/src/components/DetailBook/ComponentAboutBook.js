import { useState } from "react";

export default function ComponentAboutBook(props){

    const [detailBook] = useState(props.data);

    return(

        <>
           <div>
                <h1 className="mt-5 mb-4">About This Book</h1>
                <p className="text-muted lh-lg">
                    {detailBook.aboutBook}
                </p>
           </div>
        </>

    )

}