import { ComponentType } from 'react';

declare module 'react-syntax-highlighter' {
  export const Light: ComponentType<Record<string, unknown>>;
  export const PrismLight: ComponentType<Record<string, unknown>>;
  export const Prism: ComponentType<Record<string, unknown>>;
  export const registerLanguage: (name: string, language: unknown) => void;
}

declare module 'react-syntax-highlighter/dist/esm/styles/hljs' {
  export const docco: Record<string, unknown>;
}