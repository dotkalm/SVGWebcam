import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
    '^.+\\.(glsl|vert|frag|vs|fs)$': '<rootDir>/jest-raw-loader.js',
  },
  moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx', 'glsl', 'vert', 'frag', 'vs', 'fs'],
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: [
    '**/__tests__/**/*.(spec|test).[tj]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  verbose: true,
};

export default config;