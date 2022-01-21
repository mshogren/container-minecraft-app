import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createClient, Provider } from 'urql';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive-min.css';
import App from './App';

const client = createClient({
  url: import.meta.env.VITE_GRAPHQL_ENDPOINT,
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider value={client}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
