import { StyledEngineProvider } from "@mui/material";

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>;
};
