import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createContext } from 'react';
import UserStore from './store/UserStore';
import OrganizationStore from './store/OrganizationStore';
import EventStore from './store/EventStore';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
      user: new UserStore(),
      organization: new OrganizationStore(),
      event: new EventStore(),
    }}>
        <App />
    </Context.Provider> 
);
