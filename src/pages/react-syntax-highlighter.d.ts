declare module 'react-syntax-highlighter' {
    import { ComponentType } from 'react';
    export const Light: ComponentType<any>;
    export const PrismLight: ComponentType<any>;
    export const Prism: ComponentType<any>;
    export const registerLanguage: (name: string, language: any) => void;
  }
  
  declare module 'react-syntax-highlighter/dist/esm/styles/hljs' {
    export const docco: any;
  }