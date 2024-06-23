import Alert from "@mui/material/Alert";

export async function fetchAPI(url, method, body, setError, setOpenLoading) {
  setError(null);
  setOpenLoading(true);

  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    };

    if (method === "POST") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/${url}`,
      options
    );

    const jsonResponse = await response.json();
    setOpenLoading(false);
    if (response.status === 200) {
      return jsonResponse;
    } else {
      setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
      return null;
    }
  } catch (error) {
    setError(<Alert severity="error">{error}</Alert>);
    setOpenLoading(false);
    return null;
  }
}
