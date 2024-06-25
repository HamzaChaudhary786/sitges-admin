// StatusSelect.js

import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { UserStatus } from "./entities";


interface PropsType {
  label: string;
  value: string;
  onChange: (value: string) => void;
  menuItems: string[];
}


const StatusSelect = ({ label, value, onChange, menuItems }) => {
  return (
    <FormControl
      style={{
        width: "48%",
        marginTop: "35px",
        marginBottom: "10px",
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Is Active"
        style={{ width: "100%" }}
      >
        {menuItems.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default StatusSelect;
