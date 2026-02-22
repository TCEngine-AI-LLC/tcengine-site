import { Box, CircularProgress, Typography } from "@mui/material";
import Surface from "@/src/ui/components/Surface";

export default function Loading() {
  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Surface>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <CircularProgress size={20} />
          <Typography sx={{ color: "text.secondary" }}>
            Loading thought leadership…
          </Typography>
        </Box>
      </Surface>
    </Box>
  );
}