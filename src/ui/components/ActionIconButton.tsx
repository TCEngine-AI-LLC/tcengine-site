"use client";

import * as React from "react";
import { IconButton, type IconButtonProps, Tooltip } from "@mui/material";

/**
 * Standard icon button used across the site:
 * - theme-driven colors
 * - glass background
 * - divider border
 * - tooltip works even when disabled
 */
export default function ActionIconButton({
  tooltip,
  children,
  sx,
  ...props
}: IconButtonProps & { tooltip: string }) {
  const sxArr = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton
          {...props}
          size={props.size ?? "large"}
          sx={[
            {
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 999,
              color: "text.primary",
              backgroundColor: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              transition: "background-color 140ms ease, transform 140ms ease",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.14)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "translateY(0px)" },
            },
            ...sxArr,
          ]}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}