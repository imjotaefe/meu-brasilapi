import { CepProvider } from "./contexts/CepContext";
import BuscarCEP from "./components/BuscarCEP";

function App() {
  return (
    <CepProvider>
      <div style={{ padding: "20px" }}>
        <h1>Consulta de CEP BrasilAPI</h1>
        <BuscarCEP />
      </div>
    </CepProvider>
  );
}

export default App;
