import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

export default function LoginPage() {
  const navigate = useNavigate();

  const changePage = () => {
    navigate("/");
  };

  return (
    <>
      <h1>Login Page</h1>
      <Button variant="contained" onClick={changePage}>
        Go to Home Page
      </Button>
    </>
  );
}