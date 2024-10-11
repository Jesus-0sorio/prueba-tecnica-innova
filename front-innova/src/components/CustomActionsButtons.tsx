import { CustomActionsButtonsProps } from "@/interfaces/components/customActionsButtons.interface";
import { Button, Stack } from "@mui/material";


const CustomActionsButtons = ({
  buttons,
  spacing = 2,
  direction = "row",
  height = 50,
  width,
}: CustomActionsButtonsProps) => {
  return (
    <Stack
      spacing={spacing}
      direction={direction}
      height={height}
      width={width}
    >
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.onClick}
          variant={button.variant}
          startIcon={button.startIcon}
          color={button.color}
        >
          {button.buttonText}
        </Button>
      ))}
    </Stack>
  );
};

export default CustomActionsButtons;
