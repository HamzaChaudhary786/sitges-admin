// FilterForm.js
import React from "react";
import {
  Alert,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormControl } from "@mui/base";

const FilterForm = ({
  FilterName,
  FilterEmail,
  FilterStatus,
  setFilterName,
  setFilterEmail,
  setFilterStatus,
  ApplyFilter,
}) => {
  return (
    <div>
      <h1 style={{ marginTop: "14px", marginBottom: "10px" }}>Apply Filters</h1>

      <div className="flex" style={{ justifyContent: "space-between" }}>
        <div className="mb-10" style={{ width: "49%" }}>
          <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>Name</h4>
          <TextField
            fullWidth
            variant="outlined"
            value={FilterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>

        <div className="mb-10" style={{ width: "49%" }}>
          <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>Email</h4>
          <TextField
            fullWidth
            variant="outlined"
            value={FilterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="flex" style={{ justifyContent: "space-between" }}>
        <FormControl
          style={{
            width: "49%",
            marginTop: "15px",
            marginBottom: "10px",
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={FilterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Is Active"
            style={{ width: "100%" }}
          >
            <MenuItem value={"Active"}>Active</MenuItem>
            <MenuItem value={"InActive"}>InActive</MenuItem>
            <MenuItem value={"Pending"}>Pending</MenuItem>
            <MenuItem value={"Blocked"}>Blocked</MenuItem>
            <MenuItem value={"Deleted"}>Deleted</MenuItem>
          </Select>
        </FormControl>
      </div>
      <button
        style={{
          width: "10%",
          borderRadius: "50px",
          fontSize: "16px",
          padding: "14px 0px",
          marginTop: "20px",
          marginBottom: "16px",
          backgroundColor: "#1b2149",
          color: "white",
        }}
        onClick={ApplyFilter}
      >
        Apply
      </button>
    </div>
  );
};

export default FilterForm;
