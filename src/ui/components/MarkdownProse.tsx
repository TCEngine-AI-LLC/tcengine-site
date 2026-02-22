import { Box } from "@mui/material";

export default function MarkdownProse({ html }: { html: string }) {
  return (
    <Box
      sx={{
        "& h1": {
          fontSize: { xs: 28, sm: 36 },
          fontWeight: 900,
          letterSpacing: "-0.03em",
          mt: 0,
          mb: 1,
        },
        "& h2": {
          fontSize: { xs: 20, sm: 24 },
          fontWeight: 850,
          letterSpacing: "-0.02em",
          mt: 3,
          mb: 1,
        },
        "& h3": {
          fontSize: { xs: 18, sm: 20 },
          fontWeight: 800,
          mt: 2.5,
          mb: 1,
        },

        "& p": {
          color: "text.secondary",
          lineHeight: 1.85,
          mt: 1.2,
        },
        "& ul, & ol": {
          color: "text.secondary",
          lineHeight: 1.85,
          pl: 3,
          mt: 1,
        },
        "& li": { mt: 0.5 },

        "& a": {
          color: "primary.light",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        },

        // Default images
        "& img": {
          maxWidth: "100%",
          height: "auto",
          display: "block",
          mt: 2,
          mb: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "rgba(255,255,255,0.04)",
          padding: 1,
        },

        // Mermaid diagrams: treat like “content-width” markdown (prevents huge feel on wide screens)
        "& img[src^='/diagrams/'], & img[src^='diagrams/']": {
          width: "100%",
          maxWidth: 760,
          marginLeft: "auto",
          marginRight: "auto",
        },

        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 16,
        },
        "& th, & td": {
          border: "1px solid",
          borderColor: "divider",
          padding: 10,
          verticalAlign: "top",
        },

        "& pre": {
          overflowX: "auto",
          padding: 16,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "rgba(255,255,255,0.06)",
        },
        "& code": {
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.95em",
        },

        "& hr": {
          border: 0,
          height: "1px",
          bgcolor: "divider",
          my: 3,
        },

        "& blockquote": {
          margin: 0,
          paddingLeft: 16,
          borderLeft: "3px solid",
          borderColor: "divider",
          color: "text.secondary",
        },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}