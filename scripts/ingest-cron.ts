import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { getDatabasePath } from "@/lib/opentrust/db";
import { importCronWorkflows } from "@/lib/opentrust/import-cron";

ensureBootstrapped();
const imported = importCronWorkflows();
console.log(`Imported ${imported} cron workflows into ${getDatabasePath()}`);
