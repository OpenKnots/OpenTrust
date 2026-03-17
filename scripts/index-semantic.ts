import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { rebuildSemanticChunks, getSemanticStatus } from "@/lib/opentrust/semantic";

ensureBootstrapped();
const chunkCount = rebuildSemanticChunks();
const status = getSemanticStatus();
console.log(`Rebuilt ${chunkCount} semantic chunks. Vector ready: ${status.vectorReady ? 'yes' : 'no'}.`);
