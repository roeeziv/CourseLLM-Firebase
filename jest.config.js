require('dotenv').config({ path: '.env.test' });

module.exports = {
    testEnvironment: "jsdom",
    transform: {
      "^.+\\.tsx?$": "babel-jest",
    },
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "lucide-react": "<rootDir>/tests/mocks/lucide-react.js"
    },
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    testMatch: [
        "**/?(*.)+(test).[jt]s?(x)"
    ]
  };
  