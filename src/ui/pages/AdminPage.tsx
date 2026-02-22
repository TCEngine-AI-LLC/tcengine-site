import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { requireAdminOrRedirect } from "@/src/server/auth/requireAdmin";
import prisma from "@/src/server/db/prisma";
import Section from "@/src/ui/components/Section";
import Surface from "@/src/ui/components/Surface";
import ActionIconButton from "@/src/ui/components/ActionIconButton";
import AdminStripeOneDollarTest from "@/src/ui/widgets/AdminStripeOneDollarTest";

export const metadata: Metadata = {
  title: "Admin",
  description: "TC Engine admin",
  robots: { index: false, follow: false },
};

function yesNo(v: boolean) {
  return v ? "yes" : "no";
}

export default async function AdminPage() {
  const email = await requireAdminOrRedirect("/admin");
  const customers = await prisma.customer.findMany({
    orderBy: [{ lastSeenAt: "desc" }, { createdAt: "desc" }],
    take: 200,
    include: {
      purchases: { orderBy: { createdAt: "desc" }, take: 5 },
      leads: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  const stripeOk = Boolean(process.env.STRIPE_SECRET_KEY);
  const webhookOk = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  const resendOk = Boolean(process.env.RESEND_API_KEY);
  const turnstileOk = Boolean(process.env.TURNSTILE_SECRET_KEY);
  const turnstileSiteOk = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Surface>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: "0.14em" }}>
              Admin
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 900, letterSpacing: "-0.03em" }}>
              Admin dashboard
            </Typography>
            <Typography sx={{ color: "text.secondary", mt: 1.2 }}>
              Signed in as{" "}
              <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)" }}>
                {email}
              </Box>
            </Typography>
          </Box>

          <ActionIconButton
            tooltip="Logout"
            aria-label="Logout"
            component="a"
            href="/api/auth/admin/logout"
          >
            <LogoutRoundedIcon />
          </ActionIconButton>
        </Box>
      </Surface>

      <Section title="Customers">
        <Surface>
          {customers.length === 0 ? (
            <Typography color="text.secondary">No customer activity yet.</Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, pl: 3, lineHeight: 1.9 }}>
              {customers.map((c) => {
                const lastPurchase = c.purchases[0];
                return (
                  <li key={c.id}>
                    <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)" }}>
                      {c.email}
                    </Box>
                    {"  "}
                    <Box component="span" sx={{ color: "text.secondary", opacity: 0.9 }}>
                      {lastPurchase
                        ? `purchased ${lastPurchase.planId} (${lastPurchase.status})`
                        : "no purchases yet"}
                    </Box>
                  </li>
                );
              })}
            </Box>
          )}
        </Surface>
      </Section>

      <Section title="Env status">
        <Surface>
          <Box component="ul" sx={{ m: 0, pl: 3, lineHeight: 1.9, color: "text.secondary" }}>
            <li>
              Stripe secret key:{" "}
              <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)", color: "text.primary" }}>
                {yesNo(stripeOk)}
              </Box>
            </li>
            <li>
              Stripe webhook secret:{" "}
              <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)", color: "text.primary" }}>
                {yesNo(webhookOk)}
              </Box>
            </li>
            <li>
              Resend API key:{" "}
              <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)", color: "text.primary" }}>
                {yesNo(resendOk)}
              </Box>
            </li>
            <li>
              Turnstile secret key:{" "}
              <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)", color: "text.primary" }}>
                {yesNo(turnstileOk)}
              </Box>
            </li>
            <li>
              Turnstile site key:{" "}
              <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)", color: "text.primary" }}>
                {yesNo(turnstileSiteOk)}
              </Box>
            </li>
          </Box>
        </Surface>
      </Section>

      <Section title="Notes" subtle>
        <Surface>
          <Typography sx={{ color: "text.secondary" }}>
            This admin view is intentionally minimal. Customer events are primarily monitored via email
            notifications (leads + Stripe webhooks).
          </Typography>
        </Surface>
      </Section>

      <Section title="Stripe test" subtle>
        <Surface>
          <AdminStripeOneDollarTest />
        </Surface>
      </Section>
    </Box>
  );
}