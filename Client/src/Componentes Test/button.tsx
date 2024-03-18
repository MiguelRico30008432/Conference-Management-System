import { useState } from "react";
import Button from "@mui/material/Button";

export default function ButtonUsage() {
  const [counter, setCounter] = useState(0);
  const [counter2, setCounter2] = useState(1);

  function increaseCounter() {
    if (counter === 2) {
      setCounter(23);
    } else {
      setCounter(counter + 1);
    }
  }

  function increaseCounter2() {
    setCounter2((counter2 + 1) * 2);
  }

  return (
    <>
      <h1>Counter +1: {counter}</h1>
      <h1>Counter *2: {counter2}</h1>
      <Button
        variant="contained"
        onClick={() => {
          increaseCounter();
          increaseCounter2();
        }}
      >
        Hello world
      </Button>
    </>
  );
}
