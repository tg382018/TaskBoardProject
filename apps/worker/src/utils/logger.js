export const logger = {
    info: (...args) => console.log("[worker]", ...args),
    error: (...args) => console.error("[worker]", ...args),
    debug: (...args) => console.log("[worker][debug]", ...args),
};
