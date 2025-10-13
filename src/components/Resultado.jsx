function Resultado({ data }) {
    if (!data) return null;
    return (
      <div>
        <h3>Resultado:</h3>
        <p>Logradouro: {data.street}</p>
        <p>Bairro: {data.neighborhood}</p>
        <p>Cidade: {data.city}</p>
        <p>Estado: {data.state}</p>
      </div>
    );
  }
  
  export default Resultado;
  