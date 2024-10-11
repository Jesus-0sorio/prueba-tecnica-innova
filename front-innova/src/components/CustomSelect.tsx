import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface Options {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  options: Options[];
  variant: "standard" | "outlined" | "filled";
  classNameSelect?: string;
  styles?: {
    [key: string]: string | number;
  }
  label: string;
}

const CustomSelect = ({
  value,
  onChange,
  options,
  variant,
  classNameSelect = "w-48",
  styles = {
    m: 1,
  },
  label,
}: CustomSelectProps) => {
  return (
    <FormControl variant={variant} sx={styles} className={classNameSelect}>
      <InputLabel id={`select-laber-${label}`}>{label}</InputLabel>
      <Select
        labelId={`select-laber-${label}`}
        id={`select-${label}`}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
