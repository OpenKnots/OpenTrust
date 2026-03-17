import { ensureMigrated, getDatabasePath } from "@/lib/opentrust/db";

ensureMigrated();
console.log(`Initialized OpenTrust database at ${getDatabasePath()}`);
