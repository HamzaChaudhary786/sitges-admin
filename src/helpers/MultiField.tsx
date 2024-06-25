import React from "react";
import { TextField } from "@mui/material";

const MultiField = ({ label, value, onChange }) => {
  return (
    <div className="" style={{ width: "108%" }}>
      <h4 style={{ marginTop: "20px", marginBottom: "20px" }}>{label}</h4>
      <TextField
        fullWidth
        multiline
        variant="outlined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default MultiField;
