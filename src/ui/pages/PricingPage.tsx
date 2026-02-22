import type { Metadata } from "next";
import Link from "next/link";
import { Box, Divider, Paper, Typography } from "@mui/material";

import { pricingCopy } from "@/src/customizations/copy";
import Section from "@/src/ui/components/Section";
import PricingCheckout from "@/src/ui/widgets/PricingCheckout";

export const metadata: Metadata = {
  title: "Consulting pricing",
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
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.paper" }}>
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", letterSpacing: "0.14em" }}
        >
          Consulting
        </Typography>

        <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 900, letterSpacing: "-0.03em" }}>
          {pricingCopy.title}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1.2, lineHeight: 1.85 }}>
          {pricingCopy.intro}
        </Typography>

        {success === "1" ? (
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: "rgba(255,255,255,0.04)" }}>
            <Typography sx={{ fontWeight: 850 }}>Payment received.</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Thanks — we’ll follow up to schedule the engagement.
            </Typography>
          </Paper>
        ) : null}
      </Paper>

      <Section title="Plans">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {pricingCopy.plans.map((p) => (
            <Paper key={p.id} variant="outlined" sx={{ p: 2.5, bgcolor: "background.paper" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 850, letterSpacing: "-0.02em", fontSize: 18 }}>
                    {p.title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.6 }}>
                    {p.subtitle}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: 18 }}>{p.priceLabel}</Typography>
                  <PricingCheckout planId={p.id} label={p.title} />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box component="ul" sx={{ m: 0, pl: 3, lineHeight: 1.85, color: "text.secondary" }}>
                {p.bullets.map((b) => (
                  <Box component="li" key={b} sx={{ mt: 0.5 }}>
                    {b}
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      </Section>

      <Section title={pricingCopy.howItWorks.title}>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.paper" }}>
          <Box component="ul" sx={{ m: 0, pl: 3, lineHeight: 1.85, color: "text.secondary" }}>
            {pricingCopy.howItWorks.bullets.map((b) => (
              <Box component="li" key={b} sx={{ mt: 0.5 }}>
                {b}
              </Box>
            ))}
          </Box>
        </Paper>
      </Section>

      <Section title="Notes" subtle>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.paper" }}>
          <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>
            {pricingCopy.finePrint}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1.5 }}>
            If checkout is blocked, go to{" "}
            <Link
              href="/verify-human?next=%2Fpricing"
              style={{ textDecoration: "underline", fontFamily: "var(--font-geist-mono)" }}
            >
              /verify-human
            </Link>
            .
          </Typography>
        </Paper>
      </Section>
    </Box>
  );
}