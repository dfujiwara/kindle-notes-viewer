import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { LoadingIndicator } from "./LoadingIndicator.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingIndicator />}>
        <App />
      </Suspense>
    </QueryClientProvider>
  </StrictMode>,
);
