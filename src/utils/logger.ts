import * as colors from "std/colors";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogAdapter = (level: LogLevel, message: string) => boolean | void;

export interface Logger {
  level: LogLevel;
  adapters: LogAdapter[];
  debug: (message: string) => void;
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
}

export function createConsoleLogger(level: LogLevel = "debug"): Logger {
  const adapters: LogAdapter[] = [];
  return {
    level,
    adapters,
    debug: (args) => log("debug", level, adapters, args),
    info: (args) => log("info", level, adapters, args),
    warn: (args) => log("warn", level, adapters, args),
    error: (args) => log("error", level, adapters, args),
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
    default:
      return 0;
  }
}

function log(
  level: LogLevel,
  minLevel: LogLevel,
  adapters: LogAdapter[],
  message: string
) {
  if (levelToNumber(minLevel) > levelToNumber(level)) {
    return;
  }

  const runAdapters = (msg: string) => {
    let run = true;
    for (const adapter of adapters) {
      const result = adapter(level, msg);
      if (result === false) {
        run = false;
      }
    }

    return run;
  };

  switch (level) {
    case "debug": {
      const msg = `${colors.magenta(LEVEL_LABEL.debug)} ${message}`;
      if (runAdapters(msg)) {
        console.log(msg);
      }
      return msg;
    }
    case "info": {
      const msg = `${colors.brightBlue(LEVEL_LABEL.info)} ${message}`;
      if (runAdapters(msg)) {
        console.info(msg);
      }
      return msg;
    }
    case "warn": {
      const msg = `${colors.yellow(LEVEL_LABEL.warn)} ${message}`;
      if (runAdapters(msg)) {
        console.warn(msg);
      }
      return msg;
    }
    case "error": {
      const msg = `${colors.red(LEVEL_LABEL.error)} ${message}`;
      if (runAdapters(msg)) {
        console.error(msg);
      }
      return msg;
    }
  }
}
