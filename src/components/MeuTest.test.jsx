import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CepProvider } from "../contexts/CepContext";
import BuscarCEP from "./BuscarCEP";

describe("Componente BuscarCEP", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should render form and input", () => {
    render(
      <CepProvider>
        <BuscarCEP />
      </CepProvider>
    );

    const input = screen.getByPlaceholderText("Digite o CEP");
    const button = screen.getByRole("button", { name: /Buscar CEP/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it("should get CEP successfully", async () => {
    const mockData = {
      cep: "01310100",
      street: "Avenida Paulista",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP"
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData
    });

    render(
      <CepProvider>
        <BuscarCEP />
      </CepProvider>
    );

    const input = screen.getByPlaceholderText("Digite o CEP");
    const button = screen.getByRole("button", { name: /Buscar CEP/i });

    fireEvent.change(input, { target: { value: "01310100" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("01310100")).toBeInTheDocument();
      expect(screen.getByText("Avenida Paulista")).toBeInTheDocument();
      expect(screen.getByText("São Paulo")).toBeInTheDocument();
    });

    expect(vi.mocked(fetch)).toHaveBeenCalledWith(
      "https://brasilapi.com.br/api/cep/v1/01310100"
    );
  });
});
