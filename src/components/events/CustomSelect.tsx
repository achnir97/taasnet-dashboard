import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface CustomSelectProps {
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  options: string[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <FormControl fullWidth variant="outlined" margin="normal">
      <InputLabel shrink>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        notched
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
