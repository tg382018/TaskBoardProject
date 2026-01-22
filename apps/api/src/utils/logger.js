export const logger = {
    info: (...args) => console.log("[api]", ...args),
    warn: (...args) => console.warn("[api]", ...args),
    error: (...args) => console.error("[api]", ...args),
    debug: (...args) => console.log("[api][debug]", ...args),
};
