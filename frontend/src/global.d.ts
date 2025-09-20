export {};

declare global {
  interface Window {
    electronAPI: {
      launchMinecraft: (username: string) => void;
      onMessage: (callback: (data: any) => void) => void;
      bconfig: (config: any | null = null) => void;
      onConfig: (callback: (data: any) => void) => void;
    };
  }
}
