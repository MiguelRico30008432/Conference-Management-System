import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function MultiSelect({ users, onChange }) {
  const [selectedNames, setSelectedNames] = useState([]);

  const handleChange = (event, values) => {
    setSelectedNames(values);
    onChange(values);
  };

  useEffect(() => {
    setSelectedNames([]);
  }, [users]);

  return (
    <Autocomplete
      sx={{ m: 1, width: 500 }}
      multiple
      options={users}
      value={selectedNames}
      onChange={handleChange}
      getOptionLabel={(option) => option}
      disableCloseOnSelect
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          placeholder="Multiple Autocomplete"
        />
      )}
      renderOption={(props, option, { selected }) => (
        <MenuItem
          {...props}
          key={option}
          value={option}
          sx={{ justifyContent: "space-between" }}
        >
          {option}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
    />
  );
}
