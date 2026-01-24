/**
 * Shared ESLint Configuration
 * @packages/config/eslint
 *
 * Usage in app's eslint.config.js:
 * import baseConfig from '@packages/config/eslint';
 * export default [...baseConfig, ...yourOverrides];
 */

export const baseRules = {
    // Error Prevention
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // Code Quality
    "prefer-const": "error",
    "no-var": "error",
    eqeqeq: ["error", "always"],

    // Best Practices
    "no-duplicate-imports": "error",
    "no-template-curly-in-string": "warn",
};

export const reactRules = {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
};

export default {
    baseRules,
    reactRules,
};
