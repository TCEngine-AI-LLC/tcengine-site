import { execSync } from "node:child_process";

const run = (cmd) => execSync(cmd, { stdio: "inherit" });

if (process.env.RUN_MIGRATIONS === "1") {
  run("npx prisma migrate deploy");
}

run("next build");