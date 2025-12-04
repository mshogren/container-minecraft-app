export default {
  '*': ['prettier --ignore-unknown --write'],
  '**/*.{js,jsx,ts,tsx}': ['eslint'],
  '**/*.{ts,tsx}': [() => 'tsc -p tsconfig.json --noEmit'],
};
