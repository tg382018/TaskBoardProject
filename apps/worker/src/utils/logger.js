export const logger = {
    info: (...args) => console.log("[worker]", ...args),
    error: (...args) => console.error("[worker]", ...args),
};
