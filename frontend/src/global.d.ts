export {};

declare global {
  interface Window {
    electronAPI: {
      launchMinecraft: (username: string) => void;
      onMessage: (callback: (data: any) => void) => void;
    };
  }
}
