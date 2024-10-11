export interface ButtonProps {
  onClick: () => Promise<void> | void;
  variant: "contained" | "outlined" | "text";
  startIcon?: JSX.Element;
  color: "inherit" | "primary" | "secondary" | "success" | "error";
  buttonText: string;
}

export interface CustomActionsButtonsProps {
  buttons: ButtonProps[];
  spacing: number;
  direction: "row" | "column";
  height: number;
  width?: number;
}
