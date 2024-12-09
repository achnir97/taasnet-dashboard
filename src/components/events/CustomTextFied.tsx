import React from "react";
import { TextField, OutlinedTextFieldProps } from "@mui/material";

// Define CustomTextFieldProps specifically for the "outlined" variant
interface CustomTextFieldProps extends Omit<OutlinedTextFieldProps, "variant"> {
  label: string; // Label is required for better UX
}

// Create the CustomTextField component
const CustomTextField: React.FC<CustomTextFieldProps> = ({ label, ...props }) => {
  return (
    <TextField
      label={label}
      variant="outlined" // Lock the variant to "outlined"
      fullWidth // Ensure the TextField spans the full width
      {...props} // Pass additional props
    />
  );
};

export default CustomTextField;
