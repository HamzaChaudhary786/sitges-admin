import React from "react";
import { TextField } from "@mui/material";

const InputField = ({ label, value, onChange, type }) => {
  return (
    <div className="w-[48%] ">
      <h4 style={{ marginTop: "20px", marginBottom: "20px" }}>{label}</h4>
      <TextField
        fullWidth
        variant="outlined"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default InputField;
