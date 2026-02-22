import * as React from "react";
import { Box, Typography } from "@mui/material";

export default function Section({
  title,
  children,
  id,
  subtle,
}: {
  title?: string;
  id?: string;
  subtle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Box component="section" id={id} sx={{ mt: 4, mb: 4 }}>
      {title ? (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 850,
            letterSpacing: "-0.02em",
            mb: 1.5,
            color: subtle ? "text.secondary" : "text.primary",
          }}
        >
          {title}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}