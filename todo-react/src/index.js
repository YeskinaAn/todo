import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import theme from "./theme";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "./lib/queryClient";


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
