/**
 * Lightweight structured logger for OpenTrust.
 * Outputs JSON to stdout/stderr for machine parsing.
 * No external dependencies.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = (process.env.OPENTRUST_LOG_LEVEL as LogLevel) ?? "info";

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLevel];
}

function emit(level: LogLevel, module: string, message: string, ctx?: Record<string, unknown>) {
  if (!shouldLog(level)) return;

  const entry = {
    ts: new Date().toISOString(),
    level,
    module,
    message,
    ...ctx,
  };

  const output = JSON.stringify(entry);

  if (level === "error" || level === "warn") {
    process.stderr.write(output + "\n");
  } else {
    process.stdout.write(output + "\n");
  }
}

/**
 * Create a scoped logger for a specific module.
 *
 * @example
 * const log = createLogger("import-openclaw");
 * log.info("Session imported", { sessionKey, recordCount: 42 });
 */
export function createLogger(module: string) {
  return {
    debug: (message: string, ctx?: Record<string, unknown>) => emit("debug", module, message, ctx),
    info: (message: string, ctx?: Record<string, unknown>) => emit("info", module, message, ctx),
    warn: (message: string, ctx?: Record<string, unknown>) => emit("warn", module, message, ctx),
    error: (message: string, ctx?: Record<string, unknown>) => emit("error", module, message, ctx),
  };
}
