import { db } from "@/lib/db";
import { globalRules } from "@/lib/db/schema";
import ClientRules from "./client-rules";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function GlobalRulesPage() {
  const allRules = await db.select().from(globalRules).orderBy(desc(globalRules.createdAt));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <ClientRules initialRules={allRules} />
    </div>
  );
}
