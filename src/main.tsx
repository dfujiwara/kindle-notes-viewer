import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.tsx";
import { LoadingIndicator } from "./LoadingIndicator.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingIndicator />}>
          <App />
        </Suspense>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
