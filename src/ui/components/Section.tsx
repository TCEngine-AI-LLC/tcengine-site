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
    <Box component="section" id={id} sx={{ my: 3 }}>
      {title ? (
        <Typography
          variant="h6"
          sx={{
            fontSize: 22,
            lineHeight: 1.2,
            fontWeight: 850,
            letterSpacing: "-0.02em",
            color: subtle ? "text.secondary" : "text.primary",
            mb: 1.5,
          }}
        >
          {title}
        </Typography>
      ) : null}
      {children}
    </Box>
  );
}