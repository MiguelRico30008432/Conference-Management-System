import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function TextAreaUsage() {
  const [value, setValue] = useState("");

  const getAndUpdateValue = () => {
    let inputElement = document.getElementById("outlined-basic") as any;
    setValue(inputElement.value);

    inputElement.value = "";
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <Button
          variant="contained"
          onClick={getAndUpdateValue}
          style={{ marginTop: "10px" }}
        >
          Get Data
        </Button>
        <label>{value}</label>
      </div>
    </>
  );
}
