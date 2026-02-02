declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        themeParams?: Record<string, string>;
        initData?: string;
        initDataUnsafe?: Record<string, unknown>;
      };
    };
  }
}

export {};
