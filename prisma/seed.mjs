import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const hashedPassword = bcrypt.hashSync("demo1234", 10);

await db.user.upsert({
  where: { email: "demo-admin@furnico.demo" },
  update: {},
  create: { name: "Demo Admin", email: "demo-admin@furnico.demo", hashedPassword, roles: "DEMO_ADMIN" },
});

await db.user.upsert({
  where: { email: "demo-user@furnico.demo" },
  update: {},
  create: { name: "Demo User", email: "demo-user@furnico.demo", hashedPassword, roles: "DEMO_USER" },
});

console.log("✅ Demo accounts created!");
await db.$disconnect();