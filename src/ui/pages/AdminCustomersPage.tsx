import type { Metadata } from "next";
import Link from "next/link";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import { requireAdminOrRedirect } from "@/src/server/auth/requireAdmin";
import prisma from "@/src/server/db/prisma";

import Section from "@/src/ui/components/Section";
import Surface from "@/src/ui/components/Surface";
import ActionIconButton from "@/src/ui/components/ActionIconButton";

export const metadata: Metadata = {
  title: "Customers",
  description: "Admin customers",
  robots: { index: false, follow: false },
};

function fmt(d: Date | null | undefined): string {
  if (!d) return "-";
  // stable, timezone explicit
  return `${d.toISOString().replace("T", " ").slice(0, 19)}Z`;
}

export default async function AdminCustomersPage() {
  await requireAdminOrRedirect("/admin/customers");

  const customers = await prisma.customer.findMany({
    orderBy: [{ lastSeenAt: "desc" }, { createdAt: "desc" }],
    take: 500,
    include: {
      purchases: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <Box component="main" sx={{ py: 2, pb: 6 }}>
      <Surface>
        <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: "0.14em" }}>
          Admin
        </Typography>
        <Typography variant="h3" sx={{ mt: 0.5, fontWeight: 900, letterSpacing: "-0.03em" }}>
          Customers
        </Typography>

        <Typography sx={{ color: "text.secondary", mt: 1.2 }}>
          {customers.length} customers (latest first).
        </Typography>
      </Surface>

      <Section title="Customer list">
        <Surface sx={{ overflowX: "auto" }}>
          {customers.length === 0 ? (
            <Typography sx={{ color: "text.secondary" }}>No customers yet.</Typography>
          ) : (
            <Table size="small" aria-label="Customers">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Last seen</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last purchase</TableCell>
                  <TableCell align="right">View</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {customers.map((c) => {
                  const last = c.purchases[0];
                  const lastPurchaseLabel = last
                    ? `${last.planId} (${last.status})`
                    : "—";

                  return (
                    <TableRow key={c.id} hover>
                      <TableCell sx={{ fontFamily: "var(--font-geist-mono)" }}>
                        {c.email}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{fmt(c.lastSeenAt)}</TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{fmt(c.createdAt)}</TableCell>
                      <TableCell sx={{ color: "text.secondary", fontFamily: "var(--font-geist-mono)" }}>
                        {lastPurchaseLabel}
                      </TableCell>
                      <TableCell align="right">
                        <Link href={`/admin/customers/${c.id}`}>
                          <ActionIconButton tooltip="View customer" aria-label="View customer">
                            <VisibilityRoundedIcon />
                          </ActionIconButton>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </Surface>
      </Section>
    </Box>
  );
}