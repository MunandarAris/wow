import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { GlobalContextProviders } from "./context/globalContext";

import {BrowserRouter as Router} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";
const client = new QueryClient();

ReactDOM.render(
  <GlobalContextProviders>
    <QueryClientProvider client={client}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </GlobalContextProviders>,
  document.getElementById('root')
);

