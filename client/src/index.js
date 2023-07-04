import React from 'react'
// import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client';
import './index.css'
import { Provider } from 'react-redux'
// import { applyMiddleware, createStore } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import App from './App'
import reportWebVitals from './reportWebVitals'

import promiseMiddleware from 'redux-promise'
import thunk from 'redux-thunk'
import reducers from './_reducers'

const store = configureStore({
  reducer: reducers,
  middleware: [thunk, promiseMiddleware],
  devTools: true
});

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// );

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();