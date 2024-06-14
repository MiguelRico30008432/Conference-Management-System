import Alert from "@mui/material/Alert";

export async function handleDownload(submission, setError, setOpenLoading) {
  setError(null);
  setOpenLoading(true);

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/downloadSubmissionFile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        credentials: "include",
        body: JSON.stringify({
          submissionID: submission.id,
        }),
      }
    );

    if (!response.ok) {
      const jsonResponse = await response.json();
      setError("Failed to download file: " + jsonResponse.msg);
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = submission.title + ".pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    setError(<Alert severity="error">Could not download file</Alert>);
  }

  setOpenLoading(false);
}
