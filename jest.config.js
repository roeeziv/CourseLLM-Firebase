const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Handle the "@/" alias imports
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  testEnvironment: 'jest-environment-jsdom',

  // ⛔️ CRITICAL: Ignore Playwright E2E tests
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/tests/.*\\.spec\\.ts$' 
  ],
}

module.exports = createJestConfig(customJestConfig)