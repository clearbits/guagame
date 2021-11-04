declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // Server-side environment variables should be named using uppercase
            // letters only, while camelCase naming convention should be used
            // for variables 