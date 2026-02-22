"use client";

import * as React from "react";
import { Box, CircularProgress, Skeleton, Typography } from "@mui/material";
import Surface from "@/src/ui/components/Surface";

function LinkedInEmbed({
  src,
  onLoaded,
}: {
  src: string;
  onLoaded: () => void;
}) {
  const [loaded, setLoaded] = React.useState(false);
  const notifiedRef = React.useRef(false);

  const handleLoad = React.useCallback(() => {
    setLoaded(true);
    if (!notifiedRef.current) {
      notifiedRef.current = true;
      onLoaded();
    }
  }, [onLoaded]);

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
        title="LinkedIn post"
        // IMPORTANT: remove lazy so it doesn't wait for scroll/hover heuristics
        loading="eager"
        onLoad={handleLoad}
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
  const total = embeds.length;
  const [loadedCount, setLoadedCount] = React.useState(0);

  const onOneLoaded = React.useCallback(() => {
    setLoadedCount((c) => Math.min(total, c + 1));
  }, [total]);

  // Minimal, non-annoying global loader:
  // show only while the FIRST post hasn't loaded yet.
  const showTopLoader = total > 0 && loadedCount === 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {showTopLoader ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
          <CircularProgress size={18} />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Loading posts
          </Typography>
        </Box>
      ) : null}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: { xs: "stretch", md: "center" },
        }}
      >
        {embeds.map((src) => (
          <LinkedInEmbed key={src} src={src} onLoaded={onOneLoaded} />
        ))}
      </Box>
    </Box>
  );
}