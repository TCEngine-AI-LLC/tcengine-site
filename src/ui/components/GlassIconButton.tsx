"use client";

import * as React from "react";
import Link from "next/link";
import { IconButton, Tooltip } from "@mui/material";

export default function GlassIconButton({
  icon,
  tooltip,
  href,
  onClick,
  disabled,
  ariaLabel,
}: {
  icon: React.ReactNode;
  tooltip: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const button = (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? tooltip}
      component={href ? (Link as React.ElementType) : "button"}
      {...(href ? { href } : {})}
      size="large"
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
        color: "text.primary",
        "&:hover": { backgroundColor: "rgba(255,255,255,0.14)" },
      }}
    >
      {icon}
    </IconButton>
  );

  // Tooltip requires a wrapper to work with disabled buttons.
  return (
    <Tooltip title={tooltip}>
      <span>{button}</span>
    </Tooltip>
  );
}