import { useReducer } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validação com Yup
const schema = yup.object().shape({
  cep: yup
    .string()
    .required("O CEP é obrigatório")
    .matches(/^\d{8}$/, "Digite um CEP válido com 8 dígitos"),
});

// Estado inicial para useReducer
const initialState = {
  resultado: null,
  erro: "",
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case "SET_RESULTADO":
      return { ...state, resultado: action.payload, erro: "" };
    case "SET_ERRO":
      return { ...state, resultado: null, erro: action.payload };
    default:
      return state;
  }
}

function BuscarCEP() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${data.cep}`);
      if (!response.ok) throw new Error("CEP não encontrado");
      const resultado = await response.json();
      dispatch({ type: "SET_RESULTADO", payload: resultado });
      reset();
    } catch (err) {
      dispatch({ type: "SET_ERRO", payload: err.message });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("cep")}
          placeholder="Digite o CEP"
        />
        <button type="submit">Buscar</button>
      </form>

      {errors.cep && <p style={{ color: "red" }}>{errors.cep.message}</p>}
      {state.erro && <p style={{ color: "red" }}>{state.erro}</p>}

      {state.resultado && (
        <div style={{ marginTop: "10px" }}>
          <h3>Resultado:</h3>
          <p>Logradouro: {state.resultado.street}</p>
          <p>Bairro: {state.resultado.neighborhood}</p>
          <p>Cidade: {state.resultado.city}</p>
          <p>Estado: {state.resultado.state}</p>
        </div>
      )}
    </div>
  );
}

export default BuscarCEP;
