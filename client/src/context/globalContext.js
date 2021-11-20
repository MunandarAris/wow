import { createContext,useReducer } from "react";

export const GlobalContext = createContext();

const initialStateGlobal = {
    statusLogin : false,
    user : {},
}

const reducer  = (state,action) => {

    const {type,payload} = action;

    switch(type){
        case 'AUTH_SUCCESS' :
        case 'LOGIN_SUCCESS' :
            localStorage.setItem('token',payload.token);
            return {
                statusLogin : true,
                user : payload
            };
        case 'AUTH_ERROR' :    
        case 'LOGOUT' : 
        localStorage.removeItem('token');
            return {
                statusLogin : false,
                user : {}
            }
        default :
            throw new Error();
    }

};

export const GlobalContextProviders = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialStateGlobal);
  
    return (
      <GlobalContext.Provider value={[state, dispatch]}>
        {children}
      </GlobalContext.Provider>
    );
  };