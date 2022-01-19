export default {
  moduleNameMapper: {
    '\\.(gif|ttf|eot|svg|png)$': 'identity-obj-proxy',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['/node_modules', '/vite-plugin-singlefile'],
  testPathIgnorePatterns: ['/node_modules', '/vite-plugin-singlefile'],
};
