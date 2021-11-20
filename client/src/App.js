import React,{useState,useContext,useEffect, Suspense, lazy } from "react";

import {Switch,Route,useHistory} from "react-router-dom";

import PrivateRouteComponent from "./components/privateRoot/PrivateRootComponent";

import { API,setAuthToken } from "./config/api";

import { GlobalContext } from "./context/globalContext";

import Loading from "./components/Load/Loading";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const Home = lazy(() => import("./pages/Home"));
const ReadBook = lazy(() => import("./pages/ReadBook"));
const AdminPage = lazy(() => import("./pagesAdmin/AdminPage"));
const NotFound = lazy(() => import("./notFound"));

function App() {

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  let history = useHistory();

  const [state,dispatch] = useContext(GlobalContext);

  const [statusLoading,setStatusLoading] = useState(false);

  useEffect(() => {

    if(state.statusLogin === true)
    {
      if(state.user.role === "user")
      {
        history.push('/home');
      }
      else if (state.user.role === "admin")
      {
        history.push('/transaction');
      }
    }

    return () => {
      
    }

  },[state]); 
  
  const checkUser = async () => {

    try {

      const response = await API.get('/check-user');

      if(response.status === 400)
      {
        return dispatch({
          type : "AUTH_ERROR"
        });
      }

      let payload = response.data.data.user;
      payload.token = localStorage.token;

      dispatch({
        type : "AUTH_SUCCESS",
        payload
      })
      
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => checkUser(),[]);

  useEffect( async () => {

    await API.get('/users');
    setStatusLoading(true);
    
  },[]);

  return (
    <>
      {
        statusLoading ?
        <Suspense fallback={<Loading />}>
          <Switch>
              <Route exact path="/" component={LandingPage}/>
              <PrivateRouteComponent exact path="/home" component={Home}/>
              <PrivateRouteComponent exact path="/payment" component={Home}/>
              <PrivateRouteComponent exact path="/profile" component={Home}/>
              <PrivateRouteComponent exact path="/detail-book/:id" component={Home}/>
              <PrivateRouteComponent exact path="/read-book/:id" component={ReadBook}/>
              <PrivateRouteComponent exact path="/transaction" component={AdminPage}/>
              <PrivateRouteComponent exact path="/add-book" component={AdminPage}/>
              <PrivateRouteComponent exact path="/manage-books" component={AdminPage}/>
              <PrivateRouteComponent exact path="/edit-book/:id" component={AdminPage}/>
              <PrivateRouteComponent exact path="/complain" component={AdminPage}/>
              <PrivateRouteComponent exact path="/contact-admin" component={Home}/>
              <Route exact  path="*" component={NotFound}/>
          </Switch>
        </Suspense>
        : 
        <Loading />
      }
    </>
  );
}

export default App;
