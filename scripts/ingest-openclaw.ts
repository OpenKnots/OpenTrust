import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { getDatabasePath } from "@/lib/opentrust/db";
import { importRecentOpenClawSessions } from "@/lib/opentrust/import-openclaw";

ensureBootstrapped();
const imported = importRecentOpenClawSessions();
console.log(`Imported ${imported} recent OpenClaw sessions into ${getDatabasePath()}`);
