module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  // Test setup dosyasını kullan (console çıktılarını temizler)
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
