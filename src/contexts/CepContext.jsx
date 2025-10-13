import { createContext, useReducer } from "react";

// Estado inicial
const initialState = {
  cep: "",
  dados: null,
  erro: null
};

// Reducer simples
function cepReducer(state, action) {
  switch (action.type) {
    case "SET_CEP":
      return { ...state, cep: action.payload };
    case "SET_DADOS":
      return { ...state, dados: action.payload, erro: null };
    case "SET_ERRO":
      return { ...state, erro: action.payload, dados: null };
    default:
      return state;
  }
}

// Criando o contexto
export const CepContext = createContext();

// Provider
export function CepProvider({ children }) {
  const [state, dispatch] = useReducer(cepReducer, initialState);

  return (
    <CepContext.Provider value={{ state, dispatch }}>
      {children}
    </CepContext.Provider>
  );
}
