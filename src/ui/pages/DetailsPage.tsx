import type { Metadata } from "next";
import Link from "next/link";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { listMarkdownPages } from "@/src/server/content/markdownPages";

export const metadata: Metadata = {
  title: "Details",
  description: "All markdown routes available from /markdowns.",
};

export default async function DetailsPage() {
  const pages = await listMarkdownPages();

  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.paper" }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
          Details
        </Typography>

        <Stack spacing={1.2} sx={{ mt: 3 }}>
          {pages.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography color="text.secondary">
                No markdown pages found. Add files under <code>/markdowns</code>.
              </Typography>
            </Paper>
          ) : null}

          {pages.map((p) => (
            <Link key={p.href} href={p.href} style={{ display: "block", textDecoration: "none" }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderColor: "divider",
                  bgcolor: "action.disabledBackground",
                  transition: "background-color 120ms ease",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <Typography sx={{ fontWeight: 850 }}>{p.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                  {p.description}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.8, display: "block", fontFamily: "var(--font-geist-mono)" }}
                >
                  {p.href}
                </Typography>
              </Paper>
            </Link>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}