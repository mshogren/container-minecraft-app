/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    {
      preset: 'conventionalcommits',
      releaseRules: [
        { type: 'chore', release: 'patch' },
      ], 
    },
    '@semantic-release/release-notes-generator',
  ]  
};