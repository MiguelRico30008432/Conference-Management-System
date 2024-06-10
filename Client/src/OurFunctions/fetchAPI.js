import Alert from "@mui/material/Alert";

export async function fetchAPI(url, method, body, setError, setOpenLoading) {
  setError(null);
  setOpenLoading(true);

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const jsonResponse = await response.json();
    if (response.ok) {
      setOpenLoading(false);
      return jsonResponse;
    } else {
      setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
      setOpenLoading(false);
      return null;
    }
  } catch (error) {
    setError(<Alert severity="error">{error.message}</Alert>);
    setOpenLoading(false);
    return null;
  }
}
