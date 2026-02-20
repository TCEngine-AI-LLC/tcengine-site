import type { Metadata } from "next";

import { requireAdminOrRedirect } from "@/src/server/auth/requireAdmin";
import Section from "@/src/ui/components/Section";
import prisma from "@/src/server/db/prisma";
import AdminStripeOneDollarTest from "../widgets/AdminStripeOneDollarTest";

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
    <main style={{ padding: "20px 0 48px" }}>
      <div className="heroPanel">
        <div className="badge">Admin</div>
        <h1 style={{ marginTop: 12 }}>Admin dashboard</h1>
        <p style={{ fontSize: 16, marginTop: 12 }}>
          Signed in as <span className="mono">{email}</span>
        </p>
        <p style={{ marginTop: 10 }} className="small">
          <a className="mono" href="/api/auth/admin/logout">Logout</a>
        </p>
      </div>

      <Section title="Customers">
        <div className="card">
          {customers.length === 0 ? (
            <p className="small">No customer activity yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9 }}>
              {customers.map((c) => {
                const lastPurchase = c.purchases[0];
                return (
                  <li key={c.id}>
                    <span className="mono">{c.email}</span>
                    {lastPurchase ? (
                      <>
                        {"  "}
                        <span style={{ color: "rgba(11, 15, 23, 0.7)" }}>
                          purchased {lastPurchase.planId} ({lastPurchase.status})
                        </span>
                      </>
                    ) : (
                      <>
                        {"  "}
                        <span style={{ color: "rgba(11, 15, 23, 0.55)" }}>
                          no purchases yet
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Section>
      <Section title="Env status">
        <div className="card">
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.9, color: "rgba(11, 15, 23, 0.78)" }}>
            <li>
              Stripe secret key: <span className="mono">{yesNo(stripeOk)}</span>
            </li>
            <li>
              Stripe webhook secret: <span className="mono">{yesNo(webhookOk)}</span>
            </li>
            <li>
              Resend API key: <span className="mono">{yesNo(resendOk)}</span>
            </li>
            <li>
              Turnstile secret key: <span className="mono">{yesNo(turnstileOk)}</span>
            </li>
            <li>
              Turnstile site key: <span className="mono">{yesNo(turnstileSiteOk)}</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section title="Notes" subtle>
        <div className="card">
          <p>
            This admin view is intentionally minimal. Customer events are primarily monitored via email
            notifications (leads + Stripe webhooks).
          </p>
        </div>
      </Section>
      <Section title="Stripe test" subtle>
        <div className="card">
          <AdminStripeOneDollarTest />
        </div>
      </Section>
    </main>
  );
}
