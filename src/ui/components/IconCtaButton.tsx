"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Typography } from "@mui/material";

import ActionIconButton from "@/src/ui/components/ActionIconButton";

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
  const isInternal = Boolean(href && href.startsWith("/"));
  const isHttp = Boolean(href && /^https?:\/\//i.test(href ?? ""));
  const target = href && !isInternal && isHttp ? "_blank" : undefined;
  const rel = target ? "noreferrer" : undefined;

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2 }}>
      {href ? (
        <ActionIconButton
          tooltip={tooltip}
          aria-label={ariaLabel ?? tooltip}
          disabled={disabled}
          component={isInternal ? (Link as React.ElementType) : "a"}
          {...(isInternal
            ? { href }
            : { href, target, rel })}
        >
          {icon}
        </ActionIconButton>
      ) : (
        <ActionIconButton
          tooltip={tooltip}
          aria-label={ariaLabel ?? tooltip}
          onClick={onClick}
          disabled={disabled}
          component="button"
        >
          {icon}
        </ActionIconButton>
      )}

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