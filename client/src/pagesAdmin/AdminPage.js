import {Route} from "react-router-dom";

import TableTransaction from "./TabelTransaction";
import AddBook from "./AddBook";
import Navbar from "./Navbar";
import ManageBooks from "./ManageBooks";
import EditBook from "./EditBook";
import Complain from "./Complain";

export default function AdminPage() {

    return(
        <>
            <Navbar />
            <Route path="/transaction" component={TableTransaction}/>
            <Route path="/add-book" component={AddBook} />
            <Route path="/manage-books" component={ManageBooks} />
            <Route path="/edit-book/:id" component={EditBook} />
            <Route path="/complain" component={Complain} />
        </>
    );

}