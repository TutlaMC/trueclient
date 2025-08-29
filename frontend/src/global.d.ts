export {};

declare global {
  interface Window {
    electronAPI: {
      launchMinecraft: (username: string) => void;
    };
  }
}
