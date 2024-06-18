import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, MenuItem } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

export default function MultiSelect({ users, onChange }) {
  const [selectedNames, setSelectedNames] = useState([]);

  useEffect(() => {
    setSelectedNames([]);
  }, [users]);

  const handleChange = (event, values) => {
    setSelectedNames(values);
    onChange(values);
  };

  return (
    <Autocomplete
      sx={{ m: 1, width: 500 }}
      multiple
      options={users}
      value={selectedNames}
      onChange={handleChange}
      getOptionLabel={(option) => option.name}
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
          key={option.id}
          value={option.name}
          sx={{ justifyContent: "space-between" }}
        >
          {option.name}
          {selected ? <CheckIcon color="info" /> : null}
        </MenuItem>
      )}
    />
  );
}
