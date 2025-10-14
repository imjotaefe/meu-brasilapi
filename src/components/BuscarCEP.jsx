import { useContext, useState } from "react";
import { CepContext } from "../contexts/CepContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// 🔹 Validação do CEP usando Yup
const schema = yup.object().shape({
  cep: yup
    .string()
    .required("O CEP é obrigatório")
    .matches(/^\d{8}$/, "O CEP deve ter 8 dígitos numéricos")
});

function BuscarCEP() {
  const { state, dispatch } = useContext(CepContext);
  const [loading, setLoading] = useState(false);

  // 🔹 Configuração do React Hook Form + Yup
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  // 🔹 Função para consultar a API
  const consultarCEP = async (data) => {
    setLoading(true); // ativa o "consultando..."
    dispatch({ type: "SET_ERRO", payload: null }); // limpa erro anterior

    try {
      const resposta = await fetch(`https://brasilapi.com.br/api/cep/v1/${data.cep}`);

      if (!resposta.ok) {
        throw new Error("CEP não encontrado");
      }

      const resultado = await resposta.json();

      // Garante que os dados realmente vieram com os campos esperados
      if (!resultado.cep || !resultado.city) {
        throw new Error("Dados incompletos recebidos da API");
      }

      dispatch({ type: "SET_DADOS", payload: resultado });
    } catch (err) {
      dispatch({ type: "SET_ERRO", payload: err.message });
      dispatch({ type: "SET_DADOS", payload: null }); // limpa dados antigos
    } finally {
      setLoading(false); // desativa o "consultando..."
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(consultarCEP)}>
        <input
          type="text"
          placeholder="Digite o CEP"
          {...register("cep")}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Consultando..." : "Buscar CEP"}
        </button>
      </form>

      {/* 🔹 Erro de validação do campo */}
      {errors.cep && <p style={{ color: "red" }}>{errors.cep.message}</p>}

      {/* 🔹 Erro retornado pela API */}
      {state.erro && <p style={{ color: "red" }}>{state.erro}</p>}

      {/* 🔹 Resultado da busca */}
      {state.dados && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>CEP:</strong> {state.dados.cep}</p>
          <p><strong>Logradouro:</strong> {state.dados.street}</p>
          <p><strong>Bairro:</strong> {state.dados.neighborhood}</p>
          <p><strong>Cidade:</strong> {state.dados.city}</p>
          <p><strong>Estado:</strong> {state.dados.state}</p>
        </div>
      )}
    </div>
  );
}

export default BuscarCEP;

