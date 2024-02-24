import { useEffect, useState } from "react";

export default function TestUseEffect() {
  const [numbers, setNumber] = useState([1, 2, 3]);

  useEffect(() => {
    console.log("isto é depois");

    for (let number of numbers) {
      if (number === 1) {
        setNumber([2, 3]);
      }
    }

    return () => {
      console.log("Componente desmontado");
    };
  }, [numbers]);

  return (
    <>
      <h1>List Of Numbers</h1>
      {numbers.map((number) => (
        <p>Number : {number}</p>
      ))}
    </>
  );
}
