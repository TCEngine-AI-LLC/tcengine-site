"use client";

import * as React from "react";
import { Box, CircularProgress, Skeleton, Typography } from "@mui/material";
import Surface from "@/src/ui/components/Surface";

function LinkedInEmbed({ src }: { src: string }) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <Surface
      sx={{
        width: { xs: "100%", md: 552 },
        overflow: "hidden",
        position: "relative",
        p: 0,
      }}
    >
      {!loaded ? (
        <>
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{ position: "absolute", inset: 0, zIndex: 1 }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Loading post
            </Typography>
          </Box>
        </>
      ) : null}

      <Box
        component="iframe"
        src={src}
        loading="lazy"
        title="LinkedIn post"
        onLoad={() => setLoaded(true)}
        sx={{
          position: "relative",
          zIndex: 0,
          width: "100%",
          height: { xs: 720, md: 820 },
          border: 0,
          display: "block",
          background: "transparent",
        }}
      />
    </Surface>
  );
}

export default function LinkedInEmbeds({ embeds }: { embeds: string[] }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: { xs: "stretch", md: "center" },
      }}
    >
      {embeds.map((src) => (
        <LinkedInEmbed key={src} src={src} />
      ))}
    </Box>
  );
}