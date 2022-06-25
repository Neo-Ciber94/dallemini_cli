import * as colors from "std/colors";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  level: LogLevel;
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export function createConsoleLogger(level: LogLevel = "debug"): Logger {
  return {
    level,
    debug: (args) => log("debug", level, args),
    info: (args) => log("info", level, args),
    warn: (args) => log("warn", level, args),
    error: (args) => log("error", level, args),
  };
}

const LEVEL_LABEL = {
  debug: "[DEBUG]",
  info: "[INFO] ",
  warn: "[WARN] ",
  error: "[ERROR]",
} as const;

function levelToNumber(level: LogLevel): number {
  switch (level) {
    case "debug":
      return 1;
    case "info":
      return 2;
    case "warn":
      return 3;
    case "error":
      return 4;
  }
}

function log(level: LogLevel, minLevel: LogLevel, message: string) {
  if (levelToNumber(minLevel) > levelToNumber(level)) {
    return;
  }

  switch (level) {
    case "debug":
      console.log(`${colors.magenta(LEVEL_LABEL.debug)} ${message}`);
      break;
    case "info":
      console.info(`${colors.brightBlue(LEVEL_LABEL.info)} ${message}`);
      break;
    case "warn":
      console.warn(`${colors.yellow(LEVEL_LABEL.warn)} ${message}`);
      break;
    case "error":
      console.error(`${colors.red(LEVEL_LABEL.error)} ${message}`);
      break;
  }
}
