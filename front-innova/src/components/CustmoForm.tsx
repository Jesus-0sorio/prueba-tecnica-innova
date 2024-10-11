import { Close } from "@mui/icons-material";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface FormData {
  [key: string]: string | number | Dayjs;
}

interface Option {
  value: string | number;
  label: string;
}
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "custom"
  | "string"
  | "password";

export interface Field {
  id?: string;
  label: string;
  placeholder?: string;
  type: FieldType;
  options?: Option[];
  variant?: "standard" | "outlined" | "filled";
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disabled?: boolean;
  ariaDescribedby?: string;
  value: string | number | Dayjs;
  setValue?: (value: string | number | Dayjs) => void;
  formControlProps?: {
    fullWidth: boolean;
    margin: "normal" | "dense" | "none";
  };
}

interface CustomFormProps {
  title: string;
  textButton: string;
  setFormData?: (data: FormData) => void;
  handleSubmitCreateCustom: () => void;
  handleClose?: () => void;
  fields: Field[];
  isValidCloseIcon?: boolean
}

export const CustomForm = ({
  handleSubmitCreateCustom,
  handleClose,
  title,
  textButton,
  fields,
  isValidCloseIcon = true
}: CustomFormProps) => {
  return (
    <form>
      <Typography variant="h4" align="center" gutterBottom>
        {title}
      </Typography>
      {isValidCloseIcon && (
        <Close
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            cursor: "pointer",
            width: 30,
            height: 30,
          }}
        />
      )}

      {fields &&
        fields.map((field: Field, key: number) => {
          if (field.type === "select") {
            return (
              <FormControl key={key} fullWidth margin="normal">
                <InputLabel id={field.id}>{field.label}</InputLabel>
                <Select
                  id={field.id}
                  aria-describedby={field.ariaDescribedby}
                  label={field.label}
                  variant={field.variant}
                  value={field.value as string | number}
                  onChange={(event: SelectChangeEvent<string | number>) =>
                    field.setValue && field.setValue(event.target.value)
                  }
                >
                  {field.options &&
                    field.options?.map((option: Option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            );
          }

          if (field.type === "date") {
            return (
              <FormControl key={key} fullWidth margin="normal">
                <DatePicker
                  aria-describedby={field.ariaDescribedby}
                  label={field.label}
                  value={field.value as Dayjs}
                  onChange={(date: Dayjs | null) =>
                    date && field.setValue && field.setValue(date)
                  }
                  disabled={field.disabled}
                  minDate={field.minDate}
                  maxDate={field.maxDate}
                  format="YYYY-MM-DD"
                />
              </FormControl>
            );
          }

          return (
            <FormControl key={key} fullWidth margin="normal">
              <TextField
                id={field.id}
                aria-describedby={field.ariaDescribedby}
                label={field.label}
                variant={field.variant}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(
                  event: React.ChangeEvent<
                    HTMLInputElement | HTMLTextAreaElement
                  >
                ) => field.setValue && field.setValue(event.target.value)}
              />
            </FormControl>
          );
        })}

      <Button
        type="button"
        onClick={handleSubmitCreateCustom}
        variant="contained"
        fullWidth
        size="large"
        sx={{ mt: 2 }}
      >
        {textButton}
      </Button>
    </form>
  );
};
