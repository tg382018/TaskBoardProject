import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";

export default [
    js.configs.recommended,
    prettierConfig,
    {
        files: ["**/*.js", "**/*.jsx"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                console: "readonly",
                process: "readonly",
                Buffer: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                Promise: "readonly",
                URL: "readonly",
                URLSearchParams: "readonly",
                fetch: "readonly",
                Response: "readonly",
                Request: "readonly",
                Headers: "readonly",
                FormData: "readonly",
                Blob: "readonly",
                File: "readonly",
                FileReader: "readonly",
                AbortController: "readonly",
                AbortSignal: "readonly",
                Event: "readonly",
                CustomEvent: "readonly",
                EventTarget: "readonly",
                document: "readonly",
                window: "readonly",
                navigator: "readonly",
                localStorage: "readonly",
                sessionStorage: "readonly",
                location: "readonly",
                history: "readonly",
                HTMLElement: "readonly",
                HTMLInputElement: "readonly",
                HTMLFormElement: "readonly",
                HTMLButtonElement: "readonly",
                Element: "readonly",
                Node: "readonly",
                NodeList: "readonly",
                MouseEvent: "readonly",
                KeyboardEvent: "readonly",
                FocusEvent: "readonly",
                SubmitEvent: "readonly",
                InputEvent: "readonly",
                MutationObserver: "readonly",
                ResizeObserver: "readonly",
                IntersectionObserver: "readonly",
                WebSocket: "readonly",
                XMLHttpRequest: "readonly",
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
        },
        rules: {
            // React rules
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",

            // General rules
            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
            "no-console": "off",
            "prefer-const": "warn",
            "no-var": "error",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        files: [
            "packages/ui/**/*.jsx",
            "apps/web/src/app/components/common/**/*.jsx",
            "apps/web/src/app/components/ui/**/*.jsx",
            "apps/web/src/main.jsx",
            "apps/web/src/app/routes/**/*.jsx",
            "apps/web/src/app/providers/**/*.jsx",
            "apps/web/src/app/layouts/**/*.jsx",
            "apps/web/src/app/features/**/*.jsx",
            "apps/web/src/app/components/Dashboard.jsx",
            "apps/web/src/app/components/widgets/**/*.jsx",
        ],
        rules: {
            "no-unused-vars": "off",
        },
    },
    {
        ignores: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/.git/**",
            "**/coverage/**",
        ],
    },
];
