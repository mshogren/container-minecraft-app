/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_ENDPOINT?: string;
  readonly VITE_CONFIG_ENDPOINT?: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
