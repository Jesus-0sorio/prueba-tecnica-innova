"use client";
import theme from "@/app/theme";
import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SnackbarProvider } from "notistack";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

export const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
