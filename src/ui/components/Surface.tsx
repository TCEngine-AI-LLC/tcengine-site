import * as React from "react";
import { Paper, type PaperProps } from "@mui/material";

export default function Surface({ sx, children, ...props }: PaperProps) {
  const sxArr = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Paper
      variant="outlined"
      {...props}
      sx={[
        {
          p: { xs: 2, sm: 3 },
          bgcolor: "background.paper",
        },
        ...sxArr,
      ]}
    >
      {children}
    </Paper>
  );
}