import type { Metadata } from "next";
import Link from "next/link";
import { Alert, Box, Stack, Typography } from "@mui/material";

import { pricingCopy } from "@/src/customizations/copy";
import Section from "@/src/ui/components/Section";
import Surface from "@/src/ui/components/Surface";
import PricingCheckout from "@/src/ui/widgets/PricingCheckout";

export const metadata: Metadata = {
  title: pricingCopy.title,
  description: pricingCopy.intro,
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await Promise.resolve(searchParams);
  const success = typeof sp?.success === "string" ? sp.success : "";

  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Surface>
        <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: "0.14em" }}>
          Consulting
        </Typography>

        <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 900, letterSpacing: "-0.03em" }}>
          {pricingCopy.title}
        </Typography>

        <Typography sx={{ color: "text.secondary", mt: 1.2, maxWidth: 860 }}>
          {pricingCopy.intro}
        </Typography>

        {success === "1" ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Payment received. Thanks — we’ll follow up to schedule the engagement.
          </Alert>
        ) : null}
      </Surface>

      <Section title="Plans">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {pricingCopy.plans.map((p) => (
            <Surface key={p.id} sx={{ position: "relative" }}>
              <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 850 }}>
                    {p.title}
                  </Typography>
                  <Typography sx={{ color: "text.secondary", mt: 0.6 }}>
                    {p.subtitle}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                  <Typography sx={{ fontWeight: 950, fontSize: 18 }}>
                    {p.priceLabel}
                  </Typography>
                  <PricingCheckout planId={p.id} label={p.title} />
                </Box>
              </Stack>

              <Box sx={{ my: 2, borderTop: "1px solid", borderColor: "divider", opacity: 0.65 }} />

              <Box component="ul" sx={{ m: 0, pl: 3, lineHeight: 1.85, color: "text.secondary" }}>
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </Box>
            </Surface>
          ))}
        </Box>
      </Section>

      <Section title={pricingCopy.howItWorks.title}>
        <Surface>
          <Box component="ul" sx={{ m: 0, pl: 3, lineHeight: 1.85, color: "text.secondary" }}>
            {pricingCopy.howItWorks.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </Box>
        </Surface>
      </Section>

      <Section title="Notes" subtle>
        <Surface>
          <Typography sx={{ color: "text.secondary" }}>{pricingCopy.finePrint}</Typography>

          <Typography sx={{ color: "text.secondary", mt: 1.5 }}>
            If checkout is blocked, go to{" "}
            <Link
              href="/verify-human?next=%2Fpricing"
              style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              /verify-human
            </Link>
            .
          </Typography>
        </Surface>
      </Section>
    </Box>
  );
}