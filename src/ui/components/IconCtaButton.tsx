"use client";

import * as React from "react";
import { Box, Typography } from "@mui/material";

import GlassIconButton from "@/src/ui/components/GlassIconButton";

export default function IconCtaButton({
  icon,
  tooltip,
  label,
  href,
  onClick,
  disabled,
  ariaLabel,
}: {
  icon: React.ReactNode;
  tooltip: string;
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2 }}>
      <GlassIconButton
        icon={icon}
        tooltip={tooltip}
        href={href}
        onClick={onClick}
        disabled={disabled}
        ariaLabel={ariaLabel}
      />
      <Typography
        variant="body2"
        sx={{
          fontWeight: 650,
          color: "text.secondary",
          userSelect: "none",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}