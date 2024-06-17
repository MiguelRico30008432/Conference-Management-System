import Tooltip from "@mui/material/Tooltip";

export default function FieldInfo({ children, text }) {
  return (
    <Tooltip disableFocusListener disableTouchListener title={text}>
      {children}
    </Tooltip>
  );
}
