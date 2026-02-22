"use client";

import * as React from "react";
import Link from "next/link";
import ActionIconButton from "@/src/ui/components/ActionIconButton";

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
  const isInternal = Boolean(href && href.startsWith("/"));
  const isHttp = Boolean(href && /^https?:\/\//i.test(href ?? ""));
  const target = href && !isInternal && isHttp ? "_blank" : undefined;
  const rel = target ? "noreferrer" : undefined;

  if (href) {
    return (
      <ActionIconButton
        tooltip={tooltip}
        aria-label={ariaLabel ?? tooltip}
        disabled={disabled}
        component={isInternal ? (Link as React.ElementType) : "a"}
        {...(isInternal ? { href } : { href, target, rel })}
      >
        {icon}
      </ActionIconButton>
    );
  }

  return (
    <ActionIconButton
      tooltip={tooltip}
      aria-label={ariaLabel ?? tooltip}
      onClick={onClick}
      disabled={disabled}
      component="button"
    >
      {icon}
    </ActionIconButton>
  );
}