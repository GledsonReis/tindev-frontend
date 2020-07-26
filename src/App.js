import React, { createContext, useReducer } from 'react';
import { initialState, reducer } from "./store/reducer";
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Routes from "./routes";

export const AuthContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <Routes />
      <NotificationContainer/>
    </AuthContext.Provider>
  );
}

export default App;