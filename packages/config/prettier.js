/**
 * Shared Prettier Configuration
 * @packages/config/prettier
 *
 * Usage in app's .prettierrc or prettier.config.js:
 * export { default } from '@packages/config/prettier';
 *
 * Or extend it:
 * import base from '@packages/config/prettier';
 * export default { ...base, yourOverrides };
 */

export default {
    // Line width and wrapping
    printWidth: 110,
    tabWidth: 4,
    useTabs: false,

    // Semicolons and quotes
    semi: true,
    singleQuote: false,

    // Trailing commas and brackets
    trailingComma: "es5",
    bracketSpacing: true,
    bracketSameLine: false,

    // Arrow functions
    arrowParens: "always",

    // End of line
    endOfLine: "lf",
};
