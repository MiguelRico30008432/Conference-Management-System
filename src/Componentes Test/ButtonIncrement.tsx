import Button from "@mui/material/Button";
import { useState } from "react";

export default function ButtonIncrement() {
  const [counter, setCounter] = useState(0);
  let counter2 = 0;

  function increment() {
    counter2++;
  }

  return (
    <>
      <h1>Counter: {counter}</h1>
      <Button
        variant="contained"
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        Increment
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          setCounter(counter - 1);
        }}
      >
        Decrement
      </Button>
      <h1>Counter2: {counter2}</h1>
      <Button variant="contained" onClick={increment}>
        Increment without useState
      </Button>
    </>
  );
}
