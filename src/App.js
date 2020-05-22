import React, { createContext, useReducer } from 'react';
import { initialState, reducer } from "./store/reducer";
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
    </AuthContext.Provider>
  );
}

export default App;