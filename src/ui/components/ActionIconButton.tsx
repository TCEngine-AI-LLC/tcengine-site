"use client";

import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import type { IconButtonProps } from "@mui/material/IconButton";

type ActionIconButtonProps<C extends React.ElementType> = IconButtonProps<C> & {
  tooltip: string;
};

export default function ActionIconButton<C extends React.ElementType = "button">(
  props: ActionIconButtonProps<C>
) {
  const { tooltip, children, sx, ...rest } = props;
  const sxArr = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton
          {...rest}
          size={rest.size ?? "large"}
          sx={[
            {
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 999,
              color: "text.primary",

              // theme-driven glass
              backgroundColor: "action.selected",
              backdropFilter: "blur(10px)",

              transition: "background-color 140ms ease, transform 140ms ease",
              "&:hover": {
                backgroundColor: "action.hover",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "translateY(0px)" },

              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "text.disabled",
              },
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