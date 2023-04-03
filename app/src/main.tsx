import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { cacheExchange, createClient, fetchExchange, Provider } from 'urql';
import 'purecss/build/pure-min.css';
import 'purecss/build/grids-responsive-min.css';
import App from './App';

const client = createClient({
  url: import.meta.env.VITE_GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
});

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider value={client}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
