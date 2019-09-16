import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import ErrorBoundary from "./components/ErrorBoundary";


ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}> 
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </BrowserRouter>, 
  document.getElementById('root')
);

