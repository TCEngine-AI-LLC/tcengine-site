import type { Metadata } from "next";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

import { requireAdminOrRedirect } from "@/src/server/auth/requireAdmin";
import prisma from "@/src/server/db/prisma";

import Section from "@/src/ui/components/Section";
import Surface from "@/src/ui/components/Surface";
import AdminStripeOneDollarTest from "@/src/ui/widgets/AdminStripeOneDollarTest";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ActionIconButton from "@/src/ui/components/ActionIconButton";

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

        <Typography sx={{ mt: 1.2 }}>
          <Box
            component="a"
            href="/api/auth/admin/logout"
            sx={{
              color: "primary.light",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Logout
          </Box>
        </Typography>
      </Surface>

      <Section title="Customers">
        <Surface>
          {customers.length === 0 ? (
            <Typography sx={{ color: "text.secondary" }}>
              No customer activity yet.
            </Typography>
          ) : (
            <>
              <Box component="ul" sx={{ m: 0, pl: 3, lineHeight: 1.85 }}>
                {customers.map((c) => {
                  const lastPurchase = c.purchases[0];
                  return (
                    <Box component="li" key={c.id} sx={{ mt: 0.6 }}>
                      <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)" }}>
                        {c.email}
                      </Box>
                      <Typography component="span" sx={{ color: "text.secondary", ml: 1 }}>
                        {lastPurchase
                          ? `purchased ${lastPurchase.planId} (${lastPurchase.status})`
                          : "no purchases yet"}
                      </Typography>
                    </Box>
                  );
                })}
              </Box><Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Link href="/admin/customers">
                  <ActionIconButton tooltip="Open customers page" aria-label="Open customers page">
                    <PeopleRoundedIcon />
                  </ActionIconButton>
                </Link>
              </Box>
            </>
          )}
        </Surface>
      </Section>

      <Section title="Env status">
        <Surface>
          <Box component="ul" sx={{ m: 0, pl: 3, lineHeight: 1.85, color: "text.secondary" }}>
            <li>Stripe secret key: <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)" }}>{yesNo(stripeOk)}</Box></li>
            <li>Stripe webhook secret: <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)" }}>{yesNo(webhookOk)}</Box></li>
            <li>Resend API key: <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)" }}>{yesNo(resendOk)}</Box></li>
            <li>Turnstile secret key: <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)" }}>{yesNo(turnstileOk)}</Box></li>
            <li>Turnstile site key: <Box component="span" sx={{ fontFamily: "var(--font-geist-mono)" }}>{yesNo(turnstileSiteOk)}</Box></li>
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