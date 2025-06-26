import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleAuthProvider } from "./components/pages/auth/GoogleAuth.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <GoogleAuthProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </GoogleAuthProvider>
);
