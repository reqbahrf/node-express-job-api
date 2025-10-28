/// <reference types="vite/client" />

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly MODE: 'development' | 'production' | 'test';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __VITE_DEV_SERVER_URL__: string;
declare module '*.jpeg' {
  const value: string;
  export default value;
}
