"use client";

import * as React from "react";
import Link from "next/link";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";

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
  const content = (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? tooltip}
      component={href ? (Link as any) : "button"}
      // MUI + Next Link
      {...(href ? { href } : {})}
      size="large"
      sx={{
        border: "1px solid rgba(15, 23, 42, 0.16)",
        borderRadius: 999,
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
        "&:hover": { background: "rgba(255, 255, 255, 0.9)" },
      }}
    >
      {icon}
    </IconButton>
  );

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2 }}>
      <Tooltip title={tooltip}>{disabled ? <span>{content}</span> : content}</Tooltip>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 650,
          color: "rgba(11, 15, 23, 0.78)",
          userSelect: "none",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
