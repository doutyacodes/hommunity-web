import { db } from "../lib/db";
import { admins } from "../lib/db/schema";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  try {
    const passwordHash = await bcrypt.hash("Apple@123", 10);
    
    await db.insert(admins).values({
      name: "Super Admin",
      email: "superadmin@hommunity.com",
      passwordHash,
      role: "SUPERADMIN",
    });

    console.log("Superadmin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating superadmin:", error);
    process.exit(1);
  }
}

main();
