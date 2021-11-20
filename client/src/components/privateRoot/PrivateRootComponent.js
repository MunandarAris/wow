import React,{useContext} from "react";

import {Route, Redirect} from "react-router-dom";

import { GlobalContext } from "../../context/globalContext";

export default function PrivateRouteComponent({ component: Component, ...rest }) {
    
    const [state] = useContext(GlobalContext);

    return (
        <>
            <Route
                {...rest}
                render={(props) =>
                    state.statusLogin ? <Component {...props} /> : <Redirect to="/"/>
                }
            />
        </>
    )
}