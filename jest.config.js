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
  // Windows PowerShell komutları uzun sürebileceği için timeout artırıldı
  testTimeout: 10000, // 10 saniye (varsayılan 5 saniye)
};
