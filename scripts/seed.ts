import { db } from "../lib/db";
import { admins } from "../lib/db/schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding dummy Superadmin & Admin...");

  const hash = await bcrypt.hash("Apple@123", 10);

  try {
    await db.insert(admins).values({
      name: "Master Admin",
      email: "superadmin@hommunity.com",
      passwordHash: hash,
      role: "SUPERADMIN",
      permissions: ["SUPER_ADMIN"],
    });
    console.log("Superadmin created successfully!");
  } catch (error) {
    console.log("Superadmin may already exist.");
  }

  try {
    await db.insert(admins).values({
      name: "Local Property Admin",
      email: "admin@hommunity.com",
      passwordHash: hash,
      role: "ADMIN",
      permissions: ["MANAGE_RESIDENTS", "MANAGE_GATES"],
    });
    console.log("Local Admin created successfully!");
  } catch (error) {
    console.log("Local Admin may already exist.");
  }
  
  process.exit(0);
}

main();
